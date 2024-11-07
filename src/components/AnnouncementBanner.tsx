'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { usePathname } from 'next/navigation'

const announcements = [
  "SIGN UP & ENJOY 10% OFF",
  "WELCOME TO DRIPPINGDOG",
  "NEW DESIGNS COMING SOON",
  "FREE SHIPPING ON ORDERS OVER ₹1499"
]

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()

  // Only show on home page
  if (pathname !== '/' || !isVisible) return null

  return (
    <div className="relative">
      <div className="bg-yellow-400 overflow-hidden whitespace-nowrap py-2">
        <div className="animate-slide inline-block">
          {/* Duplicate the announcements to create seamless loop */}
          {[...announcements, ...announcements].map((announcement, index) => (
            <span key={index} className="inline-block px-8 text-sm font-medium text-black">
              {announcement}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute top-0 right-0 h-full flex items-center">
        <button
          onClick={() => setIsVisible(false)}
          className="px-2 h-full bg-black hover:bg-black/80 transition-colors"
          aria-label="Close announcement"
        >
          <X className="h-4 w-4 text-yellow-400" />
        </button>
      </div>
    </div>
  )
} 