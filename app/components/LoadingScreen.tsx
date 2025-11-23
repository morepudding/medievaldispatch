import React from 'react'

interface LoadingScreenProps {
  error?: string | null
  onRetry?: () => void
}

export default function LoadingScreen({ error, onRetry }: LoadingScreenProps) {
  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-amber-900 via-stone-800 to-slate-900 flex items-center justify-center z-50">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          {/* Icône d'erreur */}
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          
          {/* Titre */}
          <h1 className="text-3xl font-bold text-amber-100 mb-4">
            Erreur de chargement
          </h1>
          
          {/* Message d'erreur */}
          <p className="text-amber-200/80 text-lg mb-6">
            {error}
          </p>
          
          {/* Bouton réessayer */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              🔄 Réessayer
            </button>
          )}
          
          {/* Conseil technique */}
          <p className="text-amber-300/60 text-sm mt-4">
            Vérifiez votre connexion et que le serveur est démarré
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-900 via-stone-800 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        {/* Logo/Icône */}
        <div className="text-6xl mb-4 animate-bounce">
          🏰
        </div>
        
        {/* Titre */}
        <h1 className="text-4xl font-bold text-amber-100 mb-4">
          Medieval Dispatch
        </h1>
        
        {/* Spinner */}
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
        </div>
        
        {/* Message de chargement */}
        <p className="text-amber-200/80 text-lg">
          Chargement de Medieval Dispatch...
        </p>
        
        {/* Sous-texte */}
        <p className="text-amber-300/60 text-sm">
          Préparation de vos héros et missions
        </p>
      </div>
    </div>
  )
}
