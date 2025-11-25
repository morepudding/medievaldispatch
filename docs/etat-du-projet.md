# 📊 État du Projet - Medieval Dispatch

**Date de génération** : 24 novembre 2025  
**Dernière mise à jour** : 24 novembre 2025  
**Auteur** : Audit complet de la codebase

---

## 🎯 Résumé Exécutif

Medieval Dispatch est un jeu de gestion RPG en temps réel fonctionnel, développé avec Next.js 14 et TypeScript. Le projet utilise une architecture **deux bases de données** (Supabase PostgreSQL pour les données persistantes + localStorage pour les préférences UI). La migration vers base de données est **majoritairement complète**, avec 13 tables Prisma opérationnelles et 12 API routes fonctionnelles.

### État Global : **🟢 Fonctionnel avec Limitations**

**Points Forts** :
- ✅ Architecture technique solide (Prisma + Supabase)
- ✅ Système de dispatch 60s avec timer opérationnel
- ✅ Gestion d'état via GameContext (803 lignes)
- ✅ 12 API routes CRUD complètes
- ✅ Refactor Sprint 5C réussi (VillageModal -70% de lignes)

**Limitations** :
- ⚠️ Base de données contient **données de test limitées** (5 héros, 15 missions, 3 dialogues selon databaseroadmap.md)
- ⚠️ Héros ont placeholders génériques - **Sprint 1 Curator en préparation** (enrichissement D&D 5e)
- ⚠️ Pipeline contenu (AI Curator) documenté et infrastructure DB prête
- ⚠️ Certaines features documentées comme "TERMINÉ" mais doivent être validées en runtime

---

## 🗄️ État de la Base de Données

### Architecture Prisma

**Fichier** : `prisma/schema.prisma` (282 lignes)  
**Provider** : PostgreSQL (Supabase)  
**Connexions** :
- `DATABASE_URL` : Pooler PgBouncer (port 6543) pour queries
- `DIRECT_URL` : Connexion directe (port 5432) pour migrations

### Tables Créées (13 tables)

#### 📚 Tables de Contenu (Lecture seule pour le jeu)
| Table | Description | Relations |
|-------|-------------|-----------|
| `heroes` | Héros jouables avec stats (strength, diplomacy, stealth, intelligence) | → hero_images, dialogues, player_heroes |
| `hero_images` | Images multiples par héros (portrait_full, icon, emotions) | ← heroes |
| `locations` | Lieux de la carte avec positions (x, y en %) | → missions |
| `missions` | Missions par jour (1-3) avec spawn_time, duration, stats requises | ← locations, → mission_completions |
| `dialogues` | Dialogues débloqués par jour | ← heroes, → dialogue_exchanges, player_dialogues |
| `dialogue_exchanges` | Échanges textuels dans un dialogue (speaker, text, emotion) | ← dialogues |
| `buildings` | Bâtiments améliorables | → building_levels, player_buildings |
| `building_levels` | Niveaux de bâtiments avec coûts et bonus | ← buildings |

#### 💾 Tables de Sauvegarde (Gérées par le jeu)
| Table | Description | Relations |
|-------|-------------|-----------|
| `game_saves` | Parties sauvegardées (current_day, gold, reputation) | → player_heroes, player_buildings, player_dialogues, mission_completions |
| `player_heroes` | États des héros par sauvegarde (stats actuelles, disponibilité) | ← game_saves, heroes |
| `player_buildings` | Niveaux de bâtiments par sauvegarde | ← game_saves, buildings |
| `player_dialogues` | Dialogues lus avec timestamp | ← game_saves, dialogues |
| `mission_completions` | Missions terminées (succès/échec) | ← game_saves, missions |

### Contenu Actuel (Selon documentation)

**Note** : Prisma Client non généré lors de l'audit (erreur TLS), donc pas de vérification directe. Les chiffres ci-dessous proviennent de `docs/architecture/databaseroadmap.md` lignes 75-150.

| Type de Contenu | Quantité | Statut Migration |
|-----------------|----------|------------------|
| Héros | 5 | ✅ Migrés (Bjorn, Owen, Vi, Durun, Elira) |
| Images Héros | 5 | ✅ Références locales `/portraits/*.png` |
| Lieux | 4 | ✅ Créés (Forêt, Grotte, Ruines, Village) |
| Missions | 15 | ✅ Migrées (4 jour1, 5 jour2, 6 jour3) |
| Dialogues | 3 | ✅ Créés (Bjorn, Owen, Vi - jour 1) |
| Bâtiments | 5 | ✅ Créés (Forge, Hôtel de Ville, Marché, Auberge, Tour) |
| Sauvegardes | ? | Dynamique (créées par joueurs) |

**Observations Critiques** :
- Contenu actuellement **limité à 3 jours** (MVP scope)
- Images stockées **localement** (`/public/portraits/`, `/public/lieux/`) - Migration vers Supabase Storage prévue mais non effectuée
- **Pas de vérification runtime** si les données correspondent exactement au code

