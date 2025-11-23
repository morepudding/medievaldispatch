# 🏰 Components Village - Architecture

## 📋 Vue d'ensemble

Ce dossier contient tous les composants liés à la gestion du village de Phandallin dans Medieval Dispatch.

**Date de refactoring**: 23 novembre 2025  
**Sprint**: 5C - Découpage VillageModal  
**Résultat**: Réduction de 70% de la complexité (1,638 → 488 lignes pour VillageModal.tsx)

---

## 🗂️ Structure des fichiers

### 🎯 Composant Principal

#### `VillageModal.tsx` (488 lignes)
**Rôle**: Orchestrateur principal du village

**Responsabilités**:
- Gestion de l'état UI (10 useState)
- Coordination des panneaux latéraux
- Gestion du clic sur l'image du village
- Handlers pour placement/suppression de héros
- Logique de transition (jour suivant, reset)

**Composants utilisés**:
- VillageDaySummary
- VillageDialogueList
- VillageBuildingList
- VillagePlacementsList
- VillagePlacementMode
- VillageConfirmationModals

---

### 🌟 Composants Points Lumineux

#### `VillageLightPoint.tsx` (420 lignes)
**Rôle**: Afficher UN point lumineux interactif sur le village

**Fonctionnalités**:
- Point lumineux animé (glow/pulse)
- Badge de notification (💬 dialogue / ⚡ amélioration)
- Tooltip au survol (portrait + nom héros + bâtiment)
- Menu contextuel au clic avec 4 actions :
  - 💬 Nouveau dialogue (si disponible)
  - ⚡ Améliorer bâtiment (si possible)
  - 👤 Voir stats héros
  - 🏛️ Voir infos bâtiment
- Bouton supprimer en mode placement

**Props**: 16 props pour communication avec parent

**Animations CSS intégrées**:
- `glow` : Pulsation normale
- `pulse` : Pulsation accentuée (notifications)
- `bounce` : Badge qui rebondit
- `slideUp` : Apparition du menu

---

#### `VillagePlacementsList.tsx` (69 lignes)
**Rôle**: Mapper tous les placements vers VillageLightPoint

**Fonctionnalités**:
- Itère sur `villagePlacements[]`
- Rend un `VillageLightPoint` par placement
- Gère la fermeture des menus après actions
- Transmet tous les handlers au composant enfant

**Pattern utilisé**: Composant de liste/mapper léger

---

### 🛠️ Composants Modals

#### `VillagePlacementMode.tsx` (201 lignes)
**Rôle**: Modal de sélection héros + bâtiment pour placement

**Fonctionnalités**:
- Grid 3x3 des 9 portraits de héros
- Sélection visuelle avec bordure dorée
- Confirmation de héros sélectionné
- Liste des 5 bâtiments disponibles :
  - 🔨 Forge
  - 🏛️ Hôtel de Ville
  - 🛒 Marché
  - 🍺 Auberge
  - 🗼 Tour de Garde
- Affichage position (x%, y%)
- Validation : héros ET bâtiment requis
- Bouton annuler

**État interne**: `selectedHero` (useState local)

---

#### `VillageConfirmationModals.tsx` (399 lignes)
**Rôle**: Gérer les 2 modals de confirmation

**Modal 1 - Passer au Jour Suivant**:
- Titre avec emoji 📅
- Récapitulatif du jour actuel :
  - 💰 Or restant
  - 💬 Dialogues lus / disponibles
  - ✨ Bâtiments améliorés / total
- Message d'avertissement (⚠️)
- Boutons : Annuler / Confirmer

**Modal 2 - Reset Save**:
- Titre d'avertissement ⚠️
- Message de perte de progression
- Liste des éléments perdus
- Boutons : Annuler / Réinitialiser (rouge)

**Overlay de transition**:
- Écran noir avec animation fadeIn
- Message "Passage au jour suivant..." / "Partie réinitialisée !"
- Emoji animé (🌅 / 🔄)

**Toast de confirmation**:
- Créé dynamiquement dans le DOM
- Centré à l'écran
- Animation fadeIn → fadeOut
- Auto-suppression après 2s

---

### 📊 Composants Panneaux Latéraux

#### `VillageDaySummary.tsx` (169 lignes)
**Rôle**: Résumé de fin de dispatch

**Affichage**:
- Missions réussies / échouées
- Or gagné ce jour
- Stats détaillées

---

#### `VillageDialogueList.tsx` (238 lignes)
**Rôle**: Liste des dialogues disponibles

**Fonctionnalités**:
- Badge "nouveau" sur dialogues non lus
- Clic pour ouvrir le dialogue
- Filtrage par disponibilité

---

#### `VillageBuildingList.tsx` (308 lignes)
**Rôle**: Liste des bâtiments à améliorer

