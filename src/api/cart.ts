import api from './client'

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════
export interface CartItem {
  id: number
  product_id: number
  quantity: number
  name: string
  price: string
  main_image?: string
  seller_id?: number
  seller_name?: string
}

// ═══════════════════════════════════════════════════════════
// GET /api/cart
// ═══════════════════════════════════════════════════════════
export async function getCart(): Promise<CartItem[]> {
  try {
    const res = await api.get('/cart')
    return res.data.data || []
  } catch {
    return []
  }
}

// ═══════════════════════════════════════════════════════════
// POST /api/cart
// ═══════════════════════════════════════════════════════════
export async function addToCart(data: {
  product_id: number
  quantity: number
}): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await api.post('/cart', data)
    return { success: true, message: res.data.message }
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'Erreur',
    }
  }
}

// ═══════════════════════════════════════════════════════════
// PUT /api/cart/:id
// ═══════════════════════════════════════════════════════════
export async function updateCartItem(
  itemId: number,
  quantity: number
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await api.put(`/cart/${itemId}`, { quantity })
    return { success: true, message: res.data.message }
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'Erreur',
    }
  }
}

// ═══════════════════════════════════════════════════════════
// DELETE /api/cart/:id
// ═══════════════════════════════════════════════════════════
export async function removeCartItem(
  itemId: number
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await api.delete(`/cart/${itemId}`)
    return { success: true, message: res.data.message }
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'Erreur',
    }
  }
}

// ═══════════════════════════════════════════════════════════
// DELETE /api/cart (tout vider)
// ═══════════════════════════════════════════════════════════
export async function clearCart(): Promise<{ success: boolean }> {
  try {
    await api.delete('/cart')
    return { success: true }
  } catch {
    return { success: false }
  }
}