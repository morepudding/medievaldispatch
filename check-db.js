const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    console.log('🔍 Vérification de la base de données...\n');
    
    const heroCount = await prisma.hero.count();
    const missionCount = await prisma.mission.count();
    const dialogueCount = await prisma.dialogue.count();
    const buildingCount = await prisma.building.count();
    const saveCount = await prisma.gameSave.count();
    const locationCount = await prisma.location.count();
    
    console.log('📊 CONTENU DE LA BASE DE DONNÉES:');
    console.log('==================================');
    console.log(`Héros: ${heroCount}`);
    console.log(`Missions: ${missionCount}`);
    console.log(`Dialogues: ${dialogueCount}`);
    console.log(`Bâtiments: ${buildingCount}`);
    console.log(`Lieux: ${locationCount}`);
    console.log(`Sauvegardes: ${saveCount}`);
    console.log('==================================\n');
    
    if (heroCount > 0) {
      console.log('🦸 DÉTAILS DES HÉROS:');
      const heroes = await prisma.hero.findMany({
        select: { slug: true, name: true, strength: true, diplomacy: true, stealth: true, intelligence: true }
      });
      heroes.forEach(h => {
        console.log(`  - ${h.name} (${h.slug}): STR=${h.strength} DIP=${h.diplomacy} STE=${h.stealth} INT=${h.intelligence}`);
      });
      console.log('');
    }
    
    if (missionCount > 0) {
      console.log('⚔️ DÉTAILS DES MISSIONS:');
      const missions = await prisma.mission.findMany({
        select: { title: true, day: true, spawn_time: true, reward_gold: true },
        orderBy: [{ day: 'asc' }, { spawn_time: 'asc' }]
      });
      missions.forEach(m => {
        console.log(`  - Jour ${m.day}, ${m.spawn_time}h: ${m.title} (${m.reward_gold} or)`);
      });
      console.log('');
    }
    
    if (dialogueCount > 0) {
      console.log('💬 DÉTAILS DES DIALOGUES:');
      const dialogues = await prisma.dialogue.findMany({
        include: { hero: { select: { name: true } } },
        orderBy: { unlock_day: 'asc' }
      });
      dialogues.forEach(d => {
        console.log(`  - Jour ${d.unlock_day}: Dialogue avec ${d.hero.name}`);
      });
      console.log('');
    }
    
    if (buildingCount > 0) {
      console.log('🏛️ DÉTAILS DES BÂTIMENTS:');
      const buildings = await prisma.building.findMany({
        include: { levels: { select: { level: true } } }
      });
      buildings.forEach(b => {
        console.log(`  - ${b.icon} ${b.name}: ${b.levels.length} niveaux`);
      });
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
})();
