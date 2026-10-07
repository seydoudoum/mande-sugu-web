import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { becomeSeller } from '../api/seller'
import { useAuthStore } from '../stores/authStore'

export default function BecomeSeller() {
  const navigate = useNavigate()
  const { user, isAuthenticated, setUser } = useAuthStore()

  const [shopName, setShopName] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [countryCode, setCountryCode] = useState('ML')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Si déjà vendeur → rediriger
  if (user?.role === 'seller' || user?.role === 'admin') {
    navigate('/seller')
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (shopName.trim().length < 2) {
      setError('Le nom de la boutique doit contenir au moins 2 caractères')
      return
    }

    setIsLoading(true)

    const result = await becomeSeller({
      shop_name: shopName.trim(),
      description: description.trim() || undefined,
      country_code: countryCode || 'ML',
      city: city.trim() || undefined,
      whatsapp_number: whatsapp.trim() || undefined,
    })

    if (result.success && result.data) {
      if (user) {
        setUser({
          ...user,
          role: 'seller',
        })
      }
      alert('🎉 Félicitations ! Vous êtes maintenant vendeur !')
      navigate('/seller')
    } else {
      setError(result.message || 'Erreur lors de la création')
    }
    setIsLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-3 md:px-4 py-6 md:py-12">
      {/* En-tête */}
      <div className="text-center mb-6 md:mb-8">
        <div className="text-5xl md:text-6xl mb-3">🏪</div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Devenir vendeur
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Ouvrez votre boutique et vendez vos produits sur Mande Sugu
        </p>
      </div>

      {/* Avantages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border text-center">
          <div className="text-3xl mb-2">💰</div>
          <p className="text-sm font-semibold">Vendez facilement</p>
          <p className="text-xs text-gray-500 mt-1">Gratuit et sans commission</p>
        </div>
        <div className="bg-white rounded-xl p-4 border text-center">
          <div className="text-3xl mb-2">📱</div>
          <p className="text-sm font-semibold">App + Site Web</p>
          <p className="text-xs text-gray-500 mt-1">Touchez plus de clients</p>
        </div>
        <div className="bg-white rounded-xl p-4 border text-center">
          <div className="text-3xl mb-2">🚚</div>
          <p className="text-sm font-semibold">Livraison</p>
          <p className="text-xs text-gray-500 mt-1">Partout au Mali</p>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-5 md:p-6">
        <h2 className="text-lg font-bold mb-4">Informations de la boutique</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la boutique *
            </label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Ex: Artisanat Seydou"
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
              rows={3}
              placeholder="Décrivez votre activité, vos produits..."
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bamako"
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00] bg-white"
              >
                <option value="ML">🇲🇱 Mali</option>
                <option value="SN">🇸🇳 Sénégal</option>
                <option value="CI">🇨🇮 Côte d'Ivoire</option>
                <option value="BF">🇧🇫 Burkina Faso</option>
                <option value="GN">🇬🇳 Guinée</option>
                <option value="NE">🇳🇪 Niger</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro WhatsApp
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+223 70 00 00 00"
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Les clients vous contacteront via WhatsApp
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 bg-[#FF6A00] text-white py-3 rounded-lg font-semibold hover:bg-[#E55A00] transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Création...
            </>
          ) : (
            <>🚀 Ouvrir ma boutique</>
          )}
        </button>

        {!isAuthenticated && (
          <p className="text-xs text-center text-gray-500 mt-4">
            Vous devez être connecté.{' '}
            <Link to="/login" className="text-[#FF6A00] hover:underline">
              Se connecter
            </Link>
          </p>
        )}
      </form>
    </div>
  )
}