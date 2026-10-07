// ═══════════════════════════════════════════════════════════
// FORMATAGE DES PRIX
// ═══════════════════════════════════════════════════════════
export function formatPrice(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '0 FCFA'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0 FCFA'
  return `${num.toLocaleString('fr-FR')} FCFA`
}

// ═══════════════════════════════════════════════════════════
// FORMATAGE DES DATES
// ═══════════════════════════════════════════════════════════
export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const dt = new Date(dateStr)
    return dt.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

// ═══════════════════════════════════════════════════════════
// TIME AGO
// ═══════════════════════════════════════════════════════════
export function timeAgo(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const dt = new Date(dateStr)
    const diff = Date.now() - dt.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "À l'instant"
    if (minutes < 60) return `Il y a ${minutes} min`
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    if (days < 30) return `Il y a ${Math.floor(days / 7)} sem`
    return dt.toLocaleDateString('fr-FR')
  } catch {
    return ''
  }
}

// ═══════════════════════════════════════════════════════════
// TRUNCATE TEXTE
// ═══════════════════════════════════════════════════════════
export function truncate(text: string, length: number = 50): string {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// ═══════════════════════════════════════════════════════════
// URL DES IMAGES
// ═══════════════════════════════════════════════════════════
export const BACKEND_URL = 'https://mande-sugu-backend-production.up.railway.app'

export function imageUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  if (path.startsWith('/')) {
    return `${BACKEND_URL}${path}`
  }
  return `${BACKEND_URL}/${path}`
}