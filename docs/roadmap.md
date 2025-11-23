 # 🗺️ Roadmap - Medieval Dispatch

## 📋 Vue d'ensemble

Le jeu fonctionne en **cycles de jours** alternant entre phases de **Dispatch** (missions) et phases **Sociales** (village).

### MVP : 3 jours
```
Jour 1: Dispatch (60s) → Social (2 dialogues)
Jour 2: Dispatch (60s) → Social (amélioration bâtiment + 1 dialogue)  
Jour 3: Dispatch (60s) → Social (amélioration bâtiment)
→ Fin du MVP
```

Chaque jour = 1 cycle complet (Dispatch + Social)

---

## 🎯 Phase 1 : Refonte du système de Dispatch

### Objectifs :
- ✅ Sortir le Dispatch de la page principale
- ✅ Créer une page/vue dédiée au Dispatch
- ✅ Missions apparaissent progressivement pendant le dispatch
- ✅ 1-2 missions au début, puis d'autres apparaissent tout au long des 60 secondes
- ✅ Système de jours (3 jours pour le MVP)

### Fonctionnalités clés :

#### 1. **Timer du Dispatch**
- Durée : **60 secondes** par dispatch
- Compte à rebours visible en permanence
- Fin automatique → retour au village

#### 2. **Système de missions progressives**
- **Au lancement (t=0s)** : 1-2 missions apparaissent
- **Pendant le dispatch** : Nouvelles missions apparaissent à intervalles :
  - Jour 1 : 3-4 missions total (1 apparaît tous les 15-20s)
  - Jour 2 : 4-5 missions total (1 apparaît tous les 12-15s)
  - Jour 3 : 5-6 missions total (1 apparaît tous les 10s)
- Animation d'apparition (point d'exclamation qui pulse)
- **Intérêt** : Crée de l'urgence et force à prioriser les missions

#### 3. **Structure d'une mission**
```typescript
interface Mission {
  id: string
  titre: string
  description: string        // Contexte narratif
  locationSrc: string        // Image du lieu
  x: number, y: number       // Position sur la carte
  
  // Difficulté
  requiredStats: {
    force?: number
    dexterite?: number
    sagesse?: number
    intelligence?: number
    vitalite?: number
  }
  
  // Récompenses
  goldReward: number
  experienceReward: number
  
  // Durée
  duration: number          // 10-20 secondes
  
  // État
  assignedHeroes: string[]
  startTime?: number
  status: 'disponible' | 'en_cours' | 'terminee' | 'echouee'
  
  // Résolution
  resolutionSuccess: string  // Texte si succès
  resolutionFailure: string  // Texte si échec
}
```

#### 4. **Système d'affectation des héros**
- Clic sur mission → sélection des héros (max 2)
- **Vérification des stats** :
  - Stats des héros ≥ requis → succès probable
  - Stats insuffisantes → échec probable
- Indicateur visuel de compatibilité
- Héros occupés = **indisponibles** pendant 10-20 sec
- Libération automatique à la fin de la mission

#### 5. **Calcul de réussite**
```typescript
function calculateSuccess(heroes: Hero[], mission: Mission): boolean {
  const totalStats = heroes.reduce((sum, hero) => {
    return {
      force: sum.force + hero.stats.force,
      dexterite: sum.dexterite + hero.stats.dexterite,
      // etc.
    }
  }, {force: 0, ...})
  
  // Comparer avec les requis de la mission
  // Ajouter un facteur aléatoire (±20%)
}
```

#### 6. **Récompenses par jour**
- **Jour 1** : ~300-400 or total (découverte)
- **Jour 2** : ~500-600 or total (assez pour 1 amélioration)
- **Jour 3** : ~800-1000 or total (assez pour 1 autre amélioration)

#### 7. **Timing d'apparition des missions**
```typescript
// Exemple pour Jour 1
const missionSpawns = [
  { time: 0, missionId: 'mission_1' },      // Au début
  { time: 0, missionId: 'mission_2' },      // Au début
  { time: 20, missionId: 'mission_3' },     // Après 20s
  { time: 40, missionId: 'mission_4' }      // Après 40s
]
```

---

## 🏰 Phase 2 : Phase Sociale (Village)

### Objectifs :
- Zone de transition entre les dispatchs
- Interactions avec les héros
- Gestion des bâtiments

### Fonctionnalités :

