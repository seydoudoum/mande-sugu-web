import { useEffect, useState } from 'react'
import { getProducts, type Product } from '../api/products'
import ProductCard from '../components/product/ProductCard'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (e) {
      setError('Impossible de charger les produits')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-6">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-[#FF6A00] to-[#E55A00] rounded-xl md:rounded-2xl p-4 md:p-12 mb-4 md:mb-8 text-white">
        <h1 className="text-xl md:text-5xl font-bold mb-1 md:mb-3">
          Promo 1
        </h1>
        <p className="text-xs md:text-xl opacity-90">
          -50% sur l'artisanat mandingue
        </p>
      </div>

      {/* Titre */}
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
        <div className="w-1 h-5 md:h-6 bg-[#FF6A00] rounded"></div>
        <h2 className="text-lg md:text-2xl font-bold">Produits vedettes</h2>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Erreur */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-3">{error}</p>
          <button
            onClick={loadProducts}
            className="bg-[#FF6A00] text-white px-4 py-2 rounded-lg hover:bg-[#E55A00] transition"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Aucun produit */}
      {!isLoading && !error && products.length === 0 && (
        <div className="bg-white rounded-lg p-12 text-center text-gray-500">
          Aucun produit pour le moment
        </div>
      )}

      {/* Grille produits */}
      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}