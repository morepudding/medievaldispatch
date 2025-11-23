# 🔧 Plan de Refactoring - Medieval Dispatch

**Date**: 23 novembre 2025  
**Objectif**: Stabiliser et améliorer l'architecture existante avant tout ajout de fonctionnalités

---

## 📋 Vue d'ensemble

Ce document identifie les améliorations structurelles nécessaires pour solidifier la base du projet. **Aucune nouvelle fonctionnalité n'est proposée** - uniquement des refactorings pour améliorer la maintenabilité, réduire la duplication et corriger les incohérences.

---

## 🎯 Priorités de Refactoring

## 🚨 Problèmes Critiques Supplémentaires Identifiés

### Code Mort et Fonctionnalités Obsolètes
**Fichier**: `/app/page.tsx`
- **Lignes 226-318**: Ancien système de dispatch complètement dupliqué avec `/app/dispatch/page.tsx`
- **Lignes 463-1403**: Interface complète de carte interactive (1400+ lignes!) jamais utilisée en production
- **État**: Missions, timers, sélection héros définis mais obsolètes car tout se fait maintenant dans `/dispatch/page.tsx`

**Impact**: 
- ~1200 lignes de code mort dans page.tsx
- Confusion entre les 2 systèmes de dispatch
- Gaspillage de mémoire et parsing

**Solution proposée**:
- Supprimer tout le code de dispatch de `/app/page.tsx`
- Garder uniquement : navigation hub, modals village/dialogues/bâtiments, état d'affichage
- Le vrai dispatch est dans `/app/dispatch/page.tsx` - c'est la seule source de vérité

---

### ⚠️ Priorité 1 - Critique (à faire immédiatement)

#### 1.1 Centraliser la gestion du localStorage
**Problème**: 
- 3 clés localStorage différentes (`medieval-dispatch-stamps`, `medieval-dispatch-village-placements`, `medieval-dispatch-game-state`)
- Code de chargement/sauvegarde dupliqué dans plusieurs composants
- Risque d'incohérence entre les sauvegardes

**Fichiers concernés**:
- `/app/contexts/GameContext.tsx` (lignes 109, 130-152)
- `/app/page.tsx` (lignes 43, 122-140, 144-225)
- `/app/dispatch/page.tsx` (lignes 43-75)

**Solution proposée**:
```typescript
// Créer /app/utils/storage.ts
export const STORAGE_KEYS = {
  GAME_STATE: 'medieval-dispatch-game-state',
  STAMPS: 'medieval-dispatch-stamps',
  VILLAGE_PLACEMENTS: 'medieval-dispatch-village-placements'
} as const

export const StorageManager = {
  saveGameState: (state: GameState) => {
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state))
      return true
    } catch (e) {
      console.error('Erreur sauvegarde état:', e)
      return false
    }
  },
  
  loadGameState: (): GameState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAME_STATE)
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      console.error('Erreur chargement état:', e)
      return null
    }
  },
  
  saveStamps: (stamps: Stamp[]) => { /* ... */ },
  loadStamps: () => { /* ... */ },
  
  saveVillagePlacements: (placements: VillageHeroPlacement[]) => { /* ... */ },
  loadVillagePlacements: () => { /* ... */ },
  
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
  }
}
```

**Impact**: 
- Suppression de ~100 lignes de code dupliqué
- Point unique de gestion des erreurs
- Facilite les migrations futures

---

#### 1.2 Uniformiser les types Hero/Portrait
**Problème**:
- Duplication du type `PORTRAIT_STAMPS` dans 5 fichiers différents
- Incohérence entre `heroes.ts` et les constantes locales
- Risque de désynchronisation

**Fichiers concernés**:
- `/app/data/heroes.ts` (définition source)
- `/app/page.tsx` (lignes 38-44)
- `/app/dispatch/page.tsx` (lignes 14-20)
- `/app/components/village/VillageModal.tsx` (lignes 28-34)
- `/app/components/village/HeroStatsModal.tsx` (lignes 16-22)

