'use client'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { ProductSearch } from './ProductSearch'
import Image from 'next/image'

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

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)

  const fetchProducts = useCallback(async (search = '', category = '', sort = 'newest') => {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          name
        )
      `)

    // Apply search filter
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    // Apply category filter
    if (category) {
      query = query.eq('category_id', category)
    }

    // Apply sorting
    switch (sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'name_asc':
        query = query.order('name', { ascending: true })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    const { data } = await query
    if (data) setProducts(data)
  }, [])

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      if (data) setCategories(data)
    }

    fetchCategories()
    fetchProducts()
    setLoading(false)
  }, [fetchProducts])

  const isInCart = (productId: string) => {
    return items.some(item => item.id === productId)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <ProductSearch
        categories={categories}
        onSearch={fetchProducts}
      />

      {/* Featured Products */}
      {products.some(p => p.featured) && (
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Featured Collection</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products
              .filter(p => p.featured)
              .map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      )}

      {/* All Products */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
        {products
          .filter(p => !p.featured)
          .map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>

      {products.length === 0 && (
        <div className="text-center">
          <p className="text-gray-600">No products found</p>
        </div>
      )}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)
  const isInCart = items.some(item => item.id === product.id)

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <div className="mb-1 text-sm text-gray-500">{product.brand}</div>
          <h3 className="font-medium group-hover:underline">{product.name}</h3>
          <div className="mt-1 text-lg font-semibold">${product.price}</div>
        </Link>

        <div className="mt-2 flex flex-wrap gap-1">
          {product.colors.map((color) => (
            <div
              key={color}
              className="h-4 w-4 rounded-full border"
              style={{ backgroundColor: color.toLowerCase() }}
              title={color}
            />
          ))}
        </div>

        <div className="mt-2 text-sm text-gray-500">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </div>

        <button
          className={`mt-3 w-full rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
            isInCart || product.stock === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-800'
          }`}
          onClick={() => !isInCart && product.stock > 0 && addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image_url: product.image_url
          })}
          disabled={isInCart || product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : isInCart ? 'In Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

function FeaturedProductCard({ product }: { product: Product }) {
  // Similar to ProductCard but with larger layout
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-[4/5] overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            width={600}
            height={750}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Featured badge */}
      <div className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-sm text-white">
        Featured
      </div>

      {/* Rest of the card content similar to ProductCard */}
    </div>
  )
}
