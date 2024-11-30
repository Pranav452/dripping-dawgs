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
    Razorpay: any
  }
}

export default function PaymentPage() {
  const [processing, setProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const { user } = useAuth()
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const validateProducts = async () => {
    try {
      // Verify all products exist in database
      const productIds = Array.from(new Set(items.map(item => item.id)))
      console.log('Validating products:', productIds)
      
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id')
        .in('id', productIds)

      if (productsError) {
        console.error('Error fetching products:', productsError)
        throw new Error('Failed to validate products')
      }

      if (!products) {
        console.error('No products found')
        throw new Error('Failed to validate products')
      }

      console.log('Found products:', products)
      const foundProductIds = products.map(p => p.id)
      const missingProducts = items.filter(item => !foundProductIds.includes(item.id))

      if (missingProducts.length > 0) {
        const missingNames = missingProducts.map(p => p.name).join(', ')
        throw new Error(`Some products are no longer available: ${missingNames}`)
      }

      return true
    } catch (err) {
      console.error('Product validation error:', err)
      throw err
    }
  }

  const makePayment = async () => {
    if (!isScriptLoaded) {
      console.log('Waiting for Razorpay script to load...')
      return
    }

    try {
      // Validate products first
      await validateProducts()

      // Get shipping details from session storage
      const shippingDetailsStr = sessionStorage.getItem('shippingDetails')
      if (!shippingDetailsStr) {
        setError('Shipping details not found')
        setTimeout(() => router.push('/checkout'), 2000)
        return
      }

      const shippingDetails = JSON.parse(shippingDetailsStr)

      // Create Razorpay order
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

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        name: 'Dripping Dawgs',
        currency: data.currency,
        amount: data.amount,
        order_id: data.id,
        description: 'Thank you for your purchase',
        image: '/logo.png',
        handler: async function (response: any) {
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
          email: user?.email,
          contact: shippingDetails.phone
        },
        theme: {
          color: '#000000'
        },
        modal: {
          ondismiss: function() {
            setError('Payment cancelled')
            setTimeout(() => router.push('/checkout'), 2000)
          }
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error)
        setError(response.error.description)
        setTimeout(() => router.push('/checkout'), 2000)
      })
      paymentObject.open()
      setProcessing(false)
    } catch (err: any) {
      console.error('Error initializing payment:', err)
      setError(err.message || 'Failed to initialize payment')
      setTimeout(() => router.push('/checkout'), 2000)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (items.length === 0) {
      router.push('/cart')
      return
    }

    if (isScriptLoaded) {
      makePayment()
    }
  }, [user, items, total, router, clearCart, isScriptLoaded])

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
            {processing ? 'Initializing Payment...' : 'Payment Window Opened'}
          </h1>
          <div className="mb-8 text-gray-600">
            {processing ? (
              <div className="flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
              </div>
            ) : (
              <p>Please complete your payment in the Razorpay window</p>
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
