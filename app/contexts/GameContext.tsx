'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { GameState, Hero, Mission, Building, Dialogue, VillageHeroPlacement } from '../types/game'

interface GameContextType {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
  loading: boolean
  error: string | null
  retryLoading: () => void
  saveId: string | null
  isSaving: boolean
  
  // Actions
  startDispatch: () => void
  endDispatch: () => void
  goToVillage: () => void
  goToHub: () => void
  nextDay: () => void
  resetGame: () => void
  loadMissionsForDay: (day: number) => Promise<Mission[]>
  loadDialoguesForDay: (day: number) => Promise<Dialogue[]>
  loadBuildings: () => Promise<Building[]>
  
  // Save management
  createNewSave: (playerName?: string) => Promise<string | null>
  loadSave: (saveId: string) => Promise<boolean>
  saveToDatabase: () => Promise<void>
  migrateLocalStorageSave: () => Promise<string | null>
  
  // Missions
  assignHeroesToMission: (missionId: string, heroIds: string[]) => void
  completeMission: (missionId: string, success: boolean) => void
  
  // Or
  addGold: (amount: number) => void
  spendGold: (amount: number) => boolean
  
  // Bâtiments
  upgradeBuilding: (buildingId: string) => boolean
  
  // Dialogues
  markDialogueAsRead: (dialogueId: string) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const INITIAL_BUILDINGS: Building[] = [
  {
    id: 'forge',
    name: '🔨 Forge',
    icon: '🔨',
    level: 1,
    maxLevel: 3,
    description: 'La forge de Phandallin résonne du bruit des marteaux.',
    upgradeCosts: [0, 100, 800],
    bonuses: [
      { level: 1, description: '+5% dégâts d\'armes' },
      { level: 2, description: '+10% dégâts d\'armes et +5% défense' },
      { level: 3, description: '+15% dégâts et armes légendaires disponibles' }
    ]
  },
  {
    id: 'townhall',
    name: '🏛️ Hôtel de Ville',
    icon: '🏛️',
    level: 1,
    maxLevel: 3,
    description: 'Le cœur administratif de la ville.',
    upgradeCosts: [0, 1000, 1500],
    bonuses: [
      { level: 1, description: '+10% revenus de la ville' },
      { level: 2, description: '+20% revenus et nouvelles quêtes' },
      { level: 3, description: '+30% revenus et quêtes épiques' }
    ]
  },
  {
    id: 'market',
    name: '🛒 Marché',
    icon: '🛒',
    level: 1,
    maxLevel: 3,
    description: 'Un marché animé plein de marchandises.',
    upgradeCosts: [0, 750, 1200],
    bonuses: [
      { level: 1, description: '-10% prix d\'achat' },
      { level: 2, description: '-20% prix et objets rares' },
      { level: 3, description: '-30% prix et objets légendaires' }
    ]
  },
  {
    id: 'tavern',
    name: '🍺 Auberge',
    icon: '🍺',
    level: 1,
    maxLevel: 3,
    description: 'L\'auberge accueillante de Phandallin.',
    upgradeCosts: [0, 600, 1000],
    bonuses: [
      { level: 1, description: '+10% régénération au repos' },
      { level: 2, description: '+20% régénération et missions spéciales' },
      { level: 3, description: '+30% régénération et bonus d\'équipe' }
    ]
  },
  {
    id: 'watchtower',
    name: '🗼 Tour de Garde',
    icon: '🗼',
    level: 1,
    maxLevel: 3,
    description: 'La tour de garde protège la ville.',
    upgradeCosts: [0, 800, 1300],
    bonuses: [
      { level: 1, description: '+5% défense de la ville' },
      { level: 2, description: '+10% défense et alerte précoce' },
      { level: 3, description: '+15% défense et contre-attaques' }
    ]
  }
]

export function GameProvider({ children }: { children: ReactNode }) {
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [missions, setMissions] = useState<Mission[]>([])
  const [dialogues, setDialogues] = useState<Dialogue[]>([])
  const [buildings, setBuildings] = useState<Building[]>([])
  const [saveId, setSaveId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  const [gameState, setGameState] = useState<GameState>({
    currentDay: 1,
    gold: 0,
    heroes: [],
    buildings: [], // Sera chargé depuis l'API
    villagePlacements: [],
    completedMissions: [],
    activeMissions: [],
    allDayMissions: [],
    availableDialogues: [],
    readDialogues: [],
    currentView: 'hub',
    isInDispatch: false,
    dispatchTimer: 60,
    dispatchElapsed: 0
  })

  // Charger les héros depuis l'API
  useEffect(() => {
    const loadHeroes = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/heroes')
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement des héros (${response.status})`)
        }
        const data: Hero[] = await response.json()
        
        if (!data || data.length === 0) {
          throw new Error('Aucun héros trouvé dans la base de données')
        }
        
        setHeroes(data)
        
        // Initialiser les héros dans le gameState
        setGameState(prev => ({
          ...prev,
          heroes: data.map(h => ({ ...h }))
        }))
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        console.error('Error loading heroes:', error)
        setError(`Impossible de charger les héros : ${errorMessage}`)
      } finally {
        setLoading(false)
      }
    }
    
    loadHeroes()
    // Charger les bâtiments au montage
    loadBuildings()
  }, [])

  // Fonction pour réessayer le chargement en cas d'erreur
  const retryLoading = () => {
    setError(null)
    setLoading(true)
    
    // Recharger les héros
    fetch('/api/heroes')
      .then(response => {
        if (!response.ok) throw new Error(`Erreur ${response.status}`)
        return response.json()
      })
      .then((data: Hero[]) => {
        if (!data || data.length === 0) {
          throw new Error('Aucun héros trouvé')
        }
        setHeroes(data)
        setGameState(prev => ({
          ...prev,
          heroes: data.map(h => ({ ...h }))
        }))
      })
      .catch(error => {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        setError(`Impossible de charger les héros : ${errorMessage}`)
      })
      .finally(() => {
        setLoading(false)
      })
    
    // Recharger les bâtiments
    loadBuildings()
  }

  // Fonction pour charger les missions d'un jour depuis l'API
  const loadMissionsForDay = async (day: number) => {
    try {
      const response = await fetch(`/api/missions/day/${day}`)
      if (!response.ok) throw new Error(`Failed to fetch missions for day ${day}`)
      const data: Mission[] = await response.json()
      setMissions(data)
      
      // Mettre à jour allDayMissions dans le gameState
      setGameState(prev => ({
        ...prev,
        allDayMissions: data
      }))
      
      return data
    } catch (error) {
      console.error(`Error loading missions for day ${day}:`, error)
      return []
    }
  }

  // Fonction pour charger les dialogues d'un jour depuis l'API
  const loadDialoguesForDay = async (day: number) => {
    try {
      const response = await fetch(`/api/dialogues/day/${day}`)
      if (!response.ok) throw new Error(`Failed to fetch dialogues for day ${day}`)
      const data: Dialogue[] = await response.json()
      
      // Fusionner avec les dialogues existants et préserver le statut isRead
      const mergedDialogues = data.map(d => {
        const existing = gameState.availableDialogues.find(ad => ad.id === d.id)
        const isRead = gameState.readDialogues.includes(d.id) || existing?.isRead || false
        return { ...d, isRead }
      })
      
      setDialogues(mergedDialogues)
      
      // Mettre à jour availableDialogues dans le gameState
      setGameState(prev => ({
        ...prev,
        availableDialogues: mergedDialogues
      }))
      
      return mergedDialogues
    } catch (error) {
      console.error(`Error loading dialogues for day ${day}:`, error)
      return []
    }
  }

  // Fonction pour charger les bâtiments depuis l'API
  const loadBuildings = async () => {
    try {
      const response = await fetch('/api/buildings')
      if (!response.ok) throw new Error('Failed to fetch buildings')
      const data: Building[] = await response.json()
      setBuildings(data)
      
      // Initialiser les bâtiments dans le gameState (seulement au premier chargement)
      setGameState(prev => {
        // Si les bâtiments sont déjà chargés depuis localStorage, ne pas les écraser
        if (prev.buildings.length > 0) {
          return prev
        }
        return {
          ...prev,
          buildings: data.map(b => ({ ...b }))
        }
      })
      
      return data
    } catch (error) {
      console.error('Error loading buildings:', error)
      return []
    }
  }

  // Charger l'état depuis localStorage ou DB
  useEffect(() => {
    const savedSaveId = localStorage.getItem('medievalDispatch_saveId')
    
    if (savedSaveId) {
      // Charger depuis la DB
      loadSave(savedSaveId)
    } else {
      // Nouveau jeu : charger seulement les dialogues et missions du jour 1
      loadDialoguesForDay(1)
      loadMissionsForDay(1)
      setLoading(false)
    }
  }, [])

  const startDispatch = () => {
    setGameState(prev => ({
      ...prev,
      currentView: 'dispatch',
      isInDispatch: true,
      dispatchTimer: 60,
      dispatchElapsed: 0,
      activeMissions: []
    }))
  }

  const endDispatch = () => {
    setGameState(prev => ({
      ...prev,
      isInDispatch: false,
      dispatchTimer: 60,
      dispatchElapsed: 0
    }))
  }

  const goToVillage = () => {
    setGameState(prev => ({
      ...prev,
      currentView: 'village'
    }))
  }

  const goToHub = () => {
    setGameState(prev => ({
      ...prev,
      currentView: 'hub'
    }))
  }

  const nextDay = () => {
    setGameState(prev => {
      const newDay = prev.currentDay + 1
      
      // MVP END: Ne pas dépasser le jour 3
      if (newDay > 3) {
        return prev // Ne rien changer
      }
      
      // Charger les missions du nouveau jour
      loadMissionsForDay(newDay)
      
      // Charger les dialogues du nouveau jour
      loadDialoguesForDay(newDay)

      // Libérer tous les héros au changement de jour
      const updatedHeroes = prev.heroes.map(hero => ({
        ...hero,
        isAvailable: true,
        currentMissionId: undefined
      }))

      return {
        ...prev,
        currentDay: newDay,
        currentView: 'hub',
        heroes: updatedHeroes,
        // Les dialogues seront mis à jour par loadDialoguesForDay
        // Réinitialiser l'état du dispatch
        isInDispatch: false,
        activeMissions: [],
        completedMissions: [],
        allDayMissions: [],
        dispatchTimer: 60,
        dispatchElapsed: 0
      }
    })
    
    // Sauvegarder le changement de jour
    if (saveId) {
      saveToDatabase()
    }
  }

  const assignHeroesToMission = (missionId: string, heroIds: string[]) => {
    setGameState(prev => {
      const updatedMissions = prev.activeMissions.map(mission =>
        mission.id === missionId
          ? { ...mission, assignedHeroes: heroIds, status: 'en_cours' as const, startTime: Date.now() }
          : mission
      )
      
      const updatedHeroes = prev.heroes.map(hero =>
        heroIds.includes(hero.id)
          ? { ...hero, isAvailable: false, currentMissionId: missionId }
          : hero
      )
      
      return {
        ...prev,
        activeMissions: updatedMissions,
        heroes: updatedHeroes
      }
    })
  }

  const completeMission = (missionId: string, success: boolean) => {
    setGameState(prev => {
      const mission = prev.activeMissions.find(m => m.id === missionId)
      if (!mission) return prev
      
      const goldEarned = success ? mission.goldReward : Math.floor(mission.goldReward * 0.5)
      const newStatus: 'terminee' | 'echouee' = success ? 'terminee' : 'echouee'
      
      const updatedMissions = prev.activeMissions.map(m =>
        m.id === missionId
          ? { ...m, status: newStatus }
          : m
      )
      
      const updatedHeroes = prev.heroes.map(hero =>
        mission.assignedHeroes.includes(hero.id)
          ? { ...hero, isAvailable: true, currentMissionId: undefined }
          : hero
      )
      
      return {
        ...prev,
        gold: prev.gold + goldEarned,
        activeMissions: updatedMissions,
        heroes: updatedHeroes,
        completedMissions: [...prev.completedMissions, { ...mission, status: newStatus }]
      }
    })
    
    // Sauvegarder la mission complétée dans la DB
    if (saveId) {
      fetch(`/api/save/${saveId}/missions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mission_id: missionId, success })
      }).catch(error => console.error('Erreur sauvegarde mission:', error))
      
