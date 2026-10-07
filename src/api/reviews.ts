import api from './client'

export interface Review {
  id: number
  rating: number
  comment?: string
  user_name: string
  user_id: number
  avatar_url?: string
  is_verified_purchase: number
  created_at: string
}

export interface ReviewStats {
  total: number
  average: number
  stars5: number
  stars4: number
  stars3: number
  stars2: number
  stars1: number
}

export async function getProductReviews(productId: number): Promise<{
  reviews: Review[]
  stats: ReviewStats | null
}> {
  try {
    const res = await api.get(`/reviews/product/${productId}`)
    return {
      reviews: res.data.data || [],
      stats: res.data.stats || null,
    }
  } catch {
    return { reviews: [], stats: null }
  }
}

export async function createReview(data: {
  product_id: number
  rating: number
  comment?: string
}): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await api.post('/reviews', data)
    return { success: true, message: res.data.message }
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'Erreur',
    }
  }
}