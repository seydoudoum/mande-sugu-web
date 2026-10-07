import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyProducts, deleteProduct, type SellerProduct } from '../../api/seller'
import { useAuthStore } from '../../stores/authStore'
import { formatPrice, imageUrl } from '../../lib/format'

export default function SellerProducts() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [products, setProducts] = useState<SellerProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadProducts()
  }, [isAuthenticated])

  async function loadProducts() {
    setIsLoading(true)
    const data = await getMyProducts()
    setProducts(data)
    setIsLoading(false)
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Supprimer "${name}" ?`)) return
    const ok = await deleteProduct(id)
    if (ok) {
      setProducts(products.filter((p) => p.id !== id))
      alert('✅ Produit supprimé')
    } else {
      alert('❌ Erreur')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/seller"
            className="text-gray-600 hover:text-[#FF6A00] transition"
          >
            ←
          </Link>
          <div className="w-1 h-6 bg-[#FF6A00] rounded"></div>
          <h1 className="text-2xl font-bold">Mes produits</h1>
          <span className="text-sm text-gray-500">({products.length})</span>
        </div>

        <Link
          to="/seller/products/new"
          className="bg-[#FF6A00] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#E55A00] transition flex items-center gap-2"
        >
          ➕ Ajouter
        </Link>
      </div>

      {/* Vide */}
      {products.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-2">Aucun produit</h2>
          <p className="text-gray-500 mb-6">Ajoutez votre premier produit</p>
          <Link
            to="/seller/products/new"
            className="bg-[#FF6A00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E55A00] transition inline-block"
          >
            ➕ Ajouter un produit
          </Link>
        </div>
      )}

      {/* Liste */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition"
            >
              <div className="flex gap-4 p-4">
                {/* Image */}
                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  {product.main_image ? (
                    <img
                      src={imageUrl(product.main_image)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      📦
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-[#FF6A00]">
                    {formatPrice(product.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        product.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {product.is_active ? '✓ Actif' : 'Inactif'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t flex">
                <Link
                  to={`/product/${product.id}`}
                  className="flex-1 text-center py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
                >
                  👁️ Voir
                </Link>
                <div className="w-px bg-gray-200"></div>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="flex-1 text-center py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}