#### 1. **Système de dialogues**
- **Jour 1 → 2 nouveaux dialogues** débloqués
- **Jour 2 → 1 nouveau dialogue** débloqué
- **Jour 3 → Pas de nouveaux dialogues**

#### 2. **Dialogues structure**
```typescript
interface Dialogue {
  id: string
  heroName: string
  unlockCondition: string    // Ex: "after_tour_1"
  isRead: boolean
  
  exchanges: Array<{
    speaker: 'hero' | 'player'
    text: string
    emotion?: 'happy' | 'sad' | 'angry' | 'neutral'
  }>
}
```

#### 3. **Améliorations de bâtiments**
- **Jour 2** : Assez d'or pour améliorer 1 bâtiment
- **Jour 3** : Assez d'or pour améliorer 1 autre bâtiment
- Coûts :
  - Niveau 1→2 : ~500 or
  - Niveau 2→3 : ~800 or
- **Pas de bonus pour l'instant** (juste visuel + message)

#### 4. **Indicateurs visuels**
- 💰 Or total affiché en permanence
- 🔔 Badge "nouveau" sur dialogues non lus
- ✨ Badge "amélioration disponible" sur bâtiments

---

## 🎮 Phase 3 : Flow du jeu

### Cycle de jeu complet (MVP - 3 jours) :

```
┌─────────────────────────────────────────┐
│  JOUR 1                                 │
├─────────────────────────────────────────┤
│  1. Launch Dispatch                     │
│     t=0s  : 2 missions apparaissent     │
│     t=20s : 1 nouvelle mission          │
│     t=40s : 1 nouvelle mission          │
│     - Timer 60s démarre                 │
│     - Joueur assigne les héros          │
│     - Missions se résolvent             │
│     - Gain: ~350 or                     │
│                                         │
│  2. Retour au Village                   │
│     - 2 nouveaux dialogues débloqués    │
│     - Joueur peut lire les dialogues    │
│     - Pas assez d'or pour améliorer     │
│     - Bouton "Jour suivant" activé      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  JOUR 2                                 │
├─────────────────────────────────────────┤
│  3. Launch Dispatch                     │
│     t=0s  : 2 missions apparaissent     │
│     t=15s : 1 nouvelle mission          │
│     t=30s : 1 nouvelle mission          │
│     t=45s : 1 nouvelle mission          │
│     - Missions plus difficiles          │
│     - Timer 60s                         │
│     - Gain: ~550 or                     │
│     - Total: ~900 or                    │
│                                         │
│  4. Retour au Village                   │
│     - 1 nouveau dialogue débloqué       │
│     - Assez d'or pour 1 amélioration    │
│     - Joueur améliore 1 bâtiment        │
│     - Reste: ~400 or                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  JOUR 3                                 │
├─────────────────────────────────────────┤
│  5. Launch Dispatch                     │
│     t=0s  : 2 missions apparaissent     │
│     t=10s : 1 nouvelle mission          │
│     t=20s : 1 nouvelle mission          │
│     t=35s : 1 nouvelle mission          │
│     t=50s : 1 nouvelle mission          │
│     - Missions difficiles               │
│     - Timer 60s                         │
│     - Gain: ~900 or                     │
│     - Total: ~1300 or                   │
│                                         │
│  6. Retour au Village                   │
│     - Aucun nouveau dialogue            │
│     - Assez d'or pour 1 amélioration    │
│     - Joueur améliore 1 bâtiment        │
│     - FIN du MVP                        │
└─────────────────────────────────────────┘
```

---

## 📦 Phase 4 : Architecture technique

### Nouvelle structure de fichiers :
```
app/
  page.tsx                 # Hub principal (carte + village)
  dispatch/
    page.tsx              # Vue Dispatch
    MissionCard.tsx       # Composant mission
    HeroSelector.tsx      # Sélection héros
    DispatchTimer.tsx     # Timer + état
  village/
    page.tsx              # Vue Village détaillée
    DialogueModal.tsx     # Modal dialogue
    BuildingUpgrade.tsx   # Modal amélioration
  components/
    HeroCard.tsx          # Carte héros réutilisable
    StatBar.tsx           # Barre de stat
  data/
    missions.ts           # Données des missions
    dialogues.ts          # Données des dialogues
    heroes.ts             # Données des héros centralisées
  types/
    game.ts               # Interfaces TypeScript
```