**Solution proposée**:
```typescript
// Dans /app/data/heroes.ts - Exporter une seule source de vérité
export const HERO_PORTRAITS = HEROES.map(h => ({
  id: h.id,
  src: h.src,
  alt: h.alt,
  width: 180,
  color: h.color
}))

// Dans tous les autres fichiers, remplacer par:
import { HERO_PORTRAITS } from '../data/heroes'
```

**Impact**:
- Suppression de 5 définitions dupliquées
- Source unique de vérité
- Plus facile d'ajouter/modifier des héros

---

#### 1.3 Éliminer la duplication de logique de missions
**Problème**:
- Calcul de réussite de mission dupliqué dans `dispatch/page.tsx` (lignes 175-235)
- Même logique devrait être dans un service/utility réutilisable
- Difficulté de maintenance et test

**Solution proposée**:
```typescript
// Créer /app/utils/missionLogic.ts
export const MissionCalculator = {
  calculateSuccessRate: (
    heroStats: HeroStats[],
    requiredStats: MissionRequirement
  ): number => {
    // Logique centralisée
  },
  
  calculateReward: (
    mission: Mission,
    success: boolean
  ): number => {
    return success ? mission.goldReward : Math.floor(mission.goldReward * 0.5)
  },
  
  checkMissionCompletion: (
    mission: Mission,
    currentTime: number
  ): boolean => {
    if (!mission.startTime) return false
    return (currentTime - mission.startTime) / 1000 >= mission.duration
  }
}
```

**Impact**:
- Code testable unitairement
- Réutilisable pour d'autres features
- Facilite l'ajustement des règles de gameplay

---

---

#### 1.4 Supprimer le code mort de page.tsx
**Problème**:
- 1400+ lignes de code de dispatch obsolète dans `/app/page.tsx`
- Système de missions hardcodé qui n'est plus utilisé
- Duplication totale avec `/app/dispatch/page.tsx`

**Code à supprimer** (lignes 87-318 dans page.tsx):
```typescript
// États Dispatch obsolètes
const [isDispatchMode, setIsDispatchMode] = useState(false)
const [dispatchTimeLeft, setDispatchTimeLeft] = useState(0)
const [missions, setMissions] = useState<Mission[]>([])
const [selectedMission, setSelectedMission] = useState<string | null>(null)
const [selectedHeroes, setSelectedHeroes] = useState<string[]>([])
const [busyHeroes, setBusyHeroes] = useState<string[]>([])
// ... et tout le code associé
```

**Ce qui doit rester dans page.tsx**:
- Navigation vers `/dispatch`
- VillageModal et ses callbacks
- Modals de dialogue et bâtiments
- Breadcrumb et indicateurs d'état
- Carte de fond (sans interactions dispatch)

**Impact**: 
- Réduction de ~60% du fichier
- Clarté du code
- Suppression de la confusion entre les 2 systèmes

---

#### 1.5 Éliminer les styles inline dupliqués massivement
**Problème**:
- Même bouton style répété 50+ fois
- Même modal overlay répété 10+ fois
- Pas de composants UI réutilisables

**Exemples de duplication**:

**Bouton standard** (répété 20+ fois):
```typescript
style={{
  padding: '15px 30px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '25px',
  cursor: 'pointer',
  fontSize: '18px',
  fontWeight: 'bold',
  transition: 'all 0.3s'
}}
```

**Modal overlay** (répété 8+ fois):
```typescript
style={{
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.95)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3200
}}
```

**Solution proposée**:
```typescript
// Créer /app/components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger'
  size: 'sm' | 'md' | 'lg'
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
}

export const Button = ({ variant, size, ...props }: ButtonProps) => {
  // Styles centralisés avec variants
}

// Créer /app/components/ui/Modal.tsx
export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  // Overlay + container centralisés
}

// Créer /app/components/ui/Card.tsx
export const Card = ({ children, variant, ...props }: CardProps) => {
  // Cartes avec bordures dorées, etc.
}
```

