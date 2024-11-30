import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string
  size: string
  color: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string, size: string, color: string) => void
  updateQuantity: (id: string, quantity: number, size: string, color: string) => void
  clearCart: () => void
  formatPrice: (price: number) => string
  getItemQuantity: (id: string, size: string, color: string) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const currentItems = get().items
        const existingItem = currentItems.find(
          (i) => i.id === item.id && i.size === item.size && i.color === item.color
        )

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id && i.size === item.size && i.color === item.color
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ items: [...currentItems, item] })
        }
      },

      removeItem: (id, size, color) => {
        set({
          items: get().items.filter(
            (i) => !(i.id === id && i.size === size && i.color === color)
          )
        })
      },

      updateQuantity: (id, quantity, size, color) => {
        set({
          items: get().items.map((item) =>
            item.id === id && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      formatPrice: (price) => {
        return `₹${price.toLocaleString('en-IN')}`
      },

      getItemQuantity: (id, size, color) => {
        const item = get().items.find(
          (i) => i.id === id && i.size === size && i.color === color
        )
        return item?.quantity || 0
      }
    }),
    {
      name: 'cart-storage',
    }
  )
)
