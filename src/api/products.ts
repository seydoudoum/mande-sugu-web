import api from './client'

export interface Product {
  id: number
  name: string
  price: string
  old_price?: string | null
  stock: number
  main_image?: string
  rating: string
  sales_count: number
  review_count: number
  is_featured?: number
  seller_id: number
  seller_name?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  icon?: string
}

// ═══════════════════════════════════════════════════════════
// PRODUITS
// ═══════════════════════════════════════════════════════════
export async function getProducts(): Promise<Product[]> {
  const res = await api.get('/products')
  return res.data.data || []
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const res = await api.get(`/products/${id}`)
    return res.data.data || null
  } catch {
    return null
  }
}

// ═══════════════════════════════════════════════════════════
// CATÉGORIES
// ═══════════════════════════════════════════════════════════
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await api.get('/categories')
    return res.data.data || []
  } catch {
    return []
  }
}