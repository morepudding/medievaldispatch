import type { Metadata } from 'next'
import './globals.css'
import './styles/animations.css'
import { GameProvider } from './contexts/GameContext'
import GameLoader from './components/GameLoader'

export const metadata: Metadata = {
  title: 'Medieval Dispatch',
  description: 'Interactive medieval map',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <GameProvider>
          <GameLoader>
            {children}
          </GameLoader>
        </GameProvider>
      </body>
    </html>
  )
}
