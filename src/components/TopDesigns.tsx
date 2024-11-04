'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import { useCartStore } from '@/store/cart'
import { Skeleton } from "@/components/ui/skeleton"

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  description: string
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

export function TopDesigns() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const { addItem, items } = useCartStore()

  useEffect(() => {
    async function fetchFeaturedProducts() {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              name
            )
          `)
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(8)

        if (error) throw error

        if (data) {
          setProducts(data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Failed to load products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const handleAddToCart = async (product: Product) => {
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url: product.image_url
      })
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error('Failed to add item to cart')
    }
  }

  const isInCart = (productId: string) => {
    return items.some(item => item.id === productId)
  }

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev)
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId)
        toast.success('Removed from wishlist')
      } else {
        newWishlist.add(productId)
        toast.success('Added to wishlist')
      }
      return newWishlist
    })
  }

  if (isLoading) {
    return (
      <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="aspect-[3/4] w-full" />
                </CardHeader>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-20" />
                </CardContent>
                <CardFooter className="p-4">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Featured Designs This Week</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked collection of premium designs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <Link href={`/products/${product.id}`}>
                <CardHeader className="p-0">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {product.categories?.name}
                  </span>
                  <CardTitle className="text-lg font-semibold mb-2">{product.name}</CardTitle>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                </CardContent>
              </Link>
              <CardFooter className="p-4 flex justify-between items-center">
                <Button 
                  className="flex-1 mr-2"
                  onClick={() => handleAddToCart(product)}
                  disabled={isInCart(product.id)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => toggleWishlist(product.id)}
                  className={wishlist.has(product.id) ? "text-red-500" : ""}
                >
                  <Heart className="h-4 w-4" fill={wishlist.has(product.id) ? "currentColor" : "none"} />
                  <span className="sr-only">Add to wishlist</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center h-10 px-8 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
          >
            View All Designs
          </Link>
        </div>
      </div>
    </section>
  )
} 