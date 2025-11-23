import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// Cache de 1 heure
export const revalidate = 3600

/**
 * GET /api/missions/day/[day]
 * Retourne toutes les missions d'un jour spécifique
 */
export async function GET(
  request: Request,
  { params }: { params: { day: string } }
) {
  try {
    const day = parseInt(params.day)

    if (isNaN(day) || day < 1 || day > 3) {
      return NextResponse.json(
        { error: 'Invalid day parameter. Must be 1, 2, or 3' },
        { status: 400 }
      )
    }

    const missions = await prisma.mission.findMany({
      where: {
        day: day,
        is_active: true
      },
      include: {
        location: true
      },
      orderBy: {
        spawn_time: 'asc'
      }
    })

    // Mapper vers le format attendu par le jeu
    const formattedMissions = missions.map(mission => ({
      id: mission.slug,
      titre: mission.title,
      description: mission.description,
      locationSrc: mission.location.image_url,
      // Utiliser override position si disponible, sinon position du lieu
      x: mission.override_position_x ?? mission.location.position_x,
      y: mission.override_position_y ?? mission.location.position_y,
      requiredStats: {
        force: mission.required_strength,
        dexterite: mission.required_stealth,
        sagesse: mission.required_diplomacy,
        intelligence: mission.required_intelligence
      },
      difficulty: day === 1 ? 'facile' : day === 2 ? 'moyenne' : 'difficile',
      goldReward: mission.reward_gold,
      experienceReward: mission.reward_reputation,
      duration: mission.duration,
      spawnTime: mission.spawn_time,
      assignedHeroes: [],
      status: 'pending' as const,
      resolutionSuccess: mission.success_text,
      resolutionFailure: mission.failure_text
    }))

    return NextResponse.json(formattedMissions)
  } catch (error) {
    console.error('Error fetching missions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch missions' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
