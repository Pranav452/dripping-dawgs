'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export default function PaymentPage() {
  const [processing, setProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const { user } = useAuth()
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    async function processOrder() {
      try {
        const shippingDetails = JSON.parse(sessionStorage.getItem('shippingDetails') || '{}')
        
        if (!shippingDetails || !Object.keys(shippingDetails).length) {
          throw new Error('No shipping details found')
        }

        // Add null check for user
        if (!user) {
          throw new Error('User not authenticated')
        }

        // Create order with guaranteed non-null user
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,  // Now TypeScript knows user is not null
            order_number: `ORD-${Date.now()}`,
            status: 'pending',
            total_amount: total,
            shipping_address: shippingDetails,
            payment_method: shippingDetails.paymentMethod || 'card'
          })
          .select()
          .single()

        if (orderError) {
          console.error('Order creation error:', orderError)
          throw new Error('Failed to create order')
        }

        if (!order) {
          throw new Error('No order data returned')
        }

        // Create order items
        const orderItems = items.map(item => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price_at_time: item.price
        }))

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems)

        if (itemsError) {
          console.error('Order items error:', itemsError)
          throw new Error('Failed to create order items')
        }

        // Save order details for confirmation page
        sessionStorage.setItem('lastOrder', JSON.stringify({
          ...order,
          items
        }))

        // Clear cart and redirect
        setTimeout(() => {
          setProcessing(false)
          clearCart()
          router.push('/thank-you')
        }, 2000)

      } catch (error) {
        console.error('Error processing order:', error)
        setError(error instanceof Error ? error.message : 'Payment processing failed')
        setTimeout(() => {
          router.push('/checkout?error=payment-failed')
        }, 2000)
      }
    }

    processOrder()
  }, [user, items, total, clearCart, router])

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
  )
}
