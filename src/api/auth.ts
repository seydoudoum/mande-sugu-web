import api from './client'

export interface LoginResponse {
  success: boolean
  message?: string
  data?: {
    token: string
    user: {
      id: number
      full_name: string
      email: string
      phone?: string
      role: string
      is_verified?: number
      country_code?: string
      city?: string
      bio?: string
      avatar_url?: string
    }
  }
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const res = await api.post('/auth/login', { email, password })
    return res.data
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'Erreur de connexion',
    }
  }
}

export async function register(data: {
  full_name: string
  email: string
  password: string
  phone?: string
}): Promise<LoginResponse> {
  try {
    const res = await api.post('/auth/register', data)
    return res.data
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'Erreur d\'inscription',
    }
  }
}

export async function getMe(): Promise<any> {
  try {
    const res = await api.get('/auth/me')
    return res.data.data
  } catch {
    return null
  }
}