import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cartStore'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { totalItems } = useCartStore()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* BANDEAU SUPÉRIEUR */}
      <div className="bg-[#1A2B4A] text-white text-[10px] md:text-xs py-1.5 md:py-2 px-2 md:px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>🇫🇷 FR · FCFA</span>
          <div className="flex gap-2 md:gap-4">
            <Link to="/become-seller" className="hover:text-[#FF6A00]">
              Devenir vendeur
            </Link>
            <Link to="/help" className="hover:text-[#FF6A00]">
              Aide
            </Link>
          </div>
        </div>
      </div>

      {/* HEADER PRINCIPAL */}
      <div className="bg-[#FF6A00] py-2 md:py-4 px-2 md:px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 md:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 md:gap-2 shrink-0">
            <div className="text-white">
              <h1 className="text-sm md:text-2xl font-bold leading-none tracking-tight">
                MANDÉ SUGU
              </h1>
              <p className="text-[7px] md:text-[10px] tracking-widest mt-0.5 md:mt-1 opacity-90 hidden sm:block">
                ACHETEZ MIEUX, VIVEZ MIEUX
              </p>
            </div>
          </Link>

          {/* Barre de recherche */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-full flex items-center px-2 md:px-4 py-1 md:py-2">
              <svg
                className="w-3 h-3 md:w-5 md:h-5 text-gray-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Rechercher..."
                className="flex-1 px-1 md:px-3 outline-none text-[10px] md:text-sm bg-transparent min-w-0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = (e.target as HTMLInputElement).value
                    if (q.trim()) {
                      window.location.href = `/catalog?q=${encodeURIComponent(q)}`
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 md:gap-2 shrink-0">
            {/* Favoris (caché sur très petit mobile) */}
            <Link
              to="/favorites"
              className="hidden sm:flex text-white hover:bg-white/20 p-1.5 md:p-2 rounded-full transition"
              title="Favoris"
            >
              <svg
                className="w-4 h-4 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Link>

            {/* Panier */}
            <Link
              to="/cart"
              className="text-white hover:bg-white/20 p-1.5 md:p-2 rounded-full transition relative"
              title="Panier"
            >
              <svg
                className="w-4 h-4 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] md:text-xs font-bold rounded-full w-3.5 h-3.5 md:w-5 md:h-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Compte */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-white hover:bg-white/20 p-0.5 md:p-1 rounded-full transition"
                >
                  <div className="w-6 h-6 md:w-9 md:h-9 rounded-full bg-white text-[#FF6A00] flex items-center justify-center font-bold text-xs md:text-base">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showMenu && (
                  <>
                    {/* Overlay pour fermer au clic extérieur */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMenu(false)}
                    ></div>

                    {/* Menu */}
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl py-2 w-52 md:w-56 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user.full_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        👤 Mon profil
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📦 Mes commandes
                      </Link>
                      <Link
                        to="/favorites"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        ❤️ Mes favoris
                      </Link>
                      {(user.role === 'seller' ||
                        user.role === 'admin' ||
                        user.role === 'super_admin') && (
                        <Link
                          to="/seller"
                          onClick={() => setShowMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          🏪 Ma boutique
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          setShowMenu(false)
                          logout()
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        🚪 Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-white hover:bg-white/20 p-1.5 md:p-2 rounded-full transition"
                title="Se connecter"
              >
                <svg
                  className="w-4 h-4 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MENU CATÉGORIES */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <nav className="flex gap-3 md:gap-6 py-2 md:py-3 whitespace-nowrap">
            {[
              'Catégories',
              'Artisanat',
              'Tissus',
              'Instruments',
              'Mode',
              'Décoration',
              'Alimentation',
              'Beauté',
            ].map((cat) => (
              <Link
                key={cat}
                to="/catalog"
                className="text-[11px] md:text-sm text-gray-700 hover:text-[#FF6A00] font-medium"
              >
                {cat}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}