# 🎨 Roadmap Curator - Medieval Dispatch

**Date**: 23 novembre 2025  
**Objectif**: Pipeline de génération de contenu par IA avec curator

---

## 📋 Contexte

Ce document structure les demandes de contenu à envoyer au curator (pipeline IA). Le système actuel utilise une database PostgreSQL (Supabase) avec Prisma ORM. Le curator génère le contenu, nous créons les mécaniques de jeu et les entrées de base de données.

**Notre rôle** :
- ✅ Créer les mécaniques de jeu
- ✅ Créer les entrées dans la database (schéma Prisma)
- ✅ Envoyer les demandes de contenu au curator
- ✅ Intégrer le contenu généré dans le jeu

**Rôle du curator** :
- 🤖 Générer les textes (missions, dialogues, descriptions)
- 🎨 Générer les images (portraits, lieux, icônes)
- 📝 Respecter les contraintes techniques du système

---

## 🎯 Phase 1 : Contenu pour le système actuel (PRIORITÉ MAXIMALE)

Le jeu fonctionne avec un cycle de 3 jours, alternant phases Dispatch (60s) et phases Village (sociales).

### 1.1 Héros (9 héros MVP)

**Schéma DB existant** : Table `heroes` + `hero_images`

#### Données à générer par héros :

**Texte** :
```json
{
  "slug": "bjorn",
  "name": "Bjorn le Hardi",
  "title": "Guerrier du Nord",
  "description": "Un combattant redoutable au courage légendaire.",
  "lore": "Né dans les terres glacées du nord, Bjorn a combattu...",
  "stats": {
    "strength": 8,
    "diplomacy": 3,
    "stealth": 2,
    "intelligence": 4
  }
}
```

**Images actuellement utilisées** :
- `portrait_full` : Portrait complet (180x250px) - utilisé dans dialogues et UI
- `icon` : Icône carrée (64x64px) - utilisé dans listes et menus

