import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// Cache de 1 heure
export const revalidate = 3600

/**
 * GET /api/buildings
 * Retourne tous les bâtiments avec leurs niveaux
 */
export async function GET() {
  try {
    const buildings = await prisma.building.findMany({
      include: {
        levels: {
          orderBy: {
            level: 'asc'
          }
        }
      },
      orderBy: {
        slug: 'asc'
      }
    })

    // Mapper vers le format attendu par le jeu
    const formattedBuildings = buildings.map(building => {
      // Extraire les coûts d'upgrade et les bonus
      const upgradeCosts = building.levels.map(level => level.cost_gold)
      const bonuses = building.levels.map(level => ({
        level: level.level,
        description: level.description
      }))

      return {
        id: building.slug,
        name: `${building.icon} ${building.name}`,
        icon: building.icon,
        level: 0, // Niveau initial (0)
        maxLevel: Math.max(...building.levels.map(l => l.level)),
        description: building.description,
        upgradeCosts: upgradeCosts,
        bonuses: bonuses
      }
    })

    return NextResponse.json(formattedBuildings)
  } catch (error) {
    console.error('Error fetching buildings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch buildings' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
