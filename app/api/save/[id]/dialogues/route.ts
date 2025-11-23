import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/save/[id]/dialogues
 * Marque un dialogue comme lu
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const saveId = params.id;
    const body = await request.json();
    const { dialogue_id } = body;

    if (!dialogue_id) {
      return NextResponse.json(
        { success: false, error: 'dialogue_id est requis' },
        { status: 400 }
      );
    }

    // Vérifier si le dialogue a déjà été lu
    const existing = await prisma.playerDialogue.findUnique({
      where: {
        save_id_dialogue_id: {
          save_id: saveId,
          dialogue_id: dialogue_id
        }
      }
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Dialogue déjà marqué comme lu',
        data: existing
      });
    }

    // Marquer comme lu
    const playerDialogue = await prisma.playerDialogue.create({
      data: {
        save_id: saveId,
        dialogue_id: dialogue_id
      },
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
    });

    return NextResponse.json({
      success: true,
      data: playerDialogue
    });

  } catch (error) {
    console.error('Erreur marquage dialogue:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors du marquage du dialogue' },
      { status: 500 }
    );
  }
}
