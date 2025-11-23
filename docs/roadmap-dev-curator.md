# 🔧 Roadmap Dev - Adaptations pour contenu Curator

**Date**: 23 novembre 2025  
**Objectif**: Préparer et adapter le système pour intégrer le contenu enrichi du curator

---

## 📋 Vue d'ensemble

Cette roadmap liste **nos tâches développeur** pour exploiter le contenu généré par le curator. Chaque phase du curator (`roadmapcuratorv2.md`) nécessite des adaptations techniques de notre côté.

**Principe** : Le curator génère du contenu riche et **le dépose directement dans la DB Supabase** → nous adaptons le code pour l'afficher/utiliser correctement.

**Important** : Le curator a un accès direct en écriture à la DB (tables de contenu uniquement, pas les saves joueurs).

---

## 🚀 PHASE 1 DEV : Préparer l'intégration du contenu enrichi

**Note** : Le curator UPDATE/INSERT directement dans la DB. Nos tâches = adapter le code pour exploiter ces nouvelles données.

### 1.1 Configuration accès DB Curator

**Tâche** : Créer un user curator avec permissions restreintes

**Script SQL** : `prisma/setup/curator_permissions.sql`
```sql
-- Créer role curator avec accès limité
CREATE ROLE curator_role;

-- Tables de CONTENU (read/write)
GRANT SELECT, INSERT, UPDATE ON heroes TO curator_role;
GRANT SELECT, INSERT, UPDATE ON hero_images TO curator_role;
GRANT SELECT, INSERT, UPDATE ON missions TO curator_role;
GRANT SELECT, INSERT, UPDATE ON dialogues TO curator_role;
GRANT SELECT, INSERT, UPDATE ON dialogue_exchanges TO curator_role;
GRANT SELECT, INSERT, UPDATE ON buildings TO curator_role;
GRANT SELECT, INSERT, UPDATE ON building_levels TO curator_role;
GRANT SELECT, INSERT, UPDATE ON locations TO curator_role;

-- Tables de SAVE (interdit)
REVOKE ALL ON game_saves FROM curator_role;
REVOKE ALL ON player_heroes FROM curator_role;
REVOKE ALL ON player_buildings FROM curator_role;
REVOKE ALL ON player_dialogues FROM curator_role;
REVOKE ALL ON mission_completions FROM curator_role;

-- Créer user curator
CREATE USER curator_pipeline WITH PASSWORD 'CHANGE_ME';
GRANT curator_role TO curator_pipeline;
```

**Commandes** :
```bash
# Exécuter sur DB dev
psql $DATABASE_URL -f prisma/setup/curator_permissions.sql

# Générer credentials pour le curator
echo "DATABASE_URL_CURATOR=postgresql://curator_pipeline:PASSWORD@db.xxx.supabase.co:6543/postgres"
```

**À fournir au curator** :
- `DATABASE_URL_CURATOR` (connexion avec permissions limitées)
- Documentation schéma tables (`docs/database.md`)

---

### 1.2 Scripts de migration SQL ~~(SUPPRIMÉ)~~

~~**Besoin** : Remplacer le contenu placeholder par le contenu curator~~

**⚠️ PLUS NÉCESSAIRE** : Le curator fait les UPDATE/INSERT lui-même directement dans la DB.

**Notre rôle** : Juste valider que le contenu est bien arrivé.

**Commandes de vérification** :
```bash
# Vérifier héros enrichis
psql $DATABASE_URL -c "SELECT slug, LENGTH(description), LENGTH(lore) FROM heroes;"

# Vérifier dialogues créés
psql $DATABASE_URL -c "SELECT COUNT(*) FROM dialogues GROUP BY unlock_day;"

# Vérifier missions enrichies
psql $DATABASE_URL -c "SELECT slug, LENGTH(success_text) FROM missions LIMIT 5;"
```

---

### 1.3 Extension du schéma Prisma (nouveaux champs)

**Besoin** : Préparer le schéma pour les nouvelles données que le curator va insérer

**Modifications `prisma/schema.prisma`** :

