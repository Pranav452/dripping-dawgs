'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { usePathname } from 'next/navigation'

const announcements = [
  "SIGN UP & ENJOY 10% OFF",
  "WELCOME TO DRIPPINGDOG",
  "NEW DESIGNS COMING SOON",
  "FREE SHIPPING ON ORDERS OVER ₹1499"
]

export function AnnouncementBanner() {
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length)
    }, 3000) // Change announcement every 3 seconds

    return () => clearInterval(interval)
  }, [])

  // Only show on home page
  if (pathname !== '/' || !isVisible) return null

  return (
    <div className="relative">
      <div className="bg-black text-white text-center py-2 px-4">
        <p className="text-sm font-medium">{announcements[currentAnnouncementIndex]}</p>
      </div>
      <div className="absolute bg-yellow-400 top-0 right-0 h-full flex items-center">
        <button
          onClick={() => setIsVisible(false)}
          className="px-2 h-full hover:bg-yellow-500 transition-colors"
          aria-label="Close announcement"
        >
          <X className="h-4 w-4 text-black" />
        </button>
      </div>
    </div>
  )
} 