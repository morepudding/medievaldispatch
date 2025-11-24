# 🔧 Roadmap Dev-Curator v2

**Date** : 24 novembre 2025  
**Version** : 2.0  
**Statut** : En préparation

---

## 📋 Vue d'ensemble

Cette roadmap définit les **tâches côté développeur** pour préparer et intégrer le contenu généré par le curator. 

### Principe de fonctionnement
1. **Nous (dev)** : Créons la structure DB et les placeholders
2. **Curator (AI)** : Enrichit directement la DB avec du contenu narratif
3. **Nous (dev)** : Adaptons le code pour afficher/exploiter ce contenu

### Architecture
- **Curator** : Accès en écriture sur tables de contenu uniquement (`heroes`, `missions`, `dialogues`, etc.)
- **Dev** : Gestion complète DB + code front/back
- **Séparation stricte** : Tables contenu (partagées) ≠ Tables save (réservées dev)

---

## 🎯 PHASE 0 : Préparation (PRIORITAIRE)

**Objectif** : Préparer la structure DB et documenter les besoins pour le curator

### 0.1 - Extension du schéma Prisma

**Fichier** : `prisma/schema.prisma`

**Nouveaux modèles** :

```prisma
// Relations entre héros (20 paires pour 5 héros)
model HeroRelationship {
  id          String   @id @default(cuid())
  hero_a_id   String
  hero_b_id   String
  type        String   // 'ally', 'rival', 'mentor', 'romantic', 'neutral'
  description String   @db.Text
  affinity    Int      @default(0) // -20 (ennemis) à +20 (proches)
  created_at  DateTime @default(now())
  
  hero_a      Hero     @relation("hero_a_relations", fields: [hero_a_id], references: [id])
  hero_b      Hero     @relation("hero_b_relations", fields: [hero_b_id], references: [id])
  
  @@unique([hero_a_id, hero_b_id])
  @@map("hero_relationships")
}

// Textes d'ambiance (32 textes au total)
model AmbientText {
  id         String   @id @default(cuid())
  type       String   // 'location', 'hero_reaction', 'building_hover'
  context    String   // 'foret', 'bjorn_mission_assigned', 'forge_level_2'
  text       String   @db.Text
  priority   Int      @default(1) // Pondération pour sélection aléatoire
  created_at DateTime @default(now())
  
  @@index([type, context])
  @@map("ambient_texts")
}

// Choix de mission interactive (jour 3 climax)
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

// Flags narratifs pour progression joueur
model NarrativeFlag {
  id          String   @id @default(cuid())
  save_id     String
  flag_name   String   // 'saw_bjorn_secret', 'unlocked_ruines_mystery'
  unlocked_at DateTime @default(now())
  
  save        GameSave @relation(fields: [save_id], references: [id], onDelete: Cascade)
  
  @@unique([save_id, flag_name])
  @@map("narrative_flags")
}
```

**Modifications de modèles existants** :

```prisma
model Hero {
  // ... champs existants (id, name, slug, stats, etc.) ...
  
  // NOUVEAUX champs pour contenu curator
  voice              String?     @db.Text  // Ton/style dialogue
  secret             String?     @db.Text  // Secret révélé jour 3
  arc_day1           String?     @db.Text  // Arc narratif jour 1
  arc_day2           String?     @db.Text  // Arc narratif jour 2
  arc_day3           String?     @db.Text  // Arc narratif jour 3
  
  // Relations
  relations_a        HeroRelationship[] @relation("hero_a_relations")
  relations_b        HeroRelationship[] @relation("hero_b_relations")
}

model Mission {
  // ... champs existants ...
  
  // NOUVEAUX champs pour variantes textuelles
  success_text_bjorn     String? @db.Text
  success_text_owen      String? @db.Text
  success_text_vi        String? @db.Text
  success_text_durun     String? @db.Text
  success_text_elira     String? @db.Text
  failure_text_variant   String? @db.Text
  
  // Hooks narratifs
  unlocks_dialogue_id    String?
  unlocks_mission_id     String?
  narrative_flag         String?
  required_flags         String[]
  
  // Mission interactive
  is_interactive         Boolean  @default(false)
  choices                MissionChoice[]
}

model Dialogue {
  // ... champs existants ...
  
  // Conditions de déblocage
  required_flags String[]
}

model Building {
  // ... champs existants ...
  
  // NOUVEAUX champs
  atmosphere      String?  @db.Text  // Description sensorielle
  npc_name        String?
  npc_description String?  @db.Text
  secret          String?  @db.Text  // Hook narratif caché
}

model GameSave {
  // ... champs existants ...
  
  // Tracking progression narrative
  narrative_flags NarrativeFlag[]
}
```

