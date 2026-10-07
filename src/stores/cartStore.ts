import { create } from 'zustand'

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════
export interface CartItem {
  id: number
  product_id: number
  name: string
  price: number
  quantity: number
  main_image?: string
  seller_name?: string
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number

  // Actions
  setItems: (items: CartItem[]) => void
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clear: () => void
  recalculate: () => void
}

// ═══════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  setItems: (items) => {
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    set({ items, totalItems, totalPrice })
  },

  addItem: (item) => {
    const items = [...get().items]
    const existing = items.find((i) => i.product_id === item.product_id)
    if (existing) {
      existing.quantity += item.quantity
    } else {
      items.push(item)
    }
    get().setItems(items)
  },

  removeItem: (id) => {
    const items = get().items.filter((i) => i.id !== id)
    get().setItems(items)
  },

  updateQuantity: (id, quantity) => {
    const items = get().items.map((i) =>
      i.id === id ? { ...i, quantity } : i
    )
    get().setItems(items)
  },

  clear: () => {
    set({ items: [], totalItems: 0, totalPrice: 0 })
  },

  recalculate: () => {
    get().setItems(get().items)
  },
}))