**Impact**:
- Suppression de ~500 lignes de styles dupliqués
- Cohérence visuelle garantie
- Modifications de style centralisées

---

#### 1.6 Nettoyer les dépendances inutilisées et imports
**Problème**:
- Interfaces redéfinies localement au lieu d'importer depuis `types/game.ts`
- `Mission` interface dupliquée 3 fois
- `VillageHeroPlacement` interface dupliquée 4 fois

**Fichiers concernés**:
- `/app/page.tsx` (lignes 17-24, 47-65)
- `/app/components/village/VillageModal.tsx` (lignes 9-14)
- `/app/components/village/BuildingInfoModal.tsx` (lignes 3-10)
- `/app/dispatch/page.tsx` (définit sa propre version)

**Solution**: Tout centraliser dans `/app/types/game.ts` et importer partout

---

### 🟡 Priorité 2 - Important (à faire rapidement)

#### 2.1 Simplifier la gestion d'état dans VillageModal
**Problème**:
- 2038 lignes dans un seul fichier
- Trop de responsabilités dans un seul composant
- État local complexe (10+ useState)

**Fichiers concernés**:
- `/app/components/village/VillageModal.tsx`

**Solution proposée**:
```
Diviser en plusieurs composants:

/app/components/village/
  ├── VillageModal.tsx (orchestration principale)
  ├── VillageSummary.tsx (résumé du jour)
  ├── VillageDialogueList.tsx (liste dialogues)
  ├── VillageBuildingList.tsx (liste bâtiments)
  ├── VillagePlacementMode.tsx (mode placement)
  └── VillageHeroSelector.tsx (sélecteur héros)
```

**Impact**:
- Fichiers plus petits et ciblés (~300 lignes max)
- Tests unitaires plus faciles
- Meilleure réutilisabilité

---

#### 2.2 Extraire les constantes de style en tokens
**Problème**:
- Styles inline dupliqués partout
- Couleurs hardcodées (`#d4af37`, `#4488ff`, etc.)
- Impossible de créer un thème cohérent

**Solution proposée**:
```typescript
// Créer /app/styles/tokens.ts
export const COLORS = {
  primary: {
    gold: '#d4af37',
    goldDark: '#8B4513',
    goldLight: '#FFD700'
  },
  heroes: {
    bjorn: '#ff4444',
    owen: '#44ff44',
    vi: '#aa44ff',
    durun: '#ff8844',
    elira: '#4488ff'
  },
  status: {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  },
  background: {
    dark: 'rgba(20, 20, 20, 0.95)',
    overlay: 'rgba(0, 0, 0, 0.85)'
  }
} as const

export const SPACING = {
  xs: '5px',
  sm: '10px',
  md: '20px',
  lg: '40px',
  xl: '60px'
} as const

export const TRANSITIONS = {
  fast: 'all 0.2s ease',
  medium: 'all 0.3s ease',
  slow: 'all 0.5s ease'
} as const
```

**Impact**:
- Cohérence visuelle
- Facilite les changements de thème
- Réduction du code inline

---

#### 2.3 Refactoriser la logique de missions dans dispatch/page.tsx
**Problème**:
- Fonction `completeMission` de 80 lignes (lignes 175-257)
- Logique de calcul de stats dispersée
- Même calcul répété dans plusieurs fonctions

**Code problématique**:
```typescript
// Calcul de compatibilité héros (lignes 341-365)
const calculateHeroCompatibility = (heroId: string): number => {
  // 25 lignes de calculs
}

// Calcul de succès mission (lignes 195-230) 
const totalStats = assignedHeroObjects.reduce(...)
let totalPercentage = 0
// ... même logique répétée
```

