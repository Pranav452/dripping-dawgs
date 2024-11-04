'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import { ShoppingCart, Heart, Share2, Truck, RotateCcw, Shield, Zap } from "lucide-react"
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/store/cart'
import { motion } from 'framer-motion'

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const { addItem, items } = useCartStore()
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
        // Fetch related products from same category
        const { data: relatedData } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              name
            )
          `)
          .eq('category_id', productData.category_id)
          .neq('id', productData.id)
          .limit(4)

        if (relatedData) {
          setRelatedProducts(relatedData)
        }
      }
      setLoading(false)
    }

    fetchProduct()
  }, [params.id])

  const isInCart = (productId: string) => {
    return items.some(item => item.id === productId)
  }

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>

          {/* Product Details Skeleton */}
          <div className="flex flex-col space-y-6">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </div>

            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-24 w-full" />

            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>

            <div className="flex space-x-4">
              <Skeleton className="h-14 flex-1" />
              <Skeleton className="h-14 w-14" />
              <Skeleton className="h-14 w-14" />
            </div>

            <div className="flex justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="mt-16">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="aspect-square w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={product.image_url}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </motion.div>

        <motion.div 
          className="flex flex-col space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <span className="text-sm text-gray-500">{product.categories?.name}</span>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl text-gray-600">{product.brand}</p>
          </div>

          <div className="flex items-baseline space-x-4">
            <p className="text-3xl font-bold">${product.price}</p>
            {product.featured && (
              <Badge className="bg-red-500">Featured</Badge>
            )}
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <Select onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {product.size_available.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <Select onValueChange={setSelectedColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {product.colors.map((color) => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="text-xl font-semibold">{quantity}</span>
              <Button 
                variant="outline" 
                onClick={() => setQuantity(quantity + 1)}
                disabled={product ? quantity >= product.stock : true}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button 
              className="flex-1 text-lg py-6"
              disabled={isInCart(product.id) || !selectedSize || !selectedColor}
              onClick={() => {
                if (selectedSize && selectedColor) {
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity,
                    image_url: product.image_url,
                    size: selectedSize,
                    color: selectedColor
                  })
                }
              }}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
            </Button>
            <Button variant="outline" size="icon" className="h-full aspect-square">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-full aspect-square">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Truck className="mr-2 h-4 w-4" />
              <span>Free shipping over $100</span>
            </div>
            <div className="flex items-center">
              <RotateCcw className="mr-2 h-4 w-4" />
              <span>30-day returns</span>
            </div>
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span>2-year warranty</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <Card key={relatedProduct.id}>
              <CardContent className="p-4">
                <div className="aspect-square relative mb-4">
                  <Image
                    src={relatedProduct.image_url}
                    alt={relatedProduct.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {relatedProduct.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">${relatedProduct.price}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={isInCart(relatedProduct.id)}
                    onClick={() => addItem({
                      id: relatedProduct.id,
                      name: relatedProduct.name,
                      price: relatedProduct.price,
                      quantity: 1,
                      image_url: relatedProduct.image_url
                    })}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isInCart(relatedProduct.id) ? 'In Cart' : 'Add'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="mt-16 bg-primary text-primary-foreground rounded-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Get 10% Off Your First Purchase</h2>
            <p>Sign up for our newsletter and receive an exclusive discount code.</p>
          </div>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-l-md text-gray-900"
            />
            <Button className="rounded-l-none">
              <Zap className="w-4 h-4 mr-2" /> Subscribe
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
