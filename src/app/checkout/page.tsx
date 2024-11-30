'use client'
import { useCartStore } from '@/store/cart'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

// Helper function to format price in Rupees
function formatPrice(price: number): string {
  const priceInRupees = price * 83
  return `₹${priceInRupees.toLocaleString('en-IN')}`
}

export default function CheckoutPage() {
  const { items } = useCartStore()
  const { user } = useAuth()
  const router = useRouter()
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shipping = total > 100 ? 0 : 10
  const finalTotal = total + shipping

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  })

  useEffect(() => {
    // Check if cart is empty
    if (items.length === 0) {
      router.push('/cart')
      return
    }

    // Check if user is logged in
    if (!user) {
      sessionStorage.setItem('redirectAfterLogin', '/checkout')
      router.push('/login')
      return
    }

    // Pre-fill email if user is logged in
    setFormData(prev => ({
      ...prev,
      email: user.email || ''
    }))
  }, [user, items, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Added field validation
      if (!formData.name || !formData.email || !formData.address || 
          !formData.city || !formData.postalCode || !formData.phone) {
        toast.error('Please fill in all required fields')
        return
      }

      if (!user) {
        router.push('/login')
        return
      }

      // Validate cart
      if (items.length === 0) {
        router.push('/cart')
        return
      }

      // Save shipping details to session storage
      sessionStorage.setItem('shippingDetails', JSON.stringify({
        ...formData,
        userId: user.id
      }))

      // Proceed to payment
      router.push('/payment')
    } catch (error) {
      console.error('Error processing checkout:', error)
      toast.error('Error processing checkout')
    }
  }

  // Show loading state while checking auth
  if (!user || items.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Shipping Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                className="mt-1 w-full rounded-md border p-2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="mt-1 w-full rounded-md border p-2"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                required
                className="mt-1 w-full rounded-md border p-2"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                required
                className="mt-1 w-full rounded-md border p-2"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                required
                className="mt-1 w-full rounded-md border p-2"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                required
                className="mt-1 w-full rounded-md border p-2"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  )
}
