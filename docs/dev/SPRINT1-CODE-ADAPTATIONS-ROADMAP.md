# Sprint 1: Code Adaptations Roadmap
## Hero Enrichment - D&D Characters & Multi-Resolution Portraits

**Created**: 2025-01-23  
**Status**: Ready for implementation (awaiting curator delivery)  
**Dependencies**: Curator Sprint 1 must complete (30 images + DB updates)

---

## Overview

This roadmap details all code changes required to support D&D 5e character data and emotion-based multi-resolution portraits after the curator delivers enriched hero content.

**Scope**: 5 heroes (bjorn, owen, vi, durun, elira)  
**Database**: Already migrated with D&D fields + `hero_image_variants` table  
**Expected curator output**: 30 images (5 heroes × 6 emotions) + SQL updates

---

## Current State Analysis

### 🔴 Critical Issues
1. **API route uses old image system**: `app/api/heroes/route.ts` maps `hero.images[0]?.url` (deprecated)
2. **Hardcoded stats**: `HeroStatsModal.tsx` has static `HERO_STATS` dictionary instead of DB values
3. **Static portrait mapping**: `DialogueModal.tsx` and `VillageLightPoint.tsx` use `HERO_PORTRAITS` object
4. **No emotion support**: Dialogue exchanges have `emotion` field but portraits don't change
5. **Missing type fields**: `Hero` interface in `types/game.ts` lacks all D&D fields

### 📊 Code Locations

| File | Lines | Issue | Impact |
|------|-------|-------|--------|
| `app/types/game.ts` | 10-21 | Hero interface missing 20+ D&D fields | Type errors after API changes |
| `app/api/heroes/route.ts` | ~15-30 | Uses `hero.images[0]` instead of `image_variants` | Wrong images loaded |
| `app/contexts/GameContext.tsx` | 575-625 | Hydration only maps old stats (force, dexterite, sagesse) | New fields not loaded |
| `app/contexts/GameContext.tsx` | ~80-120 | Initial hero load doesn't include new fields | Missing data on mount |
| `app/components/village/HeroStatsModal.tsx` | 12-17 | Hardcoded `HERO_STATS` dictionary | Shows fake data |
| `app/components/DialogueModal.tsx` | 11-17 | Static `HERO_PORTRAITS` object | No emotion switching |
| `app/components/village/VillageLightPoint.tsx` | 32 | Uses `HERO_PORTRAITS.find()` | Static portraits only |
| `app/dispatch/page.tsx` | 972, 1171 | Direct `hero.src` references | No resolution control |
| `app/components/village/VillagePlacementMode.tsx` | 58-84 | Uses `hero.src` for placement | Inflexible system |

---

## Implementation Phases

### 🟢 PHASE 0: Type System Foundation
**Priority**: CRITICAL - Must complete first to prevent TypeScript errors  
**Estimated time**: 15 minutes  
**Dependencies**: None

#### Task 0.1: Extend Hero interface
**File**: `app/types/game.ts` (lines 10-21)

**Add after existing `Hero` interface**:
```typescript
export interface Hero {
  // Existing fields
  id: string
  name: string
  src: string // DEPRECATED: Use getHeroPortrait() instead
  alt: string
  color: string
  stats: HeroStats
  isAvailable: boolean
  currentMissionId?: string
  
  // D&D 5e Core Stats (1-20 range)
  dnd_strength?: number
  dnd_dexterity?: number
  dnd_constitution?: number
  dnd_intelligence?: number
  dnd_wisdom?: number
  dnd_charisma?: number
  dnd_level?: number // 1-20
  
  // D&D Character Identity
  dnd_race?: string // "Human", "Elf", "Dwarf", etc.
  dnd_class?: string // "Fighter", "Wizard", "Rogue", etc.
  dnd_background?: string // "Soldier", "Noble", "Criminal", etc.
  dnd_alignment?: string // "Lawful Good", "Chaotic Neutral", etc.
  
  // Personality Traits
  personality_ideal?: string
  personality_bond?: string
  personality_flaw?: string
  
  // Narrative Content
  physical_description?: string
  voice_mannerism?: string
  character_secret?: string
  narrative_arc_past?: string
  narrative_arc_present?: string
  narrative_arc_future?: string
  flavor_text?: string
  tagline?: string
  
  // Image Variants
  image_variants?: ImageVariant[]
}
```

#### Task 0.2: Create ImageVariant type
**File**: `app/types/game.ts` (add before Hero interface)

```typescript
export interface ImageVariant {
  resolution: '1024x1024' | '256x256'
  emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'determined'
  url: string
  storage_path: string
}
```

**Validation**: Run `npm run build` - should compile without type errors

---

### 🟢 PHASE 1: Helper Functions
**Priority**: HIGH - Used by all UI components  
**Estimated time**: 20 minutes  
**Dependencies**: Phase 0 complete

#### Task 1.1: Create portrait helper utility
**File**: `app/lib/utils/heroPortrait.ts` (NEW FILE)