**Commandes** :
```bash
npx prisma db push  # Dev
npx prisma migrate dev --name add_curator_content_fields  # Prod
npm run prisma:generate
```

---

### 0.2 - Script seed placeholders

**Fichier** : `prisma/seed-placeholders.ts`

**Objectif** : Créer des entrées minimales que le curator va enrichir

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding placeholders...')

  // 1. HÉROS (5)
  const heroes = await Promise.all([
    prisma.hero.upsert({
      where: { slug: 'bjorn' },
      update: {},
      create: {
        slug: 'bjorn',
        name: 'Bjorn',
        description: '[TO_ENRICH]',
        lore: '[TO_ENRICH]',
        force: 8,
        agilite: 4,
        intelligence: 3,
        charisme: 5
      }
    }),
    prisma.hero.upsert({
      where: { slug: 'owen' },
      update: {},
      create: {
        slug: 'owen',
        name: 'Owen',
        description: '[TO_ENRICH]',
        lore: '[TO_ENRICH]',
        force: 4,
        agilite: 9,
        intelligence: 6,
        charisme: 4
      }
    }),
    prisma.hero.upsert({
      where: { slug: 'vi' },
      update: {},
      create: {
        slug: 'vi',
        name: 'Vi',
        description: '[TO_ENRICH]',
        lore: '[TO_ENRICH]',
        force: 5,
        agilite: 8,
        intelligence: 7,
        charisme: 6
      }
    }),
    prisma.hero.upsert({
      where: { slug: 'durun' },
      update: {},
      create: {
        slug: 'durun',
        name: 'Durun',
        description: '[TO_ENRICH]',
        lore: '[TO_ENRICH]',
        force: 3,
        agilite: 4,
        intelligence: 9,
        charisme: 7
      }
    }),
    prisma.hero.upsert({
      where: { slug: 'elira' },
      update: {},
      create: {
        slug: 'elira',
        name: 'Elira',
        description: '[TO_ENRICH]',
        lore: '[TO_ENRICH]',
        force: 4,
        agilite: 5,
        intelligence: 8,
        charisme: 9
      }
    })
  ])

  console.log('✅ 5 héros créés')

  // 2. MISSIONS (15)
  const missions = []
  for (let day = 1; day <= 3; day++) {
    for (let i = 1; i <= 5; i++) {
      missions.push(
        prisma.mission.upsert({
          where: { slug: `mission_${day}_${i}` },
          update: {},
          create: {
            slug: `mission_${day}_${i}`,
            titre: `[MISSION_DAY_${day}_${i}]`,
            description: '[TO_ENRICH]',
            duree_minutes: day === 1 ? 30 : day === 2 ? 45 : 60,
            unlock_day: day,
            required_force: day * 2,
            required_agilite: day * 2,
            required_intelligence: day * 2,
            reward_gold: 50 * day,
            success_text: '[TO_ENRICH]',
            failure_text: '[TO_ENRICH]'
          }
        })
      )
    }
  }
  await Promise.all(missions)

  console.log('✅ 15 missions créées')

  // 3. DIALOGUES (12 slots)
  const dialogues = []
  const heroIds = heroes.map(h => h.id)
  
  // Jour 1 : 5 dialogues (1 par héros)
  for (let i = 0; i < 5; i++) {
    dialogues.push(
      prisma.dialogue.upsert({
        where: { slug: `dialogue_${heroes[i].slug}_day1` },
        update: {},
        create: {
          slug: `dialogue_${heroes[i].slug}_day1`,
          hero_id: heroIds[i],
          title: '[TO_CREATE]',
          unlock_day: 1
        }
      })
    )
  }

  // Jour 2 : 4 dialogues
  for (let i = 0; i < 4; i++) {
    dialogues.push(
      prisma.dialogue.upsert({
        where: { slug: `dialogue_${heroes[i].slug}_day2` },
        update: {},
        create: {
          slug: `dialogue_${heroes[i].slug}_day2`,
          hero_id: heroIds[i],
          title: '[TO_CREATE]',
          unlock_day: 2
        }
      })
    )
  }

  // Jour 3 : 3 dialogues
  for (let i = 0; i < 3; i++) {
    dialogues.push(
      prisma.dialogue.upsert({
        where: { slug: `dialogue_${heroes[i].slug}_day3` },
        update: {},
        create: {
          slug: `dialogue_${heroes[i].slug}_day3`,
          hero_id: heroIds[i],
          title: '[TO_CREATE]',
          unlock_day: 3
        }
      })
    )
  }

  await Promise.all(dialogues)
  console.log('✅ 12 dialogues créés')

  // 4. BÂTIMENTS (5)
  const buildings = [
    { slug: 'forge', name: 'Forge' },
    { slug: 'taverne', name: 'Taverne' },
    { slug: 'marche', name: 'Marché' },
    { slug: 'temple', name: 'Temple' },
    { slug: 'caserne', name: 'Caserne' }
  ]

  await Promise.all(
    buildings.map(b =>
      prisma.building.upsert({
        where: { slug: b.slug },
        update: {},
        create: {
          slug: b.slug,
          name: b.name,
          description: '[TO_ENRICH]',
          upgrade_cost: 100,
          max_level: 3
        }
      })
    )
  )

  console.log('✅ 5 bâtiments créés')

  console.log('🎉 Seed placeholders terminé!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

**Ajout dans `package.json`** :
```json
{
  "scripts": {
    "prisma:seed-placeholders": "ts-node prisma/seed-placeholders.ts"
  }
}
```

**Commandes** :
```bash
npm run prisma:seed-placeholders
```

---

### 0.3 - Configuration accès DB Curator

**Fichier** : `prisma/setup/curator_permissions.sql`

```sql
-- Créer role avec permissions limitées
CREATE ROLE curator_role;

-- TABLES CONTENU (read/write autorisé)
GRANT SELECT, INSERT, UPDATE ON heroes TO curator_role;
GRANT SELECT, INSERT, UPDATE ON hero_images TO curator_role;
GRANT SELECT, INSERT, UPDATE ON hero_relationships TO curator_role;
GRANT SELECT, INSERT, UPDATE ON missions TO curator_role;
GRANT SELECT, INSERT, UPDATE ON mission_choices TO curator_role;
GRANT SELECT, INSERT, UPDATE ON dialogues TO curator_role;
GRANT SELECT, INSERT, UPDATE ON dialogue_exchanges TO curator_role;
GRANT SELECT, INSERT, UPDATE ON buildings TO curator_role;
GRANT SELECT, INSERT, UPDATE ON building_levels TO curator_role;
GRANT SELECT, INSERT, UPDATE ON locations TO curator_role;
GRANT SELECT, INSERT, UPDATE ON ambient_texts TO curator_role;

-- TABLES SAVE (interdit)
REVOKE ALL ON game_saves FROM curator_role;
REVOKE ALL ON player_heroes FROM curator_role;
REVOKE ALL ON player_buildings FROM curator_role;
REVOKE ALL ON player_dialogues FROM curator_role;
REVOKE ALL ON mission_completions FROM curator_role;
REVOKE ALL ON narrative_flags FROM curator_role;

-- Créer user curator
CREATE USER curator_pipeline WITH PASSWORD 'SECURE_PASSWORD_HERE';
GRANT curator_role TO curator_pipeline;
```

**Commandes** :
```bash
# Exécuter le script
psql $DIRECT_URL -f prisma/setup/curator_permissions.sql

# Générer la connexion string pour le curator
echo "DATABASE_URL_CURATOR=postgresql://curator_pipeline:PASSWORD@db.xxx.supabase.co:6543/postgres?pgbouncer=true"
```

---

### 0.4 - Document de spécifications curator

**Fichier** : `docs/curator-specs.md`

Ce document est le **cahier des charges** pour le curator (sans code technique).

➡️ **Voir le contenu complet dans la section précédente de cette roadmap** (trop long pour répéter ici)

**Sections principales** :
- Phase 1 : Héros (descriptions, lore, relations)
- Phase 1 : Missions (descriptions, textes succès/échec, variantes)
- Phase 1 : Dialogues (structure, échanges, émotions)
- Phase 1 : Bâtiments (ambiance, NPCs, secrets)
- Phase 2 : Portraits émotionnels (25 images PNG 512×512px)
- Phase 2 : Ambient texts (32 textes d'ambiance)
- Phase 3 : Mission climax (choix multiples, conséquences)
- Résumé quantitatif : ~17,860 mots + 25 images
- Format livraison : JSON + images + narrative_bible.md

---

### 0.5 - Validation et livraison

**Checklist avant de contacter le curator** :

```bash
# 1. Vérifier que le schéma est déployé
npx prisma db pull  # Doit montrer tous les nouveaux champs

# 2. Vérifier que les placeholders existent
psql $DATABASE_URL -c "SELECT slug, description FROM heroes LIMIT 5;"
# Doit afficher '[TO_ENRICH]'

# 3. Vérifier les permissions curator
psql $DATABASE_URL -c "\du curator_pipeline"
# Doit montrer le role

# 4. Tester connexion curator
psql $DATABASE_URL_CURATOR -c "SELECT COUNT(*) FROM heroes;"
# Doit retourner 5

# 5. Vérifier que curator ne peut pas toucher aux saves
psql $DATABASE_URL_CURATOR -c "SELECT * FROM game_saves;"
# Doit retourner "permission denied"
```

**À fournir au curator** :
- ✅ `DATABASE_URL_CURATOR` (connexion avec permissions)
- ✅ `docs/curator-specs.md` (spécifications contenu)
- ✅ `docs/database.md` (schéma DB pour référence)
- ✅ Liste des slugs existants (heroes, missions, buildings)

---

## 🚀 PHASE 1 : Exploitation du contenu enrichi

**Prérequis** : Curator a enrichi la DB avec le contenu textuel

### 1.1 - API routes pour nouveau contenu

#### `app/api/heroes/[id]/full/route.ts` (NOUVEAU)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const hero = await prisma.hero.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      relations_a: {
        include: { hero_b: true }
      },
      relations_b: {
        include: { hero_a: true }
      }
    }
  })

  if (!hero) {
    return NextResponse.json({ error: 'Hero not found' }, { status: 404 })
  }

  // Fusionner les relations dans un seul array
  const allRelations = [
    ...hero.relations_a.map(r => ({ ...r, otherHero: r.hero_b })),
    ...hero.relations_b.map(r => ({ ...r, otherHero: r.hero_a }))
  ]

  return NextResponse.json({ ...hero, relationships: allRelations })
}
```

#### `app/api/missions/[id]/variant/route.ts` (NOUVEAU)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url)
  const heroSlugs = searchParams.get('heroes')?.split(',') || []

  const mission = await prisma.mission.findUnique({
    where: { id: params.id },
    include: { choices: true }
  })

  if (!mission) {
    return NextResponse.json({ error: 'Mission not found' }, { status: 404 })
  }

  // Sélectionner le bon success_text selon héros assignés
  let successText = mission.success_text

  if (heroSlugs.includes('bjorn') && mission.success_text_bjorn) {
    successText = mission.success_text_bjorn
  } else if (heroSlugs.includes('owen') && mission.success_text_owen) {
    successText = mission.success_text_owen
  } else if (heroSlugs.includes('vi') && mission.success_text_vi) {
    successText = mission.success_text_vi
  } else if (heroSlugs.includes('durun') && mission.success_text_durun) {
    successText = mission.success_text_durun
  } else if (heroSlugs.includes('elira') && mission.success_text_elira) {
    successText = mission.success_text_elira
  }

  return NextResponse.json({ ...mission, success_text: successText })
}
```

