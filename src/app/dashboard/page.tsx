'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { toast } from 'sonner'
import Link from 'next/link'

interface OrderItem {
  id: string
  product: {
    name: string
  }
  quantity: number
  price_at_time: number
  size: string
}

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  created_at: string
  shipping_address: {
    name: string
    email: string
    address: string
    city: string
    postalCode: string
    phone: string
  }
  estimated_delivery: string | null
  tracking_number: string | null
  order_items: OrderItem[]
}

interface SizeInventory {
  product_id: string
  product_name: string
  size: string
  total_ordered: number
}

// List of admin emails
const ADMIN_EMAILS = ['pranavnairop090@gmail.com']

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [sizeInventory, setSizeInventory] = useState<SizeInventory[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    popularSizes: {} as Record<string, number>
  })
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      router.push('/login?redirect=/dashboard')
      return
    }

    // Check if user is admin
    if (!ADMIN_EMAILS.includes(user.email || '')) {
      toast.error('Access denied. Admin privileges required.')
      router.push('/')
      return
    }

    setIsAdmin(true)

    async function fetchData() {
      // Fetch orders with items and product details
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

      // Fetch size inventory
      const { data: inventory } = await supabase
        .rpc('get_size_inventory')

      if (orders) {
        setOrders(orders)
        
        // Calculate statistics
        const popularSizes = orders.reduce((acc, order) => {
          order.order_items.forEach((item: OrderItem) => {
            if (item.size) {
              acc[item.size] = (acc[item.size] || 0) + item.quantity
            }
          })
          return acc
        }, {} as Record<string, number>)

        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          totalRevenue: orders.reduce((acc, order) => acc + order.total_amount, 0),
          popularSizes
        })
      }

      if (inventory) {
        setSizeInventory(inventory)
      }

      setLoading(false)
    }

    fetchData()
  }, [user, router])

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ))
      
      toast.success('Order status updated successfully')
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order status')
    }
  }

  const updateShippingDetails = async (orderId: string, tracking: string, delivery: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          tracking_number: tracking,
          estimated_delivery: delivery,
          status: 'shipped'
        })
        .eq('id', orderId)

      if (error) throw error

      setOrders(orders.map(order => 
        order.id === orderId ? {
          ...order,
          tracking_number: tracking,
          estimated_delivery: delivery,
          status: 'shipped'
        } : order
      ))

      toast.success('Shipping details updated successfully')
    } catch (error) {
      console.error('Error updating shipping details:', error)
      toast.error('Failed to update shipping details')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Access Denied</h1>
        <p className="mb-8 text-gray-600">You don't have permission to access this page.</p>
        <Link 
          href="/"
          className="rounded bg-black px-6 py-2 text-white hover:bg-gray-800"
        >
          Return Home
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
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
            ₹{(stats.totalRevenue * 83).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-gray-500">Most Popular Size</h3>
          <p className="mt-2 text-3xl font-semibold">
            {Object.entries(stats.popularSizes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
          </p>
        </div>
      </div>

      {/* Size Inventory */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Size Inventory</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total Ordered
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sizeInventory.map((item, index) => (
                <tr key={`${item.product_id}-${item.size}`}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {item.product_name}
                  </td>
                  <td className="px-6 py-4">
                    {item.size}
                  </td>
                  <td className="px-6 py-4">
                    {item.total_ordered}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders Table */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Recent Orders</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Items
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
                    <div>
                      <p className="font-medium">{order.shipping_address.name}</p>
                      <p className="text-sm text-gray-500">{order.shipping_address.email}</p>
                      <p className="text-sm text-gray-500">{order.shipping_address.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {order.order_items.map((item, index) => (
                        <p key={index} className="text-sm">
                          {item.quantity}x {item.product.name} ({item.size})
                        </p>
                      ))}
                    </div>
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
                    ₹{(order.total_amount * 83).toLocaleString('en-IN')}
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
    </div>
  )
}