```typescript
import { Hero, ImageVariant } from '@/app/types/game'

/**
 * Get hero portrait URL based on emotion and resolution
 * Falls back to neutral emotion if requested emotion not found
 * Falls back to any available image if neutral not found
 * Falls back to placeholder if no images available
 * 
 * @param hero - Hero object with image_variants
 * @param emotion - Desired emotion ('neutral', 'happy', 'sad', 'angry', 'surprised', 'determined')
 * @param resolution - Image resolution ('1024x1024' for dialogues, '256x256' for UI)
 * @returns URL string for the portrait image
 */
export function getHeroPortrait(
  hero: Hero,
  emotion: ImageVariant['emotion'] = 'neutral',
  resolution: ImageVariant['resolution'] = '1024x1024'
): string {
  // Fallback to old system if no image_variants
  if (!hero.image_variants || hero.image_variants.length === 0) {
    console.warn(`Hero ${hero.name} has no image_variants, falling back to src`)
    return hero.src || '/portraits/default.png'
  }
  
  // Filter by resolution
  const variantsForResolution = hero.image_variants.filter(
    v => v.resolution === resolution
  )
  
  if (variantsForResolution.length === 0) {
    console.warn(`No ${resolution} variants for ${hero.name}, falling back to any resolution`)
    // Try opposite resolution
    const fallbackRes = resolution === '1024x1024' ? '256x256' : '1024x1024'
    const fallbackVariant = hero.image_variants.find(v => v.resolution === fallbackRes)
    if (fallbackVariant) return fallbackVariant.url
  }
  
  // Try exact emotion match
  const exactMatch = variantsForResolution.find(v => v.emotion === emotion)
  if (exactMatch) return exactMatch.url
  
  // Fallback to neutral
  const neutralMatch = variantsForResolution.find(v => v.emotion === 'neutral')
  if (neutralMatch) {
    console.warn(`Emotion ${emotion} not found for ${hero.name}, using neutral`)
    return neutralMatch.url
  }
  
  // Fallback to any available
  if (variantsForResolution.length > 0) {
    console.warn(`Neutral not found for ${hero.name}, using first available`)
    return variantsForResolution[0].url
  }
  
  // Ultimate fallback
  console.error(`No suitable image found for ${hero.name}`)
  return '/portraits/default.png'
}

/**
 * Get all available emotions for a hero at a specific resolution
 * Useful for UI that shows emotion picker
 */
export function getAvailableEmotions(
  hero: Hero,
  resolution: ImageVariant['resolution'] = '1024x1024'
): ImageVariant['emotion'][] {
  if (!hero.image_variants) return []
  
  return hero.image_variants
    .filter(v => v.resolution === resolution)
    .map(v => v.emotion)
}
```

**Validation**: Import in a component - should not error

---

### 🟢 PHASE 2: API Layer
**Priority**: HIGH - Data source for all components  
**Estimated time**: 25 minutes  
**Dependencies**: Phase 0 complete

#### Task 2.1: Update heroes API route
**File**: `app/api/heroes/route.ts`

**BEFORE** (current line ~15-30):
```typescript
const activeHeroes = await prisma.hero.findMany({
  where: { is_active: true },
  include: {
    images: {
      where: { is_default: true }
    }
  }
})

const formattedHeroes = activeHeroes.map(hero => ({
  id: hero.slug || hero.id,
  name: hero.name,
  src: hero.images[0]?.url || '/portraits/default.png', // OLD SYSTEM
  stats: {
    force: hero.strength,
    dexterite: hero.stealth,
    sagesse: hero.diplomacy,
    intelligence: hero.intelligence,
    vitalite: 100
  },
  isAvailable: true
}))
```

**AFTER**:
```typescript
const activeHeroes = await prisma.hero.findMany({
  where: { is_active: true },
  include: {
    images: true, // Keep for backward compatibility
    image_variants: true // NEW SYSTEM
  }
})

const formattedHeroes = activeHeroes.map(hero => ({
  // Core identity
  id: hero.slug || hero.id,
  name: hero.name,
  alt: hero.name,
  color: '#4A90E2', // TODO: Store in DB or derive from class
  
  // Legacy image system (for gradual migration)
  src: hero.images.find(img => img.is_default)?.url || '/portraits/default.png',
  
  // Game stats (existing mapping)
  stats: {
    force: hero.strength,
    dexterite: hero.stealth,
    sagesse: hero.diplomacy,
    intelligence: hero.intelligence,
    vitalite: 100
  },
  isAvailable: true,
  
  // D&D 5e Core Stats
  dnd_strength: hero.dnd_strength,
  dnd_dexterity: hero.dnd_dexterity,
  dnd_constitution: hero.dnd_constitution,
  dnd_intelligence: hero.dnd_intelligence,
  dnd_wisdom: hero.dnd_wisdom,
  dnd_charisma: hero.dnd_charisma,
  dnd_level: hero.dnd_level,
  
  // D&D Character Identity
  dnd_race: hero.dnd_race,
  dnd_class: hero.dnd_class,
  dnd_background: hero.dnd_background,
  dnd_alignment: hero.dnd_alignment,
  
  // Personality Traits
  personality_ideal: hero.personality_ideal,
  personality_bond: hero.personality_bond,
  personality_flaw: hero.personality_flaw,
  
  // Narrative Content
  physical_description: hero.physical_description,
  voice_mannerism: hero.voice_mannerism,
  character_secret: hero.character_secret,
  narrative_arc_past: hero.narrative_arc_past,
  narrative_arc_present: hero.narrative_arc_present,
  narrative_arc_future: hero.narrative_arc_future,
  flavor_text: hero.flavor_text,
  tagline: hero.tagline,
  
  // Multi-resolution emotion portraits
  image_variants: hero.image_variants.map(variant => ({
    resolution: variant.resolution,
    emotion: variant.emotion,
    url: variant.url,
    storage_path: variant.storage_path
  }))
}))
```

