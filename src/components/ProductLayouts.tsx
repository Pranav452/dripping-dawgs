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

export function ProductLayout({ product, variant = 'default' }: ProductLayoutProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)

  const isInCart = items.some(item => item.id === product.id)

  if (variant === 'compact') {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} variant="slider" />
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-lg text-gray-600">${product.price}</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {product.size_available.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-md px-4 py-2 ${
                    selectedSize === size
                      ? 'bg-black text-white'
                      : 'border hover:border-black'
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
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
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
                  size: selectedSize,
                  color: selectedColor
                })
              }
            }}
          >
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </button>
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
              <p className="mt-2 text-2xl">${product.price}</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">Select Color</p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`h-8 w-8 rounded-full border-2 ${
                        selectedColor === color ? 'border-black' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.size_available.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-md px-4 py-2 ${
                        selectedSize === size
                          ? 'bg-black text-white'
                          : 'border hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              className={`w-full rounded-md px-6 py-3 ${
                isInCart || !selectedSize || !selectedColor
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
              disabled={isInCart || !selectedSize || !selectedColor}
              onClick={() => {
                if (selectedSize && selectedColor) {
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image_url: product.images[0].url,
                    size: selectedSize,
                    color: selectedColor
                  })
                }
              }}
            >
              {isInCart ? 'In Cart' : 'Add to Cart'}
            </button>
            <div className="prose prose-sm">
              <h3>Product Description</h3>
              <p>{product.description}</p>
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
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="mt-2 text-xl">${product.price}</p>
        </div>
        {/* Rest of the default layout */}
      </div>
    </div>
  )
}