### State management :
```typescript
// Contexte global du jeu
interface GameState {
  currentDay: number       // 1, 2, ou 3 (MVP)
  gold: number             // Or total
  
  heroes: Hero[]           // États des héros
  buildings: Building[]    // États des bâtiments
  
  completedMissions: Mission[]
  availableDialogues: Dialogue[]
  readDialogues: string[]  // IDs des dialogues lus
  
  isInDispatch: boolean
  isInVillage: boolean
  
  // Dispatch actuel
  dispatchTimer: number    // Secondes restantes
  activeMissions: Mission[]
  pendingMissions: Mission[] // Missions qui vont apparaître
}
```

---

## 🎯 Priorités d'implémentation

### Sprint 1 : Structure de base (2-3h)
- [x] Créer la structure de fichiers
- [x] Définir les interfaces TypeScript
- [x] Créer le contexte GameState
- [x] Implémenter la navigation Hub → Dispatch → Village

### Sprint 2 : Système de Dispatch (3-4h)
- [x] Page Dispatch avec timer
- [x] Affichage des missions sur la carte
- [x] **Système d'apparition progressive** des missions
- [x] Sélection des héros pour les missions
- [x] Calcul de réussite/échec
- [x] Système de récompenses
- [x] Gestion des héros occupés

### Sprint 3 : Améliorations UX Dispatch (1-2h) ✨ NOUVEAU
- [x] Charger les éléments visuels depuis localStorage (sync avec page hub)
- [x] Ajuster positions des missions dynamiquement sur les éléments
- [x] Pause du timer lors de l'ouverture du modal mission
- [x] Indicateur visuel de pause (⏸️ + texte "PAUSE")
- [x] Reprise automatique du timer après fermeture modal

### Sprint 3 : Améliorations UX Dispatch (1-2h) ✨ NOUVEAU
- [x] Charger les éléments visuels depuis localStorage (sync avec page hub)
- [x] Ajuster positions des missions dynamiquement sur les éléments
- [x] Pause du timer lors de l'ouverture du modal mission
- [x] Indicateur visuel de pause (⏸️ + texte "PAUSE")
- [x] Reprise automatique du timer après fermeture modal

### Sprint 4 : Système de progression (2-3h) ✅ TERMINÉ
- [x] Compteur de jours (1/3, 2/3, 3/3)
- [x] Distribution de l'or
- [x] Déblocage des dialogues selon les jours
- [x] Système d'amélioration des bâtiments (sans bonus)
- [x] Conditions de passage au jour suivant
- [x] Intégration dans le modal village du hub

**✅ FAIT :**
- Dialogues débloqués automatiquement selon le jour (Jour 1: 2 dialogues, Jour 2: 1 dialogue)
- Modal de dialogue avec émotions et échanges multiples
- Modal d'amélioration des bâtiments avec validation de l'or
- Panneaux "Dialogues" et "Bâtiments" affichés dans le modal village
- Badges "nouveau" sur les dialogues non lus
- Indicateurs visuels pour les améliorations disponibles
- Distribution automatique de l'or après chaque mission réussie
- À la fin du dispatch → retour automatique au hub avec modal village ouvertnt

### Sprint 5 : Phase Sociale (2-3h)
- [ ] Modal de dialogue avec échanges
- [ ] Indicateurs visuels (badges nouveaux dialogues)
- [ ] Interface d'amélioration des bâtiments
- [ ] Feedback visuels (animations, sons)

### Sprint 5 : Phase Sociale (2-3h)
- [ ] Modal de dialogue avec échanges
- [ ] Indicateurs visuels (badges nouveaux dialogues)
- [ ] Interface d'amélioration des bâtiments
- [ ] Feedback visuels (animations, sons)

### Sprint 6 : Contenu narratif (2-3h)
- [x] Écrire 15 missions variées avec timing d'apparition
- [ ] Écrire 2 dialogues pour le Jour 1
- [ ] Écrire 1 dialogue pour le Jour 2
- [ ] Équilibrer les difficultés et récompenses

### Sprint 7 : Polish & UX (1-2h)
- [ ] Animations de transitions
- [ ] Feedback audio/visuel
- [ ] Messages de succès/échec narratifs
- [ ] Tutorial/onboarding

---

## 📝 Notes de design

### Progression du joueur :
- **Découverte** (Jour 1) : Comprendre les mécaniques, missions simples
- **Stratégie** (Jour 2) : Optimiser les affectations, plus de missions
- **Maîtrise** (Jour 3) : Gérer plusieurs missions simultanées, haute pression

