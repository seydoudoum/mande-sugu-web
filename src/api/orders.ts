import api from './client'

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════
export interface Order {
  id: number
  order_number: string
  total_amount: string
  shipping_fee: string
  status: string
  payment_method: string
  payment_status: string
  shipping_address: string
  created_at: string
  seller_name?: string
  buyer_name?: string
  items_count: number
}

// ═══════════════════════════════════════════════════════════
// LIRE MES COMMANDES
// ═══════════════════════════════════════════════════════════
export async function getMyOrders(): Promise<Order[]> {
  try {
    const res = await api.get('/orders')
    return res.data.data || []
  } catch {
    return []
  }
}

// ═══════════════════════════════════════════════════════════
// LIRE UNE COMMANDE
// ═══════════════════════════════════════════════════════════
export async function getOrderById(id: number): Promise<any> {
  try {
    const res = await api.get(`/orders/${id}`)
    return res.data.data
  } catch {
    return null
  }
}

// ═══════════════════════════════════════════════════════════
// ✅ CRÉER UNE COMMANDE
// ═══════════════════════════════════════════════════════════
export async function createOrder(data: {
  shipping_address: string
  payment_method: string
  shipping_fee?: number
  notes?: string
}): Promise<{
  success: boolean
  message?: string
  data?: any
}> {
  try {
    const res = await api.post('/orders', data)
    return {
      success: true,
      message: res.data.message,
      data: res.data.data,
    }
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'Erreur lors de la commande',
    }
  }
}

// ═══════════════════════════════════════════════════════════
// ANNULER UNE COMMANDE
// ═══════════════════════════════════════════════════════════
export async function cancelOrder(id: number): Promise<{
  success: boolean
  message?: string
}> {
  try {
    const res = await api.put(`/orders/${id}/cancel`)
    return { success: true, message: res.data.message }
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'Erreur',
    }
  }
}

// ═══════════════════════════════════════════════════════════
// LABELS DE STATUT
// ═══════════════════════════════════════════════════════════
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'En attente',
    paid: 'Payée',
    processing: 'En préparation',
    shipped: 'Expédiée',
    in_transit: 'En transit',
    delivered: 'Livrée',
    completed: 'Terminée',
    cancelled: 'Annulée',
    refunded: 'Remboursée',
  }
  return labels[status] || status
}

// ═══════════════════════════════════════════════════════════
// COULEURS DE STATUT
// ═══════════════════════════════════════════════════════════
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-blue-100 text-blue-700',
    in_transit: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-red-100 text-red-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}