      // Sauvegarder l'état général
      saveToDatabase()
    }
  }

  const addGold = (amount: number) => {
    setGameState(prev => ({
      ...prev,
      gold: prev.gold + amount
    }))
  }

  const spendGold = (amount: number): boolean => {
    if (gameState.gold >= amount) {
      setGameState(prev => ({
        ...prev,
        gold: prev.gold - amount
      }))
      return true
    }
    return false
  }

  const upgradeBuilding = (buildingId: string): boolean => {
    const building = gameState.buildings.find(b => b.id === buildingId)
    if (!building || building.level >= building.maxLevel) return false
    
    const cost = building.upgradeCosts[building.level]
    if (gameState.gold < cost) return false
    
    const newLevel = building.level + 1
    
    setGameState(prev => ({
      ...prev,
      gold: prev.gold - cost,
      buildings: prev.buildings.map(b =>
        b.id === buildingId
          ? { ...b, level: newLevel }
          : b
      )
    }))
    
    // Sauvegarder le bâtiment dans la DB
    if (saveId) {
      fetch(`/api/save/${saveId}/buildings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ building_id: buildingId, level: newLevel })
      }).catch(error => console.error('Erreur sauvegarde bâtiment:', error))
      
      // Sauvegarder l'état général
      saveToDatabase()
    }
    
    return true
  }

  const markDialogueAsRead = (dialogueId: string) => {
    setGameState(prev => ({
      ...prev,
      readDialogues: [...prev.readDialogues, dialogueId],
      availableDialogues: prev.availableDialogues.map(d =>
        d.id === dialogueId ? { ...d, isRead: true } : d
      )
    }))
    
    // Sauvegarder dans la DB
    if (saveId) {
      fetch(`/api/save/${saveId}/dialogues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dialogue_id: dialogueId })
      }).catch(error => console.error('Erreur sauvegarde dialogue:', error))
    }
  }

  // Créer une nouvelle sauvegarde
  const createNewSave = async (playerName?: string): Promise<string | null> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_name: playerName || 'Joueur' })
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la sauvegarde')
      }
      
      const result = await response.json()
      const newSaveId = result.save_id
      
      // Stocker le saveId dans localStorage pour le retrouver
      localStorage.setItem('medievalDispatch_saveId', newSaveId)
      setSaveId(newSaveId)
      
      // Charger la sauvegarde créée
      await loadSave(newSaveId)
      
      return newSaveId
    } catch (error) {
      console.error('Erreur création sauvegarde:', error)
      setError('Impossible de créer une nouvelle partie')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Charger une sauvegarde depuis la DB
  const loadSave = async (loadSaveId: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/save/${loadSaveId}`)
      
      if (!response.ok) {
        throw new Error('Sauvegarde non trouvée')
      }
      
      const result = await response.json()
      const save = result.data
      
      // Hydrater le gameState avec les données de la DB
      setGameState({
        currentDay: save.current_day,
        gold: save.gold,
        heroes: save.player_heroes.map((ph: any) => ({
          id: ph.hero.slug || ph.hero.id, // Utiliser slug pour compatibilité
          name: ph.hero.name,
          src: ph.hero.images.find((img: any) => img.image_type === 'portrait_full')?.url || '',
          alt: ph.hero.name,
          color: '#4A90E2', // TODO: gérer couleur
          stats: {
            force: ph.current_strength,
            dexterite: ph.current_stealth,
            sagesse: ph.current_diplomacy,
            intelligence: ph.current_intelligence,
            vitalite: 100 // TODO: gérer vitalité si besoin
          },
          isAvailable: !ph.is_on_mission,
          currentMissionId: undefined
        })),
        buildings: save.player_buildings.map((pb: any) => {
          const buildingData = pb.building
          const currentLevel = buildingData.levels.find((l: any) => l.level === pb.level)
          
          return {
            id: buildingData.id,
            name: buildingData.name,
            icon: buildingData.icon || '🏛️',
            level: pb.level,
            maxLevel: Math.max(...buildingData.levels.map((l: any) => l.level)),
            description: buildingData.description,
            upgradeCosts: buildingData.levels
              .sort((a: any, b: any) => a.level - b.level)
              .map((l: any) => l.cost_gold),
            bonuses: buildingData.levels
              .sort((a: any, b: any) => a.level - b.level)
              .map((l: any) => ({ level: l.level, description: l.description }))
          }
        }),
        villagePlacements: [],
        completedMissions: save.mission_completions.map((mc: any) => mc.mission_id),
        activeMissions: [],
        allDayMissions: [],
        availableDialogues: [],
        readDialogues: save.player_dialogues.map((pd: any) => pd.dialogue_id),
        currentView: 'hub',
        isInDispatch: false,
        dispatchTimer: 60,
        dispatchElapsed: 0
      })
      
      setSaveId(loadSaveId)
      localStorage.setItem('medievalDispatch_saveId', loadSaveId)
      
      // Charger les missions et dialogues du jour actuel
      await loadMissionsForDay(save.current_day)
      await loadDialoguesForDay(save.current_day)
      
      return true
    } catch (error) {
      console.error('Erreur chargement sauvegarde:', error)
      setError('Impossible de charger la sauvegarde')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Sauvegarder dans la DB avec debounce
  let saveTimeout: NodeJS.Timeout | null = null
  
  const saveToDatabase = async () => {
    if (!saveId) return
    
    // Debounce : attendre 2 secondes avant de sauvegarder
    if (saveTimeout) clearTimeout(saveTimeout)
    
    saveTimeout = setTimeout(async () => {
      try {
        setIsSaving(true)
        
        // Sauvegarder l'état général
        await fetch(`/api/save/${saveId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            current_day: gameState.currentDay,
            current_time: 8, // TODO: gérer le temps
            gold: gameState.gold,
            reputation: 50 // TODO: gérer réputation
          })
        })
        
        // Sauvegarder les héros
        const heroesData = gameState.heroes.map(h => ({
          hero_id: h.id,
          current_strength: h.stats.force,
          current_diplomacy: h.stats.sagesse,
          current_stealth: h.stats.dexterite,
          current_intelligence: h.stats.intelligence,
          is_on_mission: !h.isAvailable,
          mission_end_time: null,
        }))
        
        await fetch(`/api/save/${saveId}/heroes`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ heroes: heroesData })
        })
        
        console.log('✓ Sauvegardé')
      } catch (error) {
        console.error('Erreur sauvegarde:', error)
      } finally {
        setIsSaving(false)
      }
    }, 2000) // Debounce de 2 secondes
  }

  // Migrer une sauvegarde localStorage vers la DB
  const migrateLocalStorageSave = async (): Promise<string | null> => {
    try {
      setLoading(true)
      setError(null)
      
      // Récupérer la sauvegarde localStorage
      const savedGameState = localStorage.getItem('medievalDispatch_gameState')
      if (!savedGameState) {
        throw new Error('Aucune sauvegarde localStorage trouvée')
      }
      
      const gameState = JSON.parse(savedGameState)
      
      // Appeler l'API de migration
      const response = await fetch('/api/save/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameState })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la migration')
      }
      
      const result = await response.json()
      const newSaveId = result.save_id
      
      // Stocker le nouveau saveId
      localStorage.setItem('medievalDispatch_saveId', newSaveId)
      setSaveId(newSaveId)
      
      // Supprimer l'ancienne sauvegarde localStorage
      localStorage.removeItem('medievalDispatch_gameState')
      
      // Charger la sauvegarde migrée
      await loadSave(newSaveId)
      
      return newSaveId
    } catch (error) {
      console.error('Erreur migration:', error)
      setError('Impossible de migrer la sauvegarde')
      return null
    } finally {
      setLoading(false)
    }
  }

  const resetGame = async () => {
    try {
      // Supprimer l'ancienne sauvegarde
      localStorage.removeItem('medievalDispatch_saveId')
      localStorage.removeItem('medieval-dispatch-game-state') // Nettoyage ancienne clé
      setSaveId(null)
      
      // Créer une nouvelle sauvegarde en DB
      const newSaveId = await createNewSave()
      
      if (newSaveId) {
        // Charger la nouvelle sauvegarde créée
        await loadSave(newSaveId)
      } else {
        console.error('Erreur lors de la création de la nouvelle partie')
      }
    } catch (error) {
      console.error('Erreur lors du reset du jeu:', error)
    }
  }

  const value: GameContextType = {
    gameState,
    setGameState,
    loading,
    error,
    retryLoading,
    saveId,
    isSaving,
    startDispatch,
    endDispatch,
    goToVillage,
    goToHub,
    nextDay,
    resetGame,
    loadMissionsForDay,
    loadDialoguesForDay,
    loadBuildings,
    createNewSave,
    loadSave,
    saveToDatabase,
    migrateLocalStorageSave,
    assignHeroesToMission,
    completeMission,
    addGold,
    spendGold,
    upgradeBuilding,
    markDialogueAsRead
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
