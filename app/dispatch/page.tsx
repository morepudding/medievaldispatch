'use client'

import { useRouter } from 'next/navigation'
import { useGame } from '../contexts/GameContext'
import { useEffect, useState, useRef } from 'react'
import { HERO_PORTRAITS } from '../data/portraits'
import { StorageManager } from '../lib/utils/storage'
import { MissionCalculator } from '../lib/utils/missionLogic'
import { COLORS, SHADOWS, SPACING, TRANSITIONS, BORDER_RADIUS, Z_INDEX } from '../lib/constants/styles'
import { Mission } from '../types/game'
import DayCounter from '../components/DayCounter'
import Breadcrumb from '../components/Breadcrumb'
import GameStateIndicator from '../components/GameStateIndicator'
import { ToastContainer, useToast } from '../components/Toast'

export default function DispatchPage() {
  const router = useRouter()
  const { gameState, setGameState, endDispatch, goToVillage } = useGame()
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast()
  
  const [timeLeft, setTimeLeft] = useState(60)
  const [elapsed, setElapsed] = useState(0)
  const [visibleMissions, setVisibleMissions] = useState<Mission[]>([])
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [selectedHeroes, setSelectedHeroes] = useState<string[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [visualElements, setVisualElements] = useState<any[]>([])
  const [showRecap, setShowRecap] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const allMissionsRef = useRef<Mission[]>([])

  // Page fade-in animation
  useEffect(() => {
    setTimeout(() => setFadeIn(true), 50)
  }, [])

  // Charger les stamps depuis localStorage (même source que la page hub)
  useEffect(() => {
    const saved = StorageManager.loadStamps()
    
    if (saved) {
      // Filtrer seulement les éléments de lieu (pas les portraits ni les frames)
      const locationStamps = saved.filter((s) => 
        s.src.includes('/lieux/') && !s.src.includes('frame')
      )
      setVisualElements(locationStamps)
    } else {
      // Si pas de données, utiliser les stamps par défaut
      setVisualElements([
        { id: '1', src: '/lieux/foret-removebg-preview.png', alt: 'Forest', x: 10, y: 10, width: 250, zIndex: 3 },
        { id: '2', src: '/lieux/grotte.png', alt: 'Cave', x: 75, y: 10, width: 250, zIndex: 3 },
        { id: '3', src: '/lieux/ruines.png', alt: 'Ruins', x: 10, y: 60, width: 250, zIndex: 3 },
        { id: '4', src: '/lieux/village.png', alt: 'Village', x: 50, y: 50, width: 400, zIndex: 5 }
      ])
    }
  }, [])

  // Initialiser les missions du jour depuis gameState
  useEffect(() => {
    // Les missions sont déjà chargées depuis la DB via GameContext
    const dayMissions = gameState.allDayMissions
    
    // Ajuster les positions des missions en fonction des éléments visuels chargés
    const adjustedMissions = dayMissions.map(mission => {
      // Trouver l'élément visuel correspondant à la mission
      const matchingElement = visualElements.find(el => 
        el.src === mission.locationSrc
      )
      
      if (matchingElement) {
        // Utiliser la position exacte de l'élément visuel
        return {
          ...mission,
          x: matchingElement.x,
          y: matchingElement.y
        }
      }
      
      // Sinon garder la position par défaut
      return mission
    })
    
    allMissionsRef.current = adjustedMissions
    
    // Ajouter immédiatement les missions avec spawnTime = 0
    const initialMissions = adjustedMissions.filter(m => m.spawnTime === 0).map(m => ({
      ...m,
      status: 'disponible' as const
    }))
    
    setVisibleMissions(initialMissions)
    setGameState(prev => ({
      ...prev,
      allDayMissions: adjustedMissions,
      activeMissions: initialMissions
    }))
  }, [gameState.currentDay, visualElements, gameState.allDayMissions])

  // Timer principal
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Fin du dispatch
            handleEndDispatch()
            return 0
          }
          return prev - 1
        })
        
        setElapsed(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused])

  // Faire apparaître les missions selon leur spawnTime
  useEffect(() => {
    const missionsToSpawn = allMissionsRef.current.filter(
      m => m.spawnTime === elapsed && m.spawnTime > 0
    )
    
    if (missionsToSpawn.length > 0) {
      const newMissions = missionsToSpawn.map(m => ({
        ...m,
        status: 'disponible' as const
      }))
      
      setVisibleMissions(prev => [...prev, ...newMissions])
      setGameState(prev => ({
        ...prev,
        activeMissions: [...prev.activeMissions, ...newMissions]
      }))
    }
  }, [elapsed])

  // Gérer la complétion des missions
  useEffect(() => {
    const now = Date.now()
    
    visibleMissions.forEach(mission => {
      if (mission.status === 'en_cours' && mission.startTime) {
        const missionElapsed = (now - mission.startTime) / 1000
        
        if (missionElapsed >= mission.duration) {
          // Mission terminée - calculer le succès
          completeMission(mission)
        }
      }
    })
  }, [elapsed])

  const completeMission = (mission: Mission) => {
    // Récupérer les héros assignés
    const assignedHeroObjects = gameState.heroes.filter(h => mission.assignedHeroes.includes(h.id))
    
    // Utiliser MissionCalculator pour calculer le taux de réussite
    const successRate = MissionCalculator.calculateSuccessRate(assignedHeroObjects, mission)
    
    // Déterminer le succès
    const success = MissionCalculator.rollSuccess(successRate)
    
    // Calculer la récompense
    const goldEarned = MissionCalculator.calculateReward(mission, success)
    
    const newStatus = success ? 'terminee' : 'echouee'
    
    // Debug logs (commenté en production)
    // console.log(`Mission "${mission.titre}": ${successRate.toFixed(1)}% de réussite → ${success ? 'SUCCÈS' : 'ÉCHEC'}`)
    // console.log(success ? mission.resolutionSuccess : mission.resolutionFailure)
    
    // Show toast notification
    if (success) {
      showSuccess(`✓ Mission réussie : ${mission.titre} (+${goldEarned} or)`, 4000)
    } else {
      showError(`✖ Mission échouée : ${mission.titre} (+${goldEarned} or)`, 4000)
    }
    
    setVisibleMissions(prev => prev.map(m =>
      m.id === mission.id
        ? { ...m, status: newStatus as 'terminee' | 'echouee' }
        : m
    ))
    
    // Libérer les héros
    setGameState(prev => ({
      ...prev,
      gold: prev.gold + goldEarned,
      heroes: prev.heroes.map(hero =>
        mission.assignedHeroes.includes(hero.id)
          ? { ...hero, isAvailable: true, currentMissionId: undefined }
          : hero
      ),
      activeMissions: prev.activeMissions.map(m =>
        m.id === mission.id
          ? { ...m, status: newStatus as 'terminee' | 'echouee', assignedHeroes: [] }
          : m
      )
    }))
  }
  
  const handleEndDispatch = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    // Afficher l'écran récapitulatif au lieu de retourner directement
    setShowRecap(true)
  }

  const handleReturnToVillage = () => {
    endDispatch()
    // Retourner au hub et ouvrir automatiquement le modal village
    router.push('/?openVillage=true')
  }

  const handleMissionClick = (mission: Mission) => {
    if (mission.status === 'disponible') {
      setSelectedMission(mission)
      setSelectedHeroes([])
      setIsPaused(true) // Mettre le timer en pause
    }
  }

  const closeMissionModal = () => {
    setSelectedMission(null)
    setSelectedHeroes([])
    setIsPaused(false) // Reprendre le timer
  }

  const toggleHeroSelection = (heroId: string) => {
    setSelectedHeroes(prev => {
      if (prev.includes(heroId)) {
        return prev.filter(id => id !== heroId)
      } else if (prev.length < 2) {
        return [...prev, heroId]
      }
      return prev
    })
  }

  const calculateHeroCompatibility = (heroId: string): number => {
    if (!selectedMission) return 0
    
    const hero = gameState.heroes.find(h => h.id === heroId)
    if (!hero) return 0
    
    // Utiliser MissionCalculator pour calculer la compatibilité
    return Math.floor(MissionCalculator.getCompatibility(hero, selectedMission))
  }

  const launchMission = () => {
    if (!selectedMission || selectedHeroes.length === 0) return
    
    // Assigner les héros
    const updatedMission = {
      ...selectedMission,
      status: 'en_cours' as const,
      assignedHeroes: selectedHeroes,
      startTime: Date.now()
    }
    
    setVisibleMissions(prev => prev.map(m =>
      m.id === selectedMission.id ? updatedMission : m
    ))
    
    setGameState(prev => ({
      ...prev,
      activeMissions: prev.activeMissions.map(m =>
        m.id === selectedMission.id ? updatedMission : m
      ),
      heroes: prev.heroes.map(hero =>
        selectedHeroes.includes(hero.id)
          ? { ...hero, isAvailable: false, currentMissionId: selectedMission.id }
          : hero
      )
    }))
    
    closeMissionModal() // Reprendre le timer automatiquement
  }

  const availableHeroes = gameState.heroes.filter(h => h.isAvailable)

  // Calculer les statistiques pour le récapitulatif
  const successfulMissions = visibleMissions.filter(m => m.status === 'terminee')
  const failedMissions = visibleMissions.filter(m => m.status === 'echouee')
  const totalGoldEarned = successfulMissions.reduce((sum, m) => sum + m.goldReward, 0) + 
                          failedMissions.reduce((sum, m) => sum + Math.floor(m.goldReward * 0.5), 0)

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: COLORS.background.dark,
      opacity: fadeIn ? 1 : 0,
      transition: TRANSITIONS.slow
    }}>
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Breadcrumb */}
      {!showRecap && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 2000
        }}>
          <Breadcrumb items={[
            { label: 'Hub', icon: '🏠' },
            { label: 'Dispatch', icon: '⚔️' }
          ]} />
        </div>
      )}

      {/* Game State Indicator */}
      {!showRecap && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 2000
        }}>
          <GameStateIndicator />
        </div>
      )}

      {/* Bouton Retour */}
      {!showRecap && (
        <button
          onClick={() => {
            if (confirm('Êtes-vous sûr de vouloir quitter le dispatch en cours ?')) {
              router.push('/')
            }
          }}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: Z_INDEX.modal,
            padding: '15px 25px',
            backgroundColor: COLORS.background.grey,
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: `2px solid ${COLORS.border.grey}`,
            borderRadius: BORDER_RADIUS.md,
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: TRANSITIONS.medium,
            boxShadow: SHADOWS.sm,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.background.greyDark
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.background.grey
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <span>←</span>
          <span>Retour au Hub</span>
        </button>
      )}

      {/* Écran récapitulatif de fin de Dispatch */}
      {showRecap && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: COLORS.background.overlayDarker,
            backdropFilter: 'blur(10px)',
            zIndex: Z_INDEX.tooltip,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.5s ease-in-out'
          }}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { transform: translateY(30px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes goldShine {
              0%, 100% { text-shadow: 0 0 20px #d4af37; }
              50% { text-shadow: 0 0 40px #d4af37, 0 0 60px #ffd700; }
            }
          `}</style>
          
          <div style={{
            backgroundColor: COLORS.background.darkTransparent,
            border: `3px solid ${COLORS.primary.gold}`,
            borderRadius: BORDER_RADIUS.lg,
            padding: '50px',
            maxWidth: '700px',
            width: '90%',
            boxShadow: SHADOWS.xxl,
            animation: 'slideUp 0.5s ease-out'
          }}>
            {/* Titre */}
            <h1 style={{
              fontSize: '48px',
              color: COLORS.primary.gold,
              textAlign: 'center',
              marginBottom: '30px',
              fontWeight: 'bold',
              textShadow: `0 0 20px ${COLORS.primary.gold}`
            }}>
              ⚔️ Dispatch Terminé ! ⚔️
            </h1>

            {/* Résumé des missions */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {/* Missions réussies */}
              <div style={{
                backgroundColor: COLORS.background.successTransparent,
                border: `2px solid ${COLORS.status.success}`,
                borderRadius: BORDER_RADIUS.lg,
                padding: '25px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
                <div style={{ fontSize: '42px', color: COLORS.status.success, fontWeight: 'bold', marginBottom: '5px' }}>
                  {successfulMissions.length}
                </div>
                <div style={{ color: COLORS.status.successLight, fontSize: '16px' }}>
                  Mission{successfulMissions.length > 1 ? 's' : ''} Réussie{successfulMissions.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* Missions échouées */}
              <div style={{
                backgroundColor: COLORS.background.errorTransparent,
                border: `2px solid ${COLORS.status.error}`,
                borderRadius: BORDER_RADIUS.lg,
                padding: '25px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>❌</div>
                <div style={{ fontSize: '42px', color: COLORS.status.error, fontWeight: 'bold', marginBottom: '5px' }}>
                  {failedMissions.length}
                </div>
                <div style={{ color: COLORS.status.errorLight, fontSize: '16px' }}>
                  Mission{failedMissions.length > 1 ? 's' : ''} Échouée{failedMissions.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Or gagné */}
            <div style={{
              backgroundColor: COLORS.background.brownTransparent,
              border: `3px solid ${COLORS.primary.gold}`,
              borderRadius: BORDER_RADIUS.lg,
              padding: '30px',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', color: COLORS.text.secondary, marginBottom: '10px' }}>
                Or gagné ce jour
              </div>
              <div style={{
                fontSize: '56px',
                color: COLORS.primary.gold,
                fontWeight: 'bold',
                animation: 'goldShine 2s infinite'
              }}>
                💰 +{totalGoldEarned} <span style={{ fontSize: '32px' }}>or</span>
              </div>
            </div>

            {/* Message de transition */}
            <div style={{
              textAlign: 'center',
              marginBottom: '30px'
            }}>
              <div style={{
                fontSize: '24px',
                color: COLORS.text.secondary,
                marginBottom: '15px',
                fontStyle: 'italic'
              }}>
                ✨ Dispatch terminé ! Retour au village... ✨
              </div>
              <div style={{
                fontSize: '16px',
                color: COLORS.text.mutedDark,
                lineHeight: '1.6'
              }}>
                Vos héros reviennent au village.<br/>
                Consultez les dialogues et améliorez vos bâtiments !
              </div>
            </div>

            {/* Bouton retour au village */}
            <button
              onClick={handleReturnToVillage}
              style={{
                width: '100%',
                padding: '20px',
                backgroundColor: COLORS.status.success,
                color: 'white',
                border: 'none',
                borderRadius: BORDER_RADIUS.lg,
                fontSize: '24px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: TRANSITIONS.medium,
                boxShadow: SHADOWS.success
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.status.successDark
                e.currentTarget.style.transform = 'scale(1.02)'
                e.currentTarget.style.boxShadow = SHADOWS.successXl
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.status.success
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = SHADOWS.success
              }}
            >
              🏰 Retour au Village
            </button>
          </div>
        </div>
      )}

      {/* Carte de fond */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        userSelect: 'none'
      }}>
        <img 
          src="/map.webp" 
          alt="Carte du monde" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Éléments visuels (port, montagnes, ruines, grotte, forêt, village) */}
      {visualElements.map(element => (
        <div
          key={element.id}
          style={{
            position: 'absolute',
            left: `${element.x}%`,
            top: `${element.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: element.zIndex,
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <img
            src={element.src}
            alt={element.alt}
            draggable={false}
            style={{
              width: `${element.width}px`,
              height: 'auto',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
          />
        </div>
      ))}
      
      {/* Timer du Dispatch */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '15px 30px',
        backgroundColor: COLORS.background.overlayDark,
        color: timeLeft <= 10 ? COLORS.heroes.bjorn : isPaused ? COLORS.status.warning : COLORS.primary.goldLight,
        borderRadius: BORDER_RADIUS.lg,
        fontSize: '32px',
        fontWeight: 'bold',
        zIndex: Z_INDEX.overlay,
        border: `3px solid ${timeLeft <= 10 ? COLORS.heroes.bjorn : isPaused ? COLORS.status.warning : COLORS.primary.goldLight}`,
        boxShadow: timeLeft <= 10 ? SHADOWS.timer : isPaused ? SHADOWS.timerWarning : SHADOWS.timerGold,
        animation: timeLeft <= 10 ? 'pulse 1s infinite' : 'none'
      }}>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.05); }
          }
        `}</style>
        {isPaused ? '⏸️' : '⏱️'} {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        {isPaused && <span style={{ fontSize: '14px', marginLeft: '10px', color: COLORS.status.warning }}>PAUSE</span>}
      </div>
      
      {/* Informations du jour */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        padding: '15px 25px',
        backgroundColor: COLORS.background.overlayDark,
        borderRadius: BORDER_RADIUS.lg,
        zIndex: Z_INDEX.overlay,
        border: `2px solid ${COLORS.primary.goldLight}`
      }}>
        <div style={{
          color: COLORS.primary.goldLight,
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '5px'
        }}>
          Jour {gameState.currentDay}/3
        </div>
        <div style={{
          color: 'white',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          💰 {gameState.gold} or
        </div>
        <div style={{
          color: COLORS.text.mutedLight,
          fontSize: '14px',
          marginTop: '5px'
        }}>
          Missions: {visibleMissions.filter(m => m.status === 'terminee').length}/{visibleMissions.length}
        </div>
      </div>
      
      {/* Missions affichées sur la carte */}
      {visibleMissions.map((mission, index) => {
        // Calculate offset for missions at the same location
        const missionsAtSameLocation = visibleMissions.filter(m => 
          Math.abs(m.x - mission.x) < 2 && Math.abs(m.y - mission.y) < 2
        )
        const missionIndexAtLocation = missionsAtSameLocation.findIndex(m => m.id === mission.id)
        const offsetX = missionIndexAtLocation * 60 // 60px horizontal offset
        
        return (
        <div
          key={mission.id}
          onClick={() => handleMissionClick(mission)}
          style={{
            position: 'absolute',
            left: `calc(${mission.x}% + ${offsetX}px)`,
            top: `${mission.y}%`,
            transform: 'translate(-50%, -50%)',
            cursor: mission.status === 'disponible' ? 'pointer' : 'default',
            zIndex: 900 + index,
            animation: mission.status === 'disponible' ? 'bounce 1s infinite' : 'none'
          }}
        >
          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translate(-50%, -50%) translateY(0); }
              50% { transform: translate(-50%, -50%) translateY(-10px); }
            }
          `}</style>
          
          {/* Point d'exclamation */}
          <div style={{
            width: '50px',
            height: '50px',
            backgroundColor: mission.status === 'terminee' ? COLORS.status.success : mission.status === 'echouee' ? COLORS.status.error : mission.status === 'en_cours' ? COLORS.status.warning : COLORS.primary.goldLight,
            borderRadius: BORDER_RADIUS.full,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 'bold',
            color: COLORS.text.dark,
            border: `3px solid ${COLORS.border.orange}`,
            boxShadow: SHADOWS.goldXl,
            opacity: mission.status === 'terminee' || mission.status === 'echouee' ? 0.5 : 1
          }}>
            {mission.status === 'terminee' ? '✓' : mission.status === 'echouee' ? '✗' : mission.status === 'en_cours' ? '⏳' : '!'}
          </div>
        </div>
      )})}
      
      {/* Bouton terminer */}
      <button
        onClick={handleEndDispatch}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '15px 30px',
          backgroundColor: COLORS.status.error,
          color: 'white',
          border: 'none',
          borderRadius: BORDER_RADIUS.pill,
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          zIndex: Z_INDEX.overlay,
          boxShadow: SHADOWS.error,
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        🏠 Terminer (test)
      </button>

      {/* Modal de sélection des héros */}
      {selectedMission && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: COLORS.background.overlayMedium,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: Z_INDEX.modal
          }}
          onClick={() => closeMissionModal()}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: COLORS.background.card,
              borderRadius: BORDER_RADIUS.lg,
              padding: '30px',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              border: '3px solid #FFD700',
              boxShadow: '0 8px 40px rgba(255, 215, 0, 0.4)'
            }}
          >
            {/* En-tête de la mission */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '20px',
              marginBottom: '25px',
              paddingBottom: '20px',
              borderBottom: '2px solid #444'
            }}>
              <img
                src={selectedMission.locationSrc}
                alt={selectedMission.titre}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  border: '2px solid #FFD700'
                }}
              />
              <div style={{ flex: 1 }}>
                <h2 style={{
                  color: '#FFD700',
                  fontSize: '28px',
                  margin: '0 0 10px 0'
                }}>
                  {selectedMission.titre}
                </h2>
                <p style={{
                  color: '#ccc',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {selectedMission.description}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  marginTop: '15px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    padding: '5px 15px',
                    backgroundColor: selectedMission.difficulty === 'facile' ? '#28a745' : selectedMission.difficulty === 'moyenne' ? '#ffc107' : '#dc3545',
                    borderRadius: '15px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#000'
                  }}>
                    {selectedMission.difficulty.toUpperCase()}
                  </span>
                  <span style={{
                    padding: '5px 15px',
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    borderRadius: '15px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#FFD700',
                    border: '1px solid #FFD700'
                  }}>
                    💰 {selectedMission.goldReward} or
                  </span>
                  <span style={{
                    padding: '5px 15px',
                    backgroundColor: 'rgba(100, 149, 237, 0.2)',
                    borderRadius: '15px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#6495ED',
                    border: '1px solid #6495ED'
                  }}>
                    ⏱️ {selectedMission.duration}s
                  </span>
                </div>
              </div>
            </div>

            {/* Stats requises */}
            <div style={{
              marginBottom: '25px',
              padding: '15px',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <h3 style={{
                color: '#FFD700',
                fontSize: '18px',
                margin: '0 0 10px 0'
              }}>
                📋 Stats Requises
              </h3>
              <div style={{
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap'
              }}>
                {selectedMission.requiredStats.force && (
                  <div style={{ color: '#ff6b6b', fontSize: '14px', fontWeight: 'bold' }}>
                    💪 Force: {selectedMission.requiredStats.force}
                  </div>
                )}
                {selectedMission.requiredStats.dexterite && (
                  <div style={{ color: '#51cf66', fontSize: '14px', fontWeight: 'bold' }}>
                    🎯 Dextérité: {selectedMission.requiredStats.dexterite}
                  </div>
                )}
                {selectedMission.requiredStats.intelligence && (
                  <div style={{ color: '#339af0', fontSize: '14px', fontWeight: 'bold' }}>
                    🧠 Intelligence: {selectedMission.requiredStats.intelligence}
                  </div>
                )}
                {selectedMission.requiredStats.sagesse && (
                  <div style={{ color: '#845ef7', fontSize: '14px', fontWeight: 'bold' }}>
                    ✨ Sagesse: {selectedMission.requiredStats.sagesse}
                  </div>
                )}
                {selectedMission.requiredStats.vitalite && (
                  <div style={{ color: '#ff8787', fontSize: '14px', fontWeight: 'bold' }}>
                    ❤️ Vitalité: {selectedMission.requiredStats.vitalite}
                  </div>
                )}
              </div>
            </div>

            {/* Liste des héros */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                color: '#FFD700',
                fontSize: '20px',
                marginBottom: '15px'
              }}>
                👥 Sélectionnez 1-2 héros ({selectedHeroes.length}/2)
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '15px'
              }}>
                {availableHeroes.map(hero => {
                  const compatibility = calculateHeroCompatibility(hero.id)
                  const isSelected = selectedHeroes.includes(hero.id)
                  
                  return (
                    <div
                      key={hero.id}
                      onClick={() => toggleHeroSelection(hero.id)}
                      style={{
                        padding: '15px',
                        backgroundColor: isSelected ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        border: `2px solid ${isSelected ? '#FFD700' : hero.color}`,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'scale(1.05)'
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.backgroundColor = isSelected ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      {/* Badge de sélection */}
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '30px',
                          height: '30px',
                          backgroundColor: '#FFD700',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#000',
                          boxShadow: '0 2px 8px rgba(255, 215, 0, 0.6)'
                        }}>
                          ✓
                        </div>
                      )}
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '10px'
                      }}>
                        <img
                          src={hero.src}
                          alt={hero.name}
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            border: `3px solid ${hero.color}`
                          }}
                        />
                        <div>
                          <div style={{
                            color: hero.color,
                            fontSize: '16px',
                            fontWeight: 'bold'
                          }}>
                            {hero.name}
                          </div>
                          <div style={{
                            color: '#888',
                            fontSize: '12px'
                          }}>
                            Niveau {hero.stats.force + hero.stats.dexterite + hero.stats.intelligence + hero.stats.sagesse + hero.stats.vitalite}
                          </div>
                        </div>
                      </div>
                      
                      {/* Barre de compatibilité */}
                      <div style={{
                        marginTop: '10px',
                        padding: '8px',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px'
                      }}>
                        <div style={{
                          fontSize: '11px',
                          color: '#aaa',
                          marginBottom: '4px'
                        }}>
                          Compatibilité
                        </div>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${compatibility}%`,
                            height: '100%',
                            backgroundColor: compatibility >= 80 ? '#28a745' : compatibility >= 50 ? '#ffc107' : '#dc3545',
                            transition: 'width 0.3s'
                          }} />
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: compatibility >= 80 ? '#28a745' : compatibility >= 50 ? '#ffc107' : '#dc3545',
                          fontWeight: 'bold',
                          marginTop: '4px',
                          textAlign: 'center'
                        }}>
                          {compatibility}%
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {availableHeroes.length === 0 && (
                <div style={{
                  padding: '30px',
                  textAlign: 'center',
                  color: '#888',
                  fontSize: '16px'
                }}>
                  Aucun héros disponible. Attendez qu'ils terminent leurs missions en cours.
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'flex-end',
              paddingTop: '20px',
              borderTop: '2px solid #444'
            }}>
              <button
                onClick={() => closeMissionModal()}
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#777'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#666'
                }}
              >
                Annuler
              </button>
              <button
                onClick={launchMission}
                disabled={selectedHeroes.length === 0}
                style={{
                  padding: '12px 30px',
                  backgroundColor: selectedHeroes.length > 0 ? '#28a745' : '#444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                      cursor: selectedHeroes.length > 0 ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  opacity: selectedHeroes.length > 0 ? 1 : 0.5
                }}
                onMouseEnter={(e) => {
                  if (selectedHeroes.length > 0) {
                    e.currentTarget.style.backgroundColor = '#218838'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedHeroes.length > 0) {
                    e.currentTarget.style.backgroundColor = '#28a745'
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
              >
                🚀 Lancer la Mission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barre de portraits des héros en bas */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: '15px 30px',
        borderRadius: '20px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
      }}>
        {HERO_PORTRAITS.map((hero) => {
          // Vérifier si le héros est en mission
          const heroMission = visibleMissions.find(m => 
            m.status === 'en_cours' && m.assignedHeroes?.includes(hero.id)
          )
          
          const isBusy = !!heroMission
          const timeRemaining = heroMission && heroMission.startTime
            ? Math.max(0, heroMission.duration - Math.floor((Date.now() - heroMission.startTime) / 1000))
            : 0

          return (
            <div
              key={hero.id}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {/* Portrait */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: `3px solid ${isBusy ? '#ff4444' : hero.color}`,
                opacity: isBusy ? 0.6 : 1,
                transition: 'all 0.3s',
                boxShadow: isBusy 
                  ? '0 0 20px rgba(255, 68, 68, 0.5)' 
                  : `0 0 20px ${hero.color}80`,
                position: 'relative'
              }}>
                <img 
                  src={hero.src} 
                  alt={hero.alt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* Overlay si occupé */}
                {isBusy && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px'
                  }}>
                    ⏳
                  </div>
                )}
              </div>

              {/* Nom du héros */}
              <div style={{
                color: isBusy ? '#ff6666' : '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
              }}>
                {hero.alt}
              </div>

              {/* Timer d'indisponibilité */}
              {isBusy && timeRemaining > 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: '-25px',
                  backgroundColor: 'rgba(255, 68, 68, 0.9)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  border: '2px solid #ff4444',
                  boxShadow: '0 2px 8px rgba(255, 68, 68, 0.4)',
                  whiteSpace: 'nowrap'
                }}>
                  ⏱️ {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
