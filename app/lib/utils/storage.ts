import type { VillageHeroPlacement } from '../../types/game'

// Clés de stockage pour les préférences UI locales uniquement
// Les sauvegardes de jeu sont maintenant dans la DB via /api/save
export const STORAGE_KEYS = {
  STAMPS: 'medieval-dispatch-stamps',
  VILLAGE_PLACEMENTS: 'medieval-dispatch-village-placements'
} as const

interface Stamp {
  id: string
  src: string
  alt: string
  x: number
  y: number
  width: number
  zIndex: number
}

// StorageManager ne gère plus que les préférences UI locales
// Les données de jeu (héros, missions, bâtiments, etc.) sont dans la DB
export const StorageManager = {
  // Stamps (positions des images sur la carte)
  saveStamps: (stamps: Stamp[]): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.STAMPS, JSON.stringify(stamps))
      return true
    } catch (e) {
      console.error('Erreur sauvegarde Stamps:', e)
      return false
    }
  },

  loadStamps: (): Stamp[] | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAMPS)
      if (saved) {
        return JSON.parse(saved)
      }
      return null
    } catch (e) {
      console.error('Erreur chargement Stamps:', e)
      return null
    }
  },

  // Village placements (positions des héros dans le village)
  saveVillagePlacements: (placements: VillageHeroPlacement[]): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.VILLAGE_PLACEMENTS, JSON.stringify(placements))
      return true
    } catch (e) {
      console.error('Erreur sauvegarde Village Placements:', e)
      return false
    }
  },

  loadVillagePlacements: (): VillageHeroPlacement[] | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VILLAGE_PLACEMENTS)
      if (saved) {
        return JSON.parse(saved)
      }
      return null
    } catch (e) {
      console.error('Erreur chargement Village Placements:', e)
      return null
    }
  }
}
