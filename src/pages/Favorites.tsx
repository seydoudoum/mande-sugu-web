import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFavorites, removeFavorite, type Favorite } from '../api/favorites'
import { useAuthStore } from '../stores/authStore'
import { formatPrice, imageUrl } from '../lib/format'

export default function Favorites() {
  const { isAuthenticated } = useAuthStore()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  async function loadFavorites() {
    setIsLoading(true)
    const data = await getFavorites()
    setFavorites(data)
    setIsLoading(false)
  }

  async function handleRemove(productId: number) {
    if (!confirm('Retirer ce produit des favoris ?')) return
    const ok = await removeFavorite(productId)
    if (ok) {
      setFavorites(favorites.filter((f) => f.id !== productId))
    }
  }

  // Non connecté
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Connectez-vous</h1>
        <p className="text-gray-500 mb-8">Pour voir vos favoris</p>
        <Link
          to="/login"
          className="bg-[#FF6A00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E55A00] transition inline-block"
        >
          Se connecter
        </Link>
      </div>
    )
  }

  // Loading
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Vide
  if (favorites.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Aucun favori</h1>
        <p className="text-gray-500 mb-8">Ajoutez des produits à vos favoris</p>
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
      {/* Titre */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-[#FF6A00] rounded"></div>
        <h1 className="text-2xl font-bold">Mes favoris</h1>
        <span className="text-sm text-gray-500">({favorites.length} produits)</span>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {favorites.map((fav) => (
          <div
            key={fav.favorite_id}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition relative"
          >
            {/* Bouton retirer */}
            <button
              onClick={() => handleRemove(fav.id)}
              className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50 transition"
              title="Retirer des favoris"
            >
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            <Link to={`/product/${fav.id}`}>
              {/* Image */}
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {fav.main_image ? (
                  <img
                    src={imageUrl(fav.main_image)}
                    alt={fav.name}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    📦
                  </div>
                )}
              </div>

              {/* Infos */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 min-h-[40px]">
                  {fav.name}
                </h3>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg font-bold text-[#FF6A00]">
                    {formatPrice(fav.price)}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{parseFloat(fav.rating).toFixed(1)}</span>
                  <span>· {fav.sales_count} ventes</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}