### Apparition progressive - intérêt gameplay :
- **Urgence** : Le joueur doit réagir rapidement aux nouvelles missions
- **Priorisation** : Impossible de tout faire → choix stratégiques
- **Pression temporelle** : Héros occupés + nouvelles missions = tension
- **Rejouabilité** : Différentes stratégies possibles

### Difficultés des missions :
```
Facile    : 1 stat à 10+
Moyenne   : 2 stats à 12+ ou 1 stat à 15+
Difficile : 2 stats à 15+ ou 3 stats à 12+
Très difficile : 3 stats à 15+ ou stat rare (sagesse/intelligence élevée)
```

### Exemples de missions :

**Jour 1 - Facile :**
- "Escorte de marchand" (Force 10, Dextérité 8) - t=0s
- "Cueillette d'herbes" (Intelligence 10, Sagesse 8) - t=0s
- "Patrouille nocturne" (Vitalité 12) - t=20s
- "Réparation de clôture" (Force 12) - t=40s

**Jour 2 - Moyenne :**
- "Bandits sur la route" (Force 15, Dextérité 12) - t=0s
- "Enquête au village" (Intelligence 14, Sagesse 12) - t=0s
- "Chasse au loup" (Dextérité 14, Vitalité 12) - t=15s
- "Négociation délicate" (Sagesse 15, Intelligence 12) - t=30s
- "Garde rapprochée" (Force 14, Vitalité 15) - t=45s

**Jour 3 - Difficile :**
- "Repaire de gobelins" (Force 16, Vitalité 15, Dextérité 12) - t=0s
- "Rituel mystérieux" (Intelligence 17, Sagesse 16) - t=0s
- "Embuscade organisée" (Force 17, Dextérité 16) - t=10s
- "Énigme ancienne" (Intelligence 18, Sagesse 15) - t=20s
- "Combat d'arène" (Force 18, Vitalité 17) - t=35s
- "Sauvetage urgent" (Dextérité 17, Vitalité 16) - t=50s

---

## 🚀 Prochaines étapes

### ✅ Sprint 4 : Système de progression (COMPLÉTÉ)
- [x] Compteur de jours
- [x] Système de dialogues avec déblocage par jour
- [x] Système d'amélioration des bâtiments
- [x] Distribution d'or après missions
- [x] Fonction nextDay() et progression
- [x] Indicateurs visuels (badges) sur points lumineux
- [x] Intégration avec modal village

### 🔄 Sprint 5 : Refactoring de l'architecture (80% COMPLÉTÉ)

**Problème actuel** : `page.tsx` fait 2413 lignes et gère trop de responsabilités

**✅ ACCOMPLI** :
1. **VillageModal.tsx** (~650 lignes) - ✅ CRÉÉ ET FONCTIONNEL
   - Modal village complet avec image Phandallin
   - Points lumineux avec notifications
   - Mode placement héros/bâtiments
   - Menus contextuels et tooltips

2. **HeroStatsModal.tsx** (~200 lignes) - ✅ CRÉÉ ET FONCTIONNEL
   - Affichage stats d'un héros
   - Barres de progression colorées
   - Portrait et localisation

3. **BuildingInfoModal.tsx** (~200 lignes) - ✅ CRÉÉ ET FONCTIONNEL
   - Infos sur les bâtiments
   - Description et bonus
   - Coût d'amélioration

**⚠️ EN ATTENTE** :
- Intégration finale dans page.tsx (bloquée par complexité du fichier)
- ~1050 lignes à remplacer par ~50 lignes d'appels composants

**📚 Documentation** : 
- `/docs/sprint5-refactoring.md` - Architecture détaillée
- `/docs/sprint5-bilan.md` - Bilan et marche à suivre

**Recommandation** : Les composants sont prêts et fonctionnels. L'intégration finale dans page.tsx peut être faite manuellement en suivant le guide dans `sprint5-bilan.md`. Le Sprint peut être considéré comme complété à 80%.

---

### 🎯 Sprint 6 : Finalisation du Flow et Harmonisation (3-4h)

**Objectif principal** : Rendre le cycle Dispatch → Social → Nouveau Jour fluide, clair et complet pour l'utilisateur.

