'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import Script from 'next/script'
import { toast } from 'sonner'

// Add Razorpay to window object type
declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PaymentPage() {
  const [processing, setProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const { user } = useAuth()
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const processOrder = async () => {
    try {
      const shippingDetails = JSON.parse(sessionStorage.getItem('shippingDetails') || '{}')
      
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user?.id,
            order_number: `ORD${Date.now()}`,
            status: 'pending',
            total_amount: total,
            shipping_address: shippingDetails,
            payment_method: shippingDetails.paymentMethod,
            payment_status: shippingDetails.paymentMethod === 'cod' ? 'pending' : 'paid',
            order_items: items.map(item => ({
              product_id: item.id,
              quantity: item.quantity,
              price_at_time: item.price,
              size: item.size,
              color: item.color
            }))
          }
        ])
        .select()
        .single()

      if (orderError) throw orderError

      // Store complete order details for thank you page
      const orderWithItems = {
        ...order,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url,
          size: item.size,
          color: item.color
        }))
      }
      sessionStorage.setItem('lastOrder', JSON.stringify(orderWithItems))

      // Clear cart
      clearCart()

      // Redirect to confirmation page
      router.push('/order-confirmation')
      setProcessing(false)
    } catch (error) {
      console.error('Error processing order:', error)
      throw error
    }
  }

  const initializePayment = async () => {
    try {
      setProcessing(true)
      
      const shippingDetails = JSON.parse(sessionStorage.getItem('shippingDetails') || '{}')
      const paymentMethod = shippingDetails.paymentMethod

      // Handle COD separately
      if (paymentMethod === 'cod') {
        await processOrder()
        router.push('/thank-you')
        return
      }

      if (total <= 0) {
        toast.error('Invalid order amount')
        router.push('/cart')
        return
      }

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: total,
          shippingDetails
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const { orderId, error } = await response.json()
      if (error) throw new Error(error)

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: "INR",
        name: "DrippingDog",
        description: "Payment for your order",
        order_id: orderId,
        handler: async (response: any) => {
          try {
            setProcessing(true)
            // Process the successful payment
            await processOrder()
            toast.success("Payment successful!")
          } catch (error) {
            console.error('Payment processing error:', error)
            toast.error("Payment failed")
            router.push('/checkout?error=payment-failed')
          }
        },
        modal: {
          ondismiss: function() {
            setProcessing(false)
            router.push('/checkout?error=payment-cancelled')
          }
        },
        prefill: {
          name: user?.email?.split('@')[0],
          email: user?.email,
        },
        theme: {
          color: "#000000",
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment initialization error:', error)
      toast.error('Failed to initialize payment')
      router.push('/checkout?error=payment-failed')
    } finally {
      setProcessing(false)
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

    // Initialize payment when component mounts
    initializePayment()
  }, [user, items, total, router, clearCart])

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
        strategy="lazyOnload"
      />
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <div className="rounded-lg border p-8">
          <h1 className="mb-4 text-2xl font-bold">
            {processing ? 'Processing Payment...' : 'Payment Completed!'}
          </h1>
          <div className="mb-8 text-gray-600">
            {processing ? (
              <div className="flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
              </div>
            ) : (
              <p>Your payment has been processed successfully!</p>
            )}
          </div>
          <div className="mb-4">
            <p className="font-semibold">Order Total: ${total.toFixed(2)}</p>
          </div>
          <p className="text-sm text-gray-500">Please do not close this window...</p>
        </div>
      </div>
    </>
  )
}