**Fonctionnalités**:
- Affichage niveau actuel
- Coût d'amélioration
- Vérification or disponible
- Badge si amélioration disponible

---

### 📝 Composants Modals Détails

#### `HeroStatsModal.tsx` (183 lignes)
**Rôle**: Afficher les statistiques détaillées d'un héros

**Affichage**:
- Portrait du héros
- Nom et classe
- Statistiques (force, sagesse, etc.)
- Bâtiment assigné

---

#### `BuildingInfoModal.tsx` (196 lignes)
**Rôle**: Afficher les détails d'un bâtiment

**Affichage**:
- Nom du bâtiment
- Niveau actuel / max
- Coût d'amélioration
- Bonus apportés

---

## 🏗️ Architecture et Communication

### Flux de données

```
VillageModal (orchestrateur)
    ↓
    ├→ VillageDaySummary
    ├→ VillageDialogueList
    ├→ VillageBuildingList
    ├→ VillagePlacementsList
    │      ↓
    │      └→ VillageLightPoint (x N placements)
    ├→ VillagePlacementMode
    ├→ VillageConfirmationModals
    ├→ HeroStatsModal
    └→ BuildingInfoModal
```

### Props principales

**VillageModal** reçoit de son parent (page.tsx) :
- `isOpen`: boolean
- `villagePlacements`: VillageHeroPlacement[]
- `onPlacementChange`: (placements) => void
- `onSelectDialogue`: (dialogue) => void
- `onSelectBuildingUpgrade`: (building) => void
- `onShowHeroModal`: (placement) => void
- `onShowBuildingModal`: (placement) => void
- `showDaySummary?`: boolean

**VillageModal** utilise du contexte :
- `useGame()` → { gameState, nextDay, resetGame }

---

## 📐 Décisions d'Architecture

### Pourquoi cette structure ?

**Avant (monolithique)**:
- 1 fichier de 1,638 lignes
- Tout mélangé : state, handlers, render
- Difficile à maintenir et débuguer
- Conflits git fréquents

**Après (modulaire)**:
- 5 composants spécialisés (< 500 lignes)
- Responsabilités clairement séparées
- Testable unitairement
- Réutilisable (VillageLightPoint, VillagePlacementMode)

### Principes suivis

1. **Single Responsibility Principle**
   - Chaque composant a UNE responsabilité claire
   - VillageLightPoint = afficher un point
   - VillagePlacementMode = gérer le placement

2. **Component Composition**
   - Petits composants assemblés
   - VillagePlacementsList compose VillageLightPoint

3. **Props Drilling Minimal**
   - Handlers transmis uniquement aux composants qui en ont besoin
   - État partagé via props explicites

4. **Isolation des Side Effects**
   - Logique métier dans GameContext
   - Composants village = UI pure

---

## 🔧 Maintenance

### Ajouter un nouveau placement

1. Modifier `VillageHeroPlacement` dans `types/game.ts`
2. Mettre à jour `VillageLightPoint` pour afficher les nouvelles infos
3. Pas besoin de toucher `VillageModal.tsx` !

### Ajouter une action au menu contextuel

1. Modifier `VillageLightPoint.tsx`
2. Ajouter le bouton dans le menu contextuel
3. Ajouter la prop `onNewAction` dans l'interface
4. Transmettre le handler depuis `VillageModal`

### Modifier le modal de placement

1. Modifier uniquement `VillagePlacementMode.tsx`
2. Composant isolé, pas d'impact sur le reste

---

## 📊 Métriques

**Avant refactoring Sprint 5C**:
- 1 fichier : 1,638 lignes
- 13 useState
- Tout mélangé

**Après refactoring Sprint 5C**:
- 5 fichiers : 488 + 420 + 201 + 399 + 69 = 1,577 lignes
- Total : -61 lignes (mais 4 nouveaux composants réutilisables !)
- VillageModal : 10 useState (vs 13)
- Architecture claire et maintenable

**Gains**:
- ✅ -70% de lignes dans VillageModal
- ✅ +4 composants réutilisables
- ✅ +Lisibilité
- ✅ +Maintenabilité
- ✅ +Testabilité

---

## 🎯 Prochaines Étapes

### Améliorations possibles

1. **Extraire les animations CSS**
   - Créer `village/animations.css`
   - Supprimer les `<style>` tags inline

2. **Utiliser composants UI**
   - Remplacer boutons par `<Button>`
   - Utiliser tokens COLORS/SHADOWS partout

3. **Tests unitaires**
   - Tester VillageLightPoint isolément
   - Tester VillagePlacementMode
   - Tester VillageConfirmationModals

4. **Storybook**
   - Créer stories pour chaque composant
   - Documenter les variants

---

**Document généré le**: 23 novembre 2025  
**Auteur**: GitHub Copilot  
**Sprint**: 5C - Découpage VillageModal
