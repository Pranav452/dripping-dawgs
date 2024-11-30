'use client'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from 'framer-motion'
import { toast } from "sonner"
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

interface OrderItem {
  id: string
  product: {
    name: string
    image_url: string
  }
  quantity: number
  price_at_time: number
  size: string
  color: string
}

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  created_at: string
  order_items: OrderItem[]
}

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    async function fetchOrders() {
      try {
        const { data: orders, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              product:products (
                name,
                image_url
              )
            )
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) throw error
        if (orders) setOrders(orders)
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
      router.push('/login')
    } catch (error) {
      toast.error("Error signing out")
      console.error("Sign out error:", error)
    }
  }

  if (!user) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-8 w-64 mx-auto mb-8" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          <Button 
            variant="destructive" 
            className="flex items-center gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-black text-white">
            <CardHeader className="border-b border-gray-800">
              <CardTitle className="text-white">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full bg-gray-800" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 mb-4">You haven't placed any orders yet.</p>
                  <Link href="/products">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-medium text-white">Order #{order.order_number}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                          ${order.status === 'delivered' ? 'bg-green-900 text-green-100' :
                            order.status === 'shipped' ? 'bg-blue-900 text-blue-100' :
                            order.status === 'processing' ? 'bg-yellow-900 text-yellow-100' :
                            'bg-gray-800 text-gray-100'}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex-shrink-0">
                            <div className="relative w-16 h-16 mb-2 bg-gray-900 rounded-lg">
                              <Image
                                src={item.product.image_url}
                                alt={item.product.name}
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                            <p className="text-xs text-center text-gray-400">
                              {item.quantity}x
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-gray-400">
                          {order.order_items.reduce((acc, item) => acc + item.quantity, 0)} items
                        </p>
                        <p className="font-medium text-white">₹{order.total_amount.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}