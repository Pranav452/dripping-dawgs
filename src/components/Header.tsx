'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { useAuth } from '@/lib/auth'
import { useState, useRef, useEffect } from 'react'

export function Header() {
  const items = useCartStore((state) => state.items)
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const { user, signOut } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Change this to check for your specific admin email
  const isAdmin = user?.email === 'pranavnairop090@gmail.com'

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsProfileOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-yellow-400 flex items-center justify-center font-bold text-black">
            DD
          </div>
          <span className="text-xl font-bold">DrippingDog</span>
        </Link>
        
        <nav className="flex items-center gap-8">
          <Link href="/products" className="hover:text-yellow-400 transition-colors">
            Designs
          </Link>
          {isAdmin && (
            <Link href="/dashboard" className="hover:text-yellow-400 transition-colors">
              Dashboard
            </Link>
          )}
          <Link href="/cart" className="hover:text-yellow-400 transition-colors">
            Cart ({itemCount})
          </Link>
          <Link href="/contact" className="hover:text-yellow-400 transition-colors">
            Contact Us
          </Link>
          
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 text-black transition-colors"
            >
              {user ? (
                <span className="text-sm font-bold">
                  {user.email?.[0].toUpperCase()}
                </span>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-700 bg-black py-1 shadow-lg">
                {user ? (
                  <>
                    <div className="border-b border-gray-700 px-4 py-2">
                      <p className="text-sm font-medium text-white">{user.email}</p>
                      {isAdmin && (
                        <p className="text-xs text-gray-400">Administrator</p>
                      )}
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-white hover:bg-yellow-400 hover:text-black"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-white hover:bg-yellow-400 hover:text-black"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-yellow-400 hover:text-black"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm text-white hover:bg-yellow-400 hover:text-black"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-2 text-sm text-white hover:bg-yellow-400 hover:text-black"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
