'use client'
import { Scene3D } from './Scene3D'

export function HeroSection() {
  return (
    <div className="relative h-[60vh] md:h-[92vh]">
      <div className="absolute inset-0">
        <Scene3D />
      </div>
      <div className="absolute bottom-0 w-full bg-yellow-400 text-black py-2 md:py-3 text-center font-medium text-sm md:text-base px-4">
        FREE SHIPPING ON ALL ORDERS OVER ₹1499 | SHOP NOW
      </div>
    </div>
  )
}
