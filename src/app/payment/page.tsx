'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import Script from 'next/script'
import { toast } from 'sonner'

// Helper function to format price in Rupees
function formatPrice(price: number): string {
  const priceInRupees = price * 83
  return `₹${priceInRupees.toLocaleString('en-IN')}`
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
      // Get shipping details from session storage
      const shippingDetailsStr = sessionStorage.getItem('shippingDetails')
      if (!shippingDetailsStr) {
        throw new Error('Shipping details not found')
      }

      const shippingDetails = JSON.parse(shippingDetailsStr)

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user!.id,
            total_amount: total,
            shipping_address: shippingDetails,
            status: 'processing',
            order_items: items.map(item => ({
              product_id: item.id,
              quantity: item.quantity,
              price_at_time: item.price
            }))
          }
        ])
        .select()
        .single()

      if (orderError) throw orderError

      // Clear cart and shipping details
      clearCart()
      sessionStorage.removeItem('shippingDetails')

      // Redirect to thank you page
      router.push(`/thank-you?orderId=${order.id}`)
    } catch (err) {
      console.error('Error processing order:', err)
      setError('Failed to process your order. Please try again.')
      setTimeout(() => {
        router.push('/checkout')
      }, 3000)
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
    processOrder()
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
            <p className="font-semibold">Order Total: {formatPrice(total)}</p>
          </div>
          <p className="text-sm text-gray-500">Please do not close this window...</p>
        </div>
      </div>
    </>
  )
}
