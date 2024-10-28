'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

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
  }
  estimated_delivery: string | null
  tracking_number: string | null
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  })
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.email !== 'pranavnairop090@gmail.com') {
      router.push('/')
      return
    }

    async function fetchOrders() {
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (
              name
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (orders) {
        setOrders(orders)
        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          totalRevenue: orders.reduce((acc, order) => acc + order.total_amount, 0),
        })
      }
      setLoading(false)
    }

    fetchOrders()
  }, [user, router])

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (!error) {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ))
    }
  }

  const updateShippingDetails = async (orderId: string, tracking: string, delivery: string) => {
    const { error } = await supabase
      .from('orders')
      .update({
        tracking_number: tracking,
        estimated_delivery: delivery,
        status: 'shipped'
      })
      .eq('id', orderId)

    if (!error) {
      setOrders(orders.map(order => 
        order.id === orderId ? {
          ...order,
          tracking_number: tracking,
          estimated_delivery: delivery,
          status: 'shipped'
        } : order
      ))
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      {/* Stats Overview */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.totalOrders}</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.pendingOrders}</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="mt-2 text-3xl font-semibold">
            ${stats.totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Order Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  {order.order_number}
                </td>
                <td className="px-6 py-4">
                  {order.shipping_address.name}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="rounded border px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  ${order.total_amount.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  {format(new Date(order.created_at), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      const tracking = prompt('Enter tracking number:')
                      const delivery = prompt('Enter estimated delivery date (YYYY-MM-DD):')
                      if (tracking && delivery) {
                        updateShippingDetails(order.id, tracking, delivery)
                      }
                    }}
                    className="rounded bg-black px-3 py-1 text-sm text-white hover:bg-gray-800"
                  >
                    Update Shipping
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