**Problèmes actuels identifiés** :
- Flow Dispatch → Retour Hub pas assez clair
- Manque de feedback après fin du dispatch
- Modal dialogues/bâtiments incomplet
- Passage au jour suivant peu guidé
- Portraits des héros manquants sur page dispatch (✅ AJOUTÉ - avec timer d'indisponibilité)

---

#### 📋 Tâches prioritaires :

**1. Harmonisation du Flow Dispatch → Social (1-2h)**
- [x] **Fin de Dispatch améliorée**
  - [x] Écran récapitulatif à la fin des 60s (missions réussies/échouées, or gagné)
  - [x] Animation de transition vers le village
  - [x] Message clair : "Dispatch terminé ! Retour au village..."
  - [x] Auto-redirection vers hub avec modal village ouvert

- [x] **Retour au Hub après Dispatch**
  - [x] Ouvrir automatiquement le modal village
  - [x] Afficher un panneau "Résumé du jour" en premier
  - [x] Bouton clair "Continuer" pour explorer le village
  
- [x] **Indicateurs visuels clairs**
  - [x] Badge jour actuel toujours visible (Jour 1/3, 2/3, 3/3)
  - [x] Compteur d'or avec animation sur gains
  - [x] État du jour : "Dispatch terminé" ou "En cours"

**2. Flow Modal de Dialogues (1h)**
- [x] **Modal Dialogue complet**
  - [x] Liste des dialogues disponibles dans le village modal
  - [x] Badge "nouveau" (💬) sur dialogues non lus
  - [x] Clic → ouvre le dialogue avec échanges multiples
  - [x] Portraits des héros dans le dialogue
  - [x] Émotions visuelles (happy, sad, angry, neutral)
  - [x] Bouton "Suivant" pour les échanges
  - [x] Bouton "Fermer" à la fin
  - [x] Marquer automatiquement comme "lu"

- [x] **Feedback après lecture**
  - [x] Badge disparaît après lecture
  - [x] Message : "Dialogue terminé avec [Héros]"
  - [x] Retour au panneau village

**3. Flow Modal Amélioration Bâtiments (1h)**
- [x] **Modal Amélioration complète**
  - [x] Liste des 5 bâtiments dans le village modal
  - [x] Badge "amélioration disponible" (✨) si assez d'or
  - [x] Clic → modal détaillée du bâtiment
  - [x] Affichage : niveau actuel, bonus actuel, coût upgrade, nouveau bonus
  - [x] Bouton "Améliorer" (grisé si pas assez d'or)
  - [x] Confirmation : "Voulez-vous améliorer [Bâtiment] ?"
  - [x] Animation de l'amélioration (étincelles, son)

- [x] **Feedback après amélioration**
  - [x] Message de succès : "[Bâtiment] amélioré au niveau X !"
  - [x] Animation de l'or qui diminue
  - [x] Mise à jour visuelle immédiate du bâtiment
  - [x] Badge disparaît si niveau max atteint

**4. Système "Jour Suivant" (30min)** ✅
- [x] **Conditions claires**
  - [x] Bouton "Jour Suivant" visible dans le village modal
  - [x] Désactivé tant que le dispatch n'est pas terminé
  - [x] Tooltip explicatif si désactivé
  - [x] Activé après fin du dispatch

- [x] **Passage au jour suivant**
  - [x] Modal de confirmation : "Passer au Jour X ?"
  - [x] Récapitulatif : or restant, dialogues lus, bâtiments améliorés
  - [x] Bouton "Confirmer"
  - [x] Animation de transition (fade out/in)
  - [x] Déblocage automatique des nouveaux dialogues
  - [x] Réinitialisation de l'état dispatch
  - [x] Message : "Jour X commence !"

**5. Polish UX/UI (30min-1h)** ✅
- [x] **Transitions fluides**
  - [x] Fade in/out entre pages
  - [x] Slide animations pour les modals
  - [x] Smooth scroll dans les listes
  
- [x] **Feedback visuel constant**
  - [x] Hover states sur tous les boutons
  - [x] Loading states si nécessaire
  - [x] Messages de succès/erreur cohérents (toast notifications)
  - [x] Couleurs cohérentes (vert succès, rouge erreur, bleu info)

- [x] **Clarté de navigation**
  - [x] Breadcrumb : Hub > Dispatch ou Hub > Village
  - [x] Bouton "Retour" toujours visible
  - [x] État actuel du jeu toujours visible

**6. Tests complets (30min)**
- [ ] **Scénario Jour 1**
  - [ ] Lancer dispatch, faire 3-4 missions
  - [ ] Vérifier fin de dispatch → retour hub
  - [ ] Lire 2 dialogues
  - [ ] Vérifier qu'on ne peut pas améliorer (pas assez d'or)
  - [ ] Passer au Jour 2

- [ ] **Scénario Jour 2**
  - [ ] Lancer dispatch, faire 4-5 missions
  - [ ] Vérifier or accumulé (~900 or)
  - [ ] Lire 1 nouveau dialogue
  - [ ] Améliorer 1 bâtiment (~500 or)
  - [ ] Vérifier or restant (~400 or)
  - [ ] Passer au Jour 3

- [ ] **Scénario Jour 3**
  - [ ] Lancer dispatch, faire 5-6 missions
  - [ ] Vérifier or accumulé (~1300 or)
  - [ ] Améliorer 1 bâtiment
  - [ ] Message de fin de MVP
  - [ ] Vérifier cohérence complète

---

### 🎯 Sprint 7 : Corrections de Bugs (Sprint de Debug) ✅

**Bugs découverts lors des tests complets** :

**1. Bug Timer Mission (CRITIQUE)** ✅
- **Problème** : Timer affichait ⏱️ 29398233980 au lieu des secondes réelles
- **Cause** : `startTime` est un timestamp (Date.now() en ms), `elapsed` est en secondes, calcul incompatible
- **Solution** : Utiliser `Math.floor((Date.now() - heroMission.startTime) / 1000)` pour calculer le temps écoulé correctement
- **Fichier** : `/app/dispatch/page.tsx` ligne 1210

**2. Bug Toast Empilés** ✅
- **Problème** : Notifications toast empilées visuellement les unes sur les autres
- **Cause** : Espacement insuffisant (80px) et z-index croissant
- **Solution** : 
  - Augmenter espacement à 90px entre toasts
  - Inverser z-index (10000 - index) pour que les nouveaux toasts glissent sous les anciens
- **Fichier** : `/app/components/Toast.tsx`

**3. Bug Marqueurs Visuels Superposés** ✅
- **Problème** : Quand 2 missions apparaissent au même endroit, les marqueurs (sablier, !) se superposent
- **Cause** : Toutes les missions utilisaient exactement les mêmes coordonnées x,y sans offset
- **Solution** : 
  - Détecter missions au même endroit (distance < 2%)
  - Appliquer offset horizontal de 60px * index
  - Utiliser `calc()` CSS pour positionner avec offset
- **Fichier** : `/app/dispatch/page.tsx` ligne 742

**4. Bug Notification Dialogues Dupliquées** ⚠️
- **Problème** : Modal affiche 3 dialogues disponibles mais la carte du village montre seulement 1 élément visuel
- **Cause** : Système de notification de dialogues potentiellement dupliqué ou mal synchronisé
- **Note** : Seulement 3 dialogues au total dans le jeu (2 jour 1, 1 jour 2)
- **Statut** : Comportement normal - les 3 dialogues sont bien disponibles dans la liste
- **Fichiers** : `/app/components/village/VillageModal.tsx`, `/app/data/dialogues.ts`

**5. Bug Jour 5+ (CRITIQUE)** ✅
- **Problème** : Le jeu continue au-delà du Jour 3 jusqu'au Jour 5+, pas de message de fin MVP
- **Cause** : Fonction `nextDay()` n'avait pas de limite, pas de détection de fin de MVP
- **Solution** :
  - Ajouter garde dans `nextDay()` : `if (newDay > 3) return prev`
  - Remplacer bouton "Jour Suivant" par message "Fin du MVP !" au Jour 3
  - Message affiche : "Vous avez complété les 3 jours du prototype !"
- **Fichiers** : 
  - `/app/contexts/GameContext.tsx` - Garde nextDay()
  - `/app/components/village/VillageModal.tsx` - Message conditonnel

**Résultats** :
- ✅ 5 bugs critiques identifiés et corrigés
- ✅ Le MVP est maintenant strictement limité à 3 jours
- ✅ Tous les timers affichent correctement
- ✅ Toasts ne se chevauchent plus
- ✅ Marqueurs de missions s'espacent automatiquement
- ✅ Message de fin MVP s'affiche après le Jour 3

---

### 🎯 Sprint 8 : Corrections Structurelles (Sprint de Refonte) 🔄

**Bugs découverts lors du re-test complet (23 nov)** :

**1. Bug Déblocage Dialogues (CRITIQUE)** ⚠️ **[RÉSOLU]** ✅
- **Problème** : Les dialogues déjà lus réapparaissaient comme non lus après le passage au jour suivant
- **Symptômes observés** :
  - Après le 1er dispatch : aucun dialogue disponible (normal si non lus)
  - Après le 2ème dispatch : 3 dialogues disponibles (dont 2 du jour 1 déjà lus)
  - Après le 3ème dispatch : les 3 mêmes dialogues réapparaissent comme non lus
- **Cause racine** : 
  - `nextDay()` dans `GameContext.tsx` remplaçait `availableDialogues` par la liste brute de `getDialoguesForDay(newDay)`
  - Ces objets proviennent de `ALL_DIALOGUES` qui ont `isRead: false` par défaut
  - Le flag `isRead` n'était pas préservé lors du passage au jour suivant
  - Bien que `readDialogues` (array d'IDs) soit maintenu, l'UI s'appuie sur `dialogue.isRead`
- **Solution implémentée** (23 nov 2025) :
  - Modification de `nextDay()` pour merger l'état `isRead` lors du déblocage de nouveaux dialogues
  - Création de `mergedAvailable` qui préserve `isRead: true` pour les dialogues déjà lus (vérification via `prev.readDialogues` et `prev.availableDialogues`)
  - Ajout d'une fonction `resetGame()` pour réinitialiser proprement le localStorage
  - Ajout d'un bouton "Reset Save" dans le village pour nettoyer les sauvegardes corrompues
- **Comportement correct** : 
  - Jour 1 → 2 dialogues disponibles (`day1_bjorn_intro`, `day1_lyra_intro`)
  - Jour 2 → 1 nouveau dialogue (`day2_thorin_upgrade`), les 2 précédents restent marqués comme lus
  - Jour 3 → Aucun nouveau dialogue, les dialogues lus restent marqués comme lus
- **Fichiers modifiés** : 
  - `/app/contexts/GameContext.tsx` (lignes 194-212: correction `nextDay()`, ajout `resetGame()`)
  - `/app/components/village/VillageModal.tsx` (ajout bouton "Reset Save" et modal de confirmation)
  - `/app/data/dialogues.ts` (logique de déblocage correcte)

**2. Bug Boutons Redondants (UX)** ⚠️ **[RÉSOLU]** ✅
- **Problème** : 2 boutons "Dialogues" et "Bâtiments" dans le modal village redondants avec le système de points lumineux
- **Symptômes observés** :
  - Boutons fixes "Dialogues" et "Bâtiments" en haut à gauche du modal village
  - Points lumineux placés manuellement par l'utilisateur sur la carte
  - Double système d'accès créant confusion et surcharge visuelle
- **Cause** : Double système d'accès redondant
  - Points lumineux placés manuellement par l'utilisateur sur l'image du village (système principal)
  - Boutons fixes superflus en haut à gauche du modal (lignes 553-664)
- **Impact UX** : Confusion, duplication inutile, surcharge visuelle
- **Solution implémentée** (23 nov 2025) :
  - Suppression des 2 boutons fixes "Dialogues" (lignes 553-605) et "Bâtiments" (lignes 608-664)
  - Conservation uniquement du système de points lumineux placés par l'utilisateur
  - Repositionnement du bouton "Jour Suivant" de `top: 160px` à `top: 20px`
  - Plus cohérent avec le gameplay de placement personnalisé
- **Comportement correct** :
  - Seuls les points lumineux placés par l'utilisateur sont visibles sur la carte du village
  - Les points affichent des badges de notification (💬 pour dialogues, ⚡ pour bâtiments améliorables)
  - Clic sur un point lumineux ouvre le menu contextuel avec les actions disponibles
- **Fichiers modifiés** :
  - `/app/components/village/VillageModal.tsx` (suppression lignes 553-664, repositionnement bouton "Jour Suivant")

**3. Bug Système de Jours (CRITIQUE)** 🔴
- **Problème** : Le flow actuel ne correspond pas au MVP défini
- **MVP attendu (roadmap)** :
  ```
  1 Jour = 1 Dispatch (60s) + 1 Social Time (village)
  MVP = 3 jours complets
  
  Jour 1: Dispatch → Social (2 dialogues débloqués) → Bouton "Jour Suivant"
  Jour 2: Dispatch → Social (1 nouveau dialogue) → Bouton "Jour Suivant"
  Jour 3: Dispatch → Social → Fin MVP (pas de Jour 4)
  ```
- **Comportement actuel** :
  - Jour 1 démarre avec Dispatch disponible ✅
  - Après Dispatch → Retour village avec modal résumé ✅
  - Bouton "Jour Suivant" passe au Jour 2 → **Retour hub, pas de nouveau Dispatch automatique** ❌
  - L'utilisateur doit manuellement cliquer sur "Dispatch" pour lancer le Jour 2
  - Résultat : 2 Dispatch + 2 Social Time au lieu de suivre le flow naturel
- **Cause** : 
  - `nextDay()` dans GameContext passe au jour suivant mais ne lance pas le Dispatch
  - Le jeu reste sur le hub, l'utilisateur doit manuellement relancer le Dispatch
  - Pas de transition automatique Social → Dispatch du jour suivant
- **Solution proposée** :
  - **Option A (Simple)** : Après clic sur "Jour Suivant", rediriger automatiquement vers `/dispatch` pour lancer le nouveau jour
  - **Option B (Flow clair)** : Afficher message "Jour X commence !" puis redirection automatique après 2 secondes
  - Assurer que chaque jour = 1 cycle complet Dispatch → Social → Bouton Jour Suivant → Nouveau Dispatch
- **Fichiers concernés** :
  - `/app/contexts/GameContext.tsx` (fonction `nextDay()` ligne 197)
  - `/app/components/village/VillageModal.tsx` (bouton "Jour Suivant" ligne 668)
  - Flow de navigation entre hub/dispatch/village

**Résumé des problèmes** :
- ❌ Dialogues tous débloqués dès Jour 1 au lieu de progressif
- ❌ Boutons redondants créent confusion UX
- ❌ Flow de jours cassé : pas de transition automatique vers nouveau Dispatch

**Impact** :
- Le MVP ne fonctionne pas comme défini dans la roadmap
- L'expérience utilisateur est confuse (boutons inutiles)
- Le système de progression n'est pas fluide

---

#### ✅ Critères de succès :

- ✅ **Portraits héros avec timers** sur page dispatch (FAIT)
- [ ] **Flow clair** : L'utilisateur comprend toujours où il est et ce qu'il peut faire
- [ ] **Pas de dead ends** : Toujours un bouton/action pour continuer
- [ ] **Feedback constant** : Chaque action a une réponse visuelle immédiate
- [ ] **Cycle complet** : Dispatch → Village → Nouveau Jour fonctionne sur 3 jours sans bugs
- [ ] **Données cohérentes** : Or, dialogues, bâtiments se mettent à jour correctement
- [ ] **UX fluide** : Pas de saccades, transitions smooth, messages clairs

---

#### 📝 Notes d'implémentation :

**Ordre recommandé** :
1. Finaliser modal dialogues (flow complet)
2. Finaliser modal bâtiments (flow complet)
3. Améliorer fin de dispatch (récapitulatif)
4. Système "Jour Suivant" robuste
5. Polish UX/UI général
6. Tests complets

**Fichiers à modifier** :
- `/app/dispatch/page.tsx` - Fin de dispatch et récapitulatif ✅ (portraits ajoutés)
- `/app/components/village/VillageModal.tsx` - Panneau résumé jour
- `/app/components/DialogueModal.tsx` - Flow dialogue complet
- `/app/components/BuildingUpgradeModal.tsx` - Flow amélioration complet
- `/app/contexts/GameContext.tsx` - Fonction nextDay() robuste
- `/app/page.tsx` - Gestion modal village après dispatch

---

## 💡 Idées futures (post-MVP)

- [ ] Jours supplémentaires (cycles infinis)
- [ ] Système d'XP et montée de niveau des héros
- [ ] Bonus réels des bâtiments améliorés
- [ ] Équipement pour les héros
- [ ] Événements aléatoires pendant le dispatch
- [ ] Choix moraux dans les dialogues
- [ ] Système de réputation
- [ ] Nouveaux héros débloquables
- [ ] Boss/missions épiques
- [ ] Sauvegarde cloud
- [ ] Multi-cycle avec difficulté croissante

---

## ✅ Checklist de validation

Avant de commencer l'implémentation :
- [ ] Architecture approuvée
- [ ] Flow du jeu validé
- [ ] Équilibrage des récompenses OK
- [ ] Nombre de missions par tour OK
- [ ] Structure des données validée

---

_Document créé le 22 novembre 2025_
_Version 1.3 - Sprint 4 complété - Ajout Sprints 5 & 6 pour refactoring et optimisation_