---

## 🔌 API Routes Implémentées (12 routes)

### Routes de Contenu (Lecture seule)

#### GET /api/heroes
**Fichier** : `app/api/heroes/route.ts`  
**Fonction** : Retourne héros actifs avec images default  
**Mapping** :
- `hero.slug` → `id` (pour compatibilité)
- `hero.strength` → `stats.force`
- `hero.stealth` → `stats.dexterite`
- `hero.diplomacy` → `stats.sagesse`
- `hero.intelligence` → `stats.intelligence`
- `images[0].url` → `src`

**Particularité** : Cache 1 heure (`revalidate = 3600`)

#### GET /api/buildings
**Fichier** : `app/api/buildings/route.ts`  
**Fonction** : Retourne bâtiments avec tous niveaux  
**Mapping** :
- `building.levels` → `upgradeCosts[]` (coûts par niveau)
- `building.levels` → `bonuses[]` (descriptions bonus)
- Niveau initial = 0

#### GET /api/missions/day/[day]
**Fichier** : `app/api/missions/day/[day]/route.ts`  
**Fonction** : Missions d'un jour spécifique (1-3)  
**Mapping** :
- `mission.override_position_x ?? location.position_x` → positions finales
- `mission.spawn_time` → Heure d'apparition (0-23)
- `mission.duration` → Durée en heures
- Validation : day doit être 1, 2 ou 3

**Particularité** : Calcule difficulté automatique (jour 1 = facile, jour 3 = difficile)

#### GET /api/dialogues/day/[day]
**Fichier** : `app/api/dialogues/day/[day]/route.ts`  
**Fonction** : Dialogues débloqués jusqu'au jour X  
**Mapping** :
- `unlock_day <= day` → Retourne dialogues cumulatifs
- `dialogue.exchanges` → Ordonnés par `order`
- Format ID : `day{unlockDay}_{heroSlug}_{order}`

**Note** : `isRead` = false par défaut, géré côté client

### Routes de Sauvegarde (CRUD)

#### POST /api/save
**Fichier** : `app/api/save/route.ts`  
**Fonction** : Créer nouvelle partie  
**Comportement** :
1. Récupère tous héros actifs + bâtiments
2. Crée `game_save` avec valeurs initiales (day=1, gold=100, reputation=50)
3. Crée relations `player_heroes` (copies des stats originales)
4. Crée relations `player_buildings` (tous niveau 0)

**Retour** : `{ success: true, save_id, data }`

#### GET /api/save/[id]
**Fichier** : `app/api/save/[id]/route.ts`  
**Fonction** : Charger sauvegarde complète  
**Inclusions Prisma** :
- `player_heroes` → `hero` → `images`
- `player_buildings` → `building` → `levels`
- `player_dialogues` → `dialogue` → `hero`, `exchanges`
- `mission_completions` → `mission` → `location`

**Retour** : Objet complet avec toutes relations

#### PUT /api/save/[id]
**Fonction** : Mettre à jour métadonnées générales  
**Champs** : `current_day`, `current_time`, `gold`, `reputation`

#### PUT /api/save/[id]/heroes
**Fichier** : `app/api/save/[id]/heroes/route.ts`  
**Fonction** : Sauvegarder états de tous héros  
**Format** : `{ heroes: [{ hero_id, current_strength, current_diplomacy, ... }] }`

#### PUT /api/save/[id]/buildings
**Fichier** : `app/api/save/[id]/buildings/route.ts`  
**Fonction** : Mettre à jour niveau d'un bâtiment  
**Format** : `{ building_id, level }`

#### POST /api/save/[id]/missions
**Fichier** : `app/api/save/[id]/missions/route.ts`  
**Fonction** : Enregistrer mission complétée  
**Format** : `{ mission_id, success: boolean }`

#### POST /api/save/[id]/dialogues
**Fichier** : `app/api/save/[id]/dialogues/route.ts`  
**Fonction** : Marquer dialogue comme lu  
**Format** : `{ dialogue_id }`

#### POST /api/save/migrate
**Fichier** : `app/api/save/migrate/route.ts`  
**Fonction** : Migrer ancienne sauvegarde localStorage → DB  
**Format** : `{ gameState: {...} }`  
**Comportement** :
1. Parse ancien format localStorage
2. Mappe héros/bâtiments par slug
3. Crée nouvelle sauvegarde DB
4. Retourne `save_id`

**Usage** : Transitoire pour migration des anciennes parties

---

## 🧩 Architecture Composants

### Composants Racine (app/)

#### app/page.tsx (Hub/Village)
**Lignes** : ~500 lignes  
**Responsabilités** :
- Point d'entrée principal du jeu
- Orchestration des modals (village, dialogues, building upgrades)
- Gestion stamps décoratifs (localStorage)
- Affichage compteurs (jour, or, réputation)

