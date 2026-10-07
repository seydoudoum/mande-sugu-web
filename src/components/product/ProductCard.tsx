import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../api/products'
import { toggleFavorite } from '../../api/favorites'
import { useAuthStore } from '../../stores/authStore'
import { formatPrice, imageUrl } from '../../lib/format'

interface Props {
  product: Product
  isFavorite?: boolean
}

export default function ProductCard({ product, isFavorite = false }: Props) {
  const { isAuthenticated } = useAuthStore()
  const [isFav, setIsFav] = useState(isFavorite)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsFav(isFavorite)
  }, [isFavorite])

  const hasPromo =
    product.old_price &&
    parseFloat(product.old_price) > parseFloat(product.price)

  async function handleToggleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      alert('Connectez-vous pour ajouter aux favoris')
      return
    }

    setIsLoading(true)
    const result = await toggleFavorite(product.id)

    if (result.success) {
      setIsFav(result.is_favorite || false)
    }
    setIsLoading(false)
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {product.main_image ? (
          <img
            src={imageUrl(product.main_image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            📦
          </div>
        )}

        {/* Badge PROMO */}
        {hasPromo && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            PROMO
          </span>
        )}

        {/* Bouton favori */}
        <button
          onClick={handleToggleFavorite}
          disabled={isLoading}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100 transition"
          title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg
              className={`w-4 h-4 ${isFav ? 'text-red-500' : 'text-gray-600'}`}
              fill={isFav ? 'currentColor' : 'none'}
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
          )}
        </button>
      </div>

      {/* Infos */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 min-h-[40px]">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg font-bold text-[#FF6A00]">
            {formatPrice(product.price)}
          </span>
          {hasPromo && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.old_price!)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <svg
            className="w-3 h-3 text-amber-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{parseFloat(product.rating).toFixed(1)}</span>
          <span>· {product.sales_count} ventes</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Mali</span>
        </div>
      </div>
    </Link>
  )
}