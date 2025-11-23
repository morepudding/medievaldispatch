'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from './contexts/GameContext'
import { Button } from './components/ui/Button'
import DayCounter from './components/DayCounter'
import DialogueModal from './components/DialogueModal'
import BuildingUpgradeModal from './components/BuildingUpgradeModal'
import VillageModal from './components/village/VillageModal'
import HeroStatsModal from './components/village/HeroStatsModal'
import BuildingInfoModal from './components/village/BuildingInfoModal'
import Breadcrumb from './components/Breadcrumb'
import GameStateIndicator from './components/GameStateIndicator'
import { ToastContainer, useToast } from './components/Toast'
import { HERO_PORTRAITS } from './data/portraits'
import { StorageManager } from './lib/utils/storage'
import { COLORS, SHADOWS, SPACING, TRANSITIONS, BORDER_RADIUS, Z_INDEX } from './lib/constants/styles'
import type { Dialogue, Building, VillageHeroPlacement } from './types/game'

interface Stamp {
  id: string
  src: string
  alt: string
  x: number
  y: number
  width: number
  zIndex: number
}

const AVAILABLE_STAMPS = [
  { src: '/lieux/foret-removebg-preview.png', alt: 'Forest', width: 250 },
  { src: '/lieux/grotte.png', alt: 'Cave', width: 250 },
  { src: '/lieux/ruines.png', alt: 'Ruins', width: 250 },
  { src: '/lieux/village.png', alt: 'Village', width: 400 },
  { src: '/lieux/montagne.png', alt: 'Mountain', width: 300 },
  { src: '/lieux/port.png', alt: 'Port', width: 300 }
]

