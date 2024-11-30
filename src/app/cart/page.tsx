'use client'

import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'

export default function CartPage() {
  const { items, removeItem, updateQuantity, formatPrice } = useCartStore()
  const router = useRouter()
  const { user } = useAuth()

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout')
      router.push('/login')
      return
    }
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your cart is empty</h1>
          <p className="mt-2 text-lg text-gray-500">Continue shopping to add items to your cart.</p>
          <div className="mt-6">
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>

      <div className="mt-12">
        <div className="divide-y divide-gray-200 border-t border-b">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="flex py-6">
              <div className="flex-shrink-0">
                <Link href={`/products/${item.id}`}>
                  <div className="relative h-24 w-24 overflow-hidden rounded-md bg-white">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>
              </div>

              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between">
                    <div>
                      <Link href={`/products/${item.id}`}>
                        <h3 className="font-medium text-gray-700 hover:text-gray-800">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="mt-1 text-sm text-gray-500">
                        Size: {item.size} | Color: {item.color}
                      </p>
                    </div>
                    <p className="ml-4 text-sm font-medium text-gray-900">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 items-end justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.size, item.color)}
                      className="rounded-full hover:bg-black hover:text-white transition-all duration-300"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-gray-600 w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                      className="rounded-full hover:bg-black hover:text-white transition-all duration-300"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id, item.size, item.color)}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>{formatPrice(subtotal)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>

          <div className="mt-6">
            <Button
              onClick={handleCheckout}
              className="w-full bg-black hover:bg-gray-800"
            >
              Checkout
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/products">
              <Button variant="link" className="text-sm">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}