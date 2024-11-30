'use client'
import { ProductGallery } from './ProductGallery'
import { useCartStore } from '@/store/cart'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  description: string
  brand: string
  colors: string[]
  size_available: string[]
  stock: number
  images: { url: string; alt: string }[]
}

interface ProductLayoutProps {
  product: Product
  variant?: 'default' | 'compact' | 'full'
}

// Helper function to format price in Rupees
function formatPrice(price: number): string {
  const priceInRupees = price * 83
  return `₹${priceInRupees.toLocaleString('en-IN')}`
}

export function ProductLayout({ product, variant = 'default' }: ProductLayoutProps) {
  const { items, addItem } = useCartStore()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  const isInCart = items.some(item => item.id === product.id)

  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        <ProductGallery images={product.images} variant="single" />
        <div>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <h2 className="font-semibold">{product.name}</h2>
          <p className="mt-2">{formatPrice(product.price)}</p>
        </div>
      </div>
    )
  }

  if (variant === 'full') {
    return (
      <div className="space-y-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <ProductGallery images={product.images} variant="grid" />
          <div className="space-y-6">
            <div>
              <p className="text-lg text-gray-600">{product.brand}</p>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="mt-2 text-2xl">{formatPrice(product.price)}</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.size_available.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-md px-4 py-2 ${
                        selectedSize === size
                          ? 'bg-primary text-primary-foreground'
                          : 'border hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <button
                className={`w-full rounded-md px-6 py-3 ${
                  isInCart || !selectedSize
                    ? 'bg-secondary text-secondary-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
                disabled={isInCart || !selectedSize}
                onClick={() => {
                  if (selectedSize) {
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      quantity: 1,
                      image_url: product.images[0].url,
                      size: selectedSize
                    })
                  }
                }}
              >
                {isInCart ? 'In Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <ProductGallery images={product.images} />
      <div className="space-y-6">
        <div>
          <p className="text-lg text-muted-foreground">{product.brand}</p>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-2xl">{formatPrice(product.price)}</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {product.size_available.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-md px-4 py-2 ${
                    selectedSize === size
                      ? 'bg-primary text-primary-foreground'
                      : 'border hover:border-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <button
            className={`w-full rounded-md px-6 py-3 ${
              isInCart || !selectedSize
                ? 'bg-secondary text-secondary-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
            disabled={isInCart || !selectedSize}
            onClick={() => {
              if (selectedSize) {
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  image_url: product.images[0].url,
                  size: selectedSize
                })
              }
            }}
          >
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