#### `app/api/ambient/[type]/[context]/route.ts` (NOUVEAU)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; context: string } }
) {
  const texts = await prisma.ambientText.findMany({
    where: {
      type: params.type,
      context: params.context
    }
  })

  if (texts.length === 0) {
    return NextResponse.json({ text: '' })
  }

  // Sélection pondérée par priority
  const weighted = texts.flatMap(t => Array(t.priority).fill(t))
  const random = weighted[Math.floor(Math.random() * weighted.length)]

  return NextResponse.json(random)
}
```

#### `app/api/save/[id]/flags/route.ts` (NOUVEAU)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

// GET - Récupérer tous les flags d'une save
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const flags = await prisma.narrativeFlag.findMany({
    where: { save_id: params.id }
  })

  return NextResponse.json(flags.map(f => f.flag_name))
}

// POST - Ajouter un flag
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
```

---

### 1.2 - Composants UI pour contenu enrichi

#### `app/components/HeroLoreModal.tsx` (NOUVEAU)

```typescript
'use client'

import { useState, useEffect } from 'react'
import Modal from './ui/Modal'
import { Hero } from '@/app/types/game'

interface HeroLoreModalProps {
  heroId: string
  onClose: () => void
}

export default function HeroLoreModal({ heroId, onClose }: HeroLoreModalProps) {
  const [hero, setHero] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/heroes/${heroId}/full`)
      .then(r => r.json())
      .then(data => {
        setHero(data)
        setLoading(false)
      })
  }, [heroId])

  if (loading) return <Modal isOpen={true} onClose={onClose}>Chargement...</Modal>

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div style={{ maxWidth: '800px', padding: '20px' }}>
        {/* Portrait */}
        <img
          src={`/portraits/${hero.slug}.png`}
          alt={hero.name}
          style={{ width: '200px', height: '200px', borderRadius: '10px' }}
        />

        {/* Nom et classe */}
        <h2>{hero.name}</h2>
        <p style={{ fontStyle: 'italic', color: '#888' }}>{hero.voice}</p>

        {/* Description courte */}
        <section>
          <h3>Description</h3>
          <p>{hero.description}</p>
        </section>

        {/* Lore complet */}
        <section style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <h3>Histoire</h3>
          <p>{hero.lore}</p>
        </section>

        {/* Stats */}
        <section>
          <h3>Statistiques</h3>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div>Force: {hero.force}</div>
            <div>Agilité: {hero.agilite}</div>
            <div>Intelligence: {hero.intelligence}</div>
            <div>Charisme: {hero.charisme}</div>
          </div>
        </section>

        {/* Relations */}
        {hero.relationships && hero.relationships.length > 0 && (
          <section>
            <h3>Relations</h3>
            {hero.relationships.map((rel: any) => (
              <div key={rel.id} style={{ marginBottom: '10px' }}>
                <strong>{rel.otherHero.name}</strong> ({rel.type}) - {rel.description}
                <br />
                <span>Affinité: {rel.affinity > 0 ? '+' : ''}{rel.affinity}</span>
              </div>
            ))}
          </section>
        )}

        {/* Secret (si découvert) */}
        {hero.secret && (
          <section style={{ backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '5px' }}>
            <h3>🔒 Secret</h3>
            <p>{hero.secret}</p>
          </section>
        )}
      </div>
    </Modal>
  )
}
```

#### `app/components/AmbientText.tsx` (NOUVEAU)

```typescript
'use client'

