# 🗄️ Architecture Base de Données - Medieval Dispatch

## 📋 Vue d'ensemble

Ce document décrit l'architecture de la base de données pour Medieval Dispatch. L'objectif est de migrer le système actuel fonctionnel (contenu statique en fichiers TypeScript) vers une base de données centralisée.

**Architecture en 2 projets** :
- **Projet externe (Content Management)** : gestion et alimentation de la DB (création de contenu, upload d'images)
- **Projet Medieval Dispatch (Game Client)** : lecture seule de la DB pour afficher le contenu du jeu

---

## 🎯 Objectifs

1. **Centraliser le contenu statique du jeu** : héros, missions, dialogues, bâtiments, lieux
2. **Gérer les ressources visuelles** : portraits, icônes, images de lieux (multiples par entité)
3. **Supporter la progression multi-jours** : système de déblocage basé sur les jours (1-3)
4. **Sauvegarder la progression joueur** : état du jeu, missions complétées, dialogues lus
5. **Alimenter depuis un projet externe** : le jeu ne fait que lire, le content management écrit

---

## 🗂️ Tables de contenu (Lecture seule pour le jeu)

Ces tables sont gérées par le projet externe de content management. Le jeu Medieval Dispatch les lit uniquement.

### 1. **HEROES** (Héros)

Table centrale contenant tous les personnages jouables du jeu.

```
Colonnes principales :
- id (UUID, PK)
- slug (string, unique) : identifiant lisible (ex: "bjorn", "elira")
- name (string) : nom affiché (ex: "Bjorn le Hardi")
- display_color (string) : couleur HEX pour l'UI (#ff4444)
- description (text) : biographie du héros
- is_starter (boolean) : héros disponible dès le début (true pour MVP)
- unlock_day (int, nullable) : jour de déblocage (NULL si starter)

Stats de base (valeurs fixes pour MVP) :
- stat_force (int)
- stat_dexterite (int)
- stat_sagesse (int)
- stat_intelligence (int)
- stat_vitalite (int)

Métadonnées :
- is_active (boolean) : héros activé dans le jeu
- created_at (timestamp)
- updated_at (timestamp)
```

**Relations** :
- Un héros possède plusieurs HERO_IMAGES (portraits, icônes, etc.)
- Un héros peut être assigné à plusieurs MISSIONS via MISSION_ASSIGNMENTS
- Un héros a plusieurs DIALOGUES

---

### 2. **HERO_IMAGES** (Images des héros)

Table pour gérer tous les assets visuels des héros (portraits, icônes, poses).

```
Colonnes :
- id (UUID, PK)
- hero_id (UUID, FK → HEROES)
- image_type (enum) : 
  * 'portrait_full' : portrait complet pour dialogues
  * 'portrait_small' : avatar pour liste
  * 'icon' : petite icône
  * 'village_pose' : sprite pour le village
  * 'mission_icon' : icône pour l'interface missions
- image_url (string) : chemin vers l'image (/portraits/bjorn_full.png)
- alt_text (string) : texte alternatif
- width (int, nullable) : largeur suggérée en pixels
- height (int, nullable) : hauteur suggérée en pixels
- is_default (boolean) : image par défaut pour ce type
- created_at (timestamp)
- updated_at (timestamp)
```

**Notes** :
- Permet plusieurs images par type (ex: différentes émotions)
- Le projet externe gère l'upload et le référencement des images
- Le jeu charge dynamiquement selon le contexte (dialogue, mission, village)

---

### 3. **LOCATIONS** (Lieux)

Table des lieux où se déroulent les missions.

```
Colonnes :
- id (UUID, PK)
- slug (string, unique) : identifiant (ex: "foret", "grotte", "ruines")
- name (string) : nom affiché ("Forêt de Neverwinter")
- description (text) : description du lieu
- image_url (string) : chemin vers l'image principale du lieu
- map_position_x (float) : position X sur la carte (en %, 0-100)
- map_position_y (float) : position Y sur la carte (en %, 0-100)
- is_active (boolean) : lieu activé dans le jeu
- created_at (timestamp)
- updated_at (timestamp)
```

**Notes** :
- Permet d'avoir plusieurs missions dans un même lieu (même position ou légèrement décalée)
- Le projet externe gère la création des lieux et l'upload des images de fond

---

### 4. **MISSIONS** (Missions)

Table centrale des missions avec toutes leurs caractéristiques.

```
Colonnes principales :
- id (UUID, PK)
- slug (string, unique) : identifiant unique (ex: "day1_mission1")
- title (string) : titre de la mission
- description (text) : narration/contexte de la mission
- location_id (UUID, FK → LOCATIONS)

Dispatch & Timing :
- dispatch_day (int) : jour où la mission apparaît (1, 2, 3)
- spawn_time (int) : secondes après début du dispatch (0-60)
- duration (int) : durée de la mission en secondes (10-20)

Position sur la carte (override optionnel du lieu) :
- override_position_x (float, nullable) : si NULL, utilise location.map_position_x
- override_position_y (float, nullable) : si NULL, utilise location.map_position_y

Difficulté & Stats requises :
- difficulty_level (enum) : 'facile', 'moyenne', 'difficile'
- required_force (int, nullable)
- required_dexterite (int, nullable)
- required_sagesse (int, nullable)
- required_intelligence (int, nullable)
- required_vitalite (int, nullable)
- max_heroes (int, default: 2) : nombre max de héros assignables

Récompenses :
- reward_gold (int)
- reward_xp (int) : pour statistiques (pas utilisé dans MVP)

Résolutions narratives :
- resolution_success (text) : texte affiché si succès
- resolution_failure (text) : texte affiché si échec

Métadonnées :
- is_active (boolean) : mission activée dans le jeu
- created_at (timestamp)
- updated_at (timestamp)
```

**Notes importantes** :
- Le système de calcul de réussite reste côté client (jeu)
- Pas de XP utilisée pour l'instant, mais trackée pour stats futures
- Le projet externe crée les missions et définit leur timing d'apparition

---

### 5. **DIALOGUES** (Dialogues)

Table des dialogues de la phase sociale.

```
Colonnes :
- id (UUID, PK)
- slug (string, unique) : identifiant (ex: "day1_bjorn_intro")
- hero_id (UUID, FK → HEROES)
- title (string) : titre du dialogue
- unlock_day (int) : jour de déblocage (1, 2, 3)
- display_order (int) : ordre d'affichage si plusieurs dialogues le même jour
- is_active (boolean) : dialogue activé dans le jeu
- created_at (timestamp)
- updated_at (timestamp)
```

**Relations** :
- Un dialogue appartient à un héros
- Un dialogue contient plusieurs DIALOGUE_EXCHANGES (messages)

---

### 6. **DIALOGUE_EXCHANGES** (Échanges de dialogue)

Table des messages individuels dans un dialogue.

```
Colonnes :
- id (UUID, PK)
- dialogue_id (UUID, FK → DIALOGUES)
- sequence_order (int) : ordre dans la conversation (1, 2, 3...)
- speaker (enum) : 'hero', 'player'
- text (text) : contenu du message
- emotion (enum, nullable) : 'neutral', 'happy', 'sad', 'angry', 'surprised'
- hero_image_id (UUID, FK → HERO_IMAGES, nullable) : image spécifique pour ce message
- created_at (timestamp)
```

**Avantages** :
- Dialogues entièrement modulables depuis le projet externe
- Ajout/modification facile de répliques
- Support des émotions avec images différentes

---

### 7. **BUILDINGS** (Bâtiments)

Table des bâtiments améliorables du village.

```
Colonnes :
- id (UUID, PK)
- slug (string, unique) : identifiant (ex: "forge", "tavern", "townhall")
- name (string) : nom affiché
- icon (string) : emoji ou icône unicode
- description (text)
- max_level (int, default: 3)
- is_active (boolean) : bâtiment activé dans le jeu
- created_at (timestamp)
- updated_at (timestamp)
```

**Notes** :
- Position dans le village gérée côté client (pas en DB pour MVP)
- Tous les bâtiments disponibles dès le début

---

### 8. **BUILDING_LEVELS** (Niveaux de bâtiments)

Table des coûts et bonus par niveau de bâtiment.

```
Colonnes :
- id (UUID, PK)
- building_id (UUID, FK → BUILDINGS)
- level (int) : niveau (1, 2, 3)
- upgrade_cost_gold (int) : coût pour atteindre ce niveau depuis le niveau précédent
- unlock_description (text) : description du bonus (purement informatif pour MVP)
- created_at (timestamp)
- updated_at (timestamp)
```

**Notes MVP** :
- Les bonus ne sont pas appliqués fonctionnellement (juste texte descriptif)
- Coûts typiques : niveau 1→2 = 500-800 or, niveau 2→3 = 1000-1500 or
- Le jeu vérifie juste si le joueur a assez d'or

---

## 🎮 Tables de sauvegarde (Lecture/Écriture pour le jeu)

Ces tables sont gérées par le jeu Medieval Dispatch pour sauvegarder la progression du joueur.

### 9. **GAME_SAVES** (Sauvegardes)

Table pour stocker les parties des joueurs.

```
Colonnes :
- id (UUID, PK)
- save_name (string) : nom de la sauvegarde (ex: "Partie 1")
- 
Progression :
- current_day (int) : jour actuel (1, 2, 3)
- current_gold (int) : or actuel
- current_view (enum) : 'hub', 'dispatch', 'village'
- is_in_dispatch (boolean)
- dispatch_timer (int, nullable) : secondes restantes si en dispatch
- dispatch_elapsed (int, nullable) : secondes écoulées depuis début dispatch

Timestamps :
- last_saved_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
```

**Notes** :
- Pour MVP : une seule sauvegarde (pas de multi-user)
- La sauvegarde se fait automatiquement à chaque changement d'état

---

### 10. **PLAYER_HEROES** (État des héros)

État des héros pour une sauvegarde spécifique.

```
Colonnes :
- id (UUID, PK)
- game_save_id (UUID, FK → GAME_SAVES)
- hero_id (UUID, FK → HEROES)
- 
État disponibilité :
- is_available (boolean) : dispo ou en mission
- current_mission_id (UUID, FK → MISSIONS, nullable) : mission en cours
- mission_end_time (timestamp, nullable) : quand la mission se termine

- created_at (timestamp)
- updated_at (timestamp)
```

**Notes** :
- Stats fixes (lues depuis HEROES), pas de progression XP pour MVP
- Système simple : héros disponible ou occupé sur une mission

---

### 11. **PLAYER_BUILDINGS** (État des bâtiments)

État des bâtiments pour une sauvegarde.

```
Colonnes :
- id (UUID, PK)
- game_save_id (UUID, FK → GAME_SAVES)
- building_id (UUID, FK → BUILDINGS)
- current_level (int, default: 1)
- upgraded_at (timestamp, nullable) : date de la dernière amélioration
- created_at (timestamp)
- updated_at (timestamp)
```

---

### 12. **PLAYER_DIALOGUES** (Dialogues lus)

Tracking des dialogues lus par le joueur.

```
Colonnes :
- id (UUID, PK)
- game_save_id (UUID, FK → GAME_SAVES)
- dialogue_id (UUID, FK → DIALOGUES)
- is_read (boolean)
- read_at (timestamp, nullable)
- created_at (timestamp)
```

---

### 13. **MISSION_COMPLETIONS** (Missions complétées)

Historique des missions effectuées (pour statistiques et débriefing de fin de journée).

```
Colonnes :
- id (UUID, PK)
- game_save_id (UUID, FK → GAME_SAVES)
- mission_id (UUID, FK → MISSIONS)
- assigned_hero_ids (UUID[]) : array des IDs de héros assignés
- result (enum) : 'success', 'failure'
- gold_earned (int)
- completed_at (timestamp)
- created_at (timestamp)
```

**Usage** :
- Historique des missions du jour
- Calcul du total d'or gagné
- Affichage du résumé de fin de dispatch

---

---

## 📊 Relations et contraintes

### Schéma des relations :

**Contenu statique (géré par projet externe)** :
```
HEROES (1) ←→ (N) HERO_IMAGES
HEROES (1) ←→ (N) DIALOGUES
DIALOGUES (1) ←→ (N) DIALOGUE_EXCHANGES

LOCATIONS (1) ←→ (N) MISSIONS

BUILDINGS (1) ←→ (N) BUILDING_LEVELS
```

**Sauvegarde (géré par le jeu)** :
```
GAME_SAVES (1) ←→ (N) PLAYER_HEROES
GAME_SAVES (1) ←→ (N) PLAYER_BUILDINGS  
GAME_SAVES (1) ←→ (N) PLAYER_DIALOGUES
GAME_SAVES (1) ←→ (N) MISSION_COMPLETIONS

PLAYER_HEROES.hero_id → HEROES.id
PLAYER_HEROES.current_mission_id → MISSIONS.id
PLAYER_BUILDINGS.building_id → BUILDINGS.id
PLAYER_DIALOGUES.dialogue_id → DIALOGUES.id
MISSION_COMPLETIONS.mission_id → MISSIONS.id
```

### Contraintes importantes :

**Sur le contenu** :
- Unicité des slugs (UNIQUE constraint)
- dispatch_day entre 1 et 3 (CHECK constraint)
- spawn_time entre 0 et 60 (CHECK constraint)
- Stats >= 0 (CHECK constraint)
- sequence_order > 0 pour les dialogues (CHECK constraint)

**Sur les sauvegardes** :
- Un héros ne peut être qu'une seule fois par sauvegarde
- current_day entre 1 et 3
- current_gold >= 0

---

---

## 🚀 Migration depuis le code actuel

### Stratégie de migration :

**Phase 1 : Mise en place de la DB et tables de contenu**
1. Créer la base de données (PostgreSQL recommandé)
2. Créer toutes les tables de contenu statique :
   - HEROES + HERO_IMAGES
   - LOCATIONS + MISSIONS
   - DIALOGUES + DIALOGUE_EXCHANGES
   - BUILDINGS + BUILDING_LEVELS

**Phase 2 : Développement du projet externe (Content Management)**
1. Interface pour créer/éditer héros, missions, dialogues, bâtiments
2. Système d'upload d'images
3. Outil de migration des données actuelles → DB

**Phase 3 : Migration des données existantes**
1. Script de migration `/app/data/heroes.ts` → **HEROES** + **HERO_IMAGES**
2. Script de migration `/app/data/missions.ts` → **LOCATIONS** + **MISSIONS**
3. Script de migration `/app/data/dialogues.ts` → **DIALOGUES** + **DIALOGUE_EXCHANGES**
4. Script de migration des bâtiments de `GameContext.tsx` → **BUILDINGS** + **BUILDING_LEVELS**
5. Indexation des images dans `/public/` → tables d'images

**Phase 4 : Adaptation du jeu pour lire depuis la DB**
1. Créer des API routes Next.js pour requêter la DB
2. Remplacer les imports de fichiers TS par des appels API
3. Système de cache pour les données statiques
4. Tester le chargement dynamique

**Phase 5 : Système de sauvegarde en DB**
1. Créer les tables de sauvegarde
2. Adapter le `GameContext` pour lire/écrire en DB au lieu de localStorage
3. API routes pour CRUD sur GAME_SAVES
4. Migration optionnelle des sauvegardes localStorage existantes

---

## 💡 Avantages de cette architecture

### Séparation des préoccupations :
- ✅ **Projet externe** : gestion du contenu par des non-développeurs
- ✅ **Projet jeu** : se concentre sur la logique et l'UI
- ✅ **Base de données** : source unique de vérité

### Pour le contenu :
- ✅ **Ajout de missions** sans rebuild du jeu
- ✅ **Correction de textes** en temps réel
- ✅ **A/B testing** de dialogues différents
- ✅ **Upload d'images** centralisé

### Pour le développement :
- ✅ **Découplage** contenu/code
- ✅ **Scalabilité** : des centaines de missions possibles
- ✅ **Versionning** : historique des modifications
- ✅ **Environnements** : dev/staging/prod séparés

### Pour la sauvegarde :
- ✅ **Persistance** en DB au lieu de localStorage
- ✅ **Sauvegarde cloud** : jouer depuis plusieurs appareils
- ✅ **Backup automatique** des progressions
- ✅ **Analytics** : taux de succès, missions favorites

---

---

## 🎯 Priorisation

### Tables essentielles (MVP) :

**Contenu statique** :
1. HEROES
2. HERO_IMAGES
3. LOCATIONS
4. MISSIONS
5. DIALOGUES
6. DIALOGUE_EXCHANGES
7. BUILDINGS
8. BUILDING_LEVELS

**Sauvegarde** :
9. GAME_SAVES
10. PLAYER_HEROES
11. PLAYER_BUILDINGS
12. PLAYER_DIALOGUES
13. MISSION_COMPLETIONS

**Total : 13 tables pour le MVP fonctionnel**

---

---

## 🔐 Sécurité et bonnes pratiques

### À prévoir :

**Pour le contenu (projet externe)** :
- **Authentication** : seuls les admins peuvent modifier le contenu
- **Validation des données** : contraintes CHECK sur les valeurs
- **Audit logs** : tracking de qui a modifié quoi et quand
- **Backup automatique** : sauvegardes quotidiennes de la DB
- **Seeds de données** : données de test pour développement

**Pour les sauvegardes (jeu)** :
- **Row Level Security (RLS)** : si multi-user plus tard
- **Sanitization** : validation des inputs utilisateur
- **Rate limiting** : limite de sauvegardes par minute
- **Compression** : optimiser la taille des sauvegardes

---

---

## 📝 Notes techniques

### Stack recommandée :

**Base de données** :
- **PostgreSQL** : robuste, excellent support des relations, JSONB si besoin
- **Supabase** : PostgreSQL + API REST + Auth + Storage tout-en-un (recommandé pour rapidité)

**Pour le projet externe (Content Management)** :
- **Next.js Admin Dashboard** : contrôle total, React
- **Retool** : création rapide d'interface admin no-code
- **Forest Admin** : génération automatique d'interface CRUD

**Pour le jeu (Medieval Dispatch)** :
- **API Routes Next.js** : endpoints pour lire la DB
- **React Query / SWR** : cache et gestion des requêtes
- **Prisma** : ORM TypeScript avec génération de types

**Assets / Images** :
- **Supabase Storage** : si on utilise Supabase
- **Cloudinary** : CDN optimisé pour images
- **AWS S3** : standard industrie

### Flux de données :

```
Projet Externe (Content Management)
         ↓ (WRITE)
    Base de Données
         ↓ (READ)
Medieval Dispatch (Jeu)
         ↓ (WRITE sauvegardes)
    Base de Données
```

---

---

## 🎮 Exemples de requêtes

### Charger les missions d'un jour :
```sql
SELECT 
  m.*,
  l.name as location_name,
  l.image_url as location_image,
  COALESCE(m.override_position_x, l.map_position_x) as position_x,
  COALESCE(m.override_position_y, l.map_position_y) as position_y
FROM missions m
JOIN locations l ON m.location_id = l.id
WHERE m.dispatch_day = 1 
  AND m.is_active = true
ORDER BY m.spawn_time ASC;
```

### Charger un héros avec toutes ses images :
```sql
SELECT 
  h.*,
  json_agg(
    json_build_object(
      'type', hi.image_type,
      'url', hi.image_url,
      'isDefault', hi.is_default
    )
  ) as images
FROM heroes h
LEFT JOIN hero_images hi ON h.id = hi.hero_id
WHERE h.slug = 'bjorn'
  AND h.is_active = true
GROUP BY h.id;
```

### Charger les dialogues disponibles avec leurs échanges :
```sql
SELECT 
  d.*,
  h.name as hero_name,
  json_agg(
    json_build_object(
      'order', de.sequence_order,
      'speaker', de.speaker,
      'text', de.text,
      'emotion', de.emotion
    ) ORDER BY de.sequence_order
  ) as exchanges
FROM dialogues d
JOIN heroes h ON d.hero_id = h.id
JOIN dialogue_exchanges de ON d.id = de.dialogue_id
WHERE d.unlock_day <= 2
  AND d.is_active = true
GROUP BY d.id, h.name
ORDER BY d.unlock_day, d.display_order;
```

### Charger la sauvegarde complète d'un joueur :
```sql
-- Sauvegarde principale
SELECT * FROM game_saves WHERE id = '<save_id>';

-- État des héros
SELECT 
  ph.*,
  h.name,
  h.stat_force,
  h.stat_dexterite,
  h.stat_sagesse,
  h.stat_intelligence,
  h.stat_vitalite
FROM player_heroes ph
JOIN heroes h ON ph.hero_id = h.id
WHERE ph.game_save_id = '<save_id>';

-- État des bâtiments
SELECT 
  pb.*,
  b.slug,
  b.name,
  b.icon
FROM player_buildings pb
JOIN buildings b ON pb.building_id = b.id
WHERE pb.game_save_id = '<save_id>';

-- Dialogues lus
SELECT dialogue_id, is_read, read_at
FROM player_dialogues
WHERE game_save_id = '<save_id>';

-- Historique des missions
SELECT 
  mc.*,
  m.title,
  m.reward_gold
FROM mission_completions mc
JOIN missions m ON mc.mission_id = m.id
WHERE mc.game_save_id = '<save_id>'
ORDER BY mc.completed_at DESC;
```

---

## 📌 Conclusion

Cette architecture de base de données offre :
- ✅ **Séparation claire** entre contenu (projet externe) et jeu (lecture)
- ✅ **Système de sauvegarde robuste** en DB
- ✅ **Scalabilité** pour des centaines de missions/dialogues
- ✅ **Maintenabilité** : modification de contenu sans toucher au code
- ✅ **Migration simple** depuis le système actuel en fichiers TS

L'implémentation se fera progressivement :
1. Setup DB + tables
2. Développement projet externe
3. Migration des données existantes
4. Adaptation du jeu pour lecture DB
5. Implémentation sauvegarde DB
