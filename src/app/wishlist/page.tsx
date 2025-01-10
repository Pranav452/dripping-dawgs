'use client'

import { useEffect, useState } from 'react'
import { useWishlistStore } from '@/store/wishlist'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCartStore } from '@/store/cart'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  description: string
  categories: {
    name: string
  }
  size_available: string[]
  colors: string[]
}

// Array of catchy messages
const WISHLIST_MESSAGES = [
  "Don't let your dreams stay dreams! 💫",
  "These items are waiting to be yours! 🌟",
  "Your style picks are just a checkout away! ✨",
  "Ready to treat yourself? Your wishlist is looking fabulous! 🛍️",
  "Life's too short to wait - make these yours today! ⭐",
  "Your perfect picks are getting lonely! 🎁",
  "Style this good shouldn't wait! 🔥",
  "Your future favorites are right here! 🌈"
]

// Helper function to format price in Rupees
function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`
}

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { items: wishlistItems, removeItem } = useWishlistStore()
  const { addItem: addToCart, items: cartItems } = useCartStore()
  const { user } = useAuth()
  const [message] = useState(() => 
    WISHLIST_MESSAGES[Math.floor(Math.random() * WISHLIST_MESSAGES.length)]
  )

  useEffect(() => {
    async function fetchWishlistProducts() {
      if (!wishlistItems.length) {
        setProducts([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          ),
          size_available,
          colors
        `)
        .in('id', wishlistItems)

      if (error) {
        console.error('Error fetching wishlist products:', error)
        return
      }

      setProducts(data || [])
      setLoading(false)
    }

    fetchWishlistProducts()
  }, [wishlistItems])

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId)
  }

  const handleAddToCart = (product: Product) => {
    if (!isInCart(product.id)) {
      const defaultSize = product.size_available[0] || 'M'
      const defaultColor = product.colors[0] || 'Black'
      
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url: product.image_url,
        size: defaultSize,
        color: defaultColor
      })
      toast.success('Added to cart! Ready for checkout!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-4">Time to discover your next favorite pieces!</p>
            <Link href="/products">
              <Button className="bg-black hover:bg-gray-800 text-white">
                Start Exploring <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">My Wishlist</h1>
          <p className="text-lg text-gray-600 mb-2">{message}</p>
          <p className="text-sm text-gray-500">
            {products.length} {products.length === 1 ? 'item' : 'items'} waiting to be yours
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="group"
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <Link href={`/products/${product.id}`} className="block">
                <div className="relative aspect-square">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h2 className="font-semibold mb-2 hover:underline group-hover:text-yellow-600 transition-colors">
                    {product.name}
                  </h2>
                </Link>
                <p className="text-gray-600 text-sm mb-2">{product.categories.name}</p>
                <p className="font-bold mb-4 text-lg">{formatPrice(product.price)}</p>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-black hover:bg-gray-800 text-white group-hover:scale-105 transition-transform duration-300"
                    onClick={() => handleAddToCart(product)}
                    disabled={isInCart(product.id)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      removeItem(product.id)
                      toast.success('Removed from wishlist')
                    }}
                    className="hover:bg-red-50 hover:text-red-500 transition-colors duration-300"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {products.length >= 2 && (
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/cart">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Ready to Checkout?
            </Button>
          </Link>
          <p className="mt-4 text-gray-600">
            Secure checkout • Free shipping over ₹8,300 • Easy returns
          </p>
        </motion.div>
      )}
    </div>
  )
} 