**Liste des 9 héros MVP** :
1. **Bjorn** - Guerrier, force et courage (couleur: #ff4444)
2. **Owen** - Archer/éclaireur, dextérité (couleur: #44ff44)
3. **Vi** - Mage, intelligence et sagesse (couleur: #aa44ff)
4. **Durun** - Nain forgeron, force et craft (couleur: #ff8844)
5. **Elira** - Elfe diplomate, sagesse et charisme (couleur: #4488ff)
6. **Kael** - Voleur/rogue, dextérité et ruse (couleur: #888888)
7. **Mira** - Prêtresse, sagesse et soin (couleur: #ffdd44)
8. **Thorne** - Paladin, force et diplomatie (couleur: #44ddff)
9. **Zara** - Ranger, dextérité et survie (couleur: #88ff88)

**Consignes style** :
- Univers médiéval-fantastique (Dungeons & Dragons like)
- Tons chauds et contrastés pour les portraits
- Personnalités distinctes et mémorables
- Diversité de races (humains, elfes, nains, etc.)

---

### 1.2 Lieux (4-5 lieux MVP)

**Schéma DB existant** : Table `locations`

#### Données à générer par lieu :

**Texte** :
```json
{
  "slug": "foret-neverwinter",
  "name": "Forêt de Neverwinter",
  "description": "Une forêt dense où rôdent bandits et créatures sauvages.",
  "position_x": 10.0,
  "position_y": 10.0
}
```

**Images** :
- Image du lieu (400x300px) - vue panoramique/isométrique
- Style : illustration stylisée, pas photoréaliste
- Compatible avec fond de carte parchemin

**Liste des lieux MVP** :
1. **Forêt de Neverwinter** - Forêt dense, mystérieuse
2. **Grotte des Échos** - Grotte profonde, dangereuse
3. **Ruines de Thundertree** - Ruines antiques, hantées
4. **Village de Phandalin** - Village médiéval, accueillant
5. **Cragmaw Hideout** - Repaire de gobelins, sombre

---

### 1.3 Missions (12-15 missions pour 3 jours)

**Schéma DB existant** : Table `missions`

#### Structure d'une mission :

**Texte** :
```json
{
  "slug": "escorte-convoi",
  "title": "Escorte du convoi",
  "description": "Un marchand demande protection pour traverser la forêt dangereuse.",
  "location_slug": "foret-neverwinter",
  "day": 1,
  "spawn_time": 0,
  "duration": 15,
  "required_strength": 5,
  "required_diplomacy": 0,
  "required_stealth": 2,
  "required_intelligence": 0,
  "reward_gold": 80,
  "reward_reputation": 10,
  "success_text": "Le convoi arrive sain et sauf. Le marchand vous remercie chaleureusement.",
  "failure_text": "Les bandits vous prennent par surprise. Le marchand perd sa cargaison."
}
```

**Répartition par jour** :
- **Jour 1** : 4 missions (faciles, 300-400 or total)
- **Jour 2** : 5 missions (moyennes, 500-600 or total)
- **Jour 3** : 6 missions (difficiles, 800-1000 or total)

**Consignes** :
- Missions variées : combat, exploration, diplomatie, furtivité
- Textes concis mais évocateurs (max 200 caractères pour description)
- Success/failure texts : 1-2 phrases, impact narratif
- Stats requises cohérentes avec le type de mission

---

### 1.4 Dialogues (5-6 dialogues pour 3 jours)

**Schéma DB existant** : Table `dialogues` + `dialogue_exchanges`

#### Structure d'un dialogue :

**Texte** :
```json
{
  "hero_slug": "bjorn",
  "unlock_day": 1,
  "order": 0,
  "exchanges": [
    {
      "order": 0,
      "speaker": "hero",
      "text": "Cette ville a besoin de protection. Je suis là pour ça.",
      "emotion": "neutral",
      "image_type": "portrait_full"
    },
    {
      "order": 1,
      "speaker": "player",
      "text": "Nous avons de la chance de t'avoir avec nous, Bjorn.",
      "emotion": null,
      "image_type": null
    },
    {
      "order": 2,
      "speaker": "hero",
      "text": "La chance n'a rien à voir là-dedans. C'est une question d'honneur.",
      "emotion": "happy",
      "image_type": "portrait_full"
    }
  ]
}
```

**Répartition** :
- **Jour 1** : 2 dialogues (introduction des héros)
- **Jour 2** : 2 dialogues (développement de personnalité)
- **Jour 3** : 1-2 dialogues (révélations, liens)

**Consignes** :
- 3-5 échanges par dialogue maximum
- Révéler la personnalité du héros progressivement
- Ton médiéval mais accessible (pas trop archaïque)
- Émotions : 'neutral', 'happy', 'sad', 'angry', 'surprised'

---

### 1.5 Bâtiments (5 bâtiments avec 3 niveaux chacun)

**Schéma DB existant** : Table `buildings` + `building_levels`

#### Données à générer :

**Texte** :
```json
{
  "slug": "forge",
  "name": "Forge",
  "icon": "🔨",
  "description": "La forge de Phandalin résonne du bruit des marteaux.",
  "levels": [
    {
      "level": 1,
      "cost_gold": 0,
      "cost_reputation": 0,
      "description": "Forge basique. +5% dégâts d'armes pour vos héros."
    },
    {
      "level": 2,
      "cost_gold": 500,
      "cost_reputation": 10,
      "description": "Forge améliorée. +10% dégâts et +5% défense."
    },
    {
      "level": 3,
      "cost_gold": 800,
      "cost_reputation": 20,
      "description": "Forge maîtresse. +15% dégâts, armes légendaires disponibles."
    }
  ]
}
```

**Liste des 5 bâtiments** :
1. **🔨 Forge** - Améliore combat et équipement
2. **🏛️ Hôtel de Ville** - Augmente revenus et débloquer quêtes
3. **🛒 Marché** - Réduit coûts et accès aux objets rares
4. **🍺 Auberge** - Boost moral et récupération des héros
5. **🗼 Tour de Garde** - Améliore défense et vision de la carte

**Coûts progressifs** :
- Niveau 1→2 : 500-600 or
- Niveau 2→3 : 800-1000 or

---

## 🔥 Phase 2 : Contenu critique à implémenter (PRIORITÉ HAUTE)

Ces éléments sont définis dans le schéma DB mais pas encore pleinement utilisés dans le jeu.

### 2.1 Portraits avec émotions pour dialogues

**Problème actuel** : Un seul portrait par héros, pas d'expressions.

**Schéma DB** : `hero_images.image_type` supporte déjà : `'happy'`, `'sad'`, `'angry'`, `'neutral'`, `'surprised'`

**À générer par héros (9 héros × 5 émotions = 45 images)** :
- `portrait_happy` : Sourire, regard chaleureux
- `portrait_sad` : Tristesse, regard baissé
- `portrait_angry` : Colère, sourcils froncés
- `portrait_neutral` : Expression neutre par défaut
- `portrait_surprised` : Yeux écarquillés, bouche ouverte

**Format** : 180x250px, même cadrage que portrait_full

**Impact mécanique** :
- Dialogues plus vivants et expressifs
- Émotions changent selon le contexte (échec de mission = sad, succès = happy)
- `dialogue_exchanges.emotion` déjà prévu dans la DB

**Tâche développeur** :
- Modifier `DialogueModal.tsx` pour charger l'image selon `emotion`
- Créer API `/api/heroes/[id]/images/[emotion]` si nécessaire
- Utiliser `hero_images.image_type` pour filtrer

---

### 2.2 Résolutions de quêtes narratives

**Problème actuel** : Textes success/failure simples, pas de conséquences.

**Schéma DB** : `missions.success_text` et `missions.failure_text` existent

**À améliorer** :
1. **Textes plus riches** (2-3 phrases au lieu de 1)
2. **Variantes selon héros assignés** (ex: Bjorn vs Vi → approches différentes)
3. **Conséquences narratives** (mentionner réputation, relations, suite)

**Exemple amélioré** :
```json
{
  "success_text": "Grâce à la force de Bjorn et à la ruse de Kael, le convoi traverse la forêt sans encombre. Le marchand promet de parler de vous aux guildes de Neverwinter. (+10 réputation)",
  "failure_text": "Les bandits, plus nombreux que prévu, submergent vos héros. Le marchand perd sa cargaison et jure de ne plus faire appel à vous. (-5 réputation)"
}
```

**Tâche développeur** :
- Ajouter système de réputation (table `game_saves.reputation` existe déjà)
- Afficher résolution avec animation/modal dédiée
- Stocker résolutions dans `mission_completions` avec `success` boolean

---

### 2.3 Phrases d'ambiance pour la carte/village

**Problème actuel** : UI muette, manque d'immersion.

**Nouveaux besoins** :
- **Phrases d'ambiance aléatoires** pour chaque lieu (3-5 par lieu)
- **Descriptions de bâtiments** au survol (texte court, 1 ligne)
- **Réactions de héros** aux actions (mission assignée, dialogue, amélioration)

**Schéma DB à étendre** :
```sql
-- Nouvelle table (à créer)
CREATE TABLE ambient_texts (
  id UUID PRIMARY KEY,
  type VARCHAR(50),  -- 'location', 'building', 'hero_reaction'
  context VARCHAR(100), -- 'foret-neverwinter', 'forge', 'mission_assigned'
  text TEXT,
  created_at TIMESTAMP
);
```

**Exemples** :
```json
// Location ambiance
{
  "type": "location",
  "context": "foret-neverwinter",
  "text": "Des bruissements inquiétants résonnent entre les arbres..."
}

// Hero reaction
{
  "type": "hero_reaction",
  "context": "bjorn_mission_success",
  "text": "Bjorn essuie son épée avec satisfaction."
}

// Building hover
{
  "type": "building",
  "context": "forge_level_2",
  "text": "Des étincelles jaillissent de l'enclume. L'artisan martèle une nouvelle épée."
}
```

**Tâche développeur** :
- Créer migration Prisma pour `ambient_texts`
- API `/api/ambient/[type]/[context]`
- Composant `<AmbientText>` avec rotation aléatoire
- Intégrer dans `dispatch/page.tsx` et `VillageModal.tsx`

---

## 💭 Phase 3 : Réflexions sur l'évolution du jeu

### 3.1 État actuel du système

**Forces** :
- ✅ Cycle de jeu fonctionnel (3 jours, Dispatch + Village)
- ✅ Architecture DB solide (séparation contenu/sauvegarde)
- ✅ Timer 60s avec spawn progressif de missions
- ✅ Calcul de réussite basé sur stats
- ✅ Système de dialogues multi-échanges
- ✅ Bâtiments améliorables (mécanique présente)

**Limites actuelles** :
- ❌ Pas de rejouabilité (fin après jour 3)
- ❌ Pas de progression des héros (XP, niveaux)
- ❌ Bâtiments ne donnent pas de bonus réels
- ❌ Pas de gestion d'équipement
- ❌ Pas de relations entre héros
- ❌ Pas de événements aléatoires

---

### 3.2 Axes d'évolution prioritaires

#### A) Système de progression des héros

**Pourquoi** : Donner du sens aux missions répétées, attachment émotionnel

**Mécanique** :
- Expérience (XP) gagnée par mission
- Niveaux de héros (1-10 pour MVP)
- Stats augmentent par niveau (+1 stat au choix par niveau)
- Déblocage de capacités spéciales (niveau 5, 10)

**Schéma DB à ajouter** :
```sql
ALTER TABLE player_heroes ADD COLUMN xp INT DEFAULT 0;
ALTER TABLE player_heroes ADD COLUMN level INT DEFAULT 1;

CREATE TABLE hero_abilities (
  id UUID PRIMARY KEY,
  hero_id UUID REFERENCES heroes(id),
  name VARCHAR(100),
  description TEXT,
  unlock_level INT,
  ability_type VARCHAR(50) -- 'passive', 'active'
);
```

**Demandes au curator** :
- Capacités uniques par héros (ex: Bjorn = "Cri de guerre", Vi = "Boule de feu")
- Descriptions des capacités (50-100 mots)
- Icônes pour capacités (64x64px)

---

#### B) Système de relations entre héros

**Pourquoi** : Profondeur narrative, synergies de gameplay

**Mécanique** :
- Affinités entre héros (+10% réussite si duo compatible)
- Rivalités (-5% si duo incompatible)
- Dialogues débloqués par relations (Bjorn + Durun = dialogue spécial)

**Schéma DB** :
```sql
CREATE TABLE hero_relationships (
  id UUID PRIMARY KEY,
  hero_a_id UUID REFERENCES heroes(id),
  hero_b_id UUID REFERENCES heroes(id),
  relationship_type VARCHAR(50), -- 'ally', 'rival', 'mentor', 'romantic'
  affinity_bonus INT, -- -10 à +20
  description TEXT
);
```

**Demandes au curator** :
- Matrice de relations pour les 9 héros (9x9 = 81 relations, simplifier à 15-20 clés)
- Textes d'explication (ex: "Bjorn et Durun se sont battus ensemble autrefois")
- Dialogues spéciaux pour 5-6 paires de héros

---

#### C) Événements aléatoires et choix narratifs

**Pourquoi** : Rejouabilité, conséquences des choix

**Mécanique** :
- Événements aléatoires pendant Dispatch (1 chance sur 3 par jour)
- Choix binaires avec conséquences (gain/perte or, réputation, etc.)
- Événements débloquent missions cachées ou dialogues secrets

**Exemple d'événement** :
```json
{
  "title": "Voyageur égaré",
  "description": "Un vieil homme demande de l'aide pour retrouver son chemin.",
  "choices": [
    {
      "text": "L'aider (+5 réputation, -10 minutes)",
      "consequence": { "reputation": 5, "time_penalty": 10 }
    },
    {
      "text": "L'ignorer (pas de conséquence)",
      "consequence": {}
    }
  ]
}
```

**Schéma DB** :
```sql
CREATE TABLE random_events (
  id UUID PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  trigger_chance FLOAT, -- 0.0 à 1.0
  day_available INT -- 1, 2, 3 ou NULL = tous les jours
);

CREATE TABLE event_choices (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES random_events(id),
  choice_text TEXT,
  gold_change INT,
  reputation_change INT,
  unlock_mission_id UUID REFERENCES missions(id) -- optionnel
);
```

**Demandes au curator** :
- 10-15 événements variés (combat, social, exploration)
- 2-3 choix par événement
- Textes courts et percutants (100-150 mots)

---

#### D) Cycle infini et meta-progression

**Pourquoi** : Passer d'un MVP 3 jours à un jeu rejouable

**Mécanique** :
- Après jour 3 → Réinitialisation "soft" (nouveau cycle, héros gardent niveaux)
- Objectifs hebdomadaires/mensuels (ex: "Terminer 50 missions")
- Monnaie premium (gemmes) pour débloquer héros/skins permanents
- Saisons thématiques (Halloween, Noël, etc.)

**Schéma DB** :
```sql
ALTER TABLE game_saves ADD COLUMN cycle_number INT DEFAULT 1;
ALTER TABLE game_saves ADD COLUMN total_missions_completed INT DEFAULT 0;
ALTER TABLE game_saves ADD COLUMN gems INT DEFAULT 0;

CREATE TABLE seasonal_content (
  id UUID PRIMARY KEY,
  season_name VARCHAR(100),
  start_date DATE,
  end_date DATE,
  mission_ids JSON, -- IDs de missions spéciales
  reward_hero_id UUID REFERENCES heroes(id) -- Héros exclusif
);
```

**Demandes au curator** :
- Concepts de saisons (4 saisons/an)
- Héros saisonniers (design + lore)
- Missions thématiques (10 missions/saison)

---

### 3.3 Priorités d'implémentation (après Phase 2)

**Court terme (1-2 mois)** :
1. ✅ Système de progression héros (XP, niveaux, capacités)
2. ✅ Relations entre héros (affinités, dialogues spéciaux)
3. ✅ Bonus réels pour bâtiments (actuellement juste visuel)

**Moyen terme (3-6 mois)** :
4. ✅ Événements aléatoires et choix narratifs
5. ✅ Équipement et inventaire
6. ✅ Nouveau cycle (jours 4-7) avec missions plus difficiles

**Long terme (6-12 mois)** :
7. ✅ Cycle infini et meta-progression
8. ✅ Saisons et contenu temporaire
9. ✅ Système de guilde/coopération (multijoueur asynchrone)

---

## 📊 Format de livraison du contenu

### Pour faciliter l'intégration, le curator doit fournir :

**1. Fichiers JSON structurés** :
```
content/
  heroes.json
  missions.json
  dialogues.json
  locations.json
  buildings.json
```

**2. Assets organisés** :
```
assets/
  portraits/
    bjorn/
      portrait_full.png
      portrait_happy.png
      portrait_sad.png
      portrait_angry.png
      portrait_neutral.png
      portrait_surprised.png
      icon.png
  locations/
    foret-neverwinter.png
    grotte-echos.png
    ...
```

**3. Script de seed Prisma** :
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import heroesData from './content/heroes.json'
// ...

async function main() {
  // Insérer les données dans la DB
}
```

---

## 🎯 Checklist Phase 1 (à envoyer au curator)

### Contenu textuel :
- [ ] 9 héros (nom, description, lore, stats)
- [ ] 5 lieux (nom, description)
- [ ] 15 missions (titre, description, success/failure texts)
- [ ] 6 dialogues (3-5 échanges chacun)
- [ ] 5 bâtiments (3 niveaux chacun, descriptions)

### Assets visuels :
- [ ] 9 portraits de héros (portrait_full, 180x250px)
- [ ] 9 icônes de héros (icon, 64x64px)
- [ ] 5 images de lieux (400x300px)

### Format de livraison :
- [ ] Fichiers JSON structurés selon schéma Prisma
- [ ] Assets PNG organisés par dossier
- [ ] Script de seed Prisma fourni

**Deadline suggérée** : 2 semaines après validation du cahier des charges

---

## 📞 Communication avec le curator

### Informations à fournir dans chaque demande :

1. **Contexte du jeu** : Univers, ton, mécaniques
2. **Contraintes techniques** : Formats, résolutions, schéma DB
3. **Références visuelles** : Style artistique souhaité
4. **Deadlines** : Dates de livraison attendues
5. **Format de livraison** : JSON, CSV, assets organisés

### Validation du contenu généré :

- ✅ Vérification cohérence narrative
- ✅ Test d'intégration dans la DB (script seed)
- ✅ Validation assets (résolution, format, poids)
- ✅ Feedback et itérations si nécessaire

---

**Dernière mise à jour** : 23 novembre 2025  
**Version** : 1.0  
**Responsable** : Équipe Medieval Dispatch
