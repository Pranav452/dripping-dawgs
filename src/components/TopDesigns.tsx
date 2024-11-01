'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  description: string
}

export function TopDesigns() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  useEffect(() => {
    async function fetchFeaturedProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(4)

      if (data) setFeaturedProducts(data)
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Top Designs</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Discover our most popular and trending designs that define style and comfort
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {featuredProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="group cursor-pointer">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-2 md:mb-4">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm md:text-base">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8 md:mt-12">
        <Link 
          href="/products" 
          className="inline-block bg-black text-white px-6 md:px-8 py-2 md:py-3 rounded-md hover:bg-gray-800 transition-colors text-sm md:text-base"
        >
          View All Designs
        </Link>
      </div>
    </section>
  )
} 