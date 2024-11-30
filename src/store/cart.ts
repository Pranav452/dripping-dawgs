import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string
  size?: string
  color?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string, size?: string) => void
  updateQuantity: (id: string, quantity: number, size?: string) => void
  clearCart: () => void
  formatPrice: (price: number) => string
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const currentItems = get().items
        const existingItem = currentItems.find(
          (i) => i.id === item.id && i.size === item.size
        )

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id && i.size === item.size
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ items: [...currentItems, item] })
        }
      },

      removeItem: (id, size) => {
        set({
          items: get().items.filter(
            (i) => !(i.id === id && i.size === size)
          )
        })
      },

      updateQuantity: (id, quantity, size) => {
        set({
          items: get().items.map((item) =>
            item.id === id && item.size === size ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      formatPrice: (price) => {
        // Convert dollar price to rupees (approximate conversion rate: 1 USD = 83 INR)
        const priceInRupees = price * 83
        return `₹${priceInRupees.toLocaleString('en-IN')}`
      }
    }),
    {
      name: 'cart-storage',
    }
  )
)
