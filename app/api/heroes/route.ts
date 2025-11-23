import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// Cache de 1 heure
export const revalidate = 3600

/**
 * GET /api/heroes
 * Retourne tous les héros actifs avec leurs images
 */
export async function GET() {
  try {
    const heroes = await prisma.hero.findMany({
      where: {
        is_active: true
      },
      include: {
        images: {
          where: {
            is_default: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Mapper vers le format attendu par le jeu
    const formattedHeroes = heroes.map(hero => ({
      id: hero.slug, // Utiliser slug comme ID pour compatibilité
      name: hero.name,
      src: hero.images[0]?.url || '/portraits/default.png',
      alt: hero.name,
      color: '#ff4444', // Couleur par défaut, à améliorer plus tard
      stats: {
        force: hero.strength,
        dexterite: hero.stealth,
        sagesse: hero.diplomacy,
        intelligence: hero.intelligence,
        vitalite: hero.strength // Approximation pour l'instant
      },
      isAvailable: true
    }))

    return NextResponse.json(formattedHeroes)
  } catch (error) {
    console.error('Error fetching heroes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch heroes' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
