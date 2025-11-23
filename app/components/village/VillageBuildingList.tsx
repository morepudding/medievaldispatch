import React from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../lib/constants/styles'
import type { Building } from '../../types/game'

interface VillageBuildingListProps {
  isOpen: boolean
  onClose: () => void
  buildings: Building[]
  currentGold: number
  onSelectBuilding: (building: Building) => void
}

export const VillageBuildingList: React.FC<VillageBuildingListProps> = ({
  isOpen,
  onClose,
  buildings,
  currentGold,
  onSelectBuilding
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
        border: `3px solid ${COLORS.status.warning}`,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.xl,
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 50px rgba(255, 193, 7, 0.4)',
        animation: 'slideUp 0.5s ease-out'
      }}>
        {/* Titre */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: SPACING.lg,
          paddingBottom: SPACING.md,
          borderBottom: `2px solid ${COLORS.status.warning}`
        }}>
          <h2 style={{
            fontSize: '32px',
            color: COLORS.status.warning,
            fontWeight: 'bold',
            margin: 0
          }}>
            🏰 Bâtiments du Village
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

        {/* Info or disponible */}
        <div style={{
          backgroundColor: 'rgba(139, 69, 19, 0.3)',
          border: `2px solid ${COLORS.primary.gold}`,
          borderRadius: BORDER_RADIUS.md,
          padding: `${SPACING.md} ${SPACING.md}`,
          marginBottom: SPACING.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ color: COLORS.text.secondary, fontSize: '16px' }}>
            💰 Or disponible :
          </span>
          <span style={{ 
            color: COLORS.primary.gold, 
            fontSize: '28px', 
            fontWeight: 'bold'
          }}>
            {currentGold} <span style={{ fontSize: '18px' }}>or</span>
          </span>
        </div>

        {/* Liste des bâtiments */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: SPACING.md
        }}>
          {buildings.map((building) => {
            const canUpgrade = building.level < building.maxLevel
            // Le coût pour upgrader est le coût du niveau suivant (level + 1)
            const upgradeCost = canUpgrade ? building.upgradeCosts[building.level + 1] : 0
            const hasEnoughGold = currentGold >= upgradeCost
            const canUpgradeNow = canUpgrade && hasEnoughGold
            const isMaxLevel = building.level >= building.maxLevel

            return (
              <button
                key={building.id}
                onClick={() => {
                  onClose()
                  onSelectBuilding(building)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: SPACING.md,
                  padding: SPACING.md,
                  backgroundColor: canUpgradeNow 
                    ? 'rgba(255, 193, 7, 0.2)' 
                    : isMaxLevel
                    ? 'rgba(40, 167, 69, 0.2)'
                    : 'rgba(50, 50, 50, 0.5)',
                  border: canUpgradeNow 
                    ? `3px solid ${COLORS.status.warning}` 
                    : isMaxLevel
                    ? `2px solid ${COLORS.status.success}`
                    : `2px solid ${COLORS.border.default}`,
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
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Badge "Amélioration disponible" */}
                {canUpgradeNow && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: COLORS.status.success,
                    color: 'white',
                    padding: `${SPACING.xs} 12px`,
                    borderRadius: BORDER_RADIUS.sm,
                    fontSize: '12px',
                    fontWeight: 'bold',
                    animation: 'bounce 1s infinite'
                  }}>
                    ✨ DISPONIBLE
                  </div>
                )}

                {/* Badge "Max Level" */}
                {isMaxLevel && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: COLORS.status.success,
                    color: 'white',
                    padding: `${SPACING.xs} 12px`,
                    borderRadius: BORDER_RADIUS.sm,
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    ✓ MAX
                  </div>
                )}

                {/* Icône du bâtiment */}
                <div style={{
                  fontSize: '64px',
                  flexShrink: 0,
                  opacity: isMaxLevel ? 1 : 0.8
                }}>
                  {building.icon}
                </div>

                {/* Infos du bâtiment */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: canUpgradeNow 
                      ? COLORS.status.warning 
                      : isMaxLevel 
                      ? COLORS.status.success 
                      : COLORS.text.muted,
                    marginBottom: '8px'
                  }}>
                    {building.name}
                  </div>
                  
                  <div style={{
                    fontSize: '14px',
                    color: COLORS.text.muted,
                    marginBottom: '10px'
                  }}>
                    {building.description}
                  </div>

                  {/* Barre de niveau */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: SPACING.sm,
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '12px', color: COLORS.text.muted }}>
                      Niveau {building.level}/{building.maxLevel}
                    </span>
                    <div style={{
                      flex: 1,
                      height: '6px',
                      backgroundColor: COLORS.background.card,
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(building.level / building.maxLevel) * 100}%`,
                        height: '100%',
                        backgroundColor: isMaxLevel ? COLORS.status.success : COLORS.status.warning,
                        transition: 'all 0.3s'
                      }} />
                    </div>
                  </div>

                  {/* Coût amélioration */}
                  {canUpgrade && (
                    <div style={{
                      fontSize: '14px',
                      color: hasEnoughGold ? COLORS.status.success : COLORS.status.error,
                      fontWeight: 'bold'
                    }}>
                      💰 Amélioration : {upgradeCost} or
                      {!hasEnoughGold && ' (insuffisant)'}
                    </div>
                  )}

                  {isMaxLevel && (
                    <div style={{
                      fontSize: '14px',
                      color: COLORS.status.success,
                      fontWeight: 'bold'
                    }}>
                      ✓ Niveau maximum atteint
                    </div>
                  )}
                </div>

                {/* Flèche */}
                <div style={{
                  fontSize: '24px',
                  color: canUpgradeNow ? COLORS.status.warning : COLORS.border.default
                }}>
                  →
                </div>
              </button>
            )
          })}
        </div>

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
