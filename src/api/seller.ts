import api from './client'

// ═══════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════
export interface SellerDashboard {
  seller: {
    id: number
    shop_name: string
    shop_slug: string
    description?: string
    logo_url?: string
    banner_url?: string
    city?: string
    country_code?: string
    is_verified: number
    rating: number
    total_sales: number
    created_at: string
  }
  stats: {
    products: number
    activeProducts: number
    totalStock: number
    orders: number
    pendingOrders: number
    completedOrders: number
    cancelledOrders: number
    revenue: number
    confirmedRevenue: number
  }
  topProducts: Array<{
    id: number
    name: string
    main_image?: string
    price: string
    sales_count: number
    rating: string
  }>
  recentOrders: Array<{
    id: number
    order_number: string
    total_amount: string
    status: string
    created_at: string
    buyer_name: string
  }>
  revenueByDay: Array<{
    day: string
    orders: number
    revenue: string
  }>
}

export async function getSellerDashboard(): Promise<SellerDashboard | null> {
  try {
    const res = await api.get('/seller/dashboard')
    return res.data.data
  } catch {
    return null
  }
}

// ═══════════════════════════════════════════════════════════
// MES PRODUITS
// ═══════════════════════════════════════════════════════════
export interface SellerProduct {
  id: number
  name: string
  slug: string
  price: string
  old_price?: string | null
  stock: number
  main_image?: string
  is_active: number
  rating: string
  sales_count: number
  created_at: string
}

export async function getMyProducts(): Promise<SellerProduct[]> {
  try {
    const res = await api.get('/seller/products')
    return res.data.data || []
  } catch {
    return []
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  try {
    await api.delete(`/seller/products/${id}`)
    return true
  } catch {
    return false
  }
}

// ═══════════════════════════════════════════════════════════
// ✅ CRÉER UN PRODUIT
// ═══════════════════════════════════════════════════════════
export async function createProduct(data: {
  name: string
  price: number
  old_price?: number
  description?: string
  stock: number
  main_image: string
  category_id?: number
}): Promise<{
  success: boolean
  message?: string
  data?: SellerProduct
}> {
  try {
    const res = await api.post('/seller/products', data)
    return {
      success: true,
      message: res.data.message,
      data: res.data.data,
    }
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'Erreur lors de la création',
    }
  }
}

// ═══════════════════════════════════════════════════════════
// ✅ UPLOAD D'IMAGE PRODUIT
// ═══════════════════════════════════════════════════════════
export async function uploadProductImage(file: File): Promise<{
  success: boolean
  message?: string
  url?: string
  fullUrl?: string
}> {
  try {
    const formData = new FormData()
    formData.append('image', file)

    const res = await api.post('/upload/product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    const url = res.data.data?.url

    return {
      success: true,
      message: res.data.message,
      url,
      fullUrl: url
        ? `https://mande-sugu-backend-production.up.railway.app${url}`
        : undefined,
    }
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'Erreur upload',
    }
  }
}

// ═══════════════════════════════════════════════════════════
// MES COMMANDES VENDEUR
// ═══════════════════════════════════════════════════════════
export async function getSellerOrders(): Promise<any[]> {
  try {
    const res = await api.get('/orders?role=seller')
    return res.data.data || []
  } catch {
    return []
  }
}