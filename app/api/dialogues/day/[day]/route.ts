import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// Cache de 1 heure
export const revalidate = 3600

/**
 * GET /api/dialogues/day/[day]
 * Retourne tous les dialogues disponibles jusqu'à un jour donné
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

    const dialogues = await prisma.dialogue.findMany({
      where: {
        unlock_day: {
          lte: day // Tous les dialogues jusqu'à ce jour
        }
      },
      include: {
        hero: true,
        exchanges: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: [
        { unlock_day: 'asc' },
        { order: 'asc' }
      ]
    })

    // Mapper vers le format attendu par le jeu
    const formattedDialogues = dialogues.map(dialogue => ({
      id: `day${dialogue.unlock_day}_${dialogue.hero.slug}_${dialogue.order}`,
      heroId: dialogue.hero.slug,
      heroName: dialogue.hero.name,
      unlockDay: dialogue.unlock_day,
      isRead: false, // Sera géré par le state du jeu
      exchanges: dialogue.exchanges.map(exchange => ({
        speaker: exchange.speaker as 'hero' | 'player',
        text: exchange.text,
        emotion: exchange.emotion || 'neutral'
      }))
    }))

    return NextResponse.json(formattedDialogues)
  } catch (error) {
    console.error('Error fetching dialogues:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dialogues' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
