'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useAuth } from '@/lib/auth'
import { products } from '@/data/products'

// Helper function to format price in Rupees
function formatPrice(price: number): string {
  const priceInRupees = price * 83
  return `₹${priceInRupees.toLocaleString('en-IN')}`
}

export function TopDesigns() {
  const { addItem, items } = useCartStore()
  const { toggleItem, hasItem } = useWishlistStore()
  const { user } = useAuth()
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(
    products.reduce((acc, product) => ({ ...acc, [product.id]: product.colors[0] }), {})
  )
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    products.reduce((acc, product) => ({ ...acc, [product.id]: product.size_available[0] }), {})
  )

  const featuredProducts = products.filter(p => p.featured).slice(0, 3)

  const isInCart = (productId: string, size: string, color: string) => {
    return items.some(item => 
      item.id === productId && 
      item.size === size && 
      item.color === color
    )
  }

  const getImageUrl = (product: typeof products[0], color: string) => {
    const colorImage = product.images.find(img => img.color === color)
    return colorImage ? colorImage.url : product.image_url
  }

  const handleAddToCart = (product: typeof products[0]) => {
    if (!user) {
      toast.error('Please login to add items to cart')
      return
    }

    const size = selectedSizes[product.id]
    const color = selectedColors[product.id]

    if (!isInCart(product.id, size, color)) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url: getImageUrl(product, color),
        size,
        color
      })
      toast.success('Added to cart')
    }
  }

  const handleWishlistToggle = async (productId: string) => {
    if (!user) {
      toast.error('Please login to add items to wishlist')
      return
    }
    await toggleItem(productId)
  }

  return (
    <section className="bg-black pb-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Bottom Glowing Line */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <div className="relative h-24">
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse" />
          <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent blur-sm" />
          <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent blur-md" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto"><br /><br /><br />
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">TOP DESIGNS</h2>
          <p className="text-gray-400">Discover our most popular t-shirt designs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden group bg-black border border-gray-800 hover:border-yellow-500/50 transition-all duration-300">
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 group-hover:from-gray-800 group-hover:to-gray-900 transition-all duration-500">
                  <Image
                    src={getImageUrl(product, selectedColors[product.id])}
                    alt={product.name}
                    fill
                    className="object-contain transform group-hover:scale-105 transition-all duration-500"
                    priority
                  />
                </div>
              </Link>
              <CardContent className="p-5">
                <Link href={`/products/${product.id}`} className="text-white hover:text-yellow-500 transition-colors">
                  <CardTitle className="text-lg font-semibold mb-2 text-white group-hover:text-yellow-500 transition-colors">{product.name}</CardTitle>
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2 group-hover:text-gray-300 transition-colors">{product.description}</p>
                  <p className="text-lg font-bold text-yellow-500">{formatPrice(product.price)}</p>
                </Link>

                {/* Color Selection */}
                <div className="mt-4">
                  <label className="text-sm text-gray-400 mb-2 block">Color</label>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: color }))}
                        className={`h-7 w-7 rounded-full transform hover:scale-110 transition-all duration-300 ring-1 ring-white ${
                          selectedColors[product.id] === color 
                            ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-black' 
                            : 'hover:ring-2 hover:ring-yellow-500/50 hover:ring-offset-2 hover:ring-offset-black'
                        }`}
                        style={{
                          backgroundColor: color.toLowerCase(),
                          border: '2px solid white'
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mt-4">
                  <label className="text-sm text-gray-400 mb-2 block">Size</label>
                  <div className="flex gap-2 flex-wrap">
                    {product.size_available.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                        className={`px-3 py-1.5 text-sm border rounded-md transform hover:scale-105 transition-all duration-300 ${
                          selectedSizes[product.id] === size 
                            ? 'border-yellow-500 bg-yellow-500 text-black font-medium' 
                            : 'border-gray-800 text-gray-400 hover:border-yellow-500/50 hover:text-yellow-500'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-5 pb-5 pt-0 flex gap-3">
                <Button
                  className={`flex-1 text-base font-medium ${
                    isInCart(product.id, selectedSizes[product.id], selectedColors[product.id])
                      ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                      : 'bg-yellow-500 hover:bg-yellow-400 text-black transform hover:scale-[1.02] transition-all duration-300'
                  }`}
                  onClick={() => handleAddToCart(product)}
                  disabled={isInCart(product.id, selectedSizes[product.id], selectedColors[product.id])}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isInCart(product.id, selectedSizes[product.id], selectedColors[product.id]) 
                    ? 'In Cart' 
                    : 'Add to Cart'
                  }
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleWishlistToggle(product.id)}
                  className={`border-2 w-11 h-11 transform hover:scale-110 transition-all duration-300 ${
                    hasItem(product.id)
                      ? 'border-red-500 bg-red-500/10 hover:bg-red-500/20'
                      : 'border-gray-800 hover:border-red-500/50'
                  }`}
                >
                  <Heart 
                    className={`w-5 h-5 ${hasItem(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    fill={hasItem(product.id) ? "currentColor" : "none"}
                  />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-6 text-lg font-medium transform hover:scale-[1.02] transition-all duration-300">
              View All Designs
            </Button>
          </Link><br /><br />
        </div>
      </div>
    </section>
  )
} 