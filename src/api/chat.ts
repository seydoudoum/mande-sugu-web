import api from './client'

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════
export interface Conversation {
  id: number
  buyer_id: number
  seller_id: number
  product_id?: number | null
  last_message?: string
  last_message_at?: string
  buyer_name?: string
  seller_name?: string
  product_name?: string
  product_image?: string
  unread_count?: number
  created_at: string
}

export interface Message {
  id: number
  conversation_id: number
  sender_id: number
  sender_name?: string
  content: string
  is_read: number
  created_at: string
}

// ═══════════════════════════════════════════════════════════
// CONVERSATIONS
// ═══════════════════════════════════════════════════════════
export async function getConversations(): Promise<Conversation[]> {
  try {
    const res = await api.get('/chat/conversations')
    return res.data.data || []
  } catch {
    return []
  }
}

export async function createConversation(data: {
  seller_id: number
  product_id?: number
}): Promise<{
  success: boolean
  message?: string
  data?: Conversation
}> {
  try {
    console.log('🚀 createConversation - Envoi:', data)

    const res = await api.post('/chat/conversations', data)

    console.log('✅ createConversation - Réponse complète:', res.data)
    console.log('✅ createConversation - res.data.data:', res.data.data)

    return {
      success: true,
      message: res.data.message,
      data: res.data.data,
    }
  } catch (e: any) {
    console.error('❌ createConversation - Erreur:', e)
    console.error('❌ createConversation - Statut:', e.response?.status)
    console.error('❌ createConversation - Message:', e.response?.data?.message)

    return {
      success: false,
      message: e.response?.data?.message || e.message || 'Erreur de connexion',
    }
  }
}

// ═══════════════════════════════════════════════════════════
// MESSAGES
// ═══════════════════════════════════════════════════════════
export async function getMessages(conversationId: number): Promise<Message[]> {
  try {
    const res = await api.get(`/chat/conversations/${conversationId}`)
    return res.data.data || []
  } catch {
    return []
  }
}

export async function sendMessage(data: {
  conversation_id: number
  content: string
}): Promise<{
  success: boolean
  message?: string
  data?: Message
}> {
  try {
    const res = await api.post('/chat/messages', data)
    return {
      success: true,
      message: res.data.message,
      data: res.data.data,
    }
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'Erreur',
    }
  }
}