**Note**: Keep `src` field for backward compatibility during transition. Components will gradually migrate to `getHeroPortrait()`.

**Validation**: GET `/api/heroes` should return all new fields

---

### 🟢 PHASE 3: State Management
**Priority**: HIGH - Central data hub for app  
**Estimated time**: 30 minutes  
**Dependencies**: Phase 2 complete

#### Task 3.1: Update GameContext initial load
**File**: `app/contexts/GameContext.tsx` (find useEffect with `/api/heroes` fetch, ~line 80-120)

**BEFORE**:
```typescript
const response = await fetch('/api/heroes')
const data = await response.json()
setGameState(prev => ({
  ...prev,
  heroes: data.heroes.map((h: any) => ({
    id: h.id,
    name: h.name,
    src: h.src,
    alt: h.name,
    color: '#4A90E2',
    stats: h.stats,
    isAvailable: true
  }))
}))
```

**AFTER**:
```typescript
const response = await fetch('/api/heroes')
const data = await response.json()
setGameState(prev => ({
  ...prev,
  heroes: data.heroes.map((h: any) => ({
    // Core identity
    id: h.id,
    name: h.name,
    src: h.src, // Legacy fallback
    alt: h.alt || h.name,
    color: h.color || '#4A90E2',
    stats: h.stats,
    isAvailable: true,
    
    // D&D Stats
    dnd_strength: h.dnd_strength,
    dnd_dexterity: h.dnd_dexterity,
    dnd_constitution: h.dnd_constitution,
    dnd_intelligence: h.dnd_intelligence,
    dnd_wisdom: h.dnd_wisdom,
    dnd_charisma: h.dnd_charisma,
    dnd_level: h.dnd_level,
    
    // D&D Identity
    dnd_race: h.dnd_race,
    dnd_class: h.dnd_class,
    dnd_background: h.dnd_background,
    dnd_alignment: h.dnd_alignment,
    
    // Personality
    personality_ideal: h.personality_ideal,
    personality_bond: h.personality_bond,
    personality_flaw: h.personality_flaw,
    
    // Narrative
    physical_description: h.physical_description,
    voice_mannerism: h.voice_mannerism,
    character_secret: h.character_secret,
    narrative_arc_past: h.narrative_arc_past,
    narrative_arc_present: h.narrative_arc_present,
    narrative_arc_future: h.narrative_arc_future,
    flavor_text: h.flavor_text,
    tagline: h.tagline,
    
    // Images
    image_variants: h.image_variants || []
  }))
}))
```

#### Task 3.2: Update GameContext loadSave hydration
**File**: `app/contexts/GameContext.tsx` (lines 575-625)

**BEFORE**:
```typescript
heroes: save.player_heroes.map((ph: any) => ({
  id: ph.hero.slug || ph.hero.id,
  name: ph.hero.name,
  src: ph.hero.images.find((img: any) => img.image_type === 'portrait_full')?.url || '',
  alt: ph.hero.name,
  color: '#4A90E2',
  stats: {
    force: ph.current_strength,
    dexterite: ph.current_stealth,
    sagesse: ph.current_diplomacy,
    intelligence: ph.current_intelligence,
    vitalite: 100
  },
  isAvailable: !ph.is_on_mission,
  currentMissionId: undefined
}))
```

**AFTER**:
```typescript
heroes: save.player_heroes.map((ph: any) => {
  const hero = ph.hero
  return {
    // Core identity
    id: hero.slug || hero.id,
    name: hero.name,
    src: hero.images.find((img: any) => img.is_default)?.url || '', // Legacy
    alt: hero.name,
    color: '#4A90E2', // TODO: Derive from class or store in DB
    
    // Game stats (from PlayerHero save data)
    stats: {
      force: ph.current_strength,
      dexterite: ph.current_stealth,
      sagesse: ph.current_diplomacy,
      intelligence: ph.current_intelligence,
      vitalite: 100
    },
    isAvailable: !ph.is_on_mission,
    currentMissionId: undefined,
    
    // D&D Stats (from Hero master data)
    dnd_strength: hero.dnd_strength,
    dnd_dexterity: hero.dnd_dexterity,
    dnd_constitution: hero.dnd_constitution,
    dnd_intelligence: hero.dnd_intelligence,
    dnd_wisdom: hero.dnd_wisdom,
    dnd_charisma: hero.dnd_charisma,
    dnd_level: hero.dnd_level,
    
    // D&D Identity
    dnd_race: hero.dnd_race,
    dnd_class: hero.dnd_class,
    dnd_background: hero.dnd_background,
    dnd_alignment: hero.dnd_alignment,
    
    // Personality
    personality_ideal: hero.personality_ideal,
    personality_bond: hero.personality_bond,
    personality_flaw: hero.personality_flaw,
    
    // Narrative
    physical_description: hero.physical_description,
    voice_mannerism: hero.voice_mannerism,
    character_secret: hero.character_secret,
    narrative_arc_past: hero.narrative_arc_past,
    narrative_arc_present: hero.narrative_arc_present,
    narrative_arc_future: hero.narrative_arc_future,
    flavor_text: hero.flavor_text,
    tagline: hero.tagline,
    
    // Images
    image_variants: hero.image_variants || []
  }
})
```

