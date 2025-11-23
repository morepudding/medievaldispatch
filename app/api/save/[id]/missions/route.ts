import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/save/[id]/missions
 * Enregistre une mission complétée
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const saveId = params.id;
    const body = await request.json();
    const { mission_id, success } = body;

    if (!mission_id || typeof success !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'mission_id et success sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si la mission a déjà été complétée
    const existing = await prisma.missionCompletion.findUnique({
      where: {
        save_id_mission_id: {
          save_id: saveId,
          mission_id: mission_id
        }
      }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Mission déjà complétée' },
        { status: 400 }
      );
    }

    // Créer la completion
    const completion = await prisma.missionCompletion.create({
      data: {
        save_id: saveId,
        mission_id: mission_id,
        success: success
      },
      include: {
        mission: {
          include: {
            location: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: completion
    });

  } catch (error) {
    console.error('Erreur enregistrement mission:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'enregistrement de la mission' },
      { status: 500 }
    );
  }
}
