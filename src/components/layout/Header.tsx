import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cartStore'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { totalItems } = useCartStore()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* ═══════════ BANDEAU SUPÉRIEUR ═══════════ */}
      <div className="bg-[#1A2B4A] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>🇫🇷 Français · FCFA</span>
          <div className="flex gap-4">
            <Link to="/become-seller" className="hover:text-[#FF6A00] transition">
              Devenir vendeur
            </Link>
            <Link to="/help" className="hover:text-[#FF6A00] transition">
              Aide
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════ HEADER PRINCIPAL ═══════════ */}
      <div className="bg-[#FF6A00] py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="text-white">
              <h1 className="text-2xl font-bold leading-none tracking-tight">
                MANDÉ <span className="text-white">SUGU</span>
              </h1>
              <p className="text-[10px] tracking-widest mt-1 opacity-90">
                ACHETEZ MIEUX, VIVEZ MIEUX
              </p>
            </div>
          </Link>

          {/* Barre de recherche */}
          <div className="flex-1 max-w-2xl">
            <div className="bg-white rounded-full flex items-center px-4 py-2">
              <svg
                className="w-5 h-5 text-gray-400 shrink-0"
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
                placeholder="Rechercher un produit, un vendeur..."
                className="flex-1 px-3 outline-none text-sm bg-transparent"
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
          <div className="flex items-center gap-2">
            {/* Favoris */}
            <Link
              to="/favorites"
              className="text-white hover:bg-white/20 p-2 rounded-full transition"
              title="Favoris"
            >
              <svg
                className="w-6 h-6"
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
              className="text-white hover:bg-white/20 p-2 rounded-full transition relative"
              title="Panier"
            >
              <svg
                className="w-6 h-6"
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
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Compte */}
            {isAuthenticated && user ? (
              <div className="relative group">
                <button className="text-white hover:bg-white/20 p-1 rounded-full transition flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-white text-[#FF6A00] flex items-center justify-center font-bold">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl py-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {/* Info utilisateur */}
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
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mon profil
                  </Link>

                  <Link
                    to="/orders"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Mes commandes
                  </Link>

                  <Link
                    to="/favorites"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Mes favoris
                  </Link>

                  {(user.role === 'seller' ||
                    user.role === 'admin' ||
                    user.role === 'super_admin') && (
                    <Link
                      to="/seller"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Ma boutique
                    </Link>
                  )}

                  <hr className="my-1" />

                  <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-white hover:bg-white/20 px-3 py-2 rounded-full transition flex items-center gap-2"
                title="Se connecter"
              >
                <svg
                  className="w-6 h-6"
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
                <span className="text-sm font-medium hidden md:inline">
                  Connexion
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════ MENU CATÉGORIES ═══════════ */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-6 py-3 overflow-x-auto">
            {[
              { name: 'Catégories', slug: 'all' },
              { name: 'Artisanat', slug: 'artisanat' },
              { name: 'Tissus', slug: 'tissus' },
              { name: 'Instruments', slug: 'instruments' },
              { name: 'Mode', slug: 'mode' },
              { name: 'Décoration', slug: 'decoration' },
              { name: 'Alimentation', slug: 'alimentation' },
              { name: 'Beauté', slug: 'beaute' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                to="/catalog"
                className="text-sm text-gray-700 hover:text-[#FF6A00] whitespace-nowrap transition font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}