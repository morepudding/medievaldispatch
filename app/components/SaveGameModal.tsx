'use client'

import { useState, useEffect } from 'react'
import { useGame } from '@/app/contexts/GameContext'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'

export function SaveGameModal() {
  const { saveId, createNewSave, loadSave, migrateLocalStorageSave, loading } = useGame()
  const [showModal, setShowModal] = useState(!saveId && !loading)
  const [playerName, setPlayerName] = useState('')
  const [creating, setCreating] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [hasLocalStorageSave, setHasLocalStorageSave] = useState(false)

  // Détecter si une sauvegarde localStorage existe
  useEffect(() => {
    const localSave = localStorage.getItem('medievalDispatch_gameState')
    const dbSaveId = localStorage.getItem('medievalDispatch_saveId')
    
    // Si pas de saveId DB mais qu'il y a une sauvegarde localStorage, proposer migration
    if (!dbSaveId && localSave) {
      setHasLocalStorageSave(true)
    }
  }, [])

  if (saveId || !showModal) return null

  const handleNewGame = async () => {
    setCreating(true)
    const newSaveId = await createNewSave(playerName || 'Joueur')
    if (newSaveId) {
      setShowModal(false)
    }
    setCreating(false)
  }

  const handleContinue = () => {
    const savedId = localStorage.getItem('medievalDispatch_saveId')
    if (savedId) {
      loadSave(savedId)
      setShowModal(false)
    }
  }

  const handleMigrate = async () => {
    setMigrating(true)
    const migratedSaveId = await migrateLocalStorageSave()
    if (migratedSaveId) {
      setShowModal(false)
    }
    setMigrating(false)
  }

  const hasSave = !!localStorage.getItem('medievalDispatch_saveId')

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {}}
      title="Medieval Dispatch"
    >
      <div className="space-y-6 p-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-amber-900 mb-2">
            🏰 Medieval Dispatch
          </h2>
          <p className="text-gray-600">
            Gérez vos héros et accomplissez des missions dans Phandalin
          </p>
        </div>

        {/* Migration localStorage */}
        {hasLocalStorageSave && !hasSave && (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💾</span>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-2">
                  Ancienne sauvegarde détectée !
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Nous avons trouvé une sauvegarde locale. Voulez-vous la migrer vers notre nouveau système de sauvegarde en ligne ?
                </p>
                <Button
                  onClick={handleMigrate}
                  variant="primary"
                  className="w-full"
                  disabled={migrating}
                >
                  {migrating ? '⏳ Migration en cours...' : '🔄 Migrer ma sauvegarde'}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Vos progrès seront conservés et synchronisés
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {hasSave && (
            <Button
              onClick={handleContinue}
              variant="primary"
              className="w-full py-4 text-lg"
            >
              ▶️ Continuer la partie
            </Button>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Nom du joueur (optionnel)
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Votre nom..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              disabled={creating || migrating}
            />
            <Button
              onClick={handleNewGame}
              variant="secondary"
              className="w-full py-4 text-lg"
              disabled={creating || migrating}
            >
              {creating ? '⏳ Création...' : '🆕 Nouvelle partie'}
            </Button>
          </div>
        </div>

        {(hasSave || hasLocalStorageSave) && (
          <div className="text-center text-sm text-gray-500 mt-4">
            ⚠️ Une nouvelle partie remplacera votre sauvegarde actuelle
          </div>
        )}
      </div>
    </Modal>
  )
}
