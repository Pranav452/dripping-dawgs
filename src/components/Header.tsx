'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { useAuth } from '@/lib/auth'
import { Search, Heart, User, ShoppingCart } from 'lucide-react'

export function Header() {
  const items = useCartStore((state) => state.items)
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image 
            src="/LOGO.png" 
            alt="DQ Logo" 
            width={50} 
            height={50} 
            className="object-contain"
          />
        </Link>

        {/* Main Navigation */}
        <nav className="flex items-center gap-8">
          <Link 
            href="/" 
            className="text-white hover:text-yellow-400 transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/products" 
            className="text-white hover:text-yellow-400 transition-colors"
          >
            Shop
          </Link>
          <Link 
            href="/contact" 
            className="text-white hover:text-yellow-400 transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center gap-6">
          <button className="hover:text-yellow-400 transition-colors">
            <Search className="h-5 w-5" />
          </button>
          
          <Link href="/wishlist" className="relative hover:text-yellow-400 transition-colors">
            <Heart className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-yellow-400 text-black text-xs flex items-center justify-center">
              0
            </span>
          </Link>
          
          <Link href={user ? "/profile" : "/login"} className="hover:text-yellow-400 transition-colors">
            <User className="h-5 w-5" />
          </Link>
          
          <Link href="/cart" className="relative hover:text-yellow-400 transition-colors">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-yellow-400 text-black text-xs flex items-center justify-center">
              {itemCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
