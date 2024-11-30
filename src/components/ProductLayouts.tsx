'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { ProductCarousel } from './ProductCarousel'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'
import { Product } from '@/data/products'

interface ProductLayoutProps {
  product: Product
  variant?: 'default' | 'slider' | 'grid'
}

export function ProductLayout({ product, variant = 'default' }: ProductLayoutProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0])
  const [currentImages, setCurrentImages] = useState<string[]>([])
  const { addItem } = useCartStore()
  const { toggleItem, hasItem } = useWishlistStore()
  const { user } = useAuth()

  useEffect(() => {
    // Update images when color changes
    const colorImages = product.images
      .filter(img => img.color === selectedColor)
      .map(img => img.url)
    setCurrentImages(colorImages.length > 0 ? colorImages : [product.image_url])
  }, [selectedColor, product])

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please login to add items to wishlist')
      return
    }
    await toggleItem(product.id)
  }

  const getImageUrl = (color: string) => {
    const colorImage = product.images.find(img => img.color === color)
    return colorImage ? colorImage.url : product.image_url
  }

  if (variant === 'default') {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ProductCarousel images={currentImages} selectedColor={selectedColor} />
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h2 className="font-heading text-3xl md:text-4xl">{product.name}</h2>
            <div className="flex space-x-2">
              <p className="text-3xl font-bold tracking-tight">₹{product.price.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Color</p>
              </div>
              <div className="mt-3 flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 w-8 rounded-full border ${
                      selectedColor === color ? 'ring-2 ring-black ring-offset-2' : ''
                    }`}
                    style={{
                      backgroundColor: color.toLowerCase(),
                      border: color.toLowerCase() === 'white' ? '1px solid #e5e7eb' : 'none'
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Size</p>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {product.size_available.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex items-center justify-center rounded-md border py-2 text-sm ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={() => {
                if (!selectedSize) {
                  toast.error('Please select a size')
                  return
                }
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  image_url: getImageUrl(selectedColor),
                  size: selectedSize,
                  color: selectedColor
                })
                toast.success('Added to cart!')
              }}
              className="w-full bg-black hover:bg-gray-800"
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              onClick={handleWishlistToggle}
              className="w-full"
            >
              <Heart
                className={`mr-2 h-4 w-4 ${hasItem(product.id) ? 'fill-black' : ''}`}
              />
              {hasItem(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <ProductCarousel images={currentImages} selectedColor={selectedColor} />
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h2 className="font-heading text-3xl">{product.name}</h2>
            <div className="flex space-x-2">
              <p className="text-xl font-bold">₹{product.price.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Color</p>
            </div>
            <div className="mt-3 flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-8 w-8 rounded-full border ${
                    selectedColor === color ? 'ring-2 ring-black ring-offset-2' : ''
                  }`}
                  style={{
                    backgroundColor: color.toLowerCase(),
                    border: color.toLowerCase() === 'white' ? '1px solid #e5e7eb' : 'none'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Size</p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {product.size_available.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`flex items-center justify-center rounded-md border py-2 text-sm ${
                    selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <Button
            onClick={() => {
              if (!selectedSize) {
                toast.error('Please select a size')
                return
              }
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image_url: getImageUrl(selectedColor),
                size: selectedSize,
                color: selectedColor
              })
              toast.success('Added to cart!')
            }}
            className="w-full bg-black hover:bg-gray-800"
          >
            Add to Cart
          </Button>
          <Button
            variant="outline"
            onClick={handleWishlistToggle}
            className="w-full"
          >
            <Heart
              className={`mr-2 h-4 w-4 ${hasItem(product.id) ? 'fill-black' : ''}`}
            />
            {hasItem(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </Button>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
      </div>
    </div>
  )
}
