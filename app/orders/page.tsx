'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import Image from 'next/image'

interface OrderItem {
  id: string
  quantity: number
  price_at_time: number
  product: {
    id: string
    name: string
    image_url: string
    description: string
  }
}

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  created_at: string
  shipping_address: {
    name: string
    address: string
    city: string
    postalCode: string
    phone: string
  }
  payment_method: string
  tracking_number: string | null
  estimated_delivery: string | null
  order_items: OrderItem[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    async function fetchOrders() {
      if (!user) return

      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (
              id,
              name,
              image_url,
              description
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
        return
      }

      if (orders) {
        setOrders(orders)
      }
      setLoading(false)
    }

    fetchOrders()
  }, [user, router])

  if (!user) return null
  if (loading) return <div>Loading...</div>

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="overflow-hidden rounded-lg border shadow-sm">
              {/* Order Header */}
              <div className="flex items-center justify-between border-b bg-gray-50 p-4">
                <div>
                  <p className="font-medium">Order #{order.order_number}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(order.created_at), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>

              {/* Order Items Preview (Always Visible) */}
              <div className="bg-white p-4">
                <div className="flex flex-wrap gap-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="relative h-16 w-16">
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="rounded object-cover"
                        sizes="(max-width: 64px) 100vw, 64px"
                      />
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs text-white">
                        {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expanded Details */}
              {selectedOrder === order.id && (
                <div className="divide-y bg-white">
                  {/* Detailed Items List */}
                  <div className="p-4">
                    <h3 className="mb-4 font-medium">Order Details</h3>
                    <div className="space-y-4">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="relative h-24 w-24 flex-shrink-0">
                            <Image
                              src={item.product.image_url}
                              alt={item.product.name}
                              fill
                              className="rounded object-cover"
                              sizes="(max-width: 96px) 100vw, 96px"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="mt-1 text-sm text-gray-600">
                              {item.product.description}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                              Quantity: {item.quantity} × ${item.price_at_time}
                            </p>
                          </div>
                          <p className="font-medium">
                            ${(item.price_at_time * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Payment Info */}
                  <div className="grid gap-6 p-4 md:grid-cols-2">
                    <div>
                      <h3 className="mb-2 font-medium">Shipping Address</h3>
                      <div className="text-sm text-gray-600">
                        <p>{order.shipping_address.name}</p>
                        <p>{order.shipping_address.address}</p>
                        <p>{order.shipping_address.city}, {order.shipping_address.postalCode}</p>
                        <p>Phone: {order.shipping_address.phone}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 font-medium">Payment Details</h3>
                      <div className="text-sm text-gray-600">
                        <p>Method: {order.payment_method}</p>
                        <p>Total: ${order.total_amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Info */}
                  {order.tracking_number && (
                    <div className="bg-gray-50 p-4">
                      <h3 className="mb-2 font-medium">Tracking Information</h3>
                      <div className="text-sm text-gray-600">
                        <p>Tracking Number: {order.tracking_number}</p>
                        {order.estimated_delivery && (
                          <p>Estimated Delivery: {format(new Date(order.estimated_delivery), 'MMMM d, yyyy')}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
