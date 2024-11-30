'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import Script from 'next/script'
import { toast } from 'sonner'

declare global {
  interface Window {
    Razorpay: {
      new(options: RazorpayOptions): RazorpayInstance
    }
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  theme?: {
    color: string
  }
  modal?: {
    confirm_close?: boolean
  }
  image?: string
}

interface RazorpayInstance {
  on(event: string, handler: (response: RazorpayErrorResponse) => void): void
  open(): void
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

interface RazorpayErrorResponse {
  error: {
    code: string
    description: string
    source: string
    step: string
    reason: string
  }
}

export default function PaymentPage() {
  const [processing, setProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [orderId, setOrderId] = useState<string>('')
  const [shippingDetails, setShippingDetails] = useState<{
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  } | null>(null)
  
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const { user } = useAuth()
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  useEffect(() => {
    // Load shipping details from session storage
    const shippingDetailsStr = sessionStorage.getItem('shippingDetails')
    if (shippingDetailsStr) {
      setShippingDetails(JSON.parse(shippingDetailsStr))
    }

    // Create Razorpay order
    async function createOrder() {
      try {
        const orderRes = await fetch('/api/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total })
        })

        if (!orderRes.ok) {
          const error = await orderRes.json()
          throw new Error(error.message || 'Failed to create order')
        }

        const data = await orderRes.json()
        setOrderId(data.id)
        setProcessing(false)
      } catch (error) {
        console.error('Error creating order:', error)
        setError(error instanceof Error ? error.message : 'Failed to create order')
      }
    }

    if (isScriptLoaded && items.length > 0) {
      createOrder()
    }
  }, [isScriptLoaded, total, items])

  const makePayment = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        throw new Error('Razorpay key is not configured')
      }

      if (!shippingDetails) {
        throw new Error('Shipping details not found')
      }

      if (!orderId) {
        throw new Error('Order ID not found')
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        name: 'DrippingDawgs',
        currency: 'INR',
        amount: Math.round(total * 83 * 100),
        order_id: orderId,
        description: 'Thank you for your purchase',
        image: '/logo.png',
        handler: async function (response: RazorpayResponse) {
          try {
            console.log('Payment successful, processing order...')
            
            // Validate payment
            const validateRes = await fetch('/api/validate-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            })

            if (!validateRes.ok) {
              const error = await validateRes.json()
              throw new Error(error.message || 'Payment validation failed')
            }

            console.log('Payment validated, creating order...')

            // Create order in database
            const { data: order, error: orderError } = await supabase
              .from('orders')
              .insert([
                {
                  user_id: user!.id,
                  total_amount: total,
                  shipping_address: shippingDetails,
                  status: 'processing',
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature
                }
              ])
              .select()
              .single()

            if (orderError) {
              console.error('Error creating order:', orderError)
              throw orderError
            }

            console.log('Order created:', order.id)

            // Insert order items
            const orderItems = items.map(item => ({
              order_id: order.id,
              product_id: item.id,
              quantity: item.quantity,
              price_at_time: item.price,
              size: item.size,
              color: item.color
            }))

            const { error: itemsError } = await supabase
              .from('order_items')
              .insert(orderItems)

            if (itemsError) {
              console.error('Error creating order items:', itemsError)
              // If order items fail, delete the order
              await supabase
                .from('orders')
                .delete()
                .match({ id: order.id })
              throw new Error('Failed to create order items')
            }

            console.log('Order items created')

            // Update product stock
            for (const item of items) {
              const { error: stockError } = await supabase.rpc('update_product_stock', {
                p_id: item.id,
                quantity: item.quantity
              })
              if (stockError) {
                console.error('Failed to update stock for product:', item.id)
                // Continue with other products
              }
            }

            // Clear cart and shipping details
            clearCart()
            sessionStorage.removeItem('shippingDetails')

            // Show success message
            toast.success('Payment successful!')

            console.log('Redirecting to thank you page...')
            
            // Force a hard redirect to thank you page
            window.location.href = `/thank-you?orderId=${order.id}`
          } catch (err: any) {
            console.error('Error processing order:', err)
            toast.error(err.message || 'Failed to process your order')
            setTimeout(() => router.push('/checkout'), 2000)
          }
        },
        prefill: {
          name: shippingDetails.name,
          email: shippingDetails.email,
          contact: shippingDetails.phone
        },
        theme: {
          color: '#000000'
        },
        modal: {
          confirm_close: true
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.on('payment.failed', function (response: RazorpayErrorResponse) {
        console.error('Payment failed:', response.error)
        setError(response.error.description)
        setTimeout(() => router.push('/checkout'), 2000)
      })
      paymentObject.open()
    } catch (error) {
      console.error('Error in makePayment:', error)
      setError(error instanceof Error ? error.message : 'Payment initialization failed')
      setTimeout(() => router.push('/checkout'), 2000)
    }
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8">
          <h1 className="mb-4 text-2xl font-bold text-red-600">Payment Failed</h1>
          <p className="text-red-600">{error}</p>
          <p className="mt-4 text-sm text-gray-500">Redirecting to checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => {
          console.log('Razorpay script loaded')
          setIsScriptLoaded(true)
        }}
        onError={() => {
          console.error('Failed to load Razorpay script')
          setError('Failed to load payment system')
          setTimeout(() => router.push('/checkout'), 2000)
        }}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <div className="rounded-lg border p-8">
          <h1 className="mb-4 text-2xl font-bold">
            {processing ? 'Initializing Payment...' : 'Ready for Payment'}
          </h1>
          <div className="mb-8 text-gray-600">
            {processing ? (
              <div className="flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
              </div>
            ) : (
              <>
                <p className="mb-4">Your order is ready for payment</p>
                <button
                  onClick={makePayment}
                  className="rounded-md bg-black px-6 py-2 text-white hover:bg-gray-800 disabled:bg-gray-400"
                  disabled={!orderId}
                >
                  Pay Now ₹{total}
                </button>
              </>
            )}
          </div>
          <div className="mb-4">
            <p className="font-semibold">Order Total: ₹{total}</p>
          </div>
          <p className="text-sm text-gray-500">Please do not close this window...</p>
        </div>
      </div>
    </>
  )
}
