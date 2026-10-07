import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSellerOrders } from '../../api/seller'
import { getStatusLabel, getStatusColor } from '../../api/orders'
import { useAuthStore } from '../../stores/authStore'
import { formatPrice, formatDate } from '../../lib/format'

export default function SellerOrders() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState<any[]>([])
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
    const data = await getSellerOrders()
    setOrders(data)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/seller"
          className="text-gray-600 hover:text-[#FF6A00] transition"
        >
          ←
        </Link>
        <div className="w-1 h-6 bg-[#FF6A00] rounded"></div>
        <h1 className="text-2xl font-bold">Commandes reçues</h1>
        <span className="text-sm text-gray-500">({orders.length})</span>
      </div>

      {/* Vide */}
      {orders.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-bold mb-2">Aucune commande</h2>
          <p className="text-gray-500">
            Vous n'avez pas encore reçu de commande
          </p>
        </div>
      )}

      {/* Liste */}
      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border hover:shadow-md transition"
            >
              <div className="p-4 border-b flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-sm">#{order.order_number}</p>
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

              <div className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-600">
                      Client : <strong>{order.buyer_name}</strong>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.items_count} article(s)
                      {order.shipping_address &&
                        ` · ${order.shipping_address}`}
                    </p>
                  </div>
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
      )}
    </div>
  )
}