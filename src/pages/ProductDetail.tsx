import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductById, type Product } from '../api/products'
import { getProductReviews, type Review, type ReviewStats } from '../api/reviews'
import { formatPrice, imageUrl, timeAgo } from '../lib/format'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'

export default function ProductDetail() {
  const { id } = useParams()
  const productId = parseInt(id || '0')
  const { isAuthenticated } = useAuthStore()
  const { addItem } = useCartStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    loadData()
  }, [productId])

  async function loadData() {
    setIsLoading(true)
    try {
      const [p, r] = await Promise.all([
        getProductById(productId),
        getProductReviews(productId),
      ])
      setProduct(p)
      setReviews(r.reviews)
      setStats(r.stats)
    } finally {
      setIsLoading(false)
    }
  }

  function handleAddToCart() {
    if (!product) return
    addItem({
      id: Date.now(),
      product_id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity,
      main_image: product.main_image,
      seller_name: product.seller_name,
    })
    alert(`✅ ${quantity} article(s) ajouté(s) au panier !`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Produit introuvable</p>
        <Link to="/catalog" className="text-[#FF6A00] hover:underline">
          Retour au catalogue
        </Link>
      </div>
    )
  }

  const images = [product.main_image, product.main_image, product.main_image, product.main_image].filter(Boolean)
  const rating = parseFloat(product.rating) || 0
  const hasPromo = product.old_price && parseFloat(product.old_price) > parseFloat(product.price)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Fil d'Ariane */}
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-[#FF6A00]">Accueil</Link>
        {' · '}
        <Link to="/catalog" className="hover:text-[#FF6A00]">Catalogue</Link>
        {' · '}
        <span className="text-gray-700">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ═══════════ GALERIE ═══════════ */}
        <div>
          <div className="bg-white rounded-xl p-4 border">
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
              {images[selectedImage] ? (
                <img
                  src={imageUrl(images[selectedImage])}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  Pas d'image
                </div>
              )}
            </div>
          </div>

          {/* Miniatures */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === i ? 'border-[#FF6A00]' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={imageUrl(img!)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══════════ INFOS ═══════════ */}
        <div>
          <h1 className="text-2xl font-bold mb-3">{product.name}</h1>

          {/* Note */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {rating.toFixed(1)} ({product.review_count} avis)
            </span>
            <span className="text-sm text-gray-400">·</span>
            <span className="text-sm text-gray-600">{product.sales_count} ventes</span>
          </div>

          {/* Prix */}
          <div className="bg-orange-50 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-600 mb-1">Prix</p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#FF6A00]">
                {formatPrice(product.price)}
              </span>
              {hasPromo && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.old_price!)}
                </span>
              )}
            </div>
          </div>

          {/* Stock */}
          <p className="text-sm text-gray-600 mb-4">
            Stock : <strong>{product.stock}</strong> disponible(s)
          </p>

          {/* Quantité */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">Quantité :</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100"
              >
                −
              </button>
              <span className="px-4 font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Boutons */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#FF6A00] text-white py-3 rounded-lg font-semibold hover:bg-[#E55A00] transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Ajouter au panier
            </button>

            {product.seller_id && (
              <button className="w-full border-2 border-[#FF6A00] text-[#FF6A00] py-3 rounded-lg font-semibold hover:bg-[#FF6A00] hover:text-white transition">
                Contacter le vendeur
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════ DESCRIPTION ═══════════ */}
      <div className="bg-white rounded-xl p-6 mt-8">
        <h2 className="text-lg font-bold mb-4">Description</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {product.name} — Produit de qualité supérieure. Livraison rapide partout au Mali.
        </p>
      </div>

      {/* ═══════════ AVIS ═══════════ */}
      <div className="bg-white rounded-xl p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#FF6A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <h2 className="text-lg font-bold">Avis clients</h2>
          </div>
          <span className="text-sm text-gray-500">
            {stats?.total || 0} avis
          </span>
        </div>

        {stats && stats.total > 0 && (
          <div className="flex gap-8 mb-6 pb-6 border-b">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FF6A00]">
                {stats.average.toFixed(1)}
              </div>
              <div className="flex justify-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className={`w-3 h-3 ${s <= stats.average ? 'text-amber-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-1">{stats.total} avis</div>
            </div>

            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = (stats as any)[`stars${star}`] || 0
                const ratio = stats.total > 0 ? (count / stats.total) * 100 : 0
                return (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <span className="text-xs w-3">{star}</span>
                    <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400"
                        style={{ width: `${ratio}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-6">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Liste des avis */}
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">Aucun avis pour le moment</p>
            <p className="text-sm">Soyez le premier à donner votre avis !</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FF6A00] text-white flex items-center justify-center font-bold">
                    {review.user_name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{review.user_name}</span>
                      {review.is_verified_purchase === 1 && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          ✓ Achat vérifié
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg
                            key={s}
                            className={`w-3 h-3 ${s <= review.rating ? 'text-amber-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{timeAgo(review.created_at)}</span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bouton laisser un avis */}
        {isAuthenticated && (
          <div className="mt-6 pt-6 border-t">
            <Link
              to={`/product/${product.id}/review`}
              className="inline-block border-2 border-[#FF6A00] text-[#FF6A00] px-6 py-2 rounded-lg font-semibold hover:bg-[#FF6A00] hover:text-white transition"
            >
              ✍️ Laisser un avis
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}