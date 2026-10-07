import api from './client'

export interface UserProfile {
  id: number
  full_name: string
  email: string
  phone?: string
  country_code?: string
  city?: string
  bio?: string
  avatar_url?: string
  role: string
  is_verified?: number
}

export async function getProfile(): Promise<UserProfile | null> {
  try {
    const res = await api.get('/profile')
    return res.data.data
  } catch {
    return null
  }
}

export async function updateProfile(data: {
  name: string
  phone?: string
  city?: string
  country?: string
  bio?: string
}): Promise<{ success: boolean; message?: string; data?: UserProfile }> {
  try {
    const res = await api.put('/profile', data)
    return res.data
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'Erreur',
    }
  }
}

export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await api.put('/profile/password', data)
    return res.data
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'Erreur',
    }
  }
}

export async function uploadAvatar(file: File): Promise<{
  success: boolean
  message?: string
  avatar?: string
}> {
  try {
    const formData = new FormData()
    formData.append('avatar', file)

    const res = await api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return {
      success: true,
      message: res.data.message,
      avatar: res.data.data?.avatar,
    }
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || 'Erreur upload',
    }
  }
}