```prisma
model Hero {
  // ... champs existants ...
  
  // NOUVEAUX champs pour contenu curator
  voice              String?     @db.Text  // Ton/style de dialogue
  secret             String?     @db.Text  // Secret caché du héros
  arc_day1           String?     @db.Text  // État narratif jour 1
  arc_day2           String?     @db.Text  // État narratif jour 2
  arc_day3           String?     @db.Text  // État narratif jour 3
}

// NOUVELLE table pour relations entre héros
model HeroRelationship {
  id          String   @id @default(cuid())
  hero_a_id   String
  hero_b_id   String
  type        String   // 'ally', 'rival', 'mentor', 'romantic', 'neutral'
  description String   @db.Text
  affinity    Int      @default(0) // -20 à +20
  created_at  DateTime @default(now())
  
  hero_a      Hero     @relation("hero_a_relations", fields: [hero_a_id], references: [id])
  hero_b      Hero     @relation("hero_b_relations", fields: [hero_b_id], references: [id])
  
  @@unique([hero_a_id, hero_b_id])
  @@map("hero_relationships")
}

model Building {
  // ... champs existants ...
  
  // NOUVEAUX champs
  atmosphere  String?  @db.Text  // Description sensorielle
  npc_name    String?             // NPC associé
  npc_description String? @db.Text
  secret      String?  @db.Text  // Hook narratif caché
}

model Mission {
  // ... champs existants ...
  
  // NOUVEAUX champs pour variantes
  success_text_bjorn     String? @db.Text
  success_text_owen      String? @db.Text
  success_text_vi        String? @db.Text
  success_text_durun     String? @db.Text
  success_text_elira     String? @db.Text
  
  failure_text_variant   String? @db.Text // Variante échec
  
  // Narrative hooks
  unlocks_dialogue_id    String? // Débloquer dialogue secret
  unlocks_mission_id     String? // Débloquer mission cachée
  narrative_flag         String? // Flag pour tracking arc narratif
}
```

**Commandes** :
```bash
# Après modification schema.prisma
npx prisma db push  # Dev
npx prisma migrate dev --name add_curator_fields  # Prod
npm run prisma:generate
```

---

### 1.4 API routes pour nouveau contenu

**Besoin** : Exposer les nouvelles données au front

**Nouvelles routes à créer** :

#### `app/api/heroes/[id]/relationships/route.ts`
```typescript
// GET /api/heroes/[id]/relationships
// Retourne les relations d'un héros avec les autres
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const relations = await prisma.heroRelationship.findMany({
    where: {
      OR: [
        { hero_a_id: params.id },
        { hero_b_id: params.id }
      ]
    },
    include: {
      hero_a: true,
      hero_b: true
    }
  })
  return NextResponse.json(relations)
}
```

#### `app/api/heroes/[id]/full/route.ts`
```typescript
// GET /api/heroes/[id]/full
// Retourne héros avec tout le contenu enrichi
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const hero = await prisma.hero.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      dialogues: {
        include: { exchanges: true }
      },
      relationships: true // Nouvelles relations
    }
  })
  return NextResponse.json(hero)
}
```

#### `app/api/missions/[id]/variants/route.ts`
```typescript
// GET /api/missions/[id]/variants?heroes=bjorn,vi
// Retourne le bon success_text selon héros assignés
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url)
  const heroSlugs = searchParams.get('heroes')?.split(',') || []
  
  const mission = await prisma.mission.findUnique({
    where: { id: params.id }
  })
  
  // Logique pour choisir le bon success_text
  let successText = mission.success_text // défaut
  if (heroSlugs.includes('bjorn') && mission.success_text_bjorn) {
    successText = mission.success_text_bjorn
  } else if (heroSlugs.includes('vi') && mission.success_text_vi) {
    successText = mission.success_text_vi
  }
  // etc.
  
  return NextResponse.json({ ...mission, success_text: successText })
}
```

---

### 1.5 Composants UI pour afficher contenu enrichi

#### A) `app/components/HeroLoreModal.tsx` (NOUVEAU)

**Besoin** : Modal détaillé pour voir tout le lore d'un héros

```typescript
interface HeroLoreModalProps {
  hero: Hero
  onClose: () => void
}

export default function HeroLoreModal({ hero, onClose }: HeroLoreModalProps) {
  // Affichage de :
  // - Portrait
  // - Description longue (200 mots)
  // - Lore (400 mots avec scroll)
  // - Stats
  // - Relations avec autres héros (avec icônes)
  // - Dialogues disponibles
}
```

