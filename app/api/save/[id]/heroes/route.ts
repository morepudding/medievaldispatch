import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * PUT /api/save/[id]/heroes
 * Met à jour les stats et état des héros du joueur
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const saveId = params.id;
    const body = await request.json();
    const { heroes } = body; // Array de PlayerHero à mettre à jour

    if (!Array.isArray(heroes)) {
      return NextResponse.json(
        { success: false, error: 'Le champ heroes doit être un tableau' },
        { status: 400 }
      );
    }

    // Mettre à jour chaque héros
    const updatePromises = heroes.map((heroData: any) => {
      return prisma.playerHero.update({
        where: {
          save_id_hero_id: {
            save_id: saveId,
            hero_id: heroData.hero_id
          }
        },
        data: {
          current_strength: heroData.current_strength,
          current_diplomacy: heroData.current_diplomacy,
          current_stealth: heroData.current_stealth,
          current_intelligence: heroData.current_intelligence,
          is_on_mission: heroData.is_on_mission,
          mission_end_time: heroData.mission_end_time,
        }
      });
    });

    await Promise.all(updatePromises);

    // Récupérer les héros mis à jour
    const updatedHeroes = await prisma.playerHero.findMany({
      where: { save_id: saveId },
      include: {
        hero: {
          include: {
            images: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedHeroes
    });

  } catch (error) {
    console.error('Erreur mise à jour héros:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour des héros' },
      { status: 500 }
    );
  }
}
