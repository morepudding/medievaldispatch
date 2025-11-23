import type { Hero, Mission, MissionRequirement } from '../../types/game'

export const MissionCalculator = {
  /**
   * Calcule le taux de réussite d'une mission basé sur les stats des héros
   * @param heroes - Liste des héros assignés à la mission
   * @param mission - La mission à évaluer
   * @returns Pourcentage de réussite (0-100)
   */
  calculateSuccessRate: (heroes: Hero[], mission: Mission): number => {
    // Sommer les stats de tous les héros assignés
    const totalStats = heroes.reduce(
      (acc, hero) => ({
        force: acc.force + hero.stats.force,
        dexterite: acc.dexterite + hero.stats.dexterite,
        intelligence: acc.intelligence + hero.stats.intelligence,
        sagesse: acc.sagesse + hero.stats.sagesse,
        vitalite: acc.vitalite + hero.stats.vitalite
      }),
      { force: 0, dexterite: 0, intelligence: 0, sagesse: 0, vitalite: 0 }
    )

    // Calculer le pourcentage de réussite pour chaque stat requise
    const req = mission.requiredStats
    let totalPercentage = 0
    let statCount = 0

    if (req.force) {
      totalPercentage += Math.min(150, (totalStats.force / req.force) * 100)
      statCount++
    }
    if (req.dexterite) {
      totalPercentage += Math.min(150, (totalStats.dexterite / req.dexterite) * 100)
      statCount++
    }
    if (req.intelligence) {
      totalPercentage += Math.min(150, (totalStats.intelligence / req.intelligence) * 100)
      statCount++
    }
    if (req.sagesse) {
      totalPercentage += Math.min(150, (totalStats.sagesse / req.sagesse) * 100)
      statCount++
    }
    if (req.vitalite) {
      totalPercentage += Math.min(150, (totalStats.vitalite / req.vitalite) * 100)
      statCount++
    }

    const averagePercentage = statCount > 0 ? totalPercentage / statCount : 50

    // Ajouter un facteur aléatoire de ±20%
    const randomFactor = Math.random() * 40 - 20
    const finalChance = Math.max(0, Math.min(100, averagePercentage + randomFactor))

    return finalChance
  },

  /**
   * Détermine si une mission est réussie basée sur un roll aléatoire
   * @param successRate - Taux de réussite (0-100)
   * @returns true si la mission est réussie
   */
  rollSuccess: (successRate: number): boolean => {
    const roll = Math.random() * 100
    return roll <= successRate
  },

  /**
   * Calcule la récompense en or basée sur le résultat de la mission
   * @param mission - La mission complétée
   * @param success - true si la mission est réussie
   * @returns Montant d'or gagné
   */
  calculateReward: (mission: Mission, success: boolean): number => {
    return success ? mission.goldReward : Math.floor(mission.goldReward * 0.5)
  },

  /**
   * Vérifie si une mission est complétée (temps écoulé)
   * @param mission - La mission à vérifier
   * @param currentTime - Timestamp actuel
   * @returns true si la mission est terminée
   */
  checkCompletion: (mission: Mission, currentTime: number): boolean => {
    if (!mission.startTime) return false
    const elapsed = (currentTime - mission.startTime) / 1000
    return elapsed >= mission.duration
  },

  /**
   * Calcule la compatibilité d'un héros avec une mission (0-100%)
   * @param hero - Le héros à évaluer
   * @param mission - La mission
   * @returns Pourcentage de compatibilité
   */
  getCompatibility: (hero: Hero, mission: Mission): number => {
    const req = mission.requiredStats
    let totalMatch = 0
    let statCount = 0

    if (req.force) {
      totalMatch += Math.min(100, (hero.stats.force / req.force) * 100)
      statCount++
    }
    if (req.dexterite) {
      totalMatch += Math.min(100, (hero.stats.dexterite / req.dexterite) * 100)
      statCount++
    }
    if (req.intelligence) {
      totalMatch += Math.min(100, (hero.stats.intelligence / req.intelligence) * 100)
      statCount++
    }
    if (req.sagesse) {
      totalMatch += Math.min(100, (hero.stats.sagesse / req.sagesse) * 100)
      statCount++
    }
    if (req.vitalite) {
      totalMatch += Math.min(100, (hero.stats.vitalite / req.vitalite) * 100)
      statCount++
    }

    return statCount > 0 ? totalMatch / statCount : 50
  },

  /**
   * Calcule la stat dominante d'un héros
   * @param hero - Le héros à analyser
   * @returns Le nom de la stat la plus élevée
   */
  getDominantStat: (hero: Hero): keyof MissionRequirement => {
    const stats = hero.stats
    const max = Math.max(stats.force, stats.dexterite, stats.intelligence, stats.sagesse, stats.vitalite)

    if (stats.force === max) return 'force'
    if (stats.dexterite === max) return 'dexterite'
    if (stats.intelligence === max) return 'intelligence'
    if (stats.sagesse === max) return 'sagesse'
    return 'vitalite'
  }
}
