'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OrderConfirmationPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home if accessed directly without order
    const hasOrder = sessionStorage.getItem('lastOrder')
    if (!hasOrder) {
      router.push('/')
    }
  }, [router])

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center">
      <div className="rounded-lg border p-8">
        <h1 className="mb-4 text-3xl font-bold text-green-600">Order Confirmed!</h1>
        <p className="mb-8 text-gray-600">
          Thank you for your order. We'll send you a confirmation email with your order details.
        </p>
        <Link
          href="/"
          className="inline-block rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
