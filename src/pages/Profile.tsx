import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, updateProfile, changePassword, type UserProfile } from '../api/profile'
import { useAuthStore } from '../stores/authStore'
import { imageUrl } from '../lib/format'

export default function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, setUser, logout } = useAuthStore()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Formulaire
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [bio, setBio] = useState('')

  // Mot de passe
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadProfile()
  }, [isAuthenticated])

  async function loadProfile() {
    setIsLoading(true)
    const p = await getProfile()
    if (p) {
      setProfile(p)
      setName(p.full_name)
      setPhone(p.phone || '')
      setCity(p.city || '')
      setCountry(p.country_code || '')
      setBio(p.bio || '')
    }
    setIsLoading(false)
  }

  function showMessage(type: 'success' | 'error', text: string) {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    const result = await updateProfile({
      name,
      phone: phone || undefined,
      city: city || undefined,
      country: country || undefined,
      bio: bio || undefined,
    })

    if (result.success && result.data) {
      setProfile(result.data)
      // Mettre à jour le store
      if (user) {
        setUser({
          ...user,
          full_name: result.data.full_name,
          phone: result.data.phone,
          city: result.data.city,
          country_code: result.data.country_code,
          bio: result.data.bio,
        })
      }
      showMessage('success', '✅ Profil enregistré')
    } else {
      showMessage('error', result.message || 'Erreur')
    }
    setIsSaving(false)
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()

    if (newPassword.length < 6) {
      showMessage('error', 'Le mot de passe doit faire 6+ caractères')
      return
    }
    if (newPassword !== confirmPassword) {
      showMessage('error', 'Les mots de passe ne correspondent pas')
      return
    }

    setIsSaving(true)
    const result = await changePassword({
      currentPassword,
      newPassword,
    })

    if (result.success) {
      showMessage('success', '✅ Mot de passe modifié')
      setShowPasswordForm(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      showMessage('error', result.message || 'Erreur')
    }
    setIsSaving(false)
  }

  function handleLogout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout()
      navigate('/')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Impossible de charger le profil</p>
      </div>
    )
  }

  const fullAvatarUrl = profile.avatar_url ? imageUrl(profile.avatar_url) : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Titre */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-[#FF6A00] rounded"></div>
        <h1 className="text-2xl font-bold">Mon profil</h1>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-lg p-3 mb-4 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ═══════════ AVATAR ═══════════ */}
      <div className="bg-white rounded-xl p-6 border mb-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-[#FF6A00] flex items-center justify-center text-white text-3xl font-bold overflow-hidden shrink-0">
            {fullAvatarUrl ? (
              <img
                src={fullAvatarUrl}
                alt={profile.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              profile.full_name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{profile.full_name}</h2>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <span
              className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                profile.role === 'seller'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {profile.role === 'seller' ? '🏪 Vendeur' : '👤 Client'}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════ INFORMATIONS ═══════════ */}
      <form onSubmit={handleSave} className="bg-white rounded-xl p-6 border mb-6">
        <h2 className="text-lg font-bold mb-4">Informations personnelles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              Pays (code ISO)
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="ML, SN, CI..."
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Parlez-nous de vous..."
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00] resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-4 bg-[#FF6A00] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#E55A00] transition disabled:opacity-50"
        >
          {isSaving ? 'Enregistrement...' : '💾 Enregistrer'}
        </button>
      </form>

      {/* ═══════════ MOT DE PASSE ═══════════ */}
      <div className="bg-white rounded-xl p-6 border mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">🔒 Sécurité</h2>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-sm text-[#FF6A00] hover:underline"
          >
            {showPasswordForm ? 'Annuler' : 'Changer le mot de passe'}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe actuel
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00]"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#FF6A00] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#E55A00] transition disabled:opacity-50"
            >
              {isSaving ? 'Modification...' : 'Changer le mot de passe'}
            </button>
          </form>
        )}
      </div>

      {/* ═══════════ DÉCONNEXION ═══════════ */}
      <div className="bg-white rounded-xl p-6 border">
        <button
          onClick={handleLogout}
          className="w-full border-2 border-red-500 text-red-500 py-3 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition"
        >
          🚪 Se déconnecter
        </button>
      </div>
    </div>
  )
}