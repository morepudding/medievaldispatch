import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * PUT /api/save/[id]/buildings
 * Met à jour le niveau d'un bâtiment du joueur
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const saveId = params.id;
    const body = await request.json();
    const { building_id, level } = body;

    if (!building_id || level === undefined) {
      return NextResponse.json(
        { success: false, error: 'building_id et level sont requis' },
        { status: 400 }
      );
    }

    // Mettre à jour le bâtiment
    const updatedBuilding = await prisma.playerBuilding.update({
      where: {
        save_id_building_id: {
          save_id: saveId,
          building_id: building_id
        }
      },
      data: {
        level: level
      },
      include: {
        building: {
          include: {
            levels: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedBuilding
    });

  } catch (error) {
    console.error('Erreur mise à jour bâtiment:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour du bâtiment' },
      { status: 500 }
    );
  }
}
