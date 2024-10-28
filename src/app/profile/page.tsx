'use client'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Profile Settings</h1>
      
      <div className="rounded-lg border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Account Information</h2>
          <p className="mt-2 text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">
            Member since: {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">Account Type</h2>
          <p className="mt-2 text-gray-600">
            {user.email === 'admin@example.com' ? 'Administrator' : 'Customer'}
          </p>
        </div>

        {/* Add more profile sections as needed */}
      </div>
    </div>
  )
}