**Composants Utilisés** :
- VillageModal
- DialogueModal
- BuildingUpgradeModal
- HeroStatsModal
- BuildingInfoModal

#### app/dispatch/page.tsx (Phase Dispatch)
**Lignes** : ~1400 lignes  
**Responsabilités** :
- Timer 60 secondes avec compte à rebours
- Apparition progressive des missions (selon `spawnTime`)
- Drag & drop héros sur missions
- Calcul succès/échec avec `MissionCalculator`
- Affichage carte avec lieux

**Fonctionnalités Clés** :
- ✅ Timer démarre automatiquement au mount
- ✅ Missions spawn à leur `spawnTime` respectif (ligne 124-127)
- ✅ Pause/Resume (useState `isPaused`)
- ✅ Assignation héros → missions via `assignHeroesToMission()`
- ✅ Calcul succès avec taux plafonné à 150% par stat

**Code Critique** :
```typescript
// Ligne 21 : Timer initial 60s
const [timeLeft, setTimeLeft] = useState(60)

// Ligne 86-87 : Chargement missions avec spawnTime = 0 immédiatement
const initialMissions = adjustedMissions.filter(m => m.spawnTime === 0)

// Ligne 126-127 : Spawn progressif des autres missions
const missionsToSpawn = allMissionsRef.current.filter(
  m => m.spawnTime === elapsed && m.spawnTime > 0
)
```

#### app/layout.tsx
**Responsabilités** :
- Wrapper global avec `GameProvider`
- Métadonnées Next.js
- Styles globaux (`globals.css`, `animations.css`)

### Composants Principaux (app/components/)

| Composant | Lignes | Rôle |
|-----------|--------|------|
| Breadcrumb.tsx | ~50 | Fil d'Ariane (Hub → Dispatch → Village) |
| BuildingUpgradeModal.tsx | ~200 | Modal d'amélioration de bâtiment avec coût/bonus |
| DayCounter.tsx | ~50 | Affichage du jour actuel (Jour X/3) |
| DialogueModal.tsx | ~300 | Affichage des échanges de dialogues avec portraits |
| GameLoader.tsx | ~50 | Wrapper de chargement pour héros depuis API |
| GameStateIndicator.tsx | ~40 | Debug indicator (or, jour, héros disponibles) |
| LoadingScreen.tsx | ~100 | Écran de chargement avec retry |
| SaveGameModal.tsx | ~150 | Modal de sauvegarde/chargement de parties |
| Toast.tsx | ~200 | Système de notifications (success, error, warning) |

**Exports** :
- `Toast` : Composant notification individuel
- `ToastContainer` : Container pour gérer pile de toasts
- `useToast()` : Hook pour afficher toasts depuis n'importe où

### Composants Village (app/components/village/)

**Documentation complète** : `app/components/village/README.md` (330 lignes)

| Composant | Lignes | Rôle |
|-----------|--------|------|
| VillageModal.tsx | 488 | **Orchestrateur** principal - Gère 10 useState, coordonne sous-composants |
| VillageLightPoint.tsx | 420 | Point lumineux interactif avec tooltip, menu contextuel, badges |
| VillagePlacementsList.tsx | 69 | Mapper liste placements → VillageLightPoint |
| VillagePlacementMode.tsx | 201 | Modal de sélection héros + bâtiment pour placement |
| VillageConfirmationModals.tsx | 399 | Modals "Jour suivant" + "Reset" avec récapitulatifs |
| VillageDaySummary.tsx | 169 | Résumé fin de dispatch (missions réussies/échouées) |
| VillageDialogueList.tsx | 238 | Liste dialogues disponibles avec badges "nouveau" |
| VillageBuildingList.tsx | 308 | Liste bâtiments améliorables avec coûts |
| HeroStatsModal.tsx | 183 | Détails d'un héros (portrait, stats, bâtiment) |
| BuildingInfoModal.tsx | 196 | Détails d'un bâtiment (niveau, bonus) |

**Architecture Post-Refactor Sprint 5C** :
- **Avant** : VillageModal = 1,638 lignes monolithique
- **Après** : 10 composants spécialisés = 488 + 420 + ... = ~2,671 lignes totales
- **Gain** : -70% de lignes dans l'orchestrateur, +composants réutilisables

**Patterns** :
- ✅ Single Responsibility Principle
- ✅ Component Composition
- ✅ Props explicites (pas de prop drilling excessif)
- ✅ Isolation side effects (logique métier dans GameContext)

### Composants UI (app/components/ui/)

| Composant | Rôle |
|-----------|------|
| Button.tsx | Bouton stylisé avec variants (primary, secondary, danger) |
| Card.tsx | Carte avec header/content/footer |
| Modal.tsx | Modal réutilisable avec overlay |
| index.ts | Barrel export de tous composants UI |

