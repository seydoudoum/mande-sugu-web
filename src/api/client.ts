import axios from 'axios'

// ═══════════════════════════════════════════════════════════
// CONFIGURATION AXIOS
// ═══════════════════════════════════════════════════════════
export const API_URL = 'https://mande-sugu-backend-production.up.railway.app/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
})

// ═══════════════════════════════════════════════════════════
// INTERCEPTEUR REQUÊTE — Ajouter le token JWT
// ═══════════════════════════════════════════════════════════
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ═══════════════════════════════════════════════════════════
// INTERCEPTEUR RÉPONSE — Gérer les erreurs 401
// ═══════════════════════════════════════════════════════════
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré → déconnexion
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api