**Critical**: Ensure `/api/save/[id]/route.ts` includes `image_variants` in Prisma query:
```typescript
// In app/api/save/[id]/route.ts (line ~20)
player_heroes: {
  include: {
    hero: {
      include: {
        images: true,
        image_variants: true // ADD THIS
      }
    }
  }
}
```

**Validation**: Load existing save - console should show heroes with `image_variants` array

---

### 🟡 PHASE 4: UI Components - Remove Hardcoded Data
**Priority**: MEDIUM - Visual improvements  
**Estimated time**: 40 minutes  
**Dependencies**: Phase 1, 2, 3 complete

#### Task 4.1: Replace HeroStatsModal hardcoded stats
**File**: `app/components/village/HeroStatsModal.tsx`

**BEFORE** (lines 12-17):
```typescript
const HERO_STATS: Record<string, { force: number, dexterite: number, ... }> = {
  'Bjorn': { force: 18, dexterite: 12, sagesse: 8, intelligence: 10, vitalite: 16 },
  // ...
}

// Later in component (line ~114)
const statValue = HERO_STATS[placement.heroAlt]?.[stat as keyof typeof HERO_STATS['Bjorn']] || 10
```

**AFTER**:
```typescript
// Remove HERO_STATS dictionary entirely

// Change component signature
interface HeroStatsModalProps {
  hero: Hero | null // Change from placement
  onClose: () => void
}

export default function HeroStatsModal({ hero, onClose }: HeroStatsModalProps) {
  if (!hero) return null
  
  const heroColor = hero.color || '#FFD700'
  
  // Get portrait using helper
  const heroPortrait = getHeroPortrait(hero, 'neutral', '256x256')
  
  return (
    <div onClick={onClose} style={{...}}>
      <div onClick={(e) => e.stopPropagation()} style={{...}}>
        {/* Portrait */}
        <div style={{...}}>
          <img 
            src={heroPortrait}
            alt={hero.name}
            style={{...}}
          />
        </div>
        
        {/* Name */}
        <h2>{hero.name}</h2>
        
        {/* D&D Class/Race */}
        <div style={{ color: '#FFD700', textAlign: 'center', marginBottom: '10px' }}>
          Level {hero.dnd_level} {hero.dnd_race} {hero.dnd_class}
        </div>
        
        {/* Game Stats (existing) */}
        <div style={{...}}>
          <h3>📊 Game Stats</h3>
          {['force', 'dexterite', 'sagesse', 'intelligence', 'vitalite'].map((stat) => {
            const statValue = hero.stats[stat as keyof HeroStats] || 10
            // ... existing stat bar rendering
          })}
        </div>
        
        {/* D&D Stats (new) */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '20px',
          borderRadius: '12px',
          marginTop: '15px'
        }}>
          <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>
            🎲 D&D 5e Stats
          </h3>
          {[
            { key: 'dnd_strength', label: '💪 STR', icon: '💪' },
            { key: 'dnd_dexterity', label: '🤸 DEX', icon: '🤸' },
            { key: 'dnd_constitution', label: '❤️ CON', icon: '❤️' },
            { key: 'dnd_intelligence', label: '🧠 INT', icon: '🧠' },
            { key: 'dnd_wisdom', label: '🦉 WIS', icon: '🦉' },
            { key: 'dnd_charisma', label: '✨ CHA', icon: '✨' }
          ].map(({ key, label, icon }) => {
            const statValue = hero[key as keyof Hero] as number || 10
            const modifier = Math.floor((statValue - 10) / 2)
            return (
              <div key={key} style={{ marginBottom: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'white',
                  fontSize: '14px',
                  marginBottom: '5px'
                }}>
                  <span>{label}</span>
                  <span style={{ fontWeight: 'bold', color: '#FFD700' }}>
                    {statValue} ({modifier >= 0 ? '+' : ''}{modifier})
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(statValue / 20) * 100}%`,
                    height: '100%',
                    backgroundColor: heroColor,
                    transition: 'width 0.5s ease-out'
                  }} />
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Alignment & Background */}
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#ccc'
        }}>
          <div><strong>Background:</strong> {hero.dnd_background || 'Unknown'}</div>
          <div><strong>Alignment:</strong> {hero.dnd_alignment || 'Unknown'}</div>
        </div>
        
        {/* Close button */}
        <button onClick={onClose} style={{...}}>Fermer</button>
      </div>
    </div>
  )
}
```

**Update callsites**:
- `VillageLightPoint.tsx` line ~355: Change `onShowHeroModal(placement)` to pass hero object
- `VillageModal.tsx`: Find hero from `gameState.heroes` by ID and pass to modal

**Validation**: Open hero stats modal - should show real DB stats with D&D modifiers

#### Task 4.2: Update DialogueModal for emotion-based portraits
**File**: `app/components/DialogueModal.tsx`

**BEFORE** (lines 11-17):
```typescript
const HERO_PORTRAITS: { [key: string]: string } = {
  'bjorn': '/portraits/bjorn.png',
  'owen': '/portraits/owen.png',
  // ...
}

