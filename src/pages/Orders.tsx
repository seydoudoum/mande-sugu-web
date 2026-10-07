import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getMyOrders,
  cancelOrder,
  getStatusLabel,
  getStatusColor,
  type Order,
} from '../api/orders'
import { useAuthStore } from '../stores/authStore'
import { formatPrice, formatDate } from '../lib/format'

export default function Orders() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadOrders()
  }, [isAuthenticated])

  async function loadOrders() {
    setIsLoading(true)
    const data = await getMyOrders()
    setOrders(data)
    setIsLoading(false)
  }

  async function handleCancel(id: number) {
    if (!confirm('Annuler cette commande ?')) return
    const result = await cancelOrder(id)
    if (result.success) {
      loadOrders()
    } else {
      alert(result.message || 'Erreur')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Aucune commande</h1>
        <p className="text-gray-500 mb-8">Vous n'avez pas encore passé de commande</p>
        <Link
          to="/catalog"
          className="bg-[#FF6A00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E55A00] transition inline-block"
        >
          Découvrir des produits
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Titre */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-[#FF6A00] rounded"></div>
        <h1 className="text-2xl font-bold">Mes commandes</h1>
        <span className="text-sm text-gray-500">({orders.length})</span>
      </div>

      {/* Liste */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border hover:shadow-md transition"
          >
            {/* Header commande */}
            <div className="p-4 border-b flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-sm">
                  #{order.order_number}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(order.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>
                <span className="text-lg font-bold text-[#FF6A00]">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>

            {/* Infos */}
            <div className="p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1">
                {order.seller_name && (
                  <p className="text-sm text-gray-600">
                    Vendeur : <strong>{order.seller_name}</strong>
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {order.items_count} article(s)
                  {order.shipping_address && ` · ${order.shipping_address}`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {(order.status === 'pending' || order.status === 'paid') && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="text-sm border border-red-300 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                  >
                    Annuler
                  </button>
                )}
                <Link
                  to={`/orders/${order.id}`}
                  className="text-sm bg-[#FF6A00] text-white px-4 py-1.5 rounded-lg hover:bg-[#E55A00] transition"
                >
                  Voir le détail
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}