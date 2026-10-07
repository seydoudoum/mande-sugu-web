import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createOrder } from '../api/orders'
import api from '../api/client'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { formatPrice, imageUrl } from '../lib/format'

export default function Checkout() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { items, totalPrice, clear } = useCartStore()

  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const shippingFee = 1500
  const finalTotal = totalPrice + shippingFee

  // Non connecté → rediriger
  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  // Panier vide
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Panier vide</h1>
        <p className="text-gray-500 mb-8">
          Ajoutez des produits avant de commander
        </p>
        <Link
          to="/catalog"
          className="bg-[#FF6A00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E55A00] transition inline-block"
        >
          Découvrir des produits
        </Link>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // SYNCHRONISER LE PANIER LOCAL → BACKEND
  // ═══════════════════════════════════════════════════════════
  async function syncCartToBackend() {
    try {
      // 1. Vider le panier backend existant
      await api.delete('/cart')

      // 2. Ajouter chaque article du panier local
      for (const item of items) {
        await api.post('/cart', {
          product_id: item.product_id,
          quantity: item.quantity,
        })
      }
      return true
    } catch (e) {
      console.error('Sync cart error:', e)
      return false
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (address.trim().length < 5) {
      setError('Adresse de livraison requise (min 5 caractères)')
      return
    }

    if (city.trim().length < 2) {
      setError('Ville requise')
      return
    }

    setIsLoading(true)

    // ⚠️ Synchroniser le panier local avec le backend AVANT de commander
    const synced = await syncCartToBackend()
    if (!synced) {
      setError('Erreur de synchronisation du panier')
      setIsLoading(false)
      return
    }

    const fullAddress = `${address}, ${city}${phone ? ` · Tél: ${phone}` : ''}`

    const result = await createOrder({
      shipping_address: fullAddress,
      payment_method: paymentMethod,
      shipping_fee: shippingFee,
      notes: notes || undefined,
    })

    if (result.success) {
      clear()
      alert('🎉 Commande passée avec succès !')
      navigate('/orders')
    } else {
      setError(result.message || 'Erreur lors de la commande')
    }
    setIsLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Titre */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-[#FF6A00] rounded"></div>
        <h1 className="text-2xl font-bold">Finaliser la commande</h1>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ═══════════ FORMULAIRE ═══════════ */}
          <div className="lg:col-span-2 space-y-6">
            {/* Adresse */}
            <div className="bg-white rounded-xl p-6 border">
              <h2 className="text-lg font-bold mb-4">
                📍 Adresse de livraison
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse complète *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Quartier, rue, numéro..."
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bamako"
                      className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+223 XX XX XX XX"
                      className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optionnel)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Instructions pour le livreur..."
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Paiement */}
            <div className="bg-white rounded-xl p-6 border">
              <h2 className="text-lg font-bold mb-4">💳 Mode de paiement</h2>

              <div className="space-y-3">
                {[
                  { id: 'cash', label: 'Paiement à la livraison', icon: '💵' },
                  { id: 'orange_money', label: 'Orange Money', icon: '🟠' },
                  { id: 'wave', label: 'Wave', icon: '🌊' },
                  { id: 'card', label: 'Carte bancaire', icon: '💳' },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === method.id
                        ? 'border-[#FF6A00] bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#FF6A00]"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════ RÉCAPITULATIF ═══════════ */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border sticky top-32">
              <h2 className="text-lg font-bold mb-4">Récapitulatif</h2>

              {/* Articles */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden shrink-0">
                      {item.main_image ? (
                        <img
                          src={imageUrl(item.main_image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              {/* Totaux */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-semibold">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-semibold">
                    {formatPrice(shippingFee)}
                  </span>
                </div>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-bold text-[#FF6A00]">
                  {formatPrice(finalTotal)}
                </span>
              </div>

              {/* Bouton */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6A00] text-white py-3 rounded-lg font-semibold hover:bg-[#E55A00] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Commande en cours...
                  </>
                ) : (
                  <>✅ Passer la commande</>
                )}
              </button>

              <Link
                to="/cart"
                className="w-full text-center text-sm text-gray-600 hover:text-[#FF6A00] mt-3 block"
              >
                ← Modifier le panier
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}