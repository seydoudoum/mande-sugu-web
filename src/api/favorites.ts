import api from './client'

export interface Favorite {
  favorite_id: number
  favorited_at: string
  id: number
  name: string
  price: string
  old_price?: string | null
  main_image?: string
  rating: string
  sales_count: number
  review_count: number
  seller_id: number
  seller_name?: string
}

export async function getFavorites(): Promise<Favorite[]> {
  try {
    const res = await api.get('/favorites')
    return res.data.data || []
  } catch {
    return []
  }
}

export async function removeFavorite(productId: number): Promise<boolean> {
  try {
    await api.delete(`/favorites/${productId}`)
    return true
  } catch {
    return false
  }
}

export async function toggleFavorite(productId: number): Promise<{
  success: boolean
  is_favorite?: boolean
}> {
  try {
    const res = await api.post('/favorites/toggle', { product_id: productId })
    return {
      success: true,
      is_favorite: res.data.data?.is_favorite,
    }
  } catch {
    return { success: false }
  }
}