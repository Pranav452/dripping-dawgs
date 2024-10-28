'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ProductLayout } from '@/components/ProductLayouts'
import { useParams } from 'next/navigation'

interface Product {
  id: string
  name: string
  price: number
  description: string
  brand: string
  colors: string[]
  size_available: string[]
  stock: number
  images: { url: string; alt: string }[]
}

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const params = useParams()

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single()

      if (data) {
        setProduct({
          ...data,
          images: [{ url: data.image_url, alt: data.name }]
        })
      }
    }

    fetchProduct()
  }, [params.id])

  if (!product) return <div>Loading...</div>

  return <ProductLayout product={product} variant="full" />
}
