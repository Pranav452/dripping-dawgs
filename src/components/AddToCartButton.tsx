'use client'
import { useCartStore } from '@/store/cart'

interface Product {
  id: string
  name: string
  price: number
  image_url: string
}

interface AddToCartButtonProps {
  product: Product
  className?: string
}

export function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const { items, addItem } = useCartStore()
  const isInCart = items.some(item => item.id === product.id)

  return (
    <button
      className={`w-full rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:bg-gray-500 ${className}`}
      onClick={() => !isInCart && addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url: product.image_url
      })}
      disabled={isInCart}
    >
      {isInCart ? 'In Cart' : 'Add to Cart'}
    </button>
  )
}
