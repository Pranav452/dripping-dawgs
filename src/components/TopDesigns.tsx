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

  const featuredProducts = products.filter(p => p.featured).slice(0, 4)

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
    <section className="bg-gray-100 pb-12 px-4 sm:px-6 lg:px-8"><br /><br />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">TOP DESIGNS</h2>
          <p className="text-gray-600">Discover our most popular t-shirt designs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-white">
                  <Image
                    src={getImageUrl(product, selectedColors[product.id])}
                    alt={product.name}
                    fill
                    className="object-contain transform group-hover:scale-105 transition-all duration-300"
                    priority
                  />
                </div>
              </Link>
              <CardContent className="p-4">
                <Link href={`/products/${product.id}`}>
                  <CardTitle className="text-lg font-semibold mb-2">{product.name}</CardTitle>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-lg font-bold">{formatPrice(product.price)}</p>
                </Link>

                {/* Color Selection */}
                <div className="mt-3">
                  <label className="text-sm text-gray-600 mb-1 block">Color:</label>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: color }))}
                        className={`h-6 w-6 rounded-full border ${
                          selectedColors[product.id] === color ? 'ring-2 ring-black ring-offset-2' : ''
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

                {/* Size Selection */}
                <div className="mt-3">
                  <label className="text-sm text-gray-600 mb-1 block">Size:</label>
                  <div className="flex gap-2 flex-wrap">
                    {product.size_available.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                        className={`px-2 py-1 text-sm border rounded ${
                          selectedSizes[product.id] === size 
                            ? 'border-black bg-black text-white' 
                            : 'border-gray-200 hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button
                  className={`flex-1 ${
                    isInCart(product.id, selectedSizes[product.id], selectedColors[product.id])
                      ? 'bg-secondary text-secondary-foreground cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                  onClick={() => handleAddToCart(product)}
                  disabled={isInCart(product.id, selectedSizes[product.id], selectedColors[product.id])}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isInCart(product.id, selectedSizes[product.id], selectedColors[product.id]) 
                    ? 'In Cart' 
                    : 'Add to Cart'
                  }
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleWishlistToggle(product.id)}
                  className="hover:bg-gray-100"
                >
                  <Heart className="w-4 h-4" fill={hasItem(product.id) ? "currentColor" : "none"} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button className="bg-black hover:bg-gray-800 text-white px-8">
              View All Designs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 