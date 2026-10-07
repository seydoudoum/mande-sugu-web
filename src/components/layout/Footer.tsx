import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#1A2B4A] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Aide */}
          <div>
            <h3 className="font-bold mb-4 text-[#FF6A00]">Aide</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/help" className="hover:text-white transition">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:text-white transition">
                  Livraison
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition">
                  Retours
                </Link>
              </li>
            </ul>
          </div>

          {/* Vendre */}
          <div>
            <h3 className="font-bold mb-4 text-[#FF6A00]">Vendre</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/become-seller" className="hover:text-white transition">
                  Devenir vendeur
                </Link>
              </li>
              <li>
                <Link to="/seller-guide" className="hover:text-white transition">
                  Guide vendeur
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition">
                  Tarifs
                </Link>
              </li>
            </ul>
          </div>

          {/* Paiement */}
          <div>
            <h3 className="font-bold mb-4 text-[#FF6A00]">Paiement</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Orange Money</li>
              <li>Wave</li>
              <li>Moov Money</li>
              <li>Carte bancaire</li>
            </ul>
          </div>

          {/* Suivez-nous */}
          <div>
            <h3 className="font-bold mb-4 text-[#FF6A00]">Suivez-nous</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>📘 Facebook</li>
              <li>📷 Instagram</li>
              <li>🎵 TikTok</li>
              <li>💬 WhatsApp</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              MANDÉ <span className="text-[#FF6A00]">SUGU</span>
            </span>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Mande Sugu. Tous droits réservés.
          </p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link to="/terms" className="hover:text-white transition">
              Conditions
            </Link>
            <Link to="/privacy" className="hover:text-white transition">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}