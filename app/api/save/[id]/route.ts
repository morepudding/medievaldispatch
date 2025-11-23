import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/save/[id]
 * Charge une sauvegarde complète avec toutes les relations
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const saveId = params.id;

    const gameSave = await prisma.gameSave.findUnique({
      where: { id: saveId },
      include: {
        player_heroes: {
          include: {
            hero: {
              include: {
                images: true
              }
            }
          }
        },
        player_buildings: {
          include: {
            building: {
              include: {
                levels: true
              }
            }
          }
        },
        player_dialogues: {
          include: {
            dialogue: {
              include: {
                hero: true,
                exchanges: {
                  orderBy: { order: 'asc' }
                }
              }
            }
          }
        },
        mission_completions: {
          include: {
            mission: {
              include: {
                location: true
              }
            }
          }
        }
      }
    });

    if (!gameSave) {
      return NextResponse.json(
        { success: false, error: 'Sauvegarde non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: gameSave
    });

  } catch (error) {
    console.error('Erreur chargement sauvegarde:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors du chargement de la sauvegarde' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/save/[id]
 * Met à jour les données générales de la sauvegarde
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const saveId = params.id;
    const body = await request.json();

    const { current_day, current_time, gold, reputation } = body;

    const updatedSave = await prisma.gameSave.update({
      where: { id: saveId },
      data: {
        ...(current_day !== undefined && { current_day }),
        ...(current_time !== undefined && { current_time }),
        ...(gold !== undefined && { gold }),
        ...(reputation !== undefined && { reputation })
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedSave
    });

  } catch (error) {
    console.error('Erreur mise à jour sauvegarde:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour de la sauvegarde' },
      { status: 500 }
    );
  }
}
