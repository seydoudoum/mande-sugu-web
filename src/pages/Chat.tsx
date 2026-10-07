import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getConversations, type Conversation } from '../api/chat'
import { useAuthStore } from '../stores/authStore'
import { imageUrl, timeAgo } from '../lib/format'

export default function Chat() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadConversations()
  }, [isAuthenticated])

  async function loadConversations() {
    setIsLoading(true)
    const data = await getConversations()
    setConversations(data)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-3 md:px-4 py-6">
      {/* Titre */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-[#FF6A00] rounded"></div>
        <h1 className="text-2xl font-bold">Mes messages</h1>
        <span className="text-sm text-gray-500">({conversations.length})</span>
      </div>

      {/* Vide */}
      {conversations.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-xl font-bold mb-2">Aucune conversation</h2>
          <p className="text-gray-500 mb-6">
            Contactez un vendeur depuis la page d'un produit
          </p>
          <Link
            to="/catalog"
            className="bg-[#FF6A00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E55A00] transition inline-block"
          >
            Découvrir des produits
          </Link>
        </div>
      )}

      {/* Liste */}
      {conversations.length > 0 && (
        <div className="space-y-2">
          {conversations.map((conv) => {
            const otherName =
              user?.id === conv.buyer_id
                ? conv.seller_name || 'Vendeur'
                : conv.buyer_name || 'Client'
            const otherInitial = otherName.charAt(0).toUpperCase()

            return (
              <Link
                key={conv.id}
                to={`/chat/${conv.id}`}
                className="bg-white rounded-xl border p-3 md:p-4 hover:shadow-md transition flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-[#FF6A00] text-white flex items-center justify-center font-bold shrink-0">
                  {otherInitial}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm truncate">
                      {otherName}
                    </p>
                    {conv.last_message_at && (
                      <span className="text-xs text-gray-400 shrink-0">
                        {timeAgo(conv.last_message_at)}
                      </span>
                    )}
                  </div>
                  {conv.product_name && (
                    <p className="text-xs text-gray-500 truncate">
                      📦 {conv.product_name}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 truncate mt-0.5">
                    {conv.last_message || 'Nouvelle conversation'}
                  </p>
                </div>

                {(conv.unread_count || 0) > 0 && (
                  <div className="w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {conv.unread_count}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}