import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSellerDashboard, type SellerDashboard as DashboardData } from '../../api/seller'
import { useAuthStore } from '../../stores/authStore'
import { formatPrice, imageUrl } from '../../lib/format'
import { getStatusLabel, getStatusColor } from '../../api/orders'

export default function SellerDashboard() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (user?.role !== 'seller' && user?.role !== 'admin') {
      alert('Accès réservé aux vendeurs')
      navigate('/')
      return
    }
    loadDashboard()
  }, [isAuthenticated])

  async function loadDashboard() {
    setIsLoading(true)
    const d = await getSellerDashboard()
    setData(d)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Boutique introuvable</p>
        <Link to="/" className="text-[#FF6A00] hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  const { seller, stats, topProducts, recentOrders } = data

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* ═══════════ EN-TÊTE BOUTIQUE ═══════════ */}
      <div className="bg-gradient-to-r from-[#FF6A00] to-[#E55A00] rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-3xl">🏪</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{seller.shop_name}</h1>
              {seller.is_verified === 1 && (
                <span className="text-lg">✓</span>
              )}
            </div>
            <p className="text-sm opacity-90">@{seller.shop_slug}</p>
            <p className="text-xs opacity-80 mt-1">
              ⭐ {seller.rating} · {stats.orders} commandes
            </p>
          </div>
          <button
            onClick={loadDashboard}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition"
            title="Rafraîchir"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* ═══════════ STATS ═══════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon="📦"
          label="Produits"
          value={String(stats.products)}
          subtitle={`${stats.activeProducts} actifs`}
          color="bg-orange-50 text-[#FF6A00]"
        />
        <StatCard
          icon="🛒"
          label="Commandes"
          value={String(stats.orders)}
          subtitle={`${stats.pendingOrders} en attente`}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon="💰"
          label="Revenus"
          value={formatPrice(stats.revenue)}
          subtitle="Total"
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon="✅"
          label="Confirmés"
          value={formatPrice(stats.confirmedRevenue)}
          subtitle={`${stats.completedOrders} livrées`}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* ═══════════ ACTIONS RAPIDES ═══════════ */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link
            to="/seller/products"
            className="bg-white rounded-xl p-4 border hover:shadow-md transition flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-2xl">
              📦
            </div>
            <div>
              <p className="font-semibold">Mes produits</p>
              <p className="text-xs text-gray-500">Gérer mon catalogue</p>
            </div>
          </Link>

          <Link
            to="/seller/orders"
            className="bg-white rounded-xl p-4 border hover:shadow-md transition flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl">
              📋
            </div>
            <div>
              <p className="font-semibold">Commandes reçues</p>
              <p className="text-xs text-gray-500">Voir les commandes</p>
            </div>
          </Link>

          <Link
            to="/seller/products/new"
            className="bg-white rounded-xl p-4 border hover:shadow-md transition flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-2xl">
              ➕
            </div>
            <div>
              <p className="font-semibold">Ajouter un produit</p>
              <p className="text-xs text-gray-500">Publier un nouveau</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ═══════════ TOP PRODUITS ═══════════ */}
      {topProducts.length > 0 && (
        <div className="bg-white rounded-xl p-6 border mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">🏆</span>
            <h2 className="text-lg font-bold">Top 5 produits</h2>
          </div>

          <div className="space-y-3">
            {topProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded transition"
              >
                <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden shrink-0">
                  {p.main_image ? (
                    <img
                      src={imageUrl(p.main_image)}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      📦
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    {p.sales_count} ventes
                  </p>
                </div>
                <span className="text-sm font-bold text-[#FF6A00]">
                  {formatPrice(p.price)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ COMMANDES RÉCENTES ═══════════ */}
      {recentOrders.length > 0 && (
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">📋</span>
            <h2 className="text-lg font-bold">Commandes récentes</h2>
          </div>

          <div className="space-y-3">
            {recentOrders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between gap-3 p-2 hover:bg-gray-50 rounded transition"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      o.status === 'delivered' || o.status === 'completed'
                        ? 'bg-green-500'
                        : o.status === 'cancelled'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium">#{o.order_number}</p>
                    <p className="text-xs text-gray-500">{o.buyer_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatPrice(o.total_amount)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(o.status)}`}>
                    {getStatusLabel(o.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// COMPOSANT STAT CARD
// ═══════════════════════════════════════════════════════════
function StatCard({
  icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: string
  label: string
  value: string
  subtitle: string
  color: string
}) {
  return (
    <div className="bg-white rounded-xl p-4 border">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${color}`}>
          {icon}
        </div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  )
}