'use client'

import { useGame } from '../contexts/GameContext'
import LoadingScreen from './LoadingScreen'
import { SaveGameModal } from './SaveGameModal'

export default function GameLoader({ children }: { children: React.ReactNode }) {
  const { loading, error, retryLoading } = useGame()

  if (loading || error) {
    return <LoadingScreen error={error} onRetry={retryLoading} />
  }

  return (
    <>
      <SaveGameModal />
      {children}
    </>
  )
}
