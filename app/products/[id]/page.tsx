'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import { ShoppingCart, Heart } from "lucide-react"
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useAuth } from '@/lib/auth'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { ProductCarousel } from '@/components/ProductCarousel'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { products } from '@/data/products'

// Helper function to format price in Rupees
function formatPrice(price: number): string {
  const priceInRupees = price * 83
  return `₹${priceInRupees.toLocaleString('en-IN')}`
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<typeof products[0] | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const { addItem } = useCartStore()
  const { toggleItem, hasItem } = useWishlistStore()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find product from hardcoded data
    const foundProduct = products.find(p => p.id === params.id)
    if (foundProduct) {
      setProduct(foundProduct)
      setSelectedColor(foundProduct.colors[0]) // Set default color
    }
    setLoading(false)
  }, [params.id])

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }

    if (!selectedColor) {
      toast.error('Please select a color')
      return
    }

    if (!user) {
      toast.error('Please login to add items to cart')
      return
    }

    if (!product) return

    const selectedImage = product.images.find(img => img.color === selectedColor)?.url || product.image_url

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: selectedImage,
      size: selectedSize,
      color: selectedColor
    })
    
    toast.success('Added to cart!')
    setSelectedSize('') // Reset size selection after adding to cart
  }

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please login to add items to wishlist')
      return
    }
    if (!product) return
    await toggleItem(product.id)
  }

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="aspect-[3/4] w-full" />
        </div>
      </div>
    )
  }

  // Create an array of images based on colors
  const productImages = product.images.map(img => img.url)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Images */}
        <ProductCarousel images={productImages} />

        {/* Product Info */}
        <motion.div
          className="flex flex-col space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500">
            Shop / T-Shirts / {product.name}
          </div>

          {/* Product Title and Price */}
          <div>
            <h1 className="text-2xl font-normal mb-4">{product.name}</h1>
            <p className="text-xl">{formatPrice(product.price)}</p>
          </div>

          {/* Product Description */}
          <div className="space-y-4 text-sm">
            <p className="leading-relaxed">{product.description}</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>100% Premium Cotton</li>
              <li>Regular fit</li>
              <li>Machine wash</li>
              <li>Made in India</li>
            </ul>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <label className="block text-sm">SELECT A COLOR</label>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-full border-2 transition-all ${
                    selectedColor === color 
                      ? 'border-black scale-110' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{ 
                    backgroundColor: color.toLowerCase(),
                    border: color.toLowerCase() === 'white' ? '1px solid #e5e5e5' : undefined
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-3">
            <label className="block text-sm">SELECT A SIZE</label>
            <Select onValueChange={setSelectedSize} value={selectedSize}>
              <SelectTrigger className="w-full h-14">
                <SelectValue placeholder="Choose your size" />
              </SelectTrigger>
              <SelectContent>
                {product.size_available.map((size) => (
                  <SelectItem key={size} value={size} className="cursor-pointer">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSize && (
              <p className="text-sm text-gray-500 mt-2">
                Selected: {selectedSize}
              </p>
            )}
          </div>

          {/* Add to Cart and Wishlist */}
          <div className="flex gap-3">
            <Button
              className="flex-1 h-14 text-base bg-black hover:bg-black/90"
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 border-gray-200 hover:border-black hover:bg-white"
              onClick={handleWishlistToggle}
            >
              <Heart 
                className="h-5 w-5" 
                fill={hasItem(product.id) ? "currentColor" : "none"}
              />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
