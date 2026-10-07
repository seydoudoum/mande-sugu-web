import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createProduct, uploadProductImage } from '../../api/seller'

export default function SellerAddProduct() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [oldPrice, setOldPrice] = useState('')
  const [stock, setStock] = useState('10')
  const [description, setDescription] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Format d\'image non supporté')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5 MB')
      return
    }

    setError(null)
    setImagePreview(URL.createObjectURL(file))
    setUploadedUrl(null)
    uploadImage(file)
  }

  async function uploadImage(file: File) {
    setIsUploading(true)
    const result = await uploadProductImage(file)

    if (result.success && result.url) {
      setUploadedUrl(result.url)
    } else {
      setError(result.message || 'Erreur upload')
      setImagePreview(null)
    }
    setIsUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!uploadedUrl) {
      setError('Veuillez uploader une image')
      return
    }

    if (name.trim().length < 2) {
      setError('Le nom doit contenir au moins 2 caractères')
      return
    }

    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Prix invalide')
      return
    }

    setIsSubmitting(true)

    const result = await createProduct({
      name: name.trim(),
      price: priceNum,
      old_price: oldPrice ? parseFloat(oldPrice) : undefined,
      description: description.trim() || undefined,
      stock: parseInt(stock) || 0,
      main_image: uploadedUrl,
    })

    if (result.success) {
      alert('🎉 Produit publié avec succès !')
      navigate('/seller/products')
    } else {
      setError(result.message || 'Erreur lors de la publication')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/seller/products"
          className="text-gray-600 hover:text-[#FF6A00] transition text-2xl"
        >
          ←
        </Link>
        <div className="w-1 h-6 bg-[#FF6A00] rounded"></div>
        <h1 className="text-2xl font-bold">Ajouter un produit</h1>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6">
        {/* IMAGE */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image du produit *
          </label>

          <div
            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-[#FF6A00] transition"
            onClick={() => document.getElementById('image-input')?.click()}
          >
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {uploadedUrl && !isUploading && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    ✓ Uploadée
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8">
                <div className="text-5xl mb-3">📷</div>
                <p className="text-gray-600 mb-1">
                  Cliquez pour choisir une image
                </p>
                <p className="text-xs text-gray-400">
                  JPG, PNG, WEBP (max 5 MB)
                </p>
              </div>
            )}
          </div>

          <input
            id="image-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* INFOS */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du produit *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Support PC portable"
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (FCFA) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15000"
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ancien prix (optionnel)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="18000"
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <input
              type="number"
              required
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Décrivez votre produit en détail..."
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00] resize-none"
            />
          </div>
        </div>

        {/* BOUTONS */}
        <div className="mt-6 flex gap-3">
          <Link
            to="/seller/products"
            className="flex-1 text-center border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="flex-1 bg-[#FF6A00] text-white py-3 rounded-lg font-semibold hover:bg-[#E55A00] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Publication...
              </>
            ) : (
              <>✓ Publier le produit</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}