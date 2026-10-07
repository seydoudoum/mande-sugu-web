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
    const res = await api.post('/chat/conversations', data)
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