---

## 🎮 GameContext - État Global

**Fichier** : `app/contexts/GameContext.tsx` (803 lignes)  
**Pattern** : React Context API avec Provider

### Interface GameContextType (40 propriétés/méthodes)

#### État
```typescript
gameState: GameState    // État complet du jeu
loading: boolean        // Chargement initial
error: string | null    // Erreur réseau/DB
saveId: string | null   // ID sauvegarde active
isSaving: boolean       // Indicateur sauvegarde en cours
```

#### Actions de Navigation
```typescript
startDispatch()  // → Passe en mode dispatch (timer 60s)
endDispatch()    // → Retour au village
goToVillage()    // → Affiche modal village
goToHub()        // → Retour hub principal
nextDay()        // → Incrémente jour, charge nouvelles missions/dialogues
resetGame()      // → Crée nouvelle partie (appelle createNewSave)
```

#### Chargement de Contenu
```typescript
loadMissionsForDay(day: number): Promise<Mission[]>
loadDialoguesForDay(day: number): Promise<Dialogue[]>
loadBuildings(): Promise<Building[]>
```

**Détail `loadDialoguesForDay()`** :
- Fetch depuis `/api/dialogues/day/${day}`
- **Merge avec dialogues déjà lus** (marque `isRead: true`)
- Stocke dans `gameState.availableDialogues`

#### Gestion Sauvegardes
```typescript
createNewSave(playerName?: string): Promise<string | null>
loadSave(saveId: string): Promise<boolean>
saveToDatabase(): Promise<void>
migrateLocalStorageSave(): Promise<string | null>
```

**Détail `loadSave()`** :
1. Fetch `/api/save/${saveId}`
2. Hydrate `gameState` avec données DB
3. Mappe `player_heroes` → `heroes[]` avec stats actuelles
4. Mappe `player_buildings` → `buildings[]` avec niveaux
5. Charge missions/dialogues du jour actuel

#### Actions Jeu
```typescript
assignHeroesToMission(missionId, heroIds)
completeMission(missionId, success)
addGold(amount)
spendGold(amount): boolean
upgradeBuilding(buildingId): boolean
markDialogueAsRead(dialogueId)
```

**Détail `completeMission()`** :
1. Trouve mission dans `activeMissions`
2. Calcule or gagné (50% si échec)
3. Libère héros assignés (`isAvailable = true`)
4. Ajoute à `completedMissions`
5. POST vers `/api/save/${saveId}/missions`
6. Appelle `saveToDatabase()`

### État GameState (Interface)

**Fichier** : `app/types/game.ts`

```typescript
interface GameState {
  // Progression
  currentDay: number              // 1, 2, ou 3
  gold: number
  
  // Entités
  heroes: Hero[]
  buildings: Building[]
  villagePlacements: VillageHeroPlacement[]
  
  // Missions
  completedMissions: Mission[]
  activeMissions: Mission[]       // Visibles actuellement
  allDayMissions: Mission[]       // Toutes du jour (incluant pas encore spawn)
  
  // Dialogues
  availableDialogues: Dialogue[]
  readDialogues: string[]         // IDs seulement
  
  // États de vue
  currentView: 'hub' | 'dispatch' | 'village'
  isInDispatch: boolean
  dispatchTimer: number           // Secondes restantes
  dispatchElapsed: number         // Secondes écoulées
}
```

### Initialisation

**Mount** (ligne 144-174) :
1. Tente charger `medievalDispatch_saveId` depuis localStorage
2. Si existe → `loadSave(savedSaveId)`
3. Sinon → Charge dialogues/missions jour 1 (nouveau jeu)

**INITIAL_BUILDINGS** (hardcodé lignes 49-120) :
- 5 bâtiments par défaut (Forge, Hôtel de Ville, Marché, Auberge, Tour)
- Utilisé comme fallback si DB ne répond pas
- **Redondant** avec `/api/buildings` (à nettoyer)

---

## 🛠️ Utilitaires & Bibliothèques

### app/lib/prisma.ts
**Fonction** : Singleton Prisma Client  
**Pattern** : Prévient multiples instances en dev (Next.js hot reload)

