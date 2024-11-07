'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, ShoppingBag, Heart, User } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useAuth } from '@/lib/auth'
import { AppSidebar } from '@/components/Sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export function Header() {
  const items = useCartStore((state) => state.items)
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const { user } = useAuth()

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="relative">
        <header className="sticky top-0 z-40 w-full bg-black text-white border-b border-gray-800">
          <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-8">
            {/* Left Section - Logo */}
            <div className="flex items-center ml-4">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/LOGO.png" 
                  alt="DQ Logo" 
                  width={60} 
                  height={60} 
                  className="object-contain"
                />
              </Link>
            </div>

            {/* Center Title - Desktop Only */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
              <Link 
                href="/" 
                className="text-3xl font-normal tracking-wide hover:text-yellow-400 transition-colors font-dancing-script"
                style={{ fontFamily: 'Dancing Script, cursive' }}
              >
                DrippingDog
              </Link>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-6 mr-4">
              <Link 
                href={user ? "/profile" : "/login"} 
                className="hover:text-yellow-400 transition-colors"
              >
                <User className="h-6 w-6 text-white" />
              </Link>
              
              <Link 
                href="/wishlist" 
                className="relative hover:text-yellow-400 transition-colors"
              >
                <Heart className="h-6 w-6 text-white" />
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center">
                  0
                </span>
              </Link>
              
              <Link 
                href="/cart" 
                className="relative hover:text-yellow-400 transition-colors"
              >
                <ShoppingBag className="h-6 w-6 text-white" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Trigger */}
              <SidebarTrigger 
                className="lg:hidden hover:text-yellow-400 transition-colors" 
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6 text-white" />
              </SidebarTrigger>
            </div>
          </div>
        </header>
        <AppSidebar />
      </div>
    </SidebarProvider>
  )
}
