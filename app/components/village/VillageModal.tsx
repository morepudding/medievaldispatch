'use client'

import { useState } from 'react'
import { useGame } from '../../contexts/GameContext'
import { Button } from '../ui/Button'
import DayCounter from '../DayCounter'
import { VillageDaySummary } from './VillageDaySummary'
import { VillageDialogueList } from './VillageDialogueList'
import { VillageBuildingList } from './VillageBuildingList'
import VillagePlacementsList from './VillagePlacementsList'
import VillagePlacementMode from './VillagePlacementMode'
import VillageConfirmationModals from './VillageConfirmationModals'
import { COLORS, SHADOWS, SPACING, TRANSITIONS, BORDER_RADIUS, Z_INDEX } from '../../lib/constants/styles'
import type { Dialogue, Building, VillageHeroPlacement } from '../../types/game'

interface VillageModalProps {
  isOpen: boolean
  onClose: () => void
  villagePlacements: VillageHeroPlacement[]
  onPlacementChange: (placements: VillageHeroPlacement[]) => void
  onSelectDialogue: (dialogue: Dialogue) => void
  onSelectBuildingUpgrade: (building: Building) => void
  onShowHeroModal: (placement: VillageHeroPlacement) => void
  onShowBuildingModal: (placement: VillageHeroPlacement) => void
  showDaySummary?: boolean
}

