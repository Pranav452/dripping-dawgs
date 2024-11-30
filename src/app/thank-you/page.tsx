'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle2, Heart } from 'lucide-react'

interface OrderItem {
  products: {
    id: string
    name: string
    image_url: string
  }
  quantity: number
  price_at_time: number
  size: string
  color: string
}

interface OrderDetails {
  id: string
  order_number: number
  total_amount: number
  status: string
  created_at: string
  shipping_address: {
    name: string
    email: string
    address: string
    city: string
    postalCode: string
    phone: string
  }
  items: {
    id: string
    name: string
    quantity: number
    price_at_time: number
    size: string
    color: string
    image_url: string
  }[]
}

function formatOrderNumber(num: number): string {
  return `DD${String(num).padStart(6, '0')}`
}

const motivationalMessages = [
  "You're now part of the DrippingDawgs family! 🎉",
  "Your style game just got stronger! 💪",
  "Get ready to turn heads! 🌟",
  "Welcome to the world of unique fashion! ✨",
  "You've made an amazing choice! 🔥"
]

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [motivationalMessage] = useState(() => 
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  )

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) {
        setError('Order ID not found')
        setLoading(false)
        return
      }

      try {
        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*, order_number')
          .eq('id', orderId)
          .single()

        if (orderError) throw orderError

        // Fetch order items with product details
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            quantity,
            price_at_time,
            size,
            color,
            products (
              id,
              name,
              image_url
            )
          `)
          .eq('order_id', orderId)

        if (itemsError) throw itemsError

        // Format order details
        const orderDetails: OrderDetails = {
          ...orderData,
          items: itemsData.map((item: {
            quantity: number
            price_at_time: number
            size: string
            color: string
            products: {
              id: string
              name: string
              image_url: string
            }
          }) => ({
            id: item.products.id,
            name: item.products.name,
            quantity: item.quantity,
            price_at_time: item.price_at_time,
            size: item.size,
            color: item.color,
            image_url: item.products.image_url
          }))
        }

        setOrder(orderDetails)
      } catch (error) {
        console.error('Error fetching order details:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-6">{error || 'Order not found'}</p>
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You for Your Order!</h1>
          <p className="text-lg text-gray-600">Your order has been successfully placed.</p>
          <p className="text-lg font-semibold mt-4">Order #{formatOrderNumber(order.order_number)}</p>
          
          {/* Motivational Message */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg">
            <div className="flex items-center justify-center space-x-2">
              <Heart className="w-6 h-6 text-white animate-pulse" />
              <p className="text-xl font-bold text-white">{motivationalMessage}</p>
              <Heart className="w-6 h-6 text-white animate-pulse" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Order Details</h2>
          </div>
          
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-medium">{formatOrderNumber(order.order_number)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium capitalize">{order.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium">₹{order.total_amount}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
              <div className="text-gray-600">
                <p>{order.shipping_address.name}</p>
                <p>{order.shipping_address.address}</p>
                <p>{order.shipping_address.city} - {order.shipping_address.postalCode}</p>
                <p>Phone: {order.shipping_address.phone}</p>
                <p>Email: {order.shipping_address.email}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Order Items</h3>
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} 
                    className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                        sizes="(max-width: 96px) 100vw, 96px"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-lg">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        ₹{item.price_at_time * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <Link 
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold">₹{order.total_amount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Thank You Message */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            We're thrilled to have you as our customer! Your order will be processed with care.
          </p>
          <p className="text-gray-600 mt-2">
            Expect your awesome DrippingDawgs merch to arrive within 5-7 business days.
          </p>
        </div>
      </div>
    </div>
  )
}