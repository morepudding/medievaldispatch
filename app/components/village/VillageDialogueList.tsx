import React from 'react'
import { Button } from '../ui/Button'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../lib/constants/styles'
import type { Dialogue } from '../../types/game'

interface VillageDialogueListProps {
  isOpen: boolean
  onClose: () => void
  dialogues: Dialogue[]
  onSelectDialogue: (dialogue: Dialogue) => void
}

export const VillageDialogueList: React.FC<VillageDialogueListProps> = ({
  isOpen,
  onClose,
  dialogues,
  onSelectDialogue
}) => {
  if (!isOpen) return null

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
      animation: 'fadeIn 0.5s ease-in-out',
      padding: SPACING.md
    }}>
      <div style={{
        backgroundColor: COLORS.background.darkTransparent,
        border: `3px solid ${COLORS.primary.gold}`,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.xl,
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: SHADOWS.gold,
        animation: 'slideUp 0.5s ease-out'
      }}>
        {/* Titre */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: SPACING.lg,
          paddingBottom: SPACING.md,
          borderBottom: `2px solid ${COLORS.primary.gold}`
        }}>
          <h2 style={{
            fontSize: '32px',
            color: COLORS.primary.gold,
            fontWeight: 'bold',
            margin: 0
          }}>
            💬 Dialogues Disponibles
          </h2>
          <button
            onClick={onClose}
            style={{
              fontSize: '32px',
              color: COLORS.border.light,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: `${SPACING.xs} ${SPACING.sm}`,
              transition: 'all 0.2s',
              lineHeight: 1
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = COLORS.text.primary
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = COLORS.border.light
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            ×
          </button>
        </div>

        {/* Liste des dialogues */}
        {dialogues.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: SPACING.xl,
            color: COLORS.text.muted
          }}>
            <div style={{ fontSize: '48px', marginBottom: SPACING.md }}>📭</div>
            <p style={{ fontSize: '18px' }}>Aucun dialogue disponible pour le moment.</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: SPACING.md
          }}>
            {dialogues.map((dialogue) => {
              const heroPortrait = `/portraits/${dialogue.heroName.toLowerCase()}.png`
              
              return (
                <button
                  key={dialogue.id}
                  onClick={() => {
                    onClose()
                    onSelectDialogue(dialogue)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: SPACING.md,
                    padding: SPACING.md,
                    backgroundColor: dialogue.isRead 
                      ? 'rgba(50, 50, 50, 0.5)' 
                      : 'rgba(68, 136, 255, 0.2)',
                    border: dialogue.isRead 
                      ? `2px solid ${COLORS.border.default}` 
                      : '3px solid #4488ff',
                    borderRadius: BORDER_RADIUS.md,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'left',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)'
                    e.currentTarget.style.boxShadow = SHADOWS.md
                    e.currentTarget.style.backgroundColor = dialogue.isRead 
                      ? 'rgba(60, 60, 60, 0.6)' 
                      : 'rgba(68, 136, 255, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.backgroundColor = dialogue.isRead 
                      ? 'rgba(50, 50, 50, 0.5)' 
                      : 'rgba(68, 136, 255, 0.2)'
                  }}
                >
                  {/* Badge "Nouveau" */}
                  {!dialogue.isRead && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: COLORS.status.error,
                      color: 'white',
                      padding: `${SPACING.xs} 12px`,
                      borderRadius: BORDER_RADIUS.sm,
                      fontSize: '12px',
                      fontWeight: 'bold',
                      animation: 'bounce 1s infinite'
                    }}>
                      💬 NOUVEAU
                    </div>
                  )}

                  {/* Portrait du héros */}
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: dialogue.isRead ? `2px solid ${COLORS.border.default}` : '3px solid #4488ff',
                    flexShrink: 0,
                    opacity: dialogue.isRead ? 0.6 : 1
                  }}>
                    <img 
                      src={heroPortrait}
                      alt={dialogue.heroName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  {/* Infos du dialogue */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: dialogue.isRead ? COLORS.text.muted : '#4488ff',
                      marginBottom: '8px'
                    }}>
                      ⚔️ {dialogue.heroName}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: dialogue.isRead ? COLORS.border.light : COLORS.text.muted,
                      display: 'flex',
                      alignItems: 'center',
                      gap: SPACING.sm
                    }}>
                      <span>💬 {dialogue.exchanges.length} échange{dialogue.exchanges.length > 1 ? 's' : ''}</span>
                      {dialogue.isRead && (
                        <span style={{ color: COLORS.status.success }}>✓ Lu</span>
                      )}
                    </div>
                  </div>

                  {/* Flèche */}
                  <div style={{
                    fontSize: '24px',
                    color: dialogue.isRead ? COLORS.border.default : '#4488ff'
                  }}>
                    →
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Bouton Fermer */}
        <Button
          variant="secondary"
          fullWidth
          onClick={onClose}
          style={{ marginTop: SPACING.md }}
        >
          Retour au Village
        </Button>
      </div>
    </div>
  )
}