import { useState, useEffect } from 'react'

interface AmbientTextProps {
  type: 'location' | 'hero_reaction' | 'building_hover'
  context: string
  interval?: number
}

export default function AmbientText({ 
  type, 
  context, 
  interval = 10000 
}: AmbientTextProps) {
  const [text, setText] = useState('')
  const [fadeIn, setFadeIn] = useState(false)

  const fetchNewText = async () => {
    setFadeIn(false)
    const res = await fetch(`/api/ambient/${type}/${context}`)
    const data = await res.json()
    setText(data.text || '')
    setTimeout(() => setFadeIn(true), 50)
  }

  useEffect(() => {
    fetchNewText()
    const timer = setInterval(fetchNewText, interval)
    return () => clearInterval(timer)
  }, [type, context, interval])

  if (!text) return null

  return (
    <div
      style={{
        fontStyle: 'italic',
        color: '#888',
        fontSize: '14px',
        padding: '10px',
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }}
    >
      {text}
    </div>
  )
}
```

---

### 1.3 - Intégrations dans les pages existantes

#### Dispatch page - Ambient texts pour lieux

**Fichier** : `app/dispatch/page.tsx`

```typescript
// Ajouter import
import AmbientText from '@/app/components/AmbientText'

// Dans le composant, ajouter state
const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)

