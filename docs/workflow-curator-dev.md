# 🔄 Workflow Curator → Dev - Medieval Dispatch

**Date**: 23 novembre 2025  
**Objectif**: Documenter le workflow complet de génération et intégration de contenu

---

## 📊 Architecture du système

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE POSTGRESQL                          │
│                                                                 │
│  ┌───────────────────────┐   ┌──────────────────────────────┐ │
│  │  TABLES DE CONTENU    │   │  TABLES DE SAUVEGARDE        │ │
│  │  (Curator READ/WRITE) │   │  (Jeu READ/WRITE uniquement) │ │
│  ├───────────────────────┤   ├──────────────────────────────┤ │
│  │ • heroes              │   │ • game_saves                 │ │
│  │ • hero_images         │   │ • player_heroes              │ │
│  │ • missions            │   │ • player_buildings           │ │
│  │ • dialogues           │   │ • player_dialogues           │ │
│  │ • dialogue_exchanges  │   │ • mission_completions        │ │
│  │ • buildings           │   │ • narrative_flags            │ │
│  │ • building_levels     │   │                              │ │
│  │ • locations           │   │                              │ │
│  └───────────────────────┘   └──────────────────────────────┘ │
│          ↑     ↓                        ↑     ↓                │
└──────────┼─────┼────────────────────────┼─────┼────────────────┘
           │     │                        │     │
    ┌──────┘     └──────┐          ┌─────┘     └─────┐
    │                   │          │                  │
┌───▼────┐         ┌───▼────┐  ┌──▼──┐          ┌───▼────┐
│CURATOR │         │  GAME  │  │GAME │          │  GAME  │
│PIPELINE│◄────────┤  DEV   │  │ API │◄─────────┤  FRONT │
│(AI Gen)│ specs   │  TEAM  │  │     │  fetch   │  (Next)│
└────────┘         └────────┘  └─────┘          └────────┘
```

---

## 🔐 Permissions et sécurité

### User `curator_pipeline`

**Accès** :
- ✅ `SELECT, INSERT, UPDATE` sur tables de contenu
- ❌ `DELETE` interdit (protection contre suppression accidentelle)
- ❌ Aucun accès aux tables de sauvegarde joueur

**Connexion fournie** :
```
DATABASE_URL_CURATOR="postgresql://curator_pipeline:PASSWORD@db.xxx.supabase.co:6543/postgres?pgbouncer=true"
```

**Validation automatique (triggers SQL)** :
- Empêche modification des IDs existants
- Valide longueur des textes (max 1000 chars description, 2000 lore)
- Check foreign keys (hero_id, location_id, etc.)

---

## 🚀 Workflow Phase 1 (Contenu enrichi de base)

### Étape 1 : Préparation (DEV → Curator)

**Durée** : 1-2h

**Actions DEV** :
1. Créer user `curator_pipeline` avec permissions
2. Générer `DATABASE_URL_CURATOR`
3. Préparer schéma Prisma avec nouveaux champs (relations, voice, arc narratif)
4. Envoyer au curator :
   - `DATABASE_URL_CURATOR`
   - `docs/roadmapcuratorv2.md` (specs complètes)
   - `docs/database.md` (schéma tables)
   - Exemples de contenu actuel (export CSV)

**Commandes** :
```bash
# Créer user curator
psql $DATABASE_URL -f prisma/setup/curator_permissions.sql

# Export contenu actuel pour référence
psql $DATABASE_URL -c "\COPY heroes TO 'exports/heroes_current.csv' CSV HEADER"
psql $DATABASE_URL -c "\COPY missions TO 'exports/missions_current.csv' CSV HEADER"
```

---

### Étape 2 : Génération Batch 1 (Curator)

**Durée** : Variable selon curator

**Contenu généré** :
- Bible narrative (document stratégique)
- 5 héros enrichis (description 200 mots, lore 400 mots, relations)

**Actions Curator** :
1. Générer contenu narratif avec AI
2. Exécuter UPDATE SQL direct :
```sql
-- Exemple pour Bjorn
UPDATE heroes SET
  name = 'Bjorn Hache-de-Fer',
  title = 'Berserker du Nord',
  description = 'Guerrier légendaire du clan des Loups-de-Fer, Bjorn a survécu à...',
  lore = 'Né dans les terres glacées du Grand Nord, Bjorn a été formé...'
WHERE slug = 'bjorn';
```

3. Valider en DB :
```sql
-- Check longueur
SELECT slug, LENGTH(description), LENGTH(lore) FROM heroes;

