'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Package, Truck, ShoppingBag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string
  size?: string
  color?: string
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
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const orderData = sessionStorage.getItem('lastOrder')
    if (!orderData) {
      router.push('/')
      return
    }
    setOrder(JSON.parse(orderData))
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
            <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>

          <Card className="mb-8">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
              </div>
            </CardContent>
          </Card>

          {/* Items Skeleton */}
          <Card className="mb-8">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!order) return null

  return (
    <div className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <CheckCircle className="mx-auto h-24 w-24 text-green-500 mb-4" />
          <h1 className="text-4xl font-extrabold mb-4">Thank You for Your Order!</h1>
          <p className="text-xl text-gray-600">Your order has been confirmed and is being processed.</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Package className="mr-2 h-6 w-6 text-yellow-500" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
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
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <ShoppingBag className="mr-2 h-6 w-6 text-yellow-500" />
              Items Ordered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="relative h-16 w-16 rounded overflow-hidden">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × ${item.price}
                      {item.size && ` • Size: ${item.size}`}
                      {item.color && ` • Color: ${item.color}`}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${order.total_amount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Truck className="mr-2 h-6 w-6 text-yellow-500" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Your order will be shipped within 2-3 business days. You will receive
              a shipping confirmation email with tracking details once your order
              ships.
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/products">
            <Button className="bg-black text-white hover:bg-gray-800">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}