**Trigger** : Clic sur portrait héros dans village ou hub

---

#### B) `app/components/MissionDetailModal.tsx` (AMÉLIORER)

**Modifications** :
- [ ] Afficher description complète (pas juste résumé)
- [ ] Preview du success_text AVANT de lancer la mission
- [ ] Indicateur si mission débloque dialogue/mission cachée
- [ ] Afficher variantes selon héros sélectionnés

```typescript
// Ajouter dans MissionDetailModal
const [previewText, setPreviewText] = useState('')

useEffect(() => {
  if (selectedHeroes.includes('bjorn') && mission.success_text_bjorn) {
    setPreviewText(mission.success_text_bjorn)
  } else {
    setPreviewText(mission.success_text)
  }
}, [selectedHeroes])

// Afficher previewText dans l'UI
```

---

#### C) `app/components/BuildingInfoModal.tsx` (AMÉLIORER)

**Modifications** :
- [ ] Afficher atmosphere (sons, odeurs)
- [ ] Afficher NPC associé avec mini-portrait
- [ ] Hint sur secret caché (si découvert via progression)

**Fichier** : `app/components/village/BuildingInfoModal.tsx` (déjà existe)

**Changements** :
```typescript
// Remplacer le BUILDING_INFO hardcodé par fetch API
const [buildingData, setBuildingData] = useState(null)

useEffect(() => {
  fetch(`/api/buildings/${buildingId}/full`)
    .then(r => r.json())
    .then(setBuildingData)
}, [buildingId])

// Afficher buildingData.atmosphere, npc_name, etc.
```

---

### 1.6 Système de narrative flags

**Besoin** : Tracker la progression narrative du joueur

**Nouvelle table `prisma/schema.prisma`** :
```prisma
model NarrativeFlag {
  id         String   @id @default(cuid())
  save_id    String
  flag_name  String   // 'saw_bjorn_secret', 'unlocked_ruines_mystery', etc.
  unlocked_at DateTime @default(now())
  
  save       GameSave @relation(fields: [save_id], references: [id], onDelete: Cascade)
  
  @@unique([save_id, flag_name])
  @@map("narrative_flags")
}

model GameSave {
  // ... champs existants ...
  narrative_flags NarrativeFlag[]
}
```

**API route** : `app/api/save/[id]/flags/route.ts`
```typescript
// POST /api/save/[id]/flags
// Body: { flag_name: "saw_bjorn_secret" }
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { flag_name } = await request.json()
  
  await prisma.narrativeFlag.upsert({
    where: {
      save_id_flag_name: {
        save_id: params.id,
        flag_name
      }
    },
    update: {},
    create: {
      save_id: params.id,
      flag_name
    }
  })
  
  return NextResponse.json({ success: true })
}

// GET /api/save/[id]/flags
// Retourne tous les flags du joueur
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const flags = await prisma.narrativeFlag.findMany({
    where: { save_id: params.id }
  })
  return NextResponse.json(flags)
}
```

**Usage** :
```typescript
// Dans completeMission, si mission débloque un flag
if (mission.narrative_flag) {
  fetch(`/api/save/${saveId}/flags`, {
    method: 'POST',
    body: JSON.stringify({ flag_name: mission.narrative_flag })
  })
}
```

---

## 🔥 PHASE 2 DEV : Portraits émotionnels

**Dépendance** : Curator génère 5 émotions × 5 héros = 25 images

### 2.1 Modification `DialogueModal.tsx`

**Fichier** : `app/components/DialogueModal.tsx`

**Changements** :

```typescript
// AVANT (statique)
const heroPortrait = HERO_PORTRAITS[dialogue.heroName.toLowerCase()] || '/portraits/bjorn.png'

// APRÈS (dynamique selon émotion)
const getHeroPortrait = (heroName: string, emotion?: string) => {
  const slug = heroName.toLowerCase()
  const emotionSuffix = emotion ? `_${emotion}` : '_neutral'
  return `/portraits/${slug}${emotionSuffix}.png`
}

// Dans le render
<img 
  src={getHeroPortrait(dialogue.heroName, currentExchange.emotion)}
  alt={dialogue.heroName}
  // ... reste du code
/>
```