**Solution**: Extraire dans `/app/utils/missionCalculator.ts`

---

#### 2.4 Refactoriser le système de points lumineux (VillageModal)
**Problème**:
- Rendu des points lumineux : 250+ lignes de code (lignes 816-1065)
- Logique d'affichage de tooltip/menu mélangée au rendering
- Animations CSS inline dupliquées

**Solution**: Créer composant `VillageLightPoint.tsx`

---

#### 2.5 Éliminer le stockage global avec `window`
**Problème critique** dans VillageModal (lignes 1517-1590):
```typescript
onClick={() => {
  (window as any).selectedHero = { src: hero.src, alt: hero.alt }
}
// ...
const hero = (window as any).selectedHero
if (hero) {
  handlePlaceHero(hero.src, hero.alt, building)
  delete (window as any).selectedHero
}
```

**Impact**: 
- Anti-pattern React
- State non contrôlé
- Risque de bugs

**Solution**: Utiliser un `useState` normal pour selectedHero

---

#### 2.6 Animations CSS définies 15+ fois
**Problème**:
- `@keyframes fadeIn` défini dans 8 fichiers différents
- `@keyframes slideUp` défini 6 fois
- `@keyframes bounce` défini 5 fois
- `@keyframes pulse` défini 4 fois

**Fichiers concernés**:
- `/app/page.tsx`
- `/app/dispatch/page.tsx`
- `/app/components/village/VillageModal.tsx`
- `/app/components/BuildingUpgradeModal.tsx`
- `/app/components/DialogueModal.tsx`

**Solution**: Créer `/app/styles/animations.css` et l'importer dans layout

```css
/* animations.css */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

@keyframes goldShine {
  0%, 100% { text-shadow: 0 0 20px #d4af37; }
  50% { text-shadow: 0 0 40px #d4af37, 0 0 60px #ffd700; }
}
```

---

#### 2.3 Nettoyer les props inutilisées
**Problème**:
- Interfaces avec propriétés optionnelles jamais utilisées
- Props passées mais non exploitées
- Confusion sur ce qui est vraiment nécessaire

**Exemples trouvés**:
- `Toast.tsx`: `duration` a toujours une valeur par défaut mais est optionnel
- `BuildingInfoModal.tsx`: Interface VillageHeroPlacement définie localement mais déjà dans types
- `DialogueModal.tsx`: emotion icons définis mais non utilisés visuellement

**Solution proposée**:
- Audit complet des props de chaque composant
- Supprimer les props jamais passées
- Rendre obligatoire ce qui est toujours présent

---

### 🟢 Priorité 3 - Amélioration (nice to have)

#### 3.1 Créer des hooks personnalisés
**Problème**:
- Logique dupliquée dans plusieurs composants (timers, animations, etc.)

**Solution proposée**:
```typescript
// /app/hooks/useTimer.ts
export function useTimer(initialTime: number, onEnd: () => void) {
  // Logique de timer réutilisable
}

// /app/hooks/useFadeIn.ts
export function useFadeIn(delay: number = 50) {
  // Animation fade-in réutilisable
}

// /app/hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Sync automatique avec localStorage
}
```

---

#### 3.2 Ajouter PropTypes/Validation
**Problème**:
- Aucune validation runtime des props
- Erreurs silencieuses si mauvais types passés

**Solution proposée**:
- Utiliser Zod pour valider les données du localStorage
- Ajouter des guards TypeScript pour les données critiques

```typescript
import { z } from 'zod'

const GameStateSchema = z.object({
  currentDay: z.number().min(1).max(3),
  gold: z.number().min(0),
  heroes: z.array(HeroSchema),
  // ...
})

export function validateGameState(data: unknown): GameState | null {
  try {
    return GameStateSchema.parse(data)
  } catch {
    return null
  }
}
```

---

