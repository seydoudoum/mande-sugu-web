import { create } from 'zustand'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  type CartItem,
} from '../api/cart'

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
function computeTotals(items: CartItem[]) {
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce(
    (sum, i) => sum + parseFloat(i.price) * i.quantity,
    0
  )
  return { totalItems, totalPrice }
}

// ═══════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════
interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isLoading: boolean

  loadFromBackend: () => Promise<void>
  addItem: (productId: number, quantity: number) => Promise<boolean>
  removeItem: (itemId: number) => Promise<boolean>
  updateQuantity: (itemId: number, quantity: number) => Promise<boolean>
  clear: () => Promise<boolean>
  recalculate: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,

  // ─────────────────────────────────────────────────────────
  // CHARGER LE PANIER DEPUIS LE BACKEND
  // ─────────────────────────────────────────────────────────
  loadFromBackend: async () => {
    set({ isLoading: true })
    try {
      const items = await getCart()
      const { totalItems, totalPrice } = computeTotals(items)
      set({ items, totalItems, totalPrice, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  // ─────────────────────────────────────────────────────────
  // AJOUTER AU PANIER
  // ─────────────────────────────────────────────────────────
  addItem: async (productId, quantity) => {
    const result = await addToCart({
      product_id: productId,
      quantity,
    })

    if (result.success) {
      await get().loadFromBackend()
      return true
    }
    return false
  },

  // ─────────────────────────────────────────────────────────
  // SUPPRIMER UN ARTICLE
  // ─────────────────────────────────────────────────────────
  removeItem: async (itemId) => {
    const oldItems = get().items
    const newItems = oldItems.filter((i) => i.id !== itemId)
    set({ items: newItems, ...computeTotals(newItems) })

    const result = await removeCartItem(itemId)
    if (!result.success) {
      set({ items: oldItems, ...computeTotals(oldItems) })
      return false
    }
    return true
  },

  // ─────────────────────────────────────────────────────────
  // MODIFIER LA QUANTITÉ
  // ─────────────────────────────────────────────────────────
  updateQuantity: async (itemId, quantity) => {
    if (quantity < 1) return false

    const oldItems = get().items
    const newItems = oldItems.map((i) =>
      i.id === itemId ? { ...i, quantity } : i
    )
    set({ items: newItems, ...computeTotals(newItems) })

    const result = await updateCartItem(itemId, quantity)
    if (!result.success) {
      set({ items: oldItems, ...computeTotals(oldItems) })
      return false
    }
    return true
  },

  // ─────────────────────────────────────────────────────────
  // VIDER LE PANIER
  // ─────────────────────────────────────────────────────────
  clear: async () => {
    set({ items: [], totalItems: 0, totalPrice: 0 })
    const result = await clearCart()
    return result.success
  },

  // ─────────────────────────────────────────────────────────
  // RECALCULER
  // ─────────────────────────────────────────────────────────
  recalculate: () => {
    set(computeTotals(get().items))
  },
}))