import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts, type Product } from '../api/products'
import ProductCard from '../components/product/ProductCard'

type SortOption = 'recent' | 'price_asc' | 'price_desc' | 'popular'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [sort, setSort] = useState<SortOption>('recent')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setIsLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  // Filtres + tri
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Recherche
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(q))
    }

    // Prix max
    if (maxPrice !== null) {
      result = result.filter((p) => parseFloat(p.price) <= maxPrice)
    }

    // Tri
    switch (sort) {
      case 'price_asc':
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        break
      case 'price_desc':
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        break
      case 'popular':
        result.sort((a, b) => b.sales_count - a.sales_count)
        break
      default:
        break
    }

    return result
  }, [products, search, sort, maxPrice])

  // Mettre à jour l'URL quand la recherche change
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    setSearchParams(params, { replace: true })
  }, [search, setSearchParams])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Titre */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-[#FF6A00] rounded"></div>
        <h1 className="text-2xl font-bold">Catalogue</h1>
        <span className="text-sm text-gray-500">
          ({filteredProducts.length} produits)
        </span>
      </div>

      {/* Barre de recherche + filtres */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Rechercher
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <svg
                className="w-4 h-4 text-gray-400"
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom du produit..."
                className="flex-1 px-2 outline-none text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Tri */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Trier par
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none bg-white"
            >
              <option value="recent">Plus récents</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="popular">Plus populaires</option>
            </select>
          </div>
        </div>

        {/* Filtre prix */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 font-medium self-center">
            Prix max :
          </span>
          {[null, 5000, 10000, 25000, 50000].map((p) => (
            <button
              key={p ?? 'all'}
              onClick={() => setMaxPrice(p)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                maxPrice === p
                  ? 'bg-[#FF6A00] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p === null ? 'Tous' : `≤ ${p.toLocaleString('fr-FR')} F`}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Aucun résultat */}
      {!isLoading && filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-3">Aucun produit trouvé</p>
          {(search || maxPrice !== null) && (
            <button
              onClick={() => {
                setSearch('')
                setMaxPrice(null)
              }}
              className="text-[#FF6A00] hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {/* Grille produits */}
      {!isLoading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}