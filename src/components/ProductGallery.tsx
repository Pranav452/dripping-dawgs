'use client'
import { useState } from 'react'
import Image from 'next/image'

interface ProductImage {
  url: string
  alt: string
}

interface ProductGalleryProps {
  images: ProductImage[]
  variant?: 'default' | 'grid' | 'slider'
}

export function ProductGallery({ images, variant = 'default' }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index} className="aspect-square overflow-hidden rounded-lg">
            <Image
              src={image.url}
              alt={image.alt}
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'slider') {
    return (
      <div className="relative">
        <div className="aspect-square overflow-hidden rounded-lg">
          <Image
            src={images[selectedImage].url}
            alt={images[selectedImage].alt}
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                selectedImage === index ? 'border-black' : 'border-transparent'
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className="flex gap-4">
      <div className="w-1/5 space-y-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square w-full overflow-hidden rounded-lg border-2 ${
              selectedImage === index ? 'border-black' : 'border-transparent'
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
      <div className="w-4/5">
        <div className="aspect-square overflow-hidden rounded-lg">
          <Image
            src={images[selectedImage].url}
            alt={images[selectedImage].alt}
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
