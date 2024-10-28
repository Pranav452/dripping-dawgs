'use client'
import { useRouter } from 'next/navigation'

export function HeroSection() {
  const router = useRouter()

  return (
    <div className="relative h-[70vh] bg-gray-900">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full items-center justify-center text-center">
        <div className="max-w-3xl px-4">
          <h1 className="mb-6 text-5xl font-bold text-white">
            Discover Your Style
          </h1>
          <p className="mb-8 text-xl text-gray-200">
            Explore our collection of premium clothing and accessories
          </p>
          <button 
            onClick={() => router.push('/products')}
            className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-100"
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  )
}
