import { useEffect, useState, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getMessages, sendMessage, type Message } from '../api/chat'
import { useAuthStore } from '../stores/authStore'
import { timeAgo } from '../lib/format'

export default function Conversation() {
  const { id } = useParams()
  const conversationId = parseInt(id || '0')
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    loadMessages()

    pollIntervalRef.current = window.setInterval(() => {
      loadMessages(true)
    }, 5000)

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [conversationId, isAuthenticated])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadMessages(silent = false) {
    if (!silent) setIsLoading(true)
    const data = await getMessages(conversationId)
    setMessages(data)
    if (!silent) setIsLoading(false)
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    const content = newMessage.trim()
    setNewMessage('')

    const result = await sendMessage({
      conversation_id: conversationId,
      content,
    })

    if (result.success) {
      await loadMessages(true)
    } else {
      alert(result.message || 'Erreur')
      setNewMessage(content)
    }
    setIsSending(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-3 flex items-center gap-3 shrink-0">
        <Link
          to="/chat"
          className="text-gray-600 hover:text-[#FF6A00] transition text-xl"
        >
          ←
        </Link>
        <div className="w-10 h-10 rounded-full bg-[#FF6A00] text-white flex items-center justify-center font-bold">
          💬
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">
            Conversation #{conversationId}
          </p>
          <p className="text-xs text-gray-500">
            {messages.length} message(s)
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p>Aucun message</p>
            <p className="text-sm">Envoyez le premier message !</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  isMe
                    ? 'bg-[#FF6A00] text-white rounded-br-sm'
                    : 'bg-white border text-gray-800 rounded-bl-sm'
                }`}
              >
                {!isMe && msg.sender_name && (
                  <p className="text-xs font-semibold mb-1 opacity-70">
                    {msg.sender_name}
                  </p>
                )}
                <p className="text-sm whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isMe ? 'text-white/70' : 'text-gray-400'
                  }`}
                >
                  {timeAgo(msg.created_at)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Saisie */}
      <form
        onSubmit={handleSend}
        className="bg-white border-t p-3 flex gap-2 shrink-0"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-[#FF6A00] text-sm"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending || !newMessage.trim()}
          className="bg-[#FF6A00] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#E55A00] transition disabled:opacity-50"
        >
          {isSending ? '...' : '➤'}
        </button>
      </form>
    </div>
  )
}