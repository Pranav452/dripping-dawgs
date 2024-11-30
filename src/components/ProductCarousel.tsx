'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ProductCarouselProps {
  images: string[]
  selectedColor?: string
}

export function ProductCarousel({ images, selectedColor }: ProductCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // If no images provided, show a placeholder
  if (images.length === 0) {
    return (
      <div className="relative aspect-square bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          No image available
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image with Navigation */}
      <div className="relative aspect-square bg-gray-50 group">
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <Image
            src={images[currentImageIndex]}
            alt="Product view"
            fill
            className="object-contain p-4"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
              onClick={previousImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "relative aspect-square overflow-hidden bg-white",
                currentImageIndex === index 
                  ? "ring-2 ring-black" 
                  : "hover:opacity-75 transition-opacity"
              )}
            >
              <Image
                src={image}
                alt={`Product view ${index + 1}`}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 25vw, 10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 