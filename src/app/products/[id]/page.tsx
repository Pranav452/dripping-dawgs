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
  return `₹${price.toLocaleString('en-IN')}`
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
    <div className="max-w-7xl mx-auto px-4 py-12 bg-black text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Images */}
        <div className="border border-yellow-500/50 rounded-xl p-4 hover:border-yellow-500 transition-all duration-300">
          <ProductCarousel images={productImages} />
        </div>

        {/* Product Info */}
        <motion.div
          className="flex flex-col space-y-8 border border-yellow-500/50 rounded-xl p-8 hover:border-yellow-500 transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Breadcrumb */}
          <div className="text-sm text-gray-400">
            Shop / T-Shirts / {product.name}
          </div>

          {/* Product Title and Price */}
          <div>
            <h1 className="text-2xl font-normal mb-4 text-white">{product.name}</h1>
            <p className="text-xl text-yellow-500">{formatPrice(product.price)}</p>
          </div>

          {/* Product Description */}
          <div className="space-y-4 text-sm">
            <p className="leading-relaxed text-gray-300">{product.description}</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>100% Premium Cotton</li>
              <li>Regular fit</li>
              <li>Machine wash</li>
              <li>Made in India</li>
            </ul>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <label className="block text-sm text-gray-300">SELECT A COLOR</label>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-full transform hover:scale-110 transition-all duration-300 ${
                    selectedColor === color 
                      ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-black' 
                      : 'hover:ring-2 hover:ring-yellow-500/50 hover:ring-offset-2 hover:ring-offset-black'
                  }`}
                  style={{ 
                    backgroundColor: color.toLowerCase(),
                    border: color.toLowerCase() === 'white' ? '1px solid #4a4a4a' : 'none'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-3">
            <label className="block text-sm text-gray-300">SELECT A SIZE</label>
            <Select onValueChange={setSelectedSize} value={selectedSize}>
              <SelectTrigger className="w-full h-14 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Choose your size" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {product.size_available.map((size) => (
                  <SelectItem key={size} value={size} className="cursor-pointer text-white hover:bg-gray-800">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSize && (
              <p className="text-sm text-gray-400 mt-2">
                Selected: {selectedSize}
              </p>
            )}
          </div>

          {/* Add to Cart and Wishlist */}
          <div className="flex gap-3">
            <Button
              className="flex-1 h-14 text-base bg-yellow-500 hover:bg-yellow-400 text-black transform hover:scale-[1.02] transition-all duration-300"
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`h-14 w-14 transform hover:scale-110 transition-all duration-300 ${
                hasItem(product.id)
                  ? 'border-red-500 bg-red-500/10 hover:bg-red-500/20'
                  : 'border-gray-700 hover:border-red-500/50'
              }`}
              onClick={handleWishlistToggle}
            >
              <Heart 
                className={`h-5 w-5 ${hasItem(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                fill={hasItem(product.id) ? "currentColor" : "none"}
              />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
