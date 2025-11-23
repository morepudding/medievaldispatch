import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/save/migrate
 * Migre une sauvegarde localStorage vers la DB
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameState } = body;

    if (!gameState) {
      return NextResponse.json(
        { success: false, error: 'gameState est requis' },
        { status: 400 }
      );
    }

    // Extraire les données du gameState
    const {
      currentDay,
      gold,
      heroes: savedHeroes,
      buildings: savedBuildings,
      completedMissions,
      readDialogues
    } = gameState;

    // Récupérer tous les héros et bâtiments de la DB pour avoir les IDs
    const [allHeroes, allBuildings, allMissions, allDialogues] = await Promise.all([
      prisma.hero.findMany({ where: { is_active: true } }),
      prisma.building.findMany(),
      prisma.mission.findMany({ where: { is_active: true } }),
      prisma.dialogue.findMany()
    ]);

    // Créer la sauvegarde avec toutes les relations
    const gameSave = await prisma.gameSave.create({
      data: {
        player_name: 'Joueur (migré)',
        current_day: currentDay || 1,
        current_time: 8,
        gold: gold || 0,
        reputation: 50,
        
        // Créer les héros du joueur avec leurs stats actuelles
        player_heroes: {
          create: savedHeroes.map((savedHero: any) => {
            const dbHero = allHeroes.find((h: any) => h.id === savedHero.id);
            if (!dbHero) {
              throw new Error(`Héros ${savedHero.id} non trouvé en DB`);
            }
            
            return {
              hero_id: dbHero.id,
              current_strength: savedHero.stats?.force || dbHero.strength,
              current_diplomacy: savedHero.stats?.sagesse || dbHero.diplomacy,
              current_stealth: savedHero.stats?.dexterite || dbHero.stealth,
              current_intelligence: savedHero.stats?.intelligence || dbHero.intelligence,
              is_on_mission: !savedHero.isAvailable,
              mission_end_time: null,
            };
          })
        },
        
        // Créer les bâtiments du joueur avec leurs niveaux actuels
        player_buildings: {
          create: savedBuildings.map((savedBuilding: any) => {
            const dbBuilding = allBuildings.find((b: any) => b.id === savedBuilding.id);
            if (!dbBuilding) {
              throw new Error(`Bâtiment ${savedBuilding.id} non trouvé en DB`);
            }
            
            return {
              building_id: dbBuilding.id,
              level: savedBuilding.level || 0
            };
          })
        },
        
        // Créer les missions complétées
        mission_completions: {
          create: (completedMissions || [])
            .filter((missionId: string) => {
              // Vérifier que la mission existe en DB
              return allMissions.some((m: any) => m.id === missionId);
            })
            .map((missionId: string) => ({
              mission_id: missionId,
              success: true // On suppose que les missions complétées étaient des succès
            }))
        },
        
        // Créer les dialogues lus
        player_dialogues: {
          create: (readDialogues || [])
            .filter((dialogueId: string) => {
              // Vérifier que le dialogue existe en DB
              return allDialogues.some((d: any) => d.id === dialogueId);
            })
            .map((dialogueId: string) => ({
              dialogue_id: dialogueId
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
      message: 'Sauvegarde migrée avec succès !',
      data: gameSave
    });

  } catch (error) {
    console.error('Erreur migration sauvegarde:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la migration de la sauvegarde',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