// Line ~24
const heroPortrait = HERO_PORTRAITS[dialogue.heroName.toLowerCase()] || '/portraits/bjorn.png'
```

**AFTER**:
```typescript
import { getHeroPortrait } from '@/app/lib/utils/heroPortrait'

interface DialogueModalProps {
  dialogue: Dialogue
  hero: Hero // ADD THIS - pass from GameContext
  onClose: () => void
}

export default function DialogueModal({ dialogue, hero, onClose }: DialogueModalProps) {
  const [currentExchangeIndex, setCurrentExchangeIndex] = useState(0)
  
  const currentExchange = dialogue.exchanges[currentExchangeIndex]
  const isLastExchange = currentExchangeIndex === dialogue.exchanges.length - 1
  
  // Use emotion from current exchange
  const heroPortrait = getHeroPortrait(
    hero,
    currentExchange.emotion || 'neutral',
    '1024x1024' // High res for dialogues
  )
  
  // ... rest of component
}
```

**Update callsites**:
- `VillageModal.tsx`: Pass hero object to DialogueModal
- Find hero from `gameState.heroes` matching `dialogue.heroId`

**Validation**: Navigate dialogue - portrait should change based on `exchange.emotion`

#### Task 4.3: Update VillageLightPoint portrait rendering
**File**: `app/components/village/VillageLightPoint.tsx`

**BEFORE** (line 32):
```typescript
const heroInfo = HERO_PORTRAITS.find(h => h.src === placement.heroSrc)
```

**AFTER**:
```typescript
import { getHeroPortrait } from '@/app/lib/utils/heroPortrait'

// Add hero to component props
interface VillageLightPointProps {
  placement: VillageHeroPlacement
  hero: Hero // ADD THIS
  // ... other props
}

// In component
const heroPortrait = getHeroPortrait(hero, 'neutral', '256x256') // Low res for tooltips
const heroColor = hero.color || '#FFD700'

// Update image src (line ~173)
<img 
  src={heroPortrait}
  alt={hero.name}
  style={{...}}
/>
```

**Update callsites**:
- `VillagePlacementsList.tsx`: Pass hero object for each placement
- Match hero from `gameState.heroes` using `placement.heroId` (will need to add this field)

**Validation**: Hover village points - should show 256x256 portrait from DB

#### Task 4.4: Update dispatch page hero rendering
**File**: `app/dispatch/page.tsx`

**BEFORE** (lines 972, 1171):
```typescript
src={hero.src}
```

**AFTER**:
```typescript
import { getHeroPortrait } from '@/app/lib/utils/heroPortrait'

// In JSX
src={getHeroPortrait(hero, 'neutral', '256x256')}
```

**Validation**: Open dispatch - hero icons should use 256x256 portraits

#### Task 4.5: Update VillagePlacementMode
**File**: `app/components/village/VillagePlacementMode.tsx`

**BEFORE** (lines 58-84):
```typescript
<img src={hero.src} alt={hero.alt} />
```

**AFTER**:
```typescript
import { getHeroPortrait } from '@/app/lib/utils/heroPortrait'

// In JSX
<img 
  src={getHeroPortrait(hero, 'neutral', '256x256')} 
  alt={hero.name} 
/>
```

**Also update placement storage** to use hero ID instead of src:
```typescript
// Line ~122
onPlace(selectedHero.id, selectedHero.name, building) // Changed from src
```

**Update VillageHeroPlacement type**:
```typescript
// In app/types/game.ts
export interface VillageHeroPlacement {
  heroId: string // Changed from heroSrc
  heroName: string // Changed from heroAlt
  buildingName: string
  x: number
  y: number
}
```

**Validation**: Place hero in village - should store ID, render using helper

---

### 🟡 PHASE 5: New Components
**Priority**: LOW - Nice-to-have features  
**Estimated time**: 60 minutes  
**Dependencies**: All previous phases complete

#### Task 5.1: Create HeroLoreModal component
**File**: `app/components/village/HeroLoreModal.tsx` (NEW FILE)

```typescript
'use client'

import { useState } from 'react'
import { Hero } from '@/app/types/game'
import { getHeroPortrait } from '@/app/lib/utils/heroPortrait'
import { COLORS, SHADOWS, BORDER_RADIUS } from '@/app/lib/constants/styles'
import type { ImageVariant } from '@/app/types/game'

interface HeroLoreModalProps {
  hero: Hero | null
  onClose: () => void
}