#### 3.3 Améliorer la structure des dossiers
**Problème actuel**:
```
app/
  components/       # Mélange de tout
  contexts/         # OK
  data/            # OK
  types/           # OK
  dispatch/        # Page mais pas dans un dossier pages/
  page.tsx         # Page hub à la racine
```

**Structure proposée**:
```
app/
  (routes)/
    page.tsx            # Hub
    dispatch/
      page.tsx          # Dispatch
    village/
      page.tsx          # Village (si besoin d'une route)
  
  components/
    common/             # Breadcrumb, Toast, DayCounter
    modals/             # Tous les modals
    village/            # Composants village
    
  lib/
    utils/              # StorageManager, MissionCalculator
    hooks/              # Hooks personnalisés
    constants/          # Tokens, configs
    
  contexts/             # OK
  data/                 # OK  
  types/                # OK
```

---

## 📊 Métriques de Qualité (Analyse Complète)

### Avant refactoring
- **Lignes de code total**: ~5800 lignes
- **Code mort**: ~1400 lignes (24% du code!)
- **Lignes de code dupliqué**: ~800 lignes (styles + animations + constantes)
- **Nombre de fichiers >500 lignes**: 3 fichiers
  - `page.tsx`: 1404 lignes (dont 1200 obsolètes)
  - `VillageModal.tsx`: 2038 lignes
  - `dispatch/page.tsx`: 1312 lignes
- **Utilisation localStorage**: 3 implémentations différentes, 8 points d'accès
- **Constantes dupliquées**: 
  - `PORTRAIT_STAMPS`: 5 occurrences
  - Styles de boutons: ~20 occurrences
  - Modal overlays: 8 occurrences
  - Animations CSS: 38 occurrences (15 keyframes différents)
- **Interfaces dupliquées**: 4 interfaces redéfinies localement
- **Anti-patterns**: 1 utilisation de `window` pour state

### Objectifs après refactoring
- **Lignes de code total**: ~3500 lignes (-40%)
- **Code mort**: 0 lignes
- **Lignes de code dupliqué**: <100 lignes
- **Nombre de fichiers >500 lignes**: 0
- **Fichier le plus gros**: <400 lignes
- **Utilisation localStorage**: 1 module centralisé, 1 point d'accès
- **Constantes dupliquées**: 0
- **Interfaces dupliquées**: 0
- **Anti-patterns**: 0

### Répartition du nouveau code
```
app/
  lib/
    utils/
      storage.ts          (~100 lignes)
      missionLogic.ts     (~80 lignes)
    constants/
      styles.ts           (~60 lignes)
      animations.css      (~40 lignes)
    hooks/
      useTimer.ts         (~30 lignes)
      useFadeIn.ts        (~20 lignes)
  
  components/
    ui/
      Button.tsx          (~50 lignes)
      Modal.tsx           (~60 lignes)
      Card.tsx            (~40 lignes)
    village/
      VillageModal.tsx    (~200 lignes) - orchestrateur
      VillageSummary.tsx  (~150 lignes)
      VillageDialogueList.tsx (~180 lignes)
      VillageBuildingList.tsx (~200 lignes)
      VillageLightPoint.tsx   (~120 lignes)
      VillagePlacementMode.tsx (~100 lignes)
  
  (routes)/
    page.tsx            (~250 lignes) - hub propre
    dispatch/
      page.tsx          (~700 lignes) - avec logique externalisée
```

---

## 🔄 Plan d'exécution (Révisé)

### Phase 0 - Nettoyage Critique (1-2h) **À FAIRE EN PREMIER**
1. ✅ **Supprimer le code mort de `/app/page.tsx`** (~1400 lignes)
   - Garder uniquement navigation, modals, carte statique
   - Supprimer tout le système de dispatch obsolète
2. ✅ **Éliminer `(window as any)` dans VillageModal**
   - Remplacer par useState propre
3. ✅ **Supprimer interfaces dupliquées**
   - Tout importer depuis `types/game.ts`

