'use client'
import { supabase } from '@/lib/supabase'
import { AddToCartButton } from '@/components/AddToCartButton'
import { useEffect, useState } from 'react'

export default function ProductPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('id', id)
        .single()
      
      if (data) setProduct(data)
    }
    fetchProduct()
  }, [id])

  if (!product) return <div>Loading...</div>

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>
        <div>
          <span className="text-sm text-gray-500">
            {product.categories?.name}
          </span>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-xl">${product.price}</p>
          <p className="mt-4 text-gray-600">{product.description}</p>
          
          <div className="mt-6">
            <h3 className="font-semibold">Select Size</h3>
            <div className="mt-2 flex gap-2">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  className="rounded border px-4 py-2 hover:bg-gray-100"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <AddToCartButton product={product} className="mt-8" />
          
          <div className="mt-8 space-y-4">
            <details className="rounded border p-4">
              <summary className="font-semibold">Shipping Information</summary>
              <p className="mt-2 text-gray-600">
                Free shipping on orders over $100. Delivery within 3-5 business days.
              </p>
            </details>
            
            <details className="rounded border p-4">
              <summary className="font-semibold">Return Policy</summary>
              <p className="mt-2 text-gray-600">
                30-day return policy. Items must be unworn with original tags.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