```typescript
const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### app/lib/utils/missionLogic.ts
**Export** : `MissionCalculator`

#### Méthodes
```typescript
calculateSuccessRate(heroes: Hero[], mission: Mission): number
performCheck(successRate: number): boolean
```

**Logique `calculateSuccessRate()`** :
1. Pour chaque stat (force, dexterite, sagesse, intelligence) :
   - Somme stats héros
   - Ratio = (somme héros / stat requise) * 100
   - **Plafond à 150%** par stat
2. Moyenne pondérée des 4 stats
3. Retourne taux global (0-150%)

**Exemple** :
- Mission requiert : force=10, dexterite=5, sagesse=8, intelligence=7
- Héros envoyés : Bjorn (force=18) + Owen (dexterite=18)
- Ratio force : (18/10)*100 = 180% → plafonné à **150%**
- Ratio dexterite : (18/5)*100 = 360% → plafonné à **150%**
- Ratio sagesse : (0/8)*100 = 0%
- Ratio intelligence : (0/7)*100 = 0%
- **Taux global** : (150+150+0+0)/4 = **75%**

### app/lib/utils/storage.ts
**Export** : `StorageManager`

#### Méthodes
```typescript
saveStamps(stamps): boolean
loadStamps(): Stamp[]
saveVillagePlacements(placements): boolean
loadVillagePlacements(): VillageHeroPlacement[]
```

**Usage** : Stockage localStorage des **préférences UI uniquement** (pas game state)

### app/lib/constants/styles.ts
**Exports** : Constantes CSS centralisées

```typescript
export const COLORS = {
  CARD_BG: '#1e1e1e',
  GOLD: '#d4af37',
  SUCCESS: '#22c55e',
  // ... 20+ couleurs
}

export const SHADOWS = {
  GLOW: '0 0 20px rgba(212, 175, 55, 0.3)',
  // ...
}

export const SPACING = { ... }
export const TRANSITIONS = { ... }
export const BORDER_RADIUS = { ... }
export const Z_INDEX = { ... }
```

**Pattern** : Évite magic values hardcodés dans composants

### app/data/portraits.ts
**Export** : `HERO_PORTRAITS`

**Structure** :
```typescript
export const HERO_PORTRAITS: Record<string, string> = {
  bjorn: '/portraits/bjorn.png',
  owen: '/portraits/owen.png',
  // ... 9 héros
}
```

**Usage** : Mapping nom héros → chemin portrait

---

## 📋 Types TypeScript

**Fichier** : `app/types/game.ts` (140 lignes)

### Types Principaux

```typescript
interface HeroStats {
  force: number
  dexterite: number
  sagesse: number
  intelligence: number
  vitalite: number
}

interface Hero {
  id: string
  name: string
  src: string              // Chemin portrait
  alt: string
  color: string            // Couleur thème héros
  stats: HeroStats
  isAvailable: boolean
  currentMissionId?: string
}

type MissionStatus = 'pending' | 'disponible' | 'en_cours' | 'terminee' | 'echouee'

interface Mission {
  id: string
  titre: string
  description: string
  locationSrc: string
  x: number                // Position % (0-100)
  y: number
  requiredStats: MissionRequirement
  difficulty: 'facile' | 'moyenne' | 'difficile'
  goldReward: number
  experienceReward: number
  duration: number         // Heures
  spawnTime: number        // Seconde d'apparition (0-60)
  assignedHeroes: string[]
  status: MissionStatus
  resolutionSuccess: string
  resolutionFailure: string
  startTime?: number       // Timestamp début
}

interface Building {
  id: string
  name: string
  icon: string
  level: number
  maxLevel: number
  description: string
  upgradeCosts: number[]   // Index = niveau actuel
  bonuses: { level: number, description: string }[]
}

interface Dialogue {
  id: string
  heroId: string
  heroName: string
  unlockDay: number
  isRead: boolean
  exchanges: DialogueExchange[]
}

interface DialogueExchange {
  speaker: 'hero' | 'player'
  text: string
  emotion?: 'happy' | 'sad' | 'angry' | 'neutral' | 'surprised'
}

