'use client'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ProductSearch } from './ProductSearch'
import Image from 'next/image'

interface Category {
  id: string
  name: string
}

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
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem, items } = useCartStore()

  const fetchProducts = async (search = '', category = '', sort = 'newest') => {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          name
        )
      `)

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    if (category) {
      query = query.eq('category_id', category)
    }

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
  }

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
  }, [])

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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="group relative rounded-lg border p-4 transition-all hover:shadow-lg">
            <Link href={`/products/${product.id}`} className="block aspect-square overflow-hidden">
              <Image
                src={product.image_url}
                alt={product.name}
                width={400}
                height={400}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </Link>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                {product.categories?.name}
              </span>
              <Link href={`/products/${product.id}`}>
                <h3 className="text-lg font-semibold hover:underline">{product.name}</h3>
              </Link>
              <p className="mt-1 text-gray-600">${product.price}</p>
              <button 
                className={`mt-4 w-full rounded px-4 py-2 text-white transition-colors ${
                  isInCart(product.id) 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-black hover:bg-gray-800'
                }`}
                onClick={() => !isInCart(product.id) && addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  image_url: product.image_url
                })}
                disabled={isInCart(product.id)}
              >
                {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
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