export default function VillageModal({
  isOpen,
  onClose,
  villagePlacements,
  onPlacementChange,
  onSelectDialogue,
  onSelectBuildingUpgrade,
  onShowHeroModal,
  onShowBuildingModal,
  showDaySummary = false
}: VillageModalProps) {
  const { gameState, nextDay, resetGame } = useGame()
  
  // États UI (réduits à l'essentiel)
  const [isPlacementMode, setIsPlacementMode] = useState(false)
  const [pendingPlacement, setPendingPlacement] = useState<{x: number, y: number} | null>(null)
  const [hoveredPlacement, setHoveredPlacement] = useState<number | null>(null)
  const [showPointMenu, setShowPointMenu] = useState<number | null>(null)
  const [displayDaySummary, setDisplayDaySummary] = useState(showDaySummary)
  const [showDialogueList, setShowDialogueList] = useState(false)
  const [showBuildingList, setShowBuildingList] = useState(false)
  const [showNextDayConfirmation, setShowNextDayConfirmation] = useState(false)
  const [showResetConfirmation, setShowResetConfirmation] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  if (!isOpen) return null
  
  const handleVillageImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlacementMode) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setPendingPlacement({ x, y })
  }
  
  const handlePlaceHero = (heroSrc: string, heroAlt: string, buildingName: string) => {
    if (!pendingPlacement) return
    
    const newPlacement: VillageHeroPlacement = {
      x: pendingPlacement.x,
      y: pendingPlacement.y,
      heroSrc,
      heroAlt,
      buildingName
    }
    
    onPlacementChange([...villagePlacements, newPlacement])
    setPendingPlacement(null)
  }
  
  const handleDeletePlacement = (index: number) => {
    const updatedPlacements = villagePlacements.filter((_, i) => i !== index)
    onPlacementChange(updatedPlacements)
  }
  
  const handleExitVillage = () => {
    setIsPlacementMode(false)
    setPendingPlacement(null)
    setShowPointMenu(null)
    onClose()
  }

  const handleConfirmNextDay = () => {
    setIsTransitioning(true)
    setShowNextDayConfirmation(false)
    
    // Animation de transition
    setTimeout(() => {
      nextDay()
      setIsTransitioning(false)
      onClose()
      
      // Message de confirmation
      const message = document.createElement('div')
      message.textContent = `🌅 Jour ${gameState.currentDay + 1} commence !`
      message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(40, 167, 69, 0.95);
        color: white;
        padding: 25px 40px;
        border-radius: 15px;
        font-size: 24px;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 10px 40px rgba(40, 167, 69, 0.6);
        animation: fadeIn 0.5s ease-in-out;
      `
      document.body.appendChild(message)
      
      setTimeout(() => {
        message.style.animation = 'fadeOut 0.5s ease-in-out'
        setTimeout(() => message.remove(), 500)
      }, 2000)
    }, 800)
  }

  const handleConfirmReset = () => {
    setShowResetConfirmation(false)
    setIsTransitioning(true)
    
    setTimeout(() => {
      resetGame()
      setIsTransitioning(false)
      onClose()
      
      // Message de confirmation
      const message = document.createElement('div')
      message.textContent = '🔄 Partie réinitialisée !'
      message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(40, 167, 69, 0.95);
        color: white;
        padding: 25px 40px;
        border-radius: 15px;
        font-size: 24px;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 10px 40px rgba(40, 167, 69, 0.6);
        animation: fadeIn 0.5s ease-in-out;
      `
      document.body.appendChild(message)
      
      setTimeout(() => {
        message.style.animation = 'fadeOut 0.5s ease-in-out'
        setTimeout(() => message.remove(), 500)
      }, 2000)
    }, 500)
  }
  
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: Z_INDEX.tooltip,
      backgroundColor: COLORS.text.dark,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Panneaux latéraux */}
      <VillageDaySummary
        isOpen={displayDaySummary}
        onClose={() => setDisplayDaySummary(false)}
        gameState={gameState}
      />

      <VillageDialogueList
        isOpen={showDialogueList}
        onClose={() => setShowDialogueList(false)}
        dialogues={gameState.availableDialogues}
        onSelectDialogue={(dialogue) => {
          setShowDialogueList(false)
          onSelectDialogue(dialogue)
        }}
      />

      <VillageBuildingList
        isOpen={showBuildingList}
        onClose={() => setShowBuildingList(false)}
        buildings={gameState.buildings}
        currentGold={gameState.gold}
        onSelectBuilding={(building) => {
          setShowBuildingList(false)
          onSelectBuildingUpgrade(building)
        }}
      />

      {/* Compteur de jours */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 3100
      }}>
        <DayCounter currentDay={gameState.currentDay} />
      </div>

      {/* Bouton Retour */}
      <button
        onClick={handleExitVillage}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '15px 30px',
          backgroundColor: COLORS.accent.brown,
          color: 'white',
          border: 'none',
          borderRadius: BORDER_RADIUS.pill,
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          boxShadow: SHADOWS.error,
          zIndex: 3100,
          transition: TRANSITIONS.medium,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.boxShadow = SHADOWS.errorLg
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = SHADOWS.error
        }}
      >
        <span style={{ fontSize: '24px' }}>←</span>
        Retour à la carte
      </button>

      {/* Bouton Jour Suivant */}
      <button
        onClick={() => setShowNextDayConfirmation(true)}
        disabled={gameState.isInDispatch}
        style={{
          position: 'absolute',
          top: '90px',
          left: '20px',
          padding: '15px 30px',
          backgroundColor: gameState.isInDispatch ? COLORS.background.grey : COLORS.status.success,
          color: 'white',
          border: 'none',
          borderRadius: BORDER_RADIUS.pill,
          cursor: gameState.isInDispatch ? 'not-allowed' : 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          boxShadow: SHADOWS.md,
          zIndex: 3100,
          transition: TRANSITIONS.medium,
          opacity: gameState.isInDispatch ? 0.5 : 1
        }}
        onMouseEnter={(e) => {
          if (!gameState.isInDispatch) {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = SHADOWS.successXl
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = SHADOWS.md
        }}
      >
        🌅 Jour Suivant
      </button>

      {/* Bouton Dialogues */}
      <button
        onClick={() => setShowDialogueList(true)}
        style={{
          position: 'absolute',
          top: '160px',
          left: '20px',
          padding: '12px 25px',
          backgroundColor: COLORS.background.cardDark,
          color: 'white',
          border: 'none',
          borderRadius: BORDER_RADIUS.md,
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: SHADOWS.sm,
          zIndex: 3100,
          transition: TRANSITIONS.medium
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.backgroundColor = COLORS.background.greyDark
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.backgroundColor = COLORS.background.cardDark
        }}
      >
        💬 Dialogues
      </button>

      {/* Bouton Bâtiments */}
      <button
        onClick={() => setShowBuildingList(true)}
        style={{
          position: 'absolute',
          top: '215px',
          left: '20px',
          padding: '12px 25px',
          backgroundColor: COLORS.background.cardDark,
          color: 'white',
          border: 'none',
          borderRadius: BORDER_RADIUS.md,
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: SHADOWS.sm,
          zIndex: 3100,
          transition: TRANSITIONS.medium
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.backgroundColor = COLORS.background.greyDark
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.backgroundColor = COLORS.background.cardDark
        }}
      >
        🏛️ Bâtiments
      </button>

      {/* Bouton Mode Placement */}
      <button
        onClick={() => {
          setIsPlacementMode(!isPlacementMode)
          setPendingPlacement(null)
        }}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          padding: '15px 30px',
          backgroundColor: isPlacementMode ? '#ff6b35' : '#4a4a4a',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          boxShadow: SHADOWS.md,
          zIndex: 3100,
          transition: TRANSITIONS.medium,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.boxShadow = SHADOWS.errorLg
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = SHADOWS.md
        }}
      >
        <span style={{ fontSize: '24px' }}>{isPlacementMode ? '✏️' : '📍'}</span>
        {isPlacementMode ? 'Mode Placement' : 'Placer les héros'}
      </button>

      {/* Bouton Reset Save (debug) */}
      <button
        onClick={() => setShowResetConfirmation(true)}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 3100,
          backgroundColor: 'rgba(220, 53, 69, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '2px solid #dc3545',
          borderRadius: '10px',
          padding: '12px 20px',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: TRANSITIONS.medium,
          boxShadow: SHADOWS.md,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 1)'
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.boxShadow = SHADOWS.errorLg
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.8)'
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = SHADOWS.md
        }}
      >
        <span style={{ fontSize: '18px' }}>🔄</span>
        <span>Reset Save</span>
      </button>

      {/* Image village + Points lumineux */}
      <div 
        style={{
          position: 'relative',
          display: 'inline-block',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        <img 
          src="/lieux/Phandallin.png" 
          alt="Phandallin Village" 
          onClick={handleVillageImageClick}
          style={{ 
            maxWidth: '100%',
            maxHeight: '100vh',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
            userSelect: 'none',
            cursor: isPlacementMode ? 'crosshair' : 'default'
          }}
          draggable={false}
        />
        
        {/* Points lumineux des héros placés */}
        <VillagePlacementsList
          placements={villagePlacements}
          isPlacementMode={isPlacementMode}
          hoveredIndex={hoveredPlacement}
          menuOpenIndex={showPointMenu}
          gameState={gameState}
          onPointHover={setHoveredPlacement}
          onPointClick={setShowPointMenu}
          onPointDelete={handleDeletePlacement}
          onSelectDialogue={onSelectDialogue}
          onSelectBuildingUpgrade={onSelectBuildingUpgrade}
          onShowHeroModal={onShowHeroModal}
          onShowBuildingModal={onShowBuildingModal}
        />
      </div>

      {/* Modal de placement et confirmations */}
      <VillagePlacementMode
        isOpen={!!pendingPlacement}
        pendingPosition={pendingPlacement}
        onPlace={handlePlaceHero}
        onCancel={() => setPendingPlacement(null)}
      />

      <VillageConfirmationModals
        showNextDay={showNextDayConfirmation}
        showReset={showResetConfirmation}
        currentDay={gameState.currentDay}
        isTransitioning={isTransitioning}
        gameState={gameState}
        onConfirmNextDay={handleConfirmNextDay}
        onConfirmReset={handleConfirmReset}
        onCancelNextDay={() => setShowNextDayConfirmation(false)}
        onCancelReset={() => setShowResetConfirmation(false)}
      />
    </div>
  )
}
