'use client'
import { useRouter } from 'next/navigation'
import { Scene3D } from './Scene3D'

export function HeroSection() {
  const router = useRouter()

  return (
    <div className="relative h-[92vh]">
      <div className="absolute inset-0">
        <Scene3D />
      </div>
      <div className="absolute bottom-0 w-full bg-yellow-400 text-black py-3 text-center font-medium">
        FREE SHIPPING ON ALL ORDERS OVER ₹1499 | SHOP NOW
      </div>
    </div>
  )
}
