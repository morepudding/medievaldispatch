// Types pour le jeu Medieval Dispatch

export interface HeroStats {
  force: number
  dexterite: number
  sagesse: number
  intelligence: number
  vitalite: number
}

export interface Hero {
  id: string
  name: string
  src: string
  alt: string
  color: string
  stats: HeroStats
  isAvailable: boolean // Disponible ou en mission
  currentMissionId?: string
}

export interface MissionRequirement {
  force?: number
  dexterite?: number
  sagesse?: number
  intelligence?: number
  vitalite?: number
}

export type MissionStatus = 'pending' | 'disponible' | 'en_cours' | 'terminee' | 'echouee'

export interface Mission {
  id: string
  titre: string
  description: string
  locationSrc: string // Chemin vers l'image du lieu
  x: number // Position X en %
  y: number // Position Y en %
  
  // Difficulté
  requiredStats: MissionRequirement
  difficulty: 'facile' | 'moyenne' | 'difficile'
  
  // Récompenses
  goldReward: number
  experienceReward: number
  
  // Durée et timing
  duration: number // Durée de la mission en secondes (10-20s)
  spawnTime: number // Quand la mission apparaît (en secondes depuis le début du dispatch)
  
  // État
  assignedHeroes: string[] // IDs des héros assignés
  startTime?: number // Timestamp de début
  status: MissionStatus
  
  // Résolution
  resolutionSuccess: string
  resolutionFailure: string
}

export interface Building {
  id: string
  name: string
  icon: string
  level: number
  maxLevel: number
  description: string
  
  // Coûts d'amélioration
  upgradeCosts: number[] // Index = niveau actuel, valeur = coût
  
  // Bonus (pour plus tard)
  bonuses: {
    level: number
    description: string
  }[]
}

export interface DialogueExchange {
  speaker: 'hero' | 'player'
  text: string
  emotion?: 'happy' | 'sad' | 'angry' | 'neutral' | 'surprised'
}

export interface Dialogue {
  id: string
  heroId: string
  heroName: string
  unlockDay: number // Jour de déblocage (1, 2, 3)
  isRead: boolean
  exchanges: DialogueExchange[]
}

export interface VillageHeroPlacement {
  heroSrc: string
  heroAlt: string
  buildingName: string
  x: number
  y: number
}

export interface GameState {
  // Progression
  currentDay: number // 1, 2, ou 3
  gold: number
  
  // Entités
  heroes: Hero[]
  buildings: Building[]
  villagePlacements: VillageHeroPlacement[]
  
  // Missions
  completedMissions: Mission[]
  activeMissions: Mission[] // Missions actuellement visibles
  allDayMissions: Mission[] // Toutes les missions du jour
  
  // Dialogues
  availableDialogues: Dialogue[]
  readDialogues: string[]
  
  // États de vue
  currentView: 'hub' | 'dispatch' | 'village'
  isInDispatch: boolean
  dispatchTimer: number // Secondes restantes
  dispatchElapsed: number // Secondes écoulées depuis le début
}

export interface MissionResult {
  mission: Mission
  success: boolean
  goldEarned: number
  experienceEarned: number
  heroIds: string[]
}
