'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string
}

interface Order {
  id: string
  order_number: string
  total_amount: number
  created_at: string
  items: OrderItem[]
}

export default function ThankYouPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const router = useRouter()

  useEffect(() => {
    const orderData = sessionStorage.getItem('lastOrder')
    if (!orderData) {
      router.push('/')
      return
    }
    setOrder(JSON.parse(orderData))
  }, [router])

  if (!order) return null

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-lg border p-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-green-600">Thank You for Your Order!</h1>
          <p className="text-gray-600">Your order has been confirmed and is being processed.</p>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Order Details</h2>
          <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Order Number:</p>
              <p className="font-medium">{order.order_number}</p>
            </div>
            <div>
              <p className="text-gray-600">Order Date:</p>
              <p className="font-medium">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">Items Ordered</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-16 w-16 object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity} × ${item.price}
                  </p>
                </div>
                <p className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 border-t pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${order.total_amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold">Shipping Information</h3>
          <p className="text-sm text-gray-600">
            Your order will be shipped within 2-3 business days. You will receive
            a shipping confirmation email with tracking details once your order
            ships.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-block rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
