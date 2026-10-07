import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cartStore'

export default function Layout() {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const loadCart = useCartStore((s) => s.loadFromBackend)

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  // Charger le panier depuis le backend si connecté
  useEffect(() => {
    if (isAuthenticated) {
      loadCart()
    }
  }, [isAuthenticated, loadCart])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}