-- Check cohérence
SELECT COUNT(*) FROM heroes WHERE is_active = true;
```

4. Notifier DEV : "Batch 1 déposé ✓"

---

### Étape 3 : Validation et tests (DEV)

**Durée** : 1-2h

**Actions DEV** :
```bash
# Vérifier contenu arrivé
psql $DATABASE_URL -c "SELECT slug, name, title FROM heroes;"

# Tester affichage in-game
npm run dev
# Naviguer vers village → Cliquer portrait héros → Vérifier nouveau contenu
```

**Checklist validation** :
- [ ] Descriptions riches (pas de placeholder)
- [ ] Lore narratif cohérent
- [ ] Pas de caractères cassés (UTF-8 OK)
- [ ] Textes français corrects (grammaire, orthographe)
- [ ] Cohérence entre héros (même univers)

**Si problème** : Feedback au curator avec exemples précis

---

### Étape 4 : Génération Batch 2 (Curator - Dialogues)

**Contenu** :
- Améliorer 3 dialogues existants (UPDATE `dialogues` + `dialogue_exchanges`)
- Créer 4-5 nouveaux dialogues (INSERT)

**Actions Curator** :
```sql
-- UPDATE dialogue existant (amélioration)
UPDATE dialogue_exchanges SET
  text = 'Texte amélioré plus character-driven',
  emotion = 'surprised'
WHERE dialogue_id = 'xxx' AND order = 2;

-- INSERT nouveau dialogue
INSERT INTO dialogues (id, hero_id, unlock_day, order) 
VALUES ('new_id', 'durun_id', 1, 0);

INSERT INTO dialogue_exchanges (id, dialogue_id, order, speaker, text, emotion)
VALUES 
  ('ex1', 'new_id', 0, 'hero', 'Premier échange...', 'neutral'),
  ('ex2', 'new_id', 1, 'player', 'Réponse joueur...', null),
  ...
```

**Validation Curator** :
```sql
-- Check nombre total dialogues
SELECT unlock_day, COUNT(*) FROM dialogues GROUP BY unlock_day;

-- Check ordre échanges OK
SELECT dialogue_id, order FROM dialogue_exchanges ORDER BY dialogue_id, order;
```

---

### Étape 5 : Génération Batch 3 (Curator - Missions)

**Contenu** :
- UPDATE 15 missions (title, description, success_text, failure_text enrichis)

**Actions Curator** :
```sql
UPDATE missions SET
  title = 'Le Dernier Convoi',
  description = 'Description narrative enrichie de 300-400 caractères...',
  success_text = 'Texte succès avec conséquences narratives...',
  failure_text = 'Texte échec avec hooks pour la suite...'
WHERE slug = 'day1-escorte-marchand';
```

**Validation** :
```sql
-- Check longueur textes
SELECT slug, LENGTH(description), LENGTH(success_text), LENGTH(failure_text)
FROM missions
ORDER BY day, spawn_time;
```

---

### Étape 6 : Génération Batch 4 (Curator - Bâtiments + Images)

**Contenu** :
- UPDATE 5 bâtiments (descriptions atmosphériques)
- Upload portraits dans Supabase Storage
- INSERT `hero_images` pour nouveaux portraits

**Actions Curator** :

1. **Bâtiments** :
```sql
UPDATE buildings SET
  description = 'Description longue et immersive...',
  atmosphere = 'Chaleur intense, étincelles, odeur de métal...',
  npc_name = 'Torval le Noir',
  npc_description = 'Forgeron bourru mais juste...',
  secret = 'Cache une arme légendaire brisée sous son enclume'
WHERE slug = 'forge';
```

2. **Images** (via Supabase Storage API) :
```bash
# Upload portraits (curl ou SDK)
curl -X POST 'https://xxx.supabase.co/storage/v1/object/portraits/bjorn_neutral.png' \
  -H "Authorization: Bearer $CURATOR_STORAGE_KEY" \
  --data-binary @bjorn_neutral.png

# Repeat pour: happy, sad, angry, surprised
```

3. **Références DB** :
```sql
INSERT INTO hero_images (id, hero_id, image_type, url, is_default)
VALUES 
  (gen_random_uuid(), 'bjorn_id', 'happy', '/portraits/bjorn_happy.png', false),
  (gen_random_uuid(), 'bjorn_id', 'sad', '/portraits/bjorn_sad.png', false),
  (gen_random_uuid(), 'bjorn_id', 'angry', '/portraits/bjorn_angry.png', false),
  (gen_random_uuid(), 'bjorn_id', 'surprised', '/portraits/bjorn_surprised.png', false);