**Alternative (si images en DB)** :
```typescript
// Fetch depuis hero_images
const [heroImages, setHeroImages] = useState({})

useEffect(() => {
  fetch(`/api/heroes/${dialogue.heroId}/images`)
    .then(r => r.json())
    .then(images => {
      const imagesMap = {}
      images.forEach(img => {
        imagesMap[img.image_type] = img.url
      })
      setHeroImages(imagesMap)
    })
}, [dialogue.heroId])

// Usage
<img src={heroImages[currentExchange.emotion || 'neutral']} />
```

---

### 2.2 Prévisualisation émotions dans `HeroStatsModal`

**Fichier** : `app/components/village/HeroStatsModal.tsx`

**Ajout** : Carrousel des 5 émotions

```typescript
const emotions = ['neutral', 'happy', 'sad', 'angry', 'surprised']
const [currentEmotion, setCurrentEmotion] = useState('neutral')

// UI : Boutons pour changer émotion
<div style={{ display: 'flex', gap: '10px' }}>
  {emotions.map(emotion => (
    <button
      key={emotion}
      onClick={() => setCurrentEmotion(emotion)}
      style={{
        padding: '8px',
        backgroundColor: currentEmotion === emotion ? 'gold' : 'grey'
      }}
    >
      {getEmotionIcon(emotion)}
    </button>
  ))}
</div>

<img 
  src={`/portraits/${heroSlug}_${currentEmotion}.png`}
  alt={`${heroName} ${currentEmotion}`}
/>
```

---

## 🌟 PHASE 2 DEV : Ambient texts

**Dépendance** : Curator génère 20-32 textes d'ambiance

### 2.3 Nouvelle table + API

**Schéma Prisma** :
```prisma
model AmbientText {
  id         String   @id @default(cuid())
  type       String   // 'location', 'hero_reaction', 'building_hover'
  context    String   // 'foret', 'bjorn_mission_assigned', 'forge_level_2'
  text       String   @db.Text
  priority   Int      @default(1) // Pour varier fréquence d'affichage
  created_at DateTime @default(now())
  
  @@index([type, context])
  @@map("ambient_texts")
}
```

**API route** : `app/api/ambient/[type]/[context]/route.ts`
```typescript
// GET /api/ambient/location/foret
// Retourne un texte aléatoire pour ce contexte
export async function GET(
  request: NextRequest,
  { params }: { params: { type: string, context: string } }
) {
  const texts = await prisma.ambientText.findMany({
    where: {
      type: params.type,
      context: params.context
    }
  })
  
  // Sélection pondérée par priority
  const weighted = texts.flatMap(t => Array(t.priority).fill(t))
  const random = weighted[Math.floor(Math.random() * weighted.length)]
  
  return NextResponse.json(random)
}
```

---

### 2.4 Composant `<AmbientText>`

**Fichier** : `app/components/AmbientText.tsx` (NOUVEAU)

```typescript
interface AmbientTextProps {
  type: 'location' | 'hero_reaction' | 'building_hover'
  context: string
  interval?: number // Ms entre rotations (défaut 10000)
}

export default function AmbientText({ type, context, interval = 10000 }: AmbientTextProps) {
  const [text, setText] = useState('')
  
  const fetchNewText = () => {
    fetch(`/api/ambient/${type}/${context}`)
      .then(r => r.json())
      .then(data => setText(data.text))
  }
  
  useEffect(() => {
    fetchNewText()
    const timer = setInterval(fetchNewText, interval)
    return () => clearInterval(timer)
  }, [type, context, interval])
  
  return (
    <div style={{
      fontStyle: 'italic',
      color: '#888',
      fontSize: '14px',
      padding: '10px',
      animation: 'fadeIn 0.5s'
    }}>
      {text}
    </div>
  )
}
```

---

### 2.5 Intégration dans dispatch/village

**Dispatch page** (`app/dispatch/page.tsx`) :
```typescript
// Afficher ambient text selon lieu survolé
const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)

{hoveredLocation && (
  <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
    <AmbientText type="location" context={hoveredLocation} />
  </div>
)}
```

