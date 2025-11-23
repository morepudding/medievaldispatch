import React from 'react'
import { Button } from '../ui/Button'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../lib/constants/styles'
import type { GameState } from '../../types/game'

interface VillageDaySummaryProps {
  isOpen: boolean
  onClose: () => void
  gameState: GameState
}

export const VillageDaySummary: React.FC<VillageDaySummaryProps> = ({
  isOpen,
  onClose,
  gameState
}) => {
  if (!isOpen) return null

  const unreadDialogues = gameState.availableDialogues.filter(d => !d.isRead).length
  const upgradableBuildings = gameState.buildings.filter(b => 
    b.level < b.maxLevel && gameState.gold >= b.upgradeCosts[b.level]
  ).length

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 3200,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.5s ease-in-out'
    }}>
      <div style={{
        backgroundColor: COLORS.background.darkTransparent,
        border: `3px solid ${COLORS.primary.gold}`,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.xl,
        maxWidth: '600px',
        width: '90%',
        boxShadow: SHADOWS.gold,
        animation: 'slideUp 0.5s ease-out'
      }}>
        {/* Titre */}
        <h1 style={{
          fontSize: '42px',
          color: COLORS.primary.gold,
          textAlign: 'center',
          marginBottom: SPACING.lg,
          fontWeight: 'bold',
          textShadow: `0 0 20px ${COLORS.primary.gold}`
        }}>
          🏰 Résumé du Jour {gameState.currentDay}
        </h1>

        {/* État du jour */}
        <div style={{
          backgroundColor: 'rgba(40, 167, 69, 0.2)',
          border: `2px solid ${COLORS.status.success}`,
          borderRadius: BORDER_RADIUS.md,
          padding: SPACING.md,
          marginBottom: SPACING.md,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
          <div style={{ fontSize: '24px', color: COLORS.status.success, fontWeight: 'bold' }}>
            Dispatch Terminé !
          </div>
          <div style={{ fontSize: '14px', color: '#90ee90', marginTop: SPACING.xs }}>
            Vos héros sont de retour au village
          </div>
        </div>

        {/* Or total */}
        <div style={{
          backgroundColor: 'rgba(139, 69, 19, 0.3)',
          border: `2px solid ${COLORS.primary.gold}`,
          borderRadius: BORDER_RADIUS.md,
          padding: SPACING.md,
          marginBottom: SPACING.md,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '16px', color: COLORS.text.secondary, marginBottom: '10px' }}>
            Or disponible
          </div>
          <div style={{
            fontSize: '48px',
            color: COLORS.primary.gold,
            fontWeight: 'bold'
          }}>
            💰 {gameState.gold} <span style={{ fontSize: '24px' }}>or</span>
          </div>
        </div>

        {/* Statistiques du jour */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: SPACING.md,
          marginBottom: SPACING.lg
        }}>
          {/* Nouveaux dialogues */}
          <div style={{
            backgroundColor: 'rgba(68, 136, 255, 0.2)',
            border: '2px solid #4488ff',
            borderRadius: BORDER_RADIUS.md,
            padding: SPACING.md,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: SPACING.xs }}>💬</div>
            <div style={{ fontSize: '28px', color: '#4488ff', fontWeight: 'bold' }}>
              {unreadDialogues}
            </div>
            <div style={{ fontSize: '12px', color: '#a0c8ff' }}>
              Nouveau{unreadDialogues > 1 ? 'x' : ''} dialogue{unreadDialogues > 1 ? 's' : ''}
            </div>
          </div>

          {/* Bâtiments améliorables */}
          <div style={{
            backgroundColor: 'rgba(255, 193, 7, 0.2)',
            border: `2px solid ${COLORS.status.warning}`,
            borderRadius: BORDER_RADIUS.md,
            padding: SPACING.md,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: SPACING.xs }}>✨</div>
            <div style={{ fontSize: '28px', color: COLORS.status.warning, fontWeight: 'bold' }}>
              {upgradableBuildings}
            </div>
            <div style={{ fontSize: '12px', color: '#ffe082' }}>
              Amélioration{upgradableBuildings > 1 ? 's' : ''} possible{upgradableBuildings > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Message */}
        <div style={{
          textAlign: 'center',
          marginBottom: SPACING.md
        }}>
          <div style={{
            fontSize: '16px',
            color: COLORS.text.muted,
            lineHeight: '1.6'
          }}>
            Explorez le village pour parler à vos héros<br/>
            et améliorer vos bâtiments !
          </div>
        </div>

        {/* Bouton Continuer */}
        <Button
          variant="success"
          size="lg"
          fullWidth
          onClick={onClose}
        >
          ➜ Continuer
        </Button>
      </div>
    </div>
  )
}