```

---

## 📊 Suivi de progression

### Dashboard de validation (pour DEV)

**Queries SQL utiles** :
```sql
-- État des héros
SELECT 
  slug, 
  CASE 
    WHEN LENGTH(description) < 100 THEN '❌ Placeholder'
    ELSE '✅ Enrichi'
  END as status_desc,
  CASE 
    WHEN LENGTH(lore) < 100 THEN '❌ Placeholder'
    ELSE '✅ Enrichi'
  END as status_lore
FROM heroes;

-- État des dialogues
SELECT 
  unlock_day,
  COUNT(*) as total,
  COUNT(CASE WHEN id IN (SELECT dialogue_id FROM dialogue_exchanges WHERE LENGTH(text) > 50) THEN 1 END) as enriched
FROM dialogues
GROUP BY unlock_day;

-- État des missions
SELECT 
  day,
  COUNT(*) as total,
  AVG(LENGTH(description)) as avg_desc_length,
  AVG(LENGTH(success_text)) as avg_success_length
FROM missions
GROUP BY day;

-- État des images
SELECT 
  h.slug,
  COUNT(hi.id) as images_count,
  STRING_AGG(hi.image_type, ', ') as types
FROM heroes h
LEFT JOIN hero_images hi ON h.id = hi.hero_id
GROUP BY h.slug;
```

---

## 🔄 Workflow itératif (corrections)

Si le DEV trouve un problème après validation :

1. **DEV** : Créer issue avec exemples précis
   ```
   Titre: Dialogue Bjorn jour 1 - incohérence
   Description: 
   - Ligne 3 : Bjorn mentionne "ma femme" mais son lore dit qu'il est célibataire
   - Échange 5 : Ton trop moderne ("C'est relou") 
   ```

2. **Curator** : Corriger directement en DB
   ```sql
   UPDATE dialogue_exchanges SET
     text = 'Version corrigée...'
   WHERE dialogue_id = 'xxx' AND order = 5;
   ```

3. **DEV** : Valider correction in-game

4. **Repeat** jusqu'à qualité OK

---

## 🎯 Checklist finale Phase 1

### Contenu en DB (validé par curator)
- [ ] 5 héros enrichis (descriptions + lore)
- [ ] 7-8 dialogues complets (existants améliorés + nouveaux créés)
- [ ] 15 missions enrichies (textes narratifs)
- [ ] 5 bâtiments atmosphériques
- [ ] Bible narrative (document séparé)

### Images (Supabase Storage)
- [ ] 5 portraits neutres (déjà existants)
- [ ] 25 portraits émotionnels (5 héros × 5 émotions) - Phase 2

### Code DEV (adapté pour nouveau contenu)
- [ ] Schéma Prisma étendu (nouveaux champs)
- [ ] API routes (relationships, variants, full)
- [ ] HeroLoreModal (affichage lore complet)
- [ ] MissionDetailModal (textes enrichis)
- [ ] BuildingInfoModal (atmosphère)

### Validation in-game
- [ ] Tous les dialogues s'affichent correctement
- [ ] Missions ont des textes narratifs riches
- [ ] Portraits héros chargent OK
- [ ] Pas de bugs d'affichage (overflow, caractères cassés)

---

## 🚨 Troubleshooting

### Problème : "Le curator ne voit pas les tables"
```bash
# Vérifier permissions
psql $DATABASE_URL -c "\dp heroes"
# Doit afficher: curator_role=arwdDxt
```

### Problème : "Les UPDATE ne s'appliquent pas"
```sql
-- Vérifier transaction committée
SELECT * FROM heroes WHERE slug = 'bjorn';
-- Si ancien contenu visible, curator doit COMMIT ses transactions
```

### Problème : "Images ne chargent pas"
```bash
# Vérifier Storage Supabase
curl https://xxx.supabase.co/storage/v1/object/public/portraits/bjorn_happy.png
# Doit retourner image (pas 404)

# Vérifier DB références
SELECT url FROM hero_images WHERE image_type = 'happy';
```

---

**Dernière mise à jour** : 23 novembre 2025  
**Version** : 1.0  
**Statut** : WORKFLOW VALIDÉ - Prêt pour Phase 1
