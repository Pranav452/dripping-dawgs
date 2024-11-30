import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface WishlistStore {
  items: string[]
  isLoading: boolean
  initialize: (userId: string) => Promise<void>
  addItem: (productId: string) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  toggleItem: (productId: string) => Promise<void>
  hasItem: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      initialize: async (userId: string) => {
        try {
          set({ isLoading: true })
          const { data, error } = await supabase
            .from('wishlist')
            .select('product_id')
            .eq('user_id', userId)

          if (error) throw error

          set({ items: data.map(item => item.product_id) })
        } catch (error) {
          console.error('Error initializing wishlist:', error)
          toast.error('Failed to load wishlist')
        } finally {
          set({ isLoading: false })
        }
      },

      addItem: async (productId: string) => {
        try {
          const { error } = await supabase
            .from('wishlist')
            .insert([{ product_id: productId, user_id: (await supabase.auth.getUser()).data.user?.id }])

          if (error) throw error

          set(state => ({ items: [...state.items, productId] }))
          toast.success('Added to wishlist')
        } catch (error) {
          console.error('Error adding to wishlist:', error)
          toast.error('Failed to add to wishlist')
        }
      },

      removeItem: async (productId: string) => {
        try {
          const { error } = await supabase
            .from('wishlist')
            .delete()
            .eq('product_id', productId)
            .eq('user_id', (await supabase.auth.getUser()).data.user?.id)

          if (error) throw error

          set(state => ({ items: state.items.filter(id => id !== productId) }))
          toast.success('Removed from wishlist')
        } catch (error) {
          console.error('Error removing from wishlist:', error)
          toast.error('Failed to remove from wishlist')
        }
      },

      toggleItem: async (productId: string) => {
        const hasItem = get().hasItem(productId)
        if (hasItem) {
          await get().removeItem(productId)
        } else {
          await get().addItem(productId)
        }
      },

      hasItem: (productId: string) => {
        return get().items.includes(productId)
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
) 