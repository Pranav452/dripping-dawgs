'use client'
import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import { useState } from 'react'
import { ProductSearch } from './ProductSearch'
import Image from 'next/image'
import { products } from '@/data/products'
import { Button } from './ui/button'

interface Category {
  id: string
  name: string
}

// Helper function to format price in Rupees
function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`
}

export function ProductGrid() {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(
    products.reduce((acc, product) => ({ ...acc, [product.id]: product.colors[0] }), {})
  )
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    products.reduce((acc, product) => ({ ...acc, [product.id]: product.size_available[0] }), {})
  )
  const [categories] = useState<Category[]>([
    { id: 't-shirts', name: 'T-Shirts' }
  ])
  const { items, addItem } = useCartStore()

  const isInCart = (productId: string, size: string, color: string) => {
    return items.some(item => 
      item.id === productId && 
      item.size === size && 
      item.color === color
    )
  }

  const handleSearch = async (query: string, category: string) => {
    let filtered = [...products]
    
    if (query) {
      const searchLower = query.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      )
    }
    
    if (category && category !== 'all') {
      filtered = filtered.filter(product => product.category_id === category)
    }
    
    setFilteredProducts(filtered)
  }

  const getImageUrl = (product: typeof products[0], color: string) => {
    const colorImage = product.images.find(img => img.color === color)
    return colorImage ? colorImage.url : product.image_url
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <ProductSearch
        categories={categories}
        onSearch={handleSearch}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group relative overflow-hidden rounded-lg border bg-black text-card-foreground shadow-sm transition-all hover:shadow-lg">
            <Link href={`/products/${product.id}`} className="block aspect-square overflow-hidden bg-black">
              <Image
                src={getImageUrl(product, selectedColors[product.id])}
                alt={product.name}
                width={400}
                height={400}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </Link>
            <div className="p-4">
              <span className="text-sm text-muted-foreground">
                T-Shirts
              </span>
              <Link href={`/products/${product.id}`}>
                <h3 className="mt-1 font-semibold text-white hover:text-yellow-500 transition-colors">{product.name}</h3>
              </Link>
              <p className="mt-1 text-yellow-500 font-medium">{formatPrice(product.price)}</p>
              
              {/* Color Selection */}
              <div className="mt-3">
                <label className="text-sm text-gray-300 mb-1 block">Color:</label>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: color }))}
                      className={`h-8 w-8 rounded-full transform hover:scale-110 transition-all duration-300 ${
                        selectedColors[product.id] === color 
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
              <div className="mt-3">
                <label className="text-sm text-gray-300 mb-1 block">Size:</label>
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

              <Button 
                className={`mt-4 w-full py-6 text-base font-medium ${
                  isInCart(product.id, selectedSizes[product.id], selectedColors[product.id])
                    ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                    : 'bg-yellow-500 hover:bg-yellow-400 text-black transform hover:scale-[1.02] transition-all duration-300'
                }`}
                onClick={() => {
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
                  }
                }}
                disabled={isInCart(product.id, selectedSizes[product.id], selectedColors[product.id])}
              >
                {isInCart(product.id, selectedSizes[product.id], selectedColors[product.id]) 
                  ? 'In Cart' 
                  : 'Add to Cart'
                }
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
