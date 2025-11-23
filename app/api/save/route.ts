import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/save
 * Crée une nouvelle sauvegarde avec valeurs initiales
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { player_name } = body;

    // Récupérer tous les héros et bâtiments pour initialisation
    const [heroes, buildings] = await Promise.all([
      prisma.hero.findMany({ where: { is_active: true } }),
      prisma.building.findMany()
    ]);

    // Créer la sauvegarde avec toutes les relations
    const gameSave = await prisma.gameSave.create({
      data: {
        player_name: player_name || 'Joueur',
        current_day: 1,
        current_time: 8, // 8h du matin
        gold: 100,
        reputation: 50,
        // Créer les héros du joueur
        player_heroes: {
          create: heroes.map((hero) => ({
            hero_id: hero.id,
            current_strength: hero.strength,
            current_diplomacy: hero.diplomacy,
            current_stealth: hero.stealth,
            current_intelligence: hero.intelligence,
            is_on_mission: false,
            mission_end_time: null,
          }))
        },
        // Créer les bâtiments du joueur (tous niveau 0)
        player_buildings: {
          create: buildings.map((building) => ({
            building_id: building.id,
            level: 0,
          }))
        }
      },
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
        }
      }
    });

    return NextResponse.json({
      success: true,
      save_id: gameSave.id,
      data: gameSave
    });

  } catch (error) {
    console.error('Erreur création sauvegarde:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de la sauvegarde' },
      { status: 500 }
    );
  }
}
