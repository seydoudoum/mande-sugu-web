import { Link } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { formatPrice, imageUrl } from '../lib/format'

export default function Cart() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clear } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
        <p className="text-gray-500 mb-8">Découvrez nos produits artisanaux</p>
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
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-[#FF6A00] rounded"></div>
          <h1 className="text-2xl font-bold">Mon panier</h1>
          <span className="text-sm text-gray-500">({totalItems} articles)</span>
        </div>
        <button
          onClick={() => {
            if (confirm('Vider le panier ?')) clear()
          }}
          className="text-sm text-red-600 hover:text-red-700"
        >
          🗑️ Vider le panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LISTE ARTICLES */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 flex gap-4 border"
            >
              <Link to={`/product/${item.product_id}`} className="shrink-0">
                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden">
                  {item.main_image ? (
                    <img
                      src={imageUrl(item.main_image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      📦
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.product_id}`}
                  className="font-semibold text-sm hover:text-[#FF6A00] line-clamp-2"
                >
                  {item.name}
                </Link>
                {item.seller_name && (
                  <p className="text-xs text-gray-500 mt-1">
                    Vendu par {item.seller_name}
                  </p>
                )}
                <p className="text-lg font-bold text-[#FF6A00] mt-2">
                  {formatPrice(Number(item.price))}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                  title="Supprimer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-3 font-semibold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <p className="text-sm font-bold text-gray-700">
                  {formatPrice(Number(item.price) * Number(item.quantity))}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* RÉCAPITULATIF */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 border sticky top-32">
            <h2 className="text-lg font-bold mb-4">Récapitulatif</h2>

            <div className="space-y-3 mb-4 pb-4 border-b">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-semibold">{formatPrice(Number(totalPrice))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Livraison</span>
                <span className="text-gray-400 text-xs">Calculée à l'étape suivante</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-bold text-[#FF6A00]">
                {formatPrice(Number(totalPrice))}
              </span>
            </div>

            {isAuthenticated ? (
              <Link
                to="/checkout"
                className="w-full bg-[#FF6A00] text-white py-3 rounded-lg font-semibold hover:bg-[#E55A00] transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Commander
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-full bg-[#FF6A00] text-white py-3 rounded-lg font-semibold hover:bg-[#E55A00] transition flex items-center justify-center gap-2"
              >
                Se connecter pour commander
              </Link>
            )}

            <Link
              to="/catalog"
              className="w-full text-center text-sm text-gray-600 hover:text-[#FF6A00] mt-3 block"
            >
              ← Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}