interface VillageHeroPlacement {
  heroSrc: string
  heroAlt: string
  buildingName: string
  x: number
  y: number
}
```

---

## 🔄 Sprints Complétés (Selon Documentation)

### docs/roadmaps/roadmap.md

**Sprint 4 : Système de progression** → ✅ TERMINÉ (ligne 319)
- Boucle 3 jours
- Système d'or et missions
- Progression linéaire

**Sprint 5 : Refactoring de l'architecture** → 🔄 80% COMPLÉTÉ (ligne 420)
- **Problème** : `page.tsx` faisait 2413 lignes (ligne 422)
- **Solution** : Composants spécialisés créés
- **Recommandation** : Intégration manuelle finale dans page.tsx

**Sprint 5C : Découpage VillageModal** → ✅ TERMINÉ (23 novembre 2025)
- VillageModal 1,638 → 488 lignes
- 10 composants village/ créés
- Architecture documentée dans README.md

**Sprint 6 : Finalisation du Flow** → 📝 EN COURS (ligne 453)
- Tâches listées mais statut flou

### docs/architecture/databaseroadmap.md

**Sprint 0 : Préparation et Setup** → ✅ TERMINÉ (ligne 103)
- Supabase DEV + PROD créés
- 13 tables Prisma créées
- Client Prisma généré

**Sprint 1 : Migration des Données** → ✅ MAJORITAIREMENT TERMINÉ (lignes 105-210)
- 5 héros migrés
- 5 images références
- 4 lieux créés
- 15 missions migrées
- 3 dialogues créés
- 5 bâtiments créés

**Sprint 2-5** : Statuts non clairs dans le document

---

## ⚠️ Gaps & Limitations Identifiés

### 1. Contenu Limité

**Problème** : Base de données contient **contenu de test/placeholder**
- Seulement 5 héros (descriptions génériques selon roadmapcuratorv2.md ligne 15)
- 15 missions (fonctionnelles mais textes génériques)
- 3 dialogues (narratifs mais incomplets)

**Impact** : Jeu fonctionnel mais **manque de profondeur narrative**

**Solution Documentée** : Pipeline AI Curator (voir `docs/curator/`)
- Curator génère contenu enrichi (descriptions, images, dialogues)
- Dev crée structures DB → Envoie specs au curator → Curator retourne JSON + assets
- **Statut** : Pipeline documenté mais séparé du développement (pas encore intégré)

### 2. Images Non Migrées vers Supabase Storage

**Problème** : Images stockées localement dans `/public/`
- `/public/portraits/` (héros)
- `/public/lieux/` (locations)

**Impact** : 
- ❌ Pas de CDN Supabase
- ❌ Taille bundle Next.js augmentée
- ❌ Pas de versioning images

**Solution Prévue** : Supabase Storage (databaseroadmap.md ligne 37)
- Upload vers buckets Supabase
- Mise à jour URLs dans `hero_images` et `locations`

**Statut** : ⏳ Reporté à plus tard (ligne 125)

### 3. Documentation Non Synchronisée

**Problème** : Docs mentionnent features comme "TERMINÉ" mais sans validation runtime

**Exemples** :
- roadmap.md ligne 420 : "Sprint 5 : 80% complété" → Qu'est-ce que les 20% manquants ?
- databaseroadmap.md : Sprint 2-5 sans statut clair

**Impact** : Confusion sur état réel du projet

**Solution** : Ce document (`etat-du-projet.md`) + mise à jour des roadmaps

### 4. Tests Absents

**Problème** : Aucun test unitaire/intégration trouvé

**Impact** : 
- ❌ Pas de validation automatique des features
- ❌ Régressions non détectées
- ❌ Refactors risqués

**Solution Suggérée** :
- Tests unitaires : `MissionCalculator`, `StorageManager`
- Tests intégration : API routes (Prisma queries)
- Tests E2E : Flow complet (dispatch → village → jour suivant)

### 5. Code Mort & Redondances

**Identifiés** :
- `INITIAL_BUILDINGS` hardcodé dans GameContext (ligne 49-120) vs `/api/buildings`
- Anciens imports commentés dans plusieurs fichiers
- `VillageModal.old.tsx` supprimé mais peut-être d'autres vieux fichiers

**Statut** : Sprint 5 (refactoring.md) a nettoyé une partie

### 6. Environnement de Développement Fragile

**Problème Observé Pendant Audit** :
- `npx prisma generate` échoue (erreur TLS certificat)
- `@prisma/client` non installé globalement
- Scripts npm (prisma:generate) appellent `prisma` au lieu de `npx prisma`

**Impact** : Setup initial difficile pour nouveaux développeurs

**Solution** : Fix scripts dans `package.json` + doc setup améliorée

---

## 🎯 Recommandations Priorisées

### 🔴 Priorité 1 (Critique)

1. **Fixer l'environnement Prisma**
   - Corriger script `prisma:generate` dans package.json
   - Documenter setup complet avec npx
   - Tester sur machine propre

2. **Valider Contenu DB en Runtime**
   - Créer script `check-db.js` fonctionnel
   - Vérifier que 5 héros + 15 missions + 3 dialogues existent réellement
   - Identifier écarts documentation vs réalité

3. **Mettre à Jour Documentation**
   - Corriger statuts sprints dans roadmap.md
   - Compléter databaseroadmap.md (sprints 2-5)
   - Marquer clairement DONE vs PLANNED

### 🟡 Priorité 2 (Important)

4. **Intégrer Pipeline Curator**
   - Établir workflow dev ↔ curator
   - Enrichir descriptions héros (remplacer placeholders)
   - Générer dialogues narratifs complets

5. **Migrer Images vers Supabase Storage**
   - Upload `/public/portraits/` → Supabase bucket `hero-portraits`
   - Upload `/public/lieux/` → Supabase bucket `locations`
   - Mettre à jour URLs dans DB

6. **Nettoyer Code Mort**
   - Supprimer `INITIAL_BUILDINGS` hardcodé
   - Supprimer imports commentés
   - Audit fichiers obsolètes (`grep -r "\.old\."`)

### 🟢 Priorité 3 (Souhaitable)

7. **Ajouter Tests**
   - Vitest pour utils (`MissionCalculator`, `StorageManager`)
   - Tests API routes avec mock Prisma
   - Playwright pour E2E basique

8. **Améliorer UX**
   - Animations transitions (dispatch → village)
   - Feedback visuel sauvegarde (spinner)
   - Tooltips sur stats héros

9. **Optimisations Performance**
   - Lazy load composants village
   - Image optimization (next/image)
   - Memoization composants lourds

---

## 📊 Métriques du Projet

### Lignes de Code

| Catégorie | Fichiers | Lignes | Moyenne |
|-----------|----------|--------|---------|
| API Routes | 12 | ~800 | 67/fichier |
| Composants | 24 | ~5,000 | 208/fichier |
| GameContext | 1 | 803 | - |
| Types | 1 | 140 | - |
| Utils | 3 | ~400 | 133/fichier |
| Prisma Schema | 1 | 282 | - |
| **TOTAL** | **42** | **~7,425** | **177/fichier** |

### Complexité Composants

**Top 5 Composants par Lignes** :
1. `app/dispatch/page.tsx` : ~1,400 lignes
2. `app/contexts/GameContext.tsx` : 803 lignes
3. `app/page.tsx` : ~500 lignes
4. `app/components/village/VillageModal.tsx` : 488 lignes
5. `app/components/village/VillageLightPoint.tsx` : 420 lignes

**Observation** : `dispatch/page.tsx` est le prochain candidat pour refactor (trop de responsabilités)

### Dépendances Principales

**package.json** :
```json
{
  "next": "14.2.0",
  "react": "^18",
  "prisma": "^5.22.0",
  "@prisma/client": "^5.22.0",
  "typescript": "^5"
}
```

**Pas de bibliothèques UI externes** : Tous composants custom (bon pour contrôle, mauvais pour rapidité)

---

## 🚀 Prochaines Étapes Suggérées

### Semaine 1-2 : Stabilisation ✅ COMPLÉTÉ (24 nov 2025)
- [ ] Fixer environnement Prisma (⚠️ Bloqué - Erreur TLS certificat, nécessite investigation réseau)
- [ ] Valider contenu DB (⚠️ En attente - Dépend de Prisma client)
- [x] Mettre à jour docs (✅ FAIT - 5 fichiers obsolètes supprimés, README.md consolidé)

**Réalisations** :
- ✅ Audit complet codebase généré (`etat-du-projet.md` - 900+ lignes)
- ✅ Suppression 5 docs obsolètes (~3,754 lignes redondantes)
- ✅ README.md réorganisé avec source de vérité unique
- ✅ Documentation consolidée et à jour

**Blocages identifiés** :
- ❌ Prisma generate échoue (TLS certificate issue)
- ⚠️ Nécessite investigation configuration réseau/proxy
- ⚠️ Pas de validation runtime du contenu DB possible 


### Semaine 2-3 : Déblocage Environnement Technique (PRIORITAIRE)
- [ ] **Investiguer erreur TLS Prisma**
  - Tester avec `--no-verify` ou configuration proxy
  - Vérifier certificats SSL système Windows
  - Alternative : Générer client Prisma sur machine propre et commit
- [ ] **Créer script validation DB fonctionnel**
  - Fix `check-db.js` avec import Prisma correct
  - Documenter contenu réel vs documentation
  - Créer rapport validation automatisé
- [ ] **Corriger scripts package.json**
  - Remplacer `prisma` par `npx prisma` dans tous scripts
  - Ajouter script `check-db` : `node check-db.js`
  - Tester setup complet sur machine fraîche

### Semaine 4-5 : Enrichissement Contenu ✅ STRUCTURE CRÉÉE (24 nov 2025)
- [x] **Établir workflow avec AI Curator**
  - ✅ Document workflow complet créé (`docs/curator/workflow-dev-curator.md`)
  - ✅ Architecture multi-niveaux de curation définie (textes, images, dialogues, missions)
  - ✅ Format JSON de sortie spécifié
  - ✅ Première spec créée : `curator-spec-heroes-enrichment.md` (42 pages)
- [x] **Créer structure DB pour multi-résolutions images**
  - ✅ Table `hero_image_variants` créée (base_type, resolution, emotion, usage_context)
  - ✅ Champs narratifs ajoutés à `heroes` (voice, secret, arc_day1/2/3)
  - ✅ Champs atmosphériques ajoutés à `buildings` (atmosphere, npc_name, npc_description, secret)
  - ✅ Migration appliquée sur Supabase DEV
- [ ] **Enrichir contenu héros** (EN ATTENTE CURATOR)
  - Bjorn : Background, personnalité, motivations + 6 images
  - Owen : Backstory, traits, arc narratif + 6 images
  - Vi : Histoire, compétences uniques + 6 images
  - Durun : Lore, relations avec autres héros + 6 images
  - Elira : Développement personnage complet + 6 images
  - **Total attendu** : 30 images (5 portraits émotionnels + 1 icône par héros)
- [ ] **Compléter dialogues jour 1**
  - 2 dialogues supplémentaires (total 5 héros)
  - Validation cohérence narrative
  - Test intégration dans UI

### Semaine 6-7 : Infrastructure & Assets
- [ ] **Migrer images vers Supabase Storage**
  - Créer buckets : `hero-portraits`, `locations`, `buildings-icons`
  - Upload `/public/portraits/` (5 héros) → bucket
  - Upload `/public/lieux/` (4 locations) → bucket
  - Mettre à jour URLs dans tables `hero_images` et `locations`
  - Tester chargement images depuis CDN Supabase
- [ ] **Optimiser assets**
  - Compresser images (WebP conversion)
  - Générer versions responsives (thumbnails)
  - Setup cache headers appropriés
- [ ] **Ajouter tests API routes**
  - Test GET /api/heroes (avec mock Prisma)
  - Test POST /api/save (création sauvegarde)
  - Test GET /api/missions/day/[day] (validation données)
  - Coverage minimum : 70% des routes

### Semaine 8-9 : Refactor Dispatch & UX
- [ ] **Refactor dispatch/page.tsx (1,400 lignes)**
  - Créer `DispatchTimer.tsx` (timer + controls)
  - Créer `DispatchMap.tsx` (carte + locations)
  - Créer `MissionList.tsx` (liste missions spawn)
  - Créer `MissionCard.tsx` (carte mission assignable)
  - Réduire orchestrateur à ~300 lignes
- [ ] **Améliorer feedbacks visuels**
  - Spinner sauvegarde (avec useTransition)
  - Animations transitions page (Framer Motion)
  - Toasts success/error cohérents
  - Loading states pour tous fetch
- [ ] **Nettoyer code mort**
  - Supprimer `INITIAL_BUILDINGS` hardcodé (GameContext ligne 49-120)
  - Supprimer imports commentés (audit grep)
  - Supprimer fichiers `.old.*` restants

### Semaine 10-11 : Tests & Qualité
- [ ] **Tests E2E avec Playwright**
  - Flow complet : Nouveau jeu → Dispatch → Village → Jour 2
  - Test sauvegarde/chargement
  - Test missions succès/échec
  - Test dialogues lecture
- [ ] **Audit accessibilité**
  - ARIA labels sur tous boutons
  - Keyboard navigation (Tab, Enter, Esc)
  - Screen reader compatibility
  - Contrast ratio WCAG AA
- [ ] **Performance audit**
  - Lighthouse score > 90
  - Lazy loading composants village
  - Memoization composants lourds (useMemo, React.memo)
  - Bundle size analysis

### Semaine 12 : Finalisation MVP
- [ ] **Contenu complet 3 jours**
  - 5 missions supplémentaires jours 2-3 (total 20)
  - 9 dialogues jours 2-3 (total 12)
  - Validation narrative cohérente
- [ ] **Documentation développeur**
  - Guide contribution (CONTRIBUTING.md)
  - Guide setup développeur (mise à jour)
  - API documentation (Swagger/OpenAPI)
- [ ] **Préparation déploiement**
  - Variables env production Vercel
  - Setup monitoring (Sentry/LogRocket)
  - Plan rollback en cas problème
  - Documentation opérationnelle

---

## 📝 Notes de Maintenance

**Comment Mettre à Jour Ce Document** :
1. Après chaque sprint, relire sections "Sprints Complétés" et "État DB"
2. Après ajout de contenu, mettre à jour tableau "Contenu Actuel"
3. Après refactor majeur, recalculer "Métriques du Projet"
4. Supprimer items "Gaps & Limitations" une fois résolus

**Dernière Validation Runtime** : ⚠️ Non effectuée (problème Prisma generate)

**Prochain Audit Recommandé** : Après stabilisation environnement dev (dans 1-2 semaines)

---

## 🔗 Références

- **Roadmap Principale** : `docs/roadmaps/roadmap.md` (784 lignes)
- **Roadmap DB** : `docs/architecture/databaseroadmap.md` (744 lignes)
- **Refactoring** : `docs/refactoring/refactoring.md` (775 lignes)
- **Changelog Refactor** : `docs/roadmaps/roadmap-refactoring.md` (1,451 lignes)
- **Architecture Village** : `app/components/village/README.md` (330 lignes)
- **Pipeline Curator** : `docs/curator/roadmapcurator-v2.md` (complet workflow AI)
- **Setup Supabase** : `docs/setup/supabase-setup.md`
- **Setup Prisma** : `docs/setup/prisma-setup.md`

---

**Généré par** : Audit automatisé de la codebase  
**Méthodologie** : 
1. Analyse schema Prisma (13 tables)
2. Lecture 12 API routes
3. Inventaire 44 fichiers TS/TSX
4. Analyse GameContext (803 lignes)
5. Lecture documentation (5 fichiers majeurs)
6. Grep searches (patterns clés)
7. Semantic search (architecture)
