'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import { ShoppingCart, Heart, ChevronDown } from "lucide-react"
import { supabase } from '@/lib/supabase'
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

interface Product {
  id: string
  name: string
  price: number
  description: string
  image_url: string
  category_id: string
  brand: string
  colors: string[]
  size_available: string[]
  stock: number
  featured: boolean
  categories: {
    name: string
  }
}

// Helper function to format price in Rupees
function formatPrice(price: number): string {
  // Convert dollar price to rupees (approximate conversion rate: 1 USD = 83 INR)
  const priceInRupees = price * 83
  return `₹${priceInRupees.toLocaleString('en-IN')}`
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const { addItem } = useCartStore()
  const { toggleItem, hasItem } = useWishlistStore()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      const { data: productData } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('id', params.id)
        .single()

      if (productData) {
        setProduct(productData)
      }
      setLoading(false)
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }

    if (!user) {
      toast.error('Please login to add items to cart')
      return
    }

    addItem({
      id: product!.id,
      name: product!.name,
      price: product!.price,
      quantity: 1,
      image_url: product!.image_url,
      size: selectedSize
    })
    
    toast.success('Added to cart!')
    setSelectedSize('') // Reset size selection after adding to cart
  }

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please login to add items to wishlist')
      return
    }
    await toggleItem(product!.id)
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

  // Create an array of images (in a real app, this would come from your database)
  // For now, we'll duplicate the image to simulate multiple views/colors
  const productImages = [
    product.image_url,
    product.image_url,
    product.image_url,
    product.image_url
  ]

  // Define standard sizes
  const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Column - Product Info */}
        <motion.div
          className="flex flex-col space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500">
            Shop / {product.categories?.name} / {product.name}
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
              <li>Handcrafted sculptural band ring in sterling silver</li>
              <li>Logo engraved at inner band</li>
              <li>Textured at surface</li>
              <li>Color: Grey</li>
              <li>925 sterling silver</li>
              <li>Made in Montreal</li>
            </ul>
          </div>

          {/* Size Selection Dropdown */}
          <div className="space-y-3">
            <label className="block text-sm">SELECT A SIZE</label>
            <Select onValueChange={setSelectedSize} value={selectedSize}>
              <SelectTrigger className="w-full h-14">
                <SelectValue placeholder="Choose your size" />
              </SelectTrigger>
              <SelectContent>
                {standardSizes.map((size) => (
                  <SelectItem key={size} value={size} className="cursor-pointer">
                    {size} - {getSizeDescription(size)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSize && (
              <p className="text-sm text-gray-500 mt-2">
                Selected: {selectedSize} - {getSizeDescription(selectedSize)}
              </p>
            )}
          </div>

          {/* Add to Cart and Wishlist */}
          <div className="flex gap-3">
            <Button
              className="flex-1 h-14 text-base bg-black hover:bg-black/90"
              onClick={handleAddToCart}
              disabled={!selectedSize}
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

          {/* Size Guide */}
          <div className="text-sm text-gray-600">
            <h3 className="font-medium mb-2">Size Guide</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">XS</p>
                <p>Chest: 81-86 cm</p>
                <p>Waist: 66-71 cm</p>
              </div>
              <div>
                <p className="font-medium">S</p>
                <p>Chest: 89-94 cm</p>
                <p>Waist: 74-79 cm</p>
              </div>
              <div>
                <p className="font-medium">M</p>
                <p>Chest: 97-102 cm</p>
                <p>Waist: 81-86 cm</p>
              </div>
              <div>
                <p className="font-medium">L</p>
                <p>Chest: 104-109 cm</p>
                <p>Waist: 89-94 cm</p>
              </div>
              <div>
                <p className="font-medium">XL</p>
                <p>Chest: 112-117 cm</p>
                <p>Waist: 97-102 cm</p>
              </div>
              <div>
                <p className="font-medium">XXL</p>
                <p>Chest: 119-124 cm</p>
                <p>Waist: 104-109 cm</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Product Images */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:sticky lg:top-24"
        >
          <ProductCarousel images={productImages} />
        </motion.div>
      </div>
    </div>
  )
}

// Helper function to get size descriptions
function getSizeDescription(size: string): string {
  const descriptions: Record<string, string> = {
    'XS': 'Extra Small (81-86 cm)',
    'S': 'Small (89-94 cm)',
    'M': 'Medium (97-102 cm)',
    'L': 'Large (104-109 cm)',
    'XL': 'Extra Large (112-117 cm)',
    'XXL': 'Double Extra Large (119-124 cm)'
  }
  return descriptions[size] || size
}
