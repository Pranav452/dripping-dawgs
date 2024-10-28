'use client'
import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth'

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore()
  const router = useRouter()
  const { user } = useAuth()
  
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const handleCheckout = () => {
    if (!user) {
      // Save current URL to redirect back after login
      sessionStorage.setItem('redirectAfterLogin', '/checkout')
      router.push('/login')
      return
    }
    router.push('/checkout')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">Your cart is empty</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-lg border p-4">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-24 w-24 object-cover"
                />
                <div className="flex-1">
                  <Link href={`/products/${item.id}`}>
                    <h3 className="text-lg font-semibold hover:underline">{item.name}</h3>
                  </Link>
                  <p className="text-gray-600">${item.price}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="rounded border px-2 py-1 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-16 rounded border px-2 py-1 text-center"
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="rounded border px-2 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="mt-4 w-full rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}