**Village** (`app/components/village/VillageModal.tsx`) :
```typescript
// Afficher ambient text pour bâtiment survolé
{hoveredBuilding && (
  <AmbientText type="building_hover" context={hoveredBuilding.slug} />
)}
```

---

## 🎯 PHASE 3 DEV : Narrative arc complet

**Dépendance** : Curator livre la "Bible narrative"

### 3.1 Système de déblocage conditionnel

**Logique dans `GameContext`** :

```typescript
// Vérifier si dialogue peut être débloqué
const canUnlockDialogue = (dialogueId: string, flags: string[]) => {
  const dialogue = dialogues.find(d => d.id === dialogueId)
  if (!dialogue.required_flags) return true
  
  return dialogue.required_flags.every(flag => flags.includes(flag))
}

// Vérifier si mission peut apparaître
const canUnlockMission = (missionId: string, flags: string[]) => {
  const mission = missions.find(m => m.id === missionId)
  if (!mission.required_flags) return true
  
  return mission.required_flags.every(flag => flags.includes(flag))
}
```

**Schéma étendu** :
```prisma
model Dialogue {
  // ... champs existants ...
  required_flags String[] // Flags nécessaires pour débloquer
}

model Mission {
  // ... champs existants ...
  required_flags String[] // Flags nécessaires pour apparaître
}
```

---

### 3.2 Mission climax jour 3 avec choix

**Nouveau type de mission interactive**

**Schéma** :
```prisma
model MissionChoice {
  id            String   @id @default(cuid())
  mission_id    String
  choice_text   String   @db.Text
  consequence   Json     // { gold: -50, reputation: 10, flag: "chose_mercy" }
  order         Int
  created_at    DateTime @default(now())
  
  mission       Mission  @relation(fields: [mission_id], references: [id])
  
  @@map("mission_choices")
}

model Mission {
  // ... champs existants ...
  is_interactive Boolean  @default(false)
  choices        MissionChoice[]
}
```

**Composant** : `app/components/MissionChoiceModal.tsx` (NOUVEAU)
```typescript
interface MissionChoiceModalProps {
  mission: Mission
  choices: MissionChoice[]
  onChoose: (choice: MissionChoice) => void
}

// Afficher les choix possibles
// Appliquer conséquences selon choix
```

---

## 📋 CHECKLIST DEV

### Phase 1 (contenu enrichi de base)
- [ ] Configuration accès DB curator (user + permissions)
- [ ] Fournir credentials DATABASE_URL_CURATOR au curator
- [ ] Extension schéma Prisma (nouveaux champs)
- [ ] API routes (relationships, full, variants)
- [ ] HeroLoreModal (nouveau composant)
- [ ] MissionDetailModal (améliorer)
- [ ] BuildingInfoModal (améliorer)
- [ ] Table NarrativeFlag + API
- [ ] Validation contenu curator en DB (queries test)

### Phase 2 (portraits + ambient)
- [ ] DialogueModal (portraits émotionnels)
- [ ] HeroStatsModal (carrousel émotions)
- [ ] Table AmbientText + API
- [ ] Composant AmbientText
- [ ] Intégration dispatch/village

### Phase 3 (narrative arc)
- [ ] Système déblocage conditionnel
- [ ] Table MissionChoice
- [ ] MissionChoiceModal
- [ ] Tracking flags dans GameContext

---

## ⏱️ Estimation temps

**Phase 1** : ~6-10h (réduit de 8-12h)
- Configuration DB curator : 1h
- Schéma Prisma : 2h
- API routes : 2h
- Composants UI : 4-6h
- Validation : 1h

**Phase 2** : ~6-8h
- Portraits émotionnels : 3h
- Ambient texts : 3-5h

**Phase 3** : ~10-15h
- Système flags/déblocage : 4-6h
- Missions interactives : 6-9h

**Total** : ~20-30h de dev pour exploiter pleinement le contenu curator (réduit grâce au dépôt direct DB)

---

**Dernière mise à jour** : 23 novembre 2025  
**Version** : 1.1 - Curator dépose directement dans DB  
**Statut** : PRÊT À DÉMARRER (configurer accès curator d'abord)