### Phase 1 - Fondations (2-3h)
4. Créer `/app/lib/utils/storage.ts` et migrer localStorage
5. Créer `/app/lib/constants/styles.ts` pour les tokens
6. Créer `/app/styles/animations.css` et consolider les keyframes
7. Centraliser HERO_PORTRAITS dans `/app/data/heroes.ts`
8. Créer `/app/lib/utils/missionLogic.ts`

### Phase 2 - Composants UI (3-4h)
9. Créer `/app/components/ui/Button.tsx`
10. Créer `/app/components/ui/Modal.tsx`
11. Créer `/app/components/ui/Card.tsx`
12. Migrer tous les boutons vers le composant Button
13. Migrer tous les modals vers le composant Modal

### Phase 3 - Village Components (4-5h)
14. Découper VillageModal :
    - VillageSummary.tsx
    - VillageDialogueList.tsx
    - VillageBuildingList.tsx
    - VillageLightPoint.tsx
    - VillagePlacementMode.tsx
15. VillageModal devient l'orchestrateur (~200 lignes)

### Phase 4 - Hooks et Utils (1-2h)
16. Créer hooks personnalisés (useTimer, useFadeIn, useLocalStorage)
17. Refactoriser dispatch/page.tsx avec les utils

### Phase 5 - Tests et validation (2h)
18. Vérifier que tout fonctionne
19. Tester localStorage (compatibilité avec anciennes saves)
20. Valider tous les flux du jeu
21. Mesurer les gains (lignes de code, taille bundle)

**Temps total estimé**: 13-17h

---

## ⚠️ Points d'attention

### Ne PAS casser:
- ✅ Système de sauvegarde localStorage existant
- ✅ Compatibilité avec les sauvegardes existantes (clés inchangées)
- ✅ Flux de jeu actuel (Hub → Dispatch → Village)
- ✅ Système de dialogues et bâtiments
- ✅ Positionnement des éléments sur la carte (stamps, villages, etc.)
- ✅ Calcul de réussite des missions (gameplay balance)

### Checklist de validation après chaque phase:
- [ ] Le jeu se lance sans erreur console
- [ ] Les sauvegardes se chargent correctement
- [ ] La navigation Hub ↔ Dispatch ↔ Village fonctionne
- [ ] Les modals s'ouvrent et se ferment
- [ ] Les animations sont fluides
- [ ] Aucune régression visuelle

### Tests de non-régression complets (à la fin):
1. ✅ Charger une partie sauvegardée (jour 1, 2, 3)
2. ✅ Lancer un dispatch
3. ✅ Assigner des héros à des missions
4. ✅ Attendre la complétion d'une mission
5. ✅ Voir les missions réussies/échouées
6. ✅ Retourner au village après dispatch
7. ✅ Lire un dialogue (nouveau et déjà lu)
8. ✅ Améliorer un bâtiment
9. ✅ Placer des points lumineux sur le village
10. ✅ Passer au jour suivant
11. ✅ Reset complet du jeu
12. ✅ Mode édition de carte (si conservé)

### Outils de mesure:
```bash
# Compter les lignes de code
find app -name "*.tsx" -o -name "*.ts" | xargs wc -l

# Trouver les doublons
jscpd app/

# Analyser le bundle
npm run build
npm run analyze  # Si configuré
```

---

## 🎯 Résultat attendu

Après ce refactoring, le projet aura:
- ✨ Une base de code plus maintenable
- 🔧 Moins de duplication
- 📦 Meilleure séparation des responsabilités
- 🧪 Code plus facilement testable
- 🚀 Prêt pour de nouvelles fonctionnalités

**Le jeu continuera de fonctionner exactement de la même manière pour l'utilisateur final.**

---

## 📝 Notes

Ce document doit être mis à jour au fur et à mesure des refactorings effectués. Cocher chaque tâche accomplie et documenter les changements majeurs.
