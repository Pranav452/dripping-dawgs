'use client'
import { Product } from '@/data/products'
import { useCartStore } from '@/store/cart'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  product: Product
  className?: string
  selectedSize?: string
  selectedColor?: string
}

export function AddToCartButton({ product, className = '', selectedSize, selectedColor }: AddToCartButtonProps) {
  const { items, addItem } = useCartStore()
  const router = useRouter()
  
  const isInCart = items.some(item => 
    item.id === product.id && 
    item.size === (selectedSize || product.size_available[0]) && 
    item.color === (selectedColor || product.colors[0])
  )

  const handleClick = async () => {
    if (isInCart) {
      router.push('/cart')
    } else {
      const size = selectedSize || product.size_available[0]
      const color = selectedColor || product.colors[0]
      const imageUrl = product.images.find(img => img.color === color)?.url || product.image_url

      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url: imageUrl,
        size,
        color
      })
      
      toast.success('Added to cart!')
    }
  }

  return (
    <button
      className={`w-full rounded bg-black px-4 py-2 text-white hover:bg-gray-800 ${className}`}
      onClick={handleClick}
    >
      {isInCart ? 'View Cart' : 'Add to Cart'}
    </button>
  )
}
