'use client'
import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore()
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Your Cart is Empty</h1>
        <Link
          href="/products"
          className="inline-block rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-8 text-2xl font-bold">Shopping Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-lg border p-4">
            <div className="relative h-24 w-24 flex-shrink-0">
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="rounded-md object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">${item.price}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="rounded border px-2 py-1 hover:bg-gray-100"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="rounded border px-2 py-1 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => removeItem(item.id)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
              <p className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 block rounded-md bg-black px-6 py-3 text-center text-white hover:bg-gray-800"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}