export default function Home() {
  const router = useRouter()
  const { startDispatch, gameState, markDialogueAsRead, upgradeBuilding } = useGame()
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast()
  
  const [stamps, setStamps] = useState<Stamp[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)
  
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null)
  const [hoveredStamp, setHoveredStamp] = useState<string | null>(null)
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [snapToGrid, setSnapToGrid] = useState(true)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  
  // Mode Village
  const [isInVillage, setIsInVillage] = useState(false)
  const [showHeroModal, setShowHeroModal] = useState<VillageHeroPlacement | null>(null)
  const [showBuildingModal, setShowBuildingModal] = useState<VillageHeroPlacement | null>(null)
  
  // Dialogues et bâtiments
  const [selectedDialogue, setSelectedDialogue] = useState<Dialogue | null>(null)
  const [selectedBuildingForUpgrade, setSelectedBuildingForUpgrade] = useState<Building | null>(null)
  
  const [villagePlacements, setVillagePlacements] = useState<VillageHeroPlacement[]>([])
  
  const [showDaySummary, setShowDaySummary] = useState(false)

  // Ouvrir village depuis URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('openVillage') === 'true') {
        setIsInVillage(true)
        setShowDaySummary(true) // Afficher le résumé quand on revient du dispatch
        window.history.replaceState({}, '', '/')
      }
    }
  }, [])

  // Page fade-in animation
  useEffect(() => {
    setTimeout(() => setFadeIn(true), 50)
  }, [])

  // Charger placements village
  useEffect(() => {
    const savedPlacements = StorageManager.loadVillagePlacements()
    if (savedPlacements) {
      setVillagePlacements(savedPlacements)
    }
  }, [])

  // Sauvegarder placements village
  useEffect(() => {
    if (isLoaded) {
      StorageManager.saveVillagePlacements(villagePlacements)
    }
  }, [villagePlacements, isLoaded])

  // Charger stamps
  useEffect(() => {
    const saved = StorageManager.loadStamps()
    if (saved) {
      const needsMigration = saved.some((stamp) => 
        !stamp.src.includes('/lieux/') && 
        !stamp.src.includes('/portraits/') && 
        !stamp.src.includes('/frame.png')
      )
      
      if (needsMigration) {
        const migratedStamps = saved.map((stamp) => {
          let newSrc = stamp.src
          if (stamp.src.includes('foret') || stamp.src.includes('grotte') || 
              stamp.src.includes('ruines') || stamp.src.includes('village') || 
              stamp.src.includes('montagne') || stamp.src.includes('port')) {
            newSrc = stamp.src.replace(/^\//, '/lieux/')
          }
          if (stamp.src.includes('bjorn') || stamp.src.includes('owen') || 
              stamp.src.includes('vi') || stamp.src.includes('portrait-test')) {
            newSrc = stamp.src.replace(/^\//, '/portraits/')
          }
          return { ...stamp, src: newSrc }
        })
        setStamps(migratedStamps)
        StorageManager.saveStamps(migratedStamps)
      } else {
        setStamps(saved)
      }
    } else {
      // Première visite - données par défaut
      const defaultStamps: Stamp[] = [
        { id: '1', src: '/lieux/foret-removebg-preview.png', alt: 'Forest', x: 10, y: 10, width: 250, zIndex: 3 },
        { id: '2', src: '/lieux/grotte.png', alt: 'Cave', x: 75, y: 10, width: 250, zIndex: 3 },
        { id: '3', src: '/lieux/ruines.png', alt: 'Ruins', x: 10, y: 60, width: 250, zIndex: 3 },
        { id: '4', src: '/lieux/village.png', alt: 'Village', x: 50, y: 50, width: 400, zIndex: 5 }
      ]
      
      const frameY = 85
      for (let i = 0; i < 8; i++) {
        const frameX = 10 + (i * 10)
        defaultStamps.push({
          id: `frame-${i}`,
          src: '/frame.png',
          alt: `Frame ${i + 1}`,
          x: frameX,
          y: frameY,
          width: 180,
          zIndex: 10 + i
        })
      }
      
      defaultStamps.push({
        id: 'bjorn-portrait',
        src: '/portraits/bjorn.png',
        alt: 'Bjorn',
        x: 10,
        y: frameY,
        width: 140,
        zIndex: 20
      })
      
      setStamps(defaultStamps)
    }
    setIsLoaded(true)
  }, [])

  // Sauvegarder stamps
  useEffect(() => {
    if (isLoaded) {
      StorageManager.saveStamps(stamps)
    }
  }, [stamps, isLoaded])

  const handleStampMouseDown = (id: string, e: React.MouseEvent) => {
    if (!isEditMode) return
    e.preventDefault()
    const stamp = stamps.find(s => s.id === id)
    if (!stamp) return

    const rect = e.currentTarget.getBoundingClientRect()
    
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setSelectedStamp(id)

    setStamps(prev => prev.map(s => 
      s.id === id ? { ...s, zIndex: Math.max(...prev.map(st => st.zIndex)) + 1 } : s
    ))
  }

  const handleStampClick = (id: string, e: React.MouseEvent) => {
    if (!isEditMode) return
    e.stopPropagation()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selectedStamp) return

    const container = e.currentTarget as HTMLElement
    const rect = container.getBoundingClientRect()
    
    let x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100
    let y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100

    if (snapToGrid) {
      const snapThreshold = 1
      stamps.forEach(stamp => {
        if (stamp.id !== selectedStamp) {
          if (Math.abs(x - stamp.x) < snapThreshold) {
            x = stamp.x
          }
          if (Math.abs(y - stamp.y) < snapThreshold) {
            y = stamp.y
          }
        }
      })
    }

    setStamps(prev => prev.map(s => 
      s.id === selectedStamp ? { ...s, x, y } : s
    ))
  }

  const handleMouseUp = () => {
    setSelectedStamp(null)
  }

  const handleDeleteStamp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setStamps(prev => prev.filter(s => s.id !== id))
  }

  const handleAddStamp = (src: string, alt: string, width: number) => {
    const newStamp: Stamp = {
      id: Date.now().toString(),
      src,
      alt,
      x: 50,
      y: 50,
      width,
      zIndex: Math.max(...stamps.map(s => s.zIndex), 0) + 1
    }
    setStamps(prev => [...prev, newStamp])
    setIsPaletteOpen(false)
  }

  const handleResizeStamp = (id: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setStamps(prev => prev.map(s => 
      s.id === id ? { ...s, width: Math.max(100, Math.min(600, s.width + delta)) } : s
    ))
  }

  const handleAlignFrames = () => {
    const portraitStamps = stamps.filter(s => s.src.includes('/portraits/'))
    if (portraitStamps.length === 0) return

    const portraitWidth = 180
    const spacing = 5
    const totalWidth = (portraitStamps.length * (portraitWidth / window.innerWidth * 100)) + ((portraitStamps.length - 1) * spacing)
    const startX = (100 - totalWidth) / 2

    const updatedStamps = stamps.map(stamp => {
      if (stamp.src.includes('/portraits/')) {
        const index = portraitStamps.findIndex(p => p.id === stamp.id)
        if (index !== -1) {
          return {
            ...stamp,
            x: startX + (index * ((portraitWidth / window.innerWidth * 100) + spacing)),
            y: 85,
            width: portraitWidth
          }
        }
      }
      return stamp
    })

    setStamps(updatedStamps)
  }

  const handleResetMap = () => {
    if (confirm('Voulez-vous vraiment réinitialiser la carte ? Toutes vos modifications seront perdues.')) {
      const defaultStamps: Stamp[] = [
        { id: Date.now().toString(), src: '/lieux/foret-removebg-preview.png', alt: 'Forest', x: 10, y: 10, width: 250, zIndex: 3 },
        { id: (Date.now() + 1).toString(), src: '/lieux/grotte.png', alt: 'Cave', x: 75, y: 10, width: 250, zIndex: 3 },
        { id: (Date.now() + 2).toString(), src: '/lieux/ruines.png', alt: 'Ruins', x: 10, y: 60, width: 250, zIndex: 3 },
        { id: (Date.now() + 3).toString(), src: '/lieux/village.png', alt: 'Village', x: 50, y: 50, width: 400, zIndex: 5 }
      ]
      
      const frameY = 85
      for (let i = 0; i < 8; i++) {
        const frameX = 10 + (i * 10)
        defaultStamps.push({
          id: `frame-${i}-${Date.now()}`,
          src: '/frame.png',
          alt: `Frame ${i + 1}`,
          x: frameX,
          y: frameY,
          width: 180,
          zIndex: 10 + i
        })
      }
      
      defaultStamps.push({
        id: `bjorn-${Date.now()}`,
        src: '/portraits/bjorn.png',
        alt: 'Bjorn',
        x: 10,
        y: frameY,
        width: 140,
        zIndex: 20
      })
      
      setStamps(defaultStamps)
      StorageManager.saveStamps(defaultStamps)
    }
  }

  const handleVillageClick = () => {
    setIsInVillage(true)
  }

  if (!isLoaded) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background.dark
      }}>
        <div style={{ fontSize: '24px', color: COLORS.text.secondary }}>Chargement...</div>
      </div>
    )
  }

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      opacity: fadeIn ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out'
    }}>
      <style>{`
        @keyframes fadeInPage {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Breadcrumb */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 2000
      }}>
        <Breadcrumb items={[
          { label: 'Hub', icon: '🏠' }
        ]} />
      </div>

      {/* Game State Indicator */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 2000
      }}>
        <GameStateIndicator />
      </div>

      {/* Village Modal */}
      <VillageModal
        isOpen={isInVillage}
        onClose={() => {
          setIsInVillage(false)
          setShowDaySummary(false) // Réinitialiser quand on ferme le village
        }}
        villagePlacements={villagePlacements}
        onPlacementChange={setVillagePlacements}
        onSelectDialogue={setSelectedDialogue}
        onSelectBuildingUpgrade={setSelectedBuildingForUpgrade}
        onShowHeroModal={setShowHeroModal}
        onShowBuildingModal={setShowBuildingModal}
        showDaySummary={showDaySummary}
      />
      
      {/* Modals Stats */}
      <HeroStatsModal
        placement={showHeroModal}
        onClose={() => setShowHeroModal(null)}
      />
      
      <BuildingInfoModal
        placement={showBuildingModal}
        onClose={() => setShowBuildingModal(null)}
      />
      
      {/* Dialogue Modal */}
      {selectedDialogue && (
        <DialogueModal
          dialogue={selectedDialogue}
          onClose={() => {
            if (!selectedDialogue.isRead) {
              markDialogueAsRead(selectedDialogue.id)
            }
            setSelectedDialogue(null)
          }}
        />
      )}
      
      {/* Building Upgrade Modal */}
      {selectedBuildingForUpgrade && (
        <BuildingUpgradeModal
          building={selectedBuildingForUpgrade}
          currentGold={gameState.gold}
          onUpgrade={() => {
            const success = upgradeBuilding(selectedBuildingForUpgrade.id)
            if (success) {
              showSuccess(`${selectedBuildingForUpgrade.name} amélioré au niveau ${selectedBuildingForUpgrade.level + 1} !`)
              setSelectedBuildingForUpgrade(null)
            } else {
              showError('Or insuffisant pour améliorer ce bâtiment')
            }
          }}
          onClose={() => setSelectedBuildingForUpgrade(null)}
        />
      )}
      
      {/* Carte principale */}
      {!isInVillage && (
        <>
      {/* Carte de fond */}
      <div 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          userSelect: 'none'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img 
          src="/map.webp" 
          alt="Map" 
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none'
          }}
        />
        
        {/* Stamps dynamiques */}
        {stamps.map((stamp) => {
          const isVillage = stamp.src === '/lieux/village.png'
          return (
          <div
            key={stamp.id}
            onMouseDown={(e) => handleStampMouseDown(stamp.id, e)}
            onMouseEnter={() => setHoveredStamp(stamp.id)}
            onMouseLeave={() => setHoveredStamp(null)}
            onClick={(e) => {
              if (isVillage && !isEditMode) {
                handleVillageClick()
              } else {
                handleStampClick(stamp.id, e)
              }
            }}
            style={{ 
              position: 'absolute',
              left: `${stamp.x}%`,
              top: `${stamp.y}%`,
              transform: 'translate(-50%, -50%)',
              width: `${stamp.width}px`,
              cursor: isEditMode ? (selectedStamp === stamp.id ? 'grabbing' : 'grab') : 'default',
              zIndex: stamp.zIndex,
              userSelect: 'none',
              filter: isEditMode && hoveredStamp === stamp.id ? 'brightness(1.1) drop-shadow(0 0 10px rgba(255,255,255,0.8))' : 'none',
              transition: TRANSITIONS.default
            }}
          >
            <img 
              src={stamp.src}
              alt={stamp.alt}
              style={{ 
                width: '100%',
                height: 'auto',
                pointerEvents: 'none'
              }}
              draggable={false}
            />
            
            {/* Controls en mode édition */}
            {isEditMode && hoveredStamp === stamp.id && (
              <>
                <button
                  onClick={(e) => handleDeleteStamp(stamp.id, e)}
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.status.error,
                    color: 'white',
                    border: `2px solid ${COLORS.background.primary}`,
                    cursor: 'pointer',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: SHADOWS.md,
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  ×
                </button>
                
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '-10px',
                  display: 'flex',
                  gap: '5px'
                }}>
                  <button
                    onClick={(e) => handleResizeStamp(stamp.id, -30, e)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: COLORS.primary.gold,
                      color: 'white',
                      border: `2px solid ${COLORS.background.primary}`,
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: SHADOWS.md,
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    −
                  </button>
                  <button
                    onClick={(e) => handleResizeStamp(stamp.id, 30, e)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: COLORS.primary.gold,
                      color: 'white',
                      border: `2px solid ${COLORS.background.primary}`,
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: SHADOWS.md,
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    +
                  </button>
                </div>
              </>
            )}
          </div>
        )})}
        
        {/* Indicateur village */}
        {!isEditMode && stamps.find(s => s.src === '/lieux/village.png') && (
          <div
            style={{
              position: 'absolute',
              left: `${stamps.find(s => s.src === '/lieux/village.png')!.x}%`,
              top: `${stamps.find(s => s.src === '/lieux/village.png')!.y - 8}%`,
              transform: 'translate(-50%, -100%)',
              cursor: 'pointer',
              zIndex: 1000,
              animation: 'bounce 1s infinite'
            }}
            onClick={handleVillageClick}
          >
            <div style={{
              width: '50px',
              height: '50px',
              backgroundColor: COLORS.status.infoBlue,
              borderRadius: BORDER_RADIUS.full,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 'bold',
              color: COLORS.text.light,
              border: `3px solid ${COLORS.border.primary}`,
              boxShadow: SHADOWS.lg
            }}>
              !
            </div>
          </div>
        )}
        
      </div>
      
      {/* Bouton Launch Dispatch */}
      <Button
        variant="success"
        size="lg"
        onClick={() => {
          startDispatch()
          router.push('/dispatch')
        }}
        icon={<span style={{ fontSize: '24px' }}>⚔️</span>}
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
        }}
      >
        Launch Dispatch
      </Button>
      
      {/* Day Counter */}
      <DayCounter currentDay={gameState.currentDay} />
      
      {/* Bouton Mode Édition */}
      <Button
        variant={isEditMode ? 'danger' : 'secondary'}
        onClick={() => setIsEditMode(!isEditMode)}
        icon={<span style={{ fontSize: '20px' }}>{isEditMode ? '🔓' : '🔒'}</span>}
        style={{
          position: 'absolute',
          top: '150px',
          right: '20px',
          zIndex: 100,
        }}
      >
        {isEditMode ? 'Mode Édition' : 'Mode Lecture'}
      </Button>
      
      {/* Bouton Réinitialiser */}
      {isEditMode && (
        <>
          <Button
            variant="danger"
            onClick={handleResetMap}
            icon={<span style={{ fontSize: '20px' }}>🔄</span>}
            style={{
              position: 'absolute',
              top: '20px',
              right: '220px',
              zIndex: 100,
            }}
          >
            Réinitialiser
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleAlignFrames}
            icon={<span style={{ fontSize: '20px' }}>👤</span>}
            style={{
              position: 'absolute',
              top: '80px',
              right: '20px',
              zIndex: 100,
            }}
          >
            Aligner Portraits
          </Button>
          
          <Button
            variant={snapToGrid ? 'success' : 'secondary'}
            onClick={() => setSnapToGrid(!snapToGrid)}
            icon={<span style={{ fontSize: '20px' }}>�</span>}
            style={{
              position: 'absolute',
              top: '140px',
              right: '20px',
              zIndex: 100,
            }}
          >
            {snapToGrid ? 'Magnétisme ON' : 'Magnétisme OFF'}
          </Button>
        </>
      )}
      
      {/* Bouton Ajouter Stamp */}
      {isEditMode && (
        <Button
          variant="success"
          onClick={() => setIsPaletteOpen(!isPaletteOpen)}
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            fontSize: '32px',
            zIndex: 100,
          }}
        >
          +
        </Button>
      )}
      
      {/* Palette de stamps */}
      {isPaletteOpen && isEditMode && (
        <div style={{
          position: 'absolute',
          bottom: '110px',
          right: '30px',
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          padding: '15px',
          backgroundColor: COLORS.background.overlayLight,
          borderRadius: BORDER_RADIUS.lg,
          boxShadow: SHADOWS.xl,
          zIndex: Z_INDEX.modal,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <style>{`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: COLORS.text.darkPrimary,
              marginBottom: '10px',
              textAlign: 'center',
              borderBottom: `2px solid ${COLORS.accent.brown}`,
              paddingBottom: '5px'
            }}>
              👤 Personnages
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
              {HERO_PORTRAITS.map((stamp, i) => (
                <div
                  key={`portrait-${i}`}
                  onClick={() => handleAddStamp(stamp.src, stamp.alt, stamp.width)}
                  style={{
                    width: '100px',
                    height: '100px',
                    border: '3px solid #8B4513',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <img 
                    src={stamp.src}
                    alt={stamp.alt}
                    style={{
                      maxWidth: '90%',
                      maxHeight: '90%',
                      objectFit: 'contain',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: COLORS.text.darkPrimary,
              marginBottom: '10px',
              textAlign: 'center',
              borderBottom: `2px solid ${COLORS.accent.brown}`,
              paddingBottom: '5px'
            }}>
              🏰 Lieux
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
              {AVAILABLE_STAMPS.map((stamp, i) => (
                <div
                  key={`place-${i}`}
                  onClick={() => handleAddStamp(stamp.src, stamp.alt, stamp.width)}
                  style={{
                    width: '100px',
                    height: '100px',
                    border: `3px solid ${COLORS.accent.brown}`,
                    borderRadius: BORDER_RADIUS.md,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.background.primary,
                    transition: TRANSITIONS.default
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)'
                    e.currentTarget.style.boxShadow = SHADOWS.lg
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <img 
                    src={stamp.src}
                    alt={stamp.alt}
                    style={{
                      maxWidth: '90%',
                      maxHeight: '90%',
                      objectFit: 'contain',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  )
}