export default function HeroLoreModal({ hero, onClose }: HeroLoreModalProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<ImageVariant['emotion']>('neutral')
  
  if (!hero) return null
  
  const heroColor = hero.color || '#FFD700'
  const heroPortrait = getHeroPortrait(hero, selectedEmotion, '1024x1024')
  
  // Available emotions for this hero
  const availableEmotions: ImageVariant['emotion'][] = 
    hero.image_variants
      ?.filter(v => v.resolution === '1024x1024')
      .map(v => v.emotion) || ['neutral']
  
  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5000,
        padding: '20px',
        overflowY: 'auto'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: COLORS.CARD_BG,
          padding: '40px',
          borderRadius: BORDER_RADIUS.LARGE,
          border: `4px solid ${heroColor}`,
          maxWidth: '900px',
          width: '100%',
          boxShadow: SHADOWS.LARGE,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header with Portrait */}
        <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
          {/* Portrait with emotion selector */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: `4px solid ${heroColor}`,
              boxShadow: `0 0 30px ${heroColor}`,
              marginBottom: '15px'
            }}>
              <img 
                src={heroPortrait}
                alt={hero.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            
            {/* Emotion selector */}
            <div style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {availableEmotions.map(emotion => (
                <button
                  key={emotion}
                  onClick={() => setSelectedEmotion(emotion)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: selectedEmotion === emotion 
                      ? heroColor 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: 'none',
                    borderRadius: BORDER_RADIUS.SMALL,
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedEmotion !== emotion) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedEmotion !== emotion) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>
          
          {/* Identity Card */}
          <div style={{ flex: 1 }}>
            <h1 style={{
              color: 'white',
              fontSize: '36px',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              {hero.name}
            </h1>
            
            <div style={{
              color: '#FFD700',
              fontSize: '18px',
              marginBottom: '15px',
              fontStyle: 'italic'
            }}>
              "{hero.tagline || 'A hero of legend'}"
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              fontSize: '14px',
              color: '#ccc'
            }}>
              <div><strong>Race:</strong> {hero.dnd_race || 'Unknown'}</div>
              <div><strong>Class:</strong> {hero.dnd_class || 'Unknown'}</div>
              <div><strong>Level:</strong> {hero.dnd_level || '?'}</div>
              <div><strong>Background:</strong> {hero.dnd_background || 'Unknown'}</div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Alignment:</strong> {hero.dnd_alignment || 'Unknown'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Flavor Text */}
        {hero.flavor_text && (
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '20px',
            borderRadius: BORDER_RADIUS.MEDIUM,
            marginBottom: '20px',
            borderLeft: `4px solid ${heroColor}`
          }}>
            <p style={{
              color: 'white',
              fontSize: '16px',
              lineHeight: '1.6',
              fontStyle: 'italic',
              margin: 0
            }}>
              {hero.flavor_text}
            </p>
          </div>
        )}
        
        {/* Physical Description */}
        {hero.physical_description && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{
              color: '#FFD700',
              fontSize: '20px',
              marginBottom: '10px'
            }}>
              👁️ Physical Appearance
            </h3>
            <p style={{
              color: 'white',
              fontSize: '14px',
              lineHeight: '1.6',
              margin: 0
            }}>
              {hero.physical_description}
            </p>
          </div>
        )}
        
        {/* Voice & Mannerisms */}
        {hero.voice_mannerism && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{
              color: '#FFD700',
              fontSize: '20px',
              marginBottom: '10px'
            }}>
              🗣️ Voice & Mannerisms
            </h3>
            <p style={{
              color: 'white',
              fontSize: '14px',
              lineHeight: '1.6',
              margin: 0
            }}>
              {hero.voice_mannerism}
            </p>
          </div>
        )}
        
        {/* Personality Traits */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          {hero.personality_ideal && (
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '15px',
              borderRadius: BORDER_RADIUS.MEDIUM
            }}>
              <h4 style={{ color: '#FFD700', marginBottom: '8px', fontSize: '16px' }}>
                ⭐ Ideal
              </h4>
              <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>
                {hero.personality_ideal}
              </p>
            </div>
          )}
          
          {hero.personality_bond && (
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '15px',
              borderRadius: BORDER_RADIUS.MEDIUM
            }}>
              <h4 style={{ color: '#FFD700', marginBottom: '8px', fontSize: '16px' }}>
                🔗 Bond
              </h4>
              <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>
                {hero.personality_bond}
              </p>
            </div>
          )}
          
          {hero.personality_flaw && (
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '15px',
              borderRadius: BORDER_RADIUS.MEDIUM
            }}>
              <h4 style={{ color: '#FFD700', marginBottom: '8px', fontSize: '16px' }}>
                ⚠️ Flaw
              </h4>
              <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>
                {hero.personality_flaw}
              </p>
            </div>
          )}
        </div>
        
        {/* Character Secret */}
        {hero.character_secret && (
          <div style={{
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            padding: '20px',
            borderRadius: BORDER_RADIUS.MEDIUM,
            border: '2px solid #ff4444',
            marginBottom: '20px'
          }}>
            <h3 style={{
              color: '#ff4444',
              fontSize: '20px',
              marginBottom: '10px'
            }}>
              🔒 Hidden Secret
            </h3>
            <p style={{
              color: 'white',
              fontSize: '14px',
              lineHeight: '1.6',
              margin: 0
            }}>
              {hero.character_secret}
            </p>
          </div>
        )}
        
        {/* Narrative Arcs */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            color: '#FFD700',
            fontSize: '22px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            📖 Narrative Arc
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '15px'
          }}>
            {hero.narrative_arc_past && (
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '15px',
                borderRadius: BORDER_RADIUS.MEDIUM,
                borderLeft: '4px solid #888'
              }}>
                <h4 style={{ color: '#888', marginBottom: '8px', fontSize: '16px' }}>
                  ⏪ Past
                </h4>
                <p style={{ color: 'white', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  {hero.narrative_arc_past}
                </p>
              </div>
            )}
            
            {hero.narrative_arc_present && (
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '15px',
                borderRadius: BORDER_RADIUS.MEDIUM,
                borderLeft: `4px solid ${heroColor}`
              }}>
                <h4 style={{ color: heroColor, marginBottom: '8px', fontSize: '16px' }}>
                  ▶️ Present
                </h4>
                <p style={{ color: 'white', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  {hero.narrative_arc_present}
                </p>
              </div>
            )}
            
            {hero.narrative_arc_future && (
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '15px',
                borderRadius: BORDER_RADIUS.MEDIUM,
                borderLeft: '4px solid #4CAF50'
              }}>
                <h4 style={{ color: '#4CAF50', marginBottom: '8px', fontSize: '16px' }}>
                  ⏩ Future
                </h4>
                <p style={{ color: 'white', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  {hero.narrative_arc_future}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: '#4a4a4a',
            color: 'white',
            border: 'none',
            borderRadius: BORDER_RADIUS.MEDIUM,
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)'
            e.currentTarget.style.backgroundColor = '#5a5a5a'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.backgroundColor = '#4a4a4a'
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
```

#### Task 5.2: Add HeroLoreModal button to VillageLightPoint
**File**: `app/components/village/VillageLightPoint.tsx`

**Add after "Voir le héros" button** (~line 370):
```typescript
<button
  onClick={(e) => {
    e.stopPropagation()
    onShowHeroLore(hero) // Add this handler to props
  }}
  style={{
    padding: '10px 15px',
    backgroundColor: '#6A1B9A', // Purple for lore
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'scale(1.05)'
    e.currentTarget.style.filter = 'brightness(1.2)'
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'scale(1)'
    e.currentTarget.style.filter = 'brightness(1)'
  }}
>
  <span style={{ fontSize: '18px' }}>📖</span>
  Voir l'histoire
</button>
```

**Update VillageLightPointProps**:
```typescript
interface VillageLightPointProps {
  // ... existing props
  onShowHeroLore: (hero: Hero) => void // ADD THIS
}
```

**Update VillageModal.tsx**:
```typescript
const [showHeroLore, setShowHeroLore] = useState(false)
const [selectedHeroForLore, setSelectedHeroForLore] = useState<Hero | null>(null)

// ... in JSX
{showHeroLore && (
  <HeroLoreModal 
    hero={selectedHeroForLore}
    onClose={() => {
      setShowHeroLore(false)
      setSelectedHeroForLore(null)
    }}
  />
)}
```

**Validation**: Click "Voir l'histoire" - should open modal with all lore fields

---

### 🔵 PHASE 6: Testing & Validation
**Priority**: CRITICAL - Must verify everything works  
**Estimated time**: 45 minutes  
**Dependencies**: All previous phases complete

#### Test 6.1: Hero Loading from DB
- [ ] Open dev tools network tab
- [ ] Load game page
- [ ] Verify `/api/heroes` returns all new fields (D&D stats, personality, image_variants)
- [ ] Console: No errors about missing fields
- [ ] GameContext state inspector: Heroes array includes `image_variants` with 6 items each

#### Test 6.2: Emotion-Based Portrait System
- [ ] Open DialogueModal
- [ ] Navigate through exchanges with different emotions
- [ ] Verify portrait changes (check network tab for correct image URLs)
- [ ] Test fallback: Remove one emotion variant from DB, check it falls back to neutral
- [ ] Test resolution: Dialogue uses 1024x1024, UI elements use 256x256

#### Test 6.3: HeroStatsModal Displays Real Data
- [ ] Open village
- [ ] Click hero point → "Voir le héros"
- [ ] Verify stats match database values (not hardcoded)
- [ ] Check D&D stats show correctly with modifiers
- [ ] Verify portrait is 256x256 resolution

#### Test 6.4: HeroLoreModal All Fields
- [ ] Click "Voir l'histoire" in village
- [ ] Verify all sections render:
  - [ ] Physical description
  - [ ] Voice & mannerisms
  - [ ] Personality traits (ideal, bond, flaw)
  - [ ] Character secret
  - [ ] Narrative arcs (past, present, future)
  - [ ] Flavor text & tagline
- [ ] Test emotion selector - portrait should change
- [ ] Verify 1024x1024 resolution used

#### Test 6.5: Dispatch Page Hero Icons
- [ ] Open dispatch phase
- [ ] Verify hero selection cards show 256x256 portraits
- [ ] Check assigned heroes in mission panel use correct images
- [ ] No console errors about missing images

#### Test 6.6: Save/Load Persistence
- [ ] Complete a mission with assigned heroes
- [ ] Save game
- [ ] Reload page
- [ ] Load save
- [ ] Verify heroes still have all D&D fields
- [ ] Check image_variants persisted correctly

---

## Migration Checklist

### Before Starting
- [ ] Backup database (Supabase has automatic backups, verify in dashboard)
- [ ] Create git branch: `git checkout -b feature/sprint1-dnd-heroes`
- [ ] Verify curator has completed delivery (30 images + DB updates)
- [ ] Check Supabase Storage has 30 images in `hero_portraits` bucket
- [ ] Verify `hero_image_variants` table has 30 rows (5 heroes × 6 emotions)

### During Implementation
- [ ] Follow phase order strictly (0 → 1 → 2 → 3 → 4 → 5 → 6)
- [ ] Test after each phase before proceeding
- [ ] Commit after each completed phase
- [ ] Keep old code commented for first commit (easy rollback)

### After Completion
- [ ] Run full test suite (Phase 6 checklist)
- [ ] Performance check: Image loading times acceptable?
- [ ] Accessibility: Alt texts present on all images?
- [ ] Mobile responsive: Modals work on small screens?
- [ ] Merge to main: `git merge feature/sprint1-dnd-heroes`
- [ ] Deploy to production
- [ ] Monitor Sentry/logs for 24h

---

## Troubleshooting Guide

### Issue: "Cannot read property 'image_variants' of undefined"
**Cause**: API not returning new fields  
**Fix**: Check Phase 2 - API route must include `image_variants` in Prisma query

### Issue: "Hero portrait not changing with emotion"
**Cause**: DialogueModal not using `getHeroPortrait()` helper  
**Fix**: Verify Phase 4.2 complete - must import and use helper function

### Issue: "Stats still showing hardcoded values"
**Cause**: HeroStatsModal still using `HERO_STATS` dictionary  
**Fix**: Complete Phase 4.1 - remove dictionary, load from hero prop

### Issue: "Images loading slowly"
**Cause**: Using 1024x1024 where 256x256 sufficient  
**Fix**: Review Phase 1 - use correct resolution parameter

### Issue: "TypeScript errors about missing fields"
**Cause**: Phase 0 not completed  
**Fix**: Extend Hero interface with all D&D fields first

---

## Performance Considerations

### Image Loading Optimization
- **1024x1024**: Only for dialogues (full-screen, emotion important)
- **256x256**: All UI elements (tooltips, cards, icons)
- **Lazy loading**: Consider for HeroLoreModal emotion selector
- **Caching**: Supabase Storage has CDN, ensure cache headers set

### Database Query Optimization
- API route includes `image_variants` - 6 extra rows per hero (30 total)
- Current Prisma query already includes `images` - minor overhead increase
- Consider adding index on `hero_image_variants(hero_id, resolution, emotion)`

### Bundle Size
- New component (HeroLoreModal): ~8KB minified
- Helper function (heroPortrait.ts): <1KB
- Total impact: <10KB to main bundle

---

## Dependencies & Compatibility

### Existing Systems
- ✅ **GameContext**: Extends existing hero loading, backward compatible
- ✅ **portraits.ts**: Keep for gradual migration (deprecated but functional)
- ✅ **localStorage**: No changes needed (only for UI preferences)
- ✅ **Mission system**: No changes needed (uses existing stats)

### New Dependencies
- None - uses existing Next.js/React/Prisma stack

### Breaking Changes
- **VillageHeroPlacement**: `heroSrc` → `heroId`, `heroAlt` → `heroName`
  - **Migration**: StorageManager auto-converts on first load (add migration helper)
- **HeroStatsModal**: Props changed from `placement` to `hero`
  - **Migration**: Update all callsites (VillageLightPoint, VillageModal)

---

## Rollback Plan

### If Critical Issue Found

1. **Revert image_variants usage**:
   ```typescript
   // In app/api/heroes/route.ts
   src: hero.images.find(img => img.is_default)?.url || '/portraits/default.png'
   // Remove image_variants from response
   ```

2. **Restore HERO_STATS dictionary**:
   ```typescript
   // In HeroStatsModal.tsx
   const HERO_STATS: Record<string, ...> = { /* original data */ }
   ```

3. **Restore HERO_PORTRAITS mapping**:
   ```typescript
   // In DialogueModal.tsx
   const HERO_PORTRAITS: { [key: string]: string } = { /* original paths */ }
   ```

4. **Git revert**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

### Gradual Rollout Strategy
- Deploy to staging first
- Test with 20% of users (feature flag)
- Monitor error rates for 48h
- Full rollout if <0.1% error rate

---

## Next Steps After Sprint 1

### Sprint 2: Missions Enrichment
- Apply same pattern to missions (locations, narratives)
- Multi-resolution location images (1024x1024 for dispatch map, 512x512 for cards)
- Dynamic mission generation based on hero arcs

### Sprint 3: Dialogues Enrichment
- Context-aware dialogue variations (references hero personality)
- Branching dialogue trees (use D&D stats for skill checks)
- Voice acting integration (text-to-speech using `voice_mannerism`)

### Long-term Improvements
- Hero leveling system (use `dnd_level` field)
- Equipment system (D&D items tied to stats)
- Narrative choices affect personality traits
- Multi-language support (separate translations table)

---

## Success Metrics

### Technical
- [ ] All 5 heroes load with complete D&D data
- [ ] 30 portrait variants accessible via `getHeroPortrait()`
- [ ] Zero TypeScript errors
- [ ] Page load time <2s (before: 1.8s, target: <2.2s)
- [ ] Image loading <500ms per portrait

### User Experience
- [ ] Dialogues show emotion-appropriate portraits
- [ ] Hero stats reflect actual database values
- [ ] Lore modal reveals rich character backstories
- [ ] No visual glitches or missing images
- [ ] Smooth transitions between emotions

### Content Quality (Curator Responsibility)
- [ ] D&D stats balanced (no hero >18 in multiple stats)
- [ ] Personality traits distinct per hero
- [ ] Narrative arcs cohesive and engaging
- [ ] Portraits match physical descriptions
- [ ] Emotions appropriate for dialogue context

---

**Document Status**: ✅ Ready for implementation  
**Last Updated**: 2025-01-23  
**Next Review**: After Phase 3 completion (estimate: 90 minutes from start)