// Dans le render, au survol des pins de mission
{hoveredLocation && (
  <div style={{ position: 'absolute', bottom: 20, left: 20, maxWidth: '400px' }}>
    <AmbientText type="location" context={hoveredLocation} />
  </div>
)}
```

#### Village - Hero lore modal

**Fichier** : `app/components/village/VillageLightPoint.tsx`

```typescript
// Ajouter import
import HeroLoreModal from '@/app/components/HeroLoreModal'

// Ajouter state
const [showLore, setShowLore] = useState(false)

// Ajouter option dans le menu
{menuOpen && (
  <div>
    {/* ... options existantes ... */}
    <button onClick={() => setShowLore(true)}>
      Voir l'histoire
    </button>
  </div>
)}

{showLore && (
  <HeroLoreModal heroId={hero.id} onClose={() => setShowLore(false)} />
)}
```

---

### 1.4 - Système de déblocage narratif

#### GameContext - Gestion des flags

**Fichier** : `app/contexts/GameContext.tsx`

```typescript
// Ajouter dans le type GameState
interface GameState {
  // ... champs existants ...
  narrativeFlags: string[]
}

// Ajouter fonction pour ajouter un flag
const addNarrativeFlag = async (flagName: string) => {
  if (!currentSaveId || gameState.narrativeFlags.includes(flagName)) return

  await fetch(`/api/save/${currentSaveId}/flags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ flag_name: flagName })
  })

  setGameState(prev => ({
    ...prev,
    narrativeFlags: [...prev.narrativeFlags, flagName]
  }))
}

// Modifier completeMission pour gérer les flags
const completeMission = async (missionId: string, success: boolean) => {
  // ... logique existante ...

  if (success && mission.narrative_flag) {
    await addNarrativeFlag(mission.narrative_flag)
  }

  if (success && mission.unlocks_dialogue_id) {
    // Débloquer dialogue
  }

  if (success && mission.unlocks_mission_id) {
    // Débloquer mission cachée
  }
}

// Filtrer dialogues/missions selon flags
const getAvailableDialogues = () => {
  return dialogues.filter(d => {
    if (!d.required_flags || d.required_flags.length === 0) return true
    return d.required_flags.every(flag => gameState.narrativeFlags.includes(flag))
  })
}
```

---

## 🎨 PHASE 2 : Portraits émotionnels

**Prérequis** : Curator a généré 25 portraits (5 héros × 5 émotions)

### 2.1 - Organisation des fichiers images

**Structure** : `public/portraits/`

```
public/
  portraits/
    bjorn_neutral.png
    bjorn_happy.png
    bjorn_sad.png
    bjorn_angry.png
    bjorn_surprised.png
    owen_neutral.png
    owen_happy.png
    ... (25 fichiers)
```

---

### 2.2 - DialogueModal avec émotions

**Fichier** : `app/components/DialogueModal.tsx`

```typescript
// Fonction helper pour récupérer le bon portrait
const getHeroPortrait = (heroSlug: string, emotion?: string) => {
  const emotionSuffix = emotion || 'neutral'
  return `/portraits/${heroSlug}_${emotionSuffix}.png`
}

// Dans le render, utiliser l'émotion de l'exchange actuel
<img
  src={getHeroPortrait(dialogue.hero.slug, currentExchange.emotion)}
  alt={dialogue.hero.name}
  style={{ width: '150px', height: '150px' }}
/>
```

---

### 2.3 - HeroStatsModal avec carrousel émotions

**Fichier** : `app/components/village/HeroStatsModal.tsx`

```typescript
const emotions = ['neutral', 'happy', 'sad', 'angry', 'surprised']
const [currentEmotion, setCurrentEmotion] = useState<string>('neutral')

// Boutons pour changer émotion
<div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
  {emotions.map(emotion => (
    <button
      key={emotion}
      onClick={() => setCurrentEmotion(emotion)}
      style={{
        padding: '10px',
        backgroundColor: currentEmotion === emotion ? 'gold' : '#444',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      {emotion === 'neutral' && '😐'}
      {emotion === 'happy' && '😊'}
      {emotion === 'sad' && '😢'}
      {emotion === 'angry' && '😠'}
      {emotion === 'surprised' && '😲'}
    </button>
  ))}
</div>

<img
  src={`/portraits/${hero.slug}_${currentEmotion}.png`}
  alt={`${hero.name} ${currentEmotion}`}
  style={{ width: '200px', height: '200px', marginTop: '10px' }}
/>
```

---

## 🎯 PHASE 3 : Mission climax interactive

**Prérequis** : Curator a créé 1 mission jour 3 avec 3 choix

### 3.1 - Composant MissionChoiceModal

**Fichier** : `app/components/MissionChoiceModal.tsx` (NOUVEAU)

```typescript
'use client'

import Modal from './ui/Modal'

interface MissionChoice {
  id: string
  choice_text: string
  consequence: {
    gold?: number
    reputation?: number
    flag?: string
  }
  order: number
}

interface MissionChoiceModalProps {
  mission: any
  choices: MissionChoice[]
  onChoose: (choice: MissionChoice) => void
  onClose: () => void
}

export default function MissionChoiceModal({
  mission,
  choices,
  onChoose,
  onClose
}: MissionChoiceModalProps) {
  return (
    <Modal isOpen={true} onClose={onClose}>
      <div style={{ maxWidth: '700px', padding: '30px' }}>
        <h2>{mission.titre}</h2>
        <p style={{ marginBottom: '30px' }}>{mission.description}</p>

        <h3>Comment voulez-vous agir ?</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {choices
            .sort((a, b) => a.order - b.order)
            .map(choice => (
              <button
                key={choice.id}
                onClick={() => onChoose(choice)}
                style={{
                  padding: '20px',
                  backgroundColor: '#2a2a2a',
                  border: '2px solid #555',
                  borderRadius: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'gold'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#555'
                }}
              >
                <p>{choice.choice_text}</p>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
                  {choice.consequence.gold && (
                    <span>Or: {choice.consequence.gold > 0 ? '+' : ''}
                    {choice.consequence.gold} </span>
                  )}
                  {choice.consequence.reputation && (
                    <span>Réputation: {choice.consequence.reputation > 0 ? '+' : ''}
                    {choice.consequence.reputation}</span>
                  )}
                </div>
              </button>
            ))}
        </div>
      </div>
    </Modal>
  )
}
```

---

### 3.2 - Intégration dans dispatch/completeMission

**Fichier** : `app/contexts/GameContext.tsx`

```typescript
const completeMission = async (missionId: string, success: boolean, choiceId?: string) => {
  const mission = missions.find(m => m.id === missionId)
  
  // Si mission interactive et succès, appliquer les conséquences du choix
  if (success && mission.is_interactive && choiceId) {
    const choice = mission.choices.find(c => c.id === choiceId)
    
    if (choice) {
      const { gold, reputation, flag } = choice.consequence
      
      if (gold) {
        setGameState(prev => ({ ...prev, gold: prev.gold + gold }))
      }
      
      if (flag) {
        await addNarrativeFlag(flag)
      }
    }
  }

  // ... reste de la logique existante ...
}
```

---

## 📋 Checklist complète

### Phase 0 - Préparation (PRIORITAIRE)
- [ ] Extension schéma Prisma (nouveaux modèles + champs)
- [ ] Migration DB (`npx prisma db push`)
- [ ] Script `seed-placeholders.ts`
- [ ] Exécuter seed (`npm run prisma:seed-placeholders`)
- [ ] Configuration permissions curator (`curator_permissions.sql`)
- [ ] Créer `docs/curator-specs.md`
- [ ] Validation DB (queries test)
- [ ] Fournir credentials + docs au curator

### Phase 1 - Contenu enrichi
- [ ] API route `/api/heroes/[id]/full`
- [ ] API route `/api/missions/[id]/variant`
- [ ] API route `/api/ambient/[type]/[context]`
- [ ] API route `/api/save/[id]/flags` (GET + POST)
- [ ] Composant `HeroLoreModal.tsx`
- [ ] Composant `AmbientText.tsx`
- [ ] Intégration dispatch (ambient texts)
- [ ] Intégration village (hero lore)
- [ ] GameContext - Gestion flags narratifs
- [ ] GameContext - Filtrage dialogues/missions conditionnels

### Phase 2 - Portraits émotionnels
- [ ] Organiser fichiers images (25 portraits)
- [ ] Modifier `DialogueModal.tsx` (portraits dynamiques)
- [ ] Modifier `HeroStatsModal.tsx` (carrousel émotions)

### Phase 3 - Mission climax
- [ ] Composant `MissionChoiceModal.tsx`
- [ ] Modifier `completeMission` (gestion choix)
- [ ] Tester mission interactive jour 3

---

## ⏱️ Estimation temps

| Phase | Durée | Détail |
|-------|-------|--------|
| **Phase 0** | **4-6h** | Schéma (2h) + Seed (2h) + Config (1h) + Validation (1h) |
| **Phase 1** | **8-12h** | API routes (3h) + Composants (4h) + GameContext (3h) + Tests (2h) |
| **Phase 2** | **3-4h** | Organisation images (1h) + Modifs composants (2-3h) |
| **Phase 3** | **4-6h** | Modal choix (2h) + Logique GameContext (2h) + Tests (2h) |
| **TOTAL** | **19-28h** | |

---

## 🔍 Commandes de validation

### Après Phase 0
```bash
# Vérifier placeholders
psql $DATABASE_URL -c "SELECT slug, description FROM heroes WHERE description = '[TO_ENRICH]';"

# Vérifier permissions curator
psql $DATABASE_URL_CURATOR -c "SELECT COUNT(*) FROM heroes;"
psql $DATABASE_URL_CURATOR -c "SELECT COUNT(*) FROM game_saves;"  # Doit échouer

# Vérifier schéma
npx prisma db pull
```

### Après Phase 1
```bash
# Vérifier contenu enrichi
psql $DATABASE_URL -c "SELECT slug, LENGTH(description), LENGTH(lore) FROM heroes;"

# Tester API routes
curl http://localhost:3000/api/heroes/[ID]/full
curl http://localhost:3000/api/ambient/location/foret
```

### Après Phase 2
```bash
# Vérifier images
ls public/portraits/ | wc -l  # Doit afficher 25
```

---

**Dernière mise à jour** : 24 novembre 2025  
**Version** : 2.0  
**Statut** : Prêt pour Phase 0
