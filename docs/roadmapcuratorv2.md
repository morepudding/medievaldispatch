# 🎨 Roadmap Curator V2 - Medieval Dispatch

**Date**: 23 novembre 2025  
**Contexte**: Après analyse complète de la DB Supabase et du code

---

## 📊 État actuel du système (analyse réelle)

### Contenu existant dans la DB :

**5 Héros** (contenu placeholder naïf):
- Bjorn le Vaillant, Owen le Roublard, Vi la Sage, Durun le Robuste, Elira la Diplomate
- ❌ **Problème**: Descriptions génériques ("un héros de Medieval Dispatch")
- ❌ **Problème**: Lore ridicule ("est prêt à servir votre village")
- ✅ **OK**: Stats différenciées (force/diplomacy/stealth/intelligence)
- ✅ **OK**: 1 portrait par héros (`portrait_full`)

**15 Missions** (contenu minimal mais utilisable):
- Répartition: Jour 1 (4), Jour 2 (5), Jour 3 (6)
- ✅ **OK**: Descriptions correctes (escorte, cueillette, patrouille, etc.)
- ✅ **OK**: Textes success/failure narratifs
- ⚠️ **Moyen**: Manque de profondeur, trop générique

**3 Dialogues** (basique mais narratif):
- 2 dialogues jour 1 (Bjorn, Owen), 1 dialogue jour 2 (Vi)
- ✅ **OK**: Échanges multi-tours avec émotions
- ✅ **OK**: Début de trame narrative (traces dans la forêt, présence magique)
- ⚠️ **Manque**: Seulement 3 dialogues sur 5 héros

**4 Locations** (fonctionnel):
- Forêt, Grotte, Ruines, Village
- ✅ **OK**: Images existantes dans `/public/lieux/`
- ✅ **OK**: Positions sur carte définies

**5 Bâtiments** (structure OK, contenu placeholder):
- Forge, Hôtel de Ville, Marché, Auberge, Tour de Garde
- ✅ **OK**: 4 niveaux chacun avec coûts
- ❌ **Problème**: Descriptions ultra-basiques

---

## 🎯 NOTRE RÔLE vs CURATOR

### Ce qu'ON fait (développeurs):
1. ✅ Créer les mécaniques de jeu (timer, stats, calcul réussite)
2. ✅ Créer les tables DB et relations (déjà fait)
3. ✅ Envoyer des specs détaillées au curator
4. ✅ Intégrer le contenu généré dans le système
5. ✅ Améliorer les systèmes de jeu (émotions dans dialogues, events, etc.)

### Ce que le CURATOR fait:
1. 🎨 Générer du contenu narratif profond et original
2. 🎨 Créer des portraits artistiques cohérents
3. 🎨 Écrire des dialogues riches et character-driven
4. 🎨 Imaginer des missions narratives complexes
5. 🎨 Créer l'univers et le lore du jeu
6. 🗄️ **Déposer le contenu DIRECTEMENT dans la DB Supabase** (UPDATE/INSERT SQL)

---

## 🚀 PHASE 1: Remplacer le contenu placeholder (URGENT)

**Objectif**: Sortir du contenu naïf actuel et créer un vrai univers

### 1.1 Héros - Refonte complète des 5 héros existants

**Ce qui ne va PAS actuellement** :
```
"description": "Bjorn, un héros de Medieval Dispatch"
"lore": "Bjorn est prêt à servir votre village."
```

**Ce qu'on veut du curator** :

#### Specs détaillées par héros :

**Bjorn** (Guerrier, strength 18):
- **Backstory riche** : D'où vient-il ? Pourquoi combat-il ? Quel trauma ?
- **Personnalité complexe** : Pas juste "courageux" - nuances, faiblesses
- **Motivation cachée** : Secret qui se révèle progressivement
- **Relations** : Lien avec Owen (ancien compagnon ?), méfiance envers Vi ?
- **Arc narratif** : Évolution jour 1 → jour 2 → jour 3

**Format attendu** :
```json
{
  "slug": "bjorn",
  "name": "Bjorn Hache-de-Fer",
  "title": "Berserker du Nord",
  "description": "150-200 mots - Physique, background, personnalité, motivations",
  "lore": "300-400 mots - Histoire complète, origines, secrets, objectifs cachés",
  "voice": "Comment il parle (ton, expressions typiques)",
  "relationships": {
    "owen": "Ancien compagnon d'armes. Complicité mais tensions...",
    "vi": "Méfiance. Le pragmatisme de Bjorn s'oppose à la magie de Vi...",
    "durun": "Respect mutuel entre guerriers...",
    "elira": "Incompréhension. Bjorn ne comprend pas la diplomatie..."
  }
}
```

**À générer pour CHAQUE héros (5 héros)** :
- Description enrichie (150-200 mots)
- Lore profond (300-400 mots)
- Voice/ton de dialogue
- Relations avec les 4 autres héros

---

### 1.2 Dialogues - Compléter et enrichir

**État actuel** : 3 dialogues (Bjorn, Owen, Vi) - **manque Durun et Elira**

**Ce qu'on veut** :

#### Jour 1 (2 dialogues existants à AMÉLIORER + créer pour Durun/Elira):
- **Bjorn jour 1** : Retravailler le dialogue existant pour être plus character-driven
  - Actuellement : "Traces dans la forêt" → OK mais trop expositif
  - Amélioration : Montrer sa personnalité PENDANT qu'il explique
  
- **Owen jour 1** : Idem, enrichir
  
- **Durun jour 1** : CRÉER - Introduction du personnage
  - Ton : Pragmatique, terre-à-terre, artisan
  - Hook : Problème avec les outils/armes ? Découverte à la forge ?

- **Elira jour 1** : CRÉER - Introduction
  - Ton : Diplomate, observatrice, stratège
  - Hook : Tensions politiques au village ? Rumeurs ?

#### Jour 2 (1 existant + en créer 1-2):
- **Vi jour 2** : Améliorer
- Créer 1-2 nouveaux dialogues pour d'autres héros

#### Jour 3 (créer 1-2):
- Révélations, climax narratif

**Contraintes techniques** :
- 4-7 échanges par dialogue
- Émotions : neutral, happy, sad, angry, surprised
- Alternance hero/player pour créer du rythme
- Chaque dialogue doit faire avancer le LORE global

---

### 1.3 Missions - Enrichir les 15 missions existantes

**État actuel** : Missions fonctionnelles mais génériques

**Ce qu'on veut** :

#### Retravailler les textes (title/description/success/failure):

**Exemple actuel (jour 1 - escorte marchand)** :
```
Title: "Escorte de marchand"
Description: "Un marchand local a besoin de protection..."
Success: "Le marchand est arrivé sain et sauf..."
Failure: "Les brigands vous ont pris par surprise..."
```

**Amélioration curator** :
```
Title: "Le Dernier Convoi" (titre évocateur)
Description: "Le marchand Aldric, dernier à oser la traversée depuis l'augmentation des attaques, transporte plus que des marchandises - des informations cruciales sur l'activité des brigands. Mais pourquoi semble-t-il si nerveux ?"
Success: "Aldric vous remercie avec un soulagement palpable. En plus de l'or promis, il vous glisse un avertissement : 'Ces brigands... ils ne sont pas normaux. Leurs mouvements sont trop coordonnés. Quelqu'un les dirige.' [+80 or, +50 réputation, unlock: indice 'Chef Brigand']"
Failure: "L'embuscade était un piège. Aldric perd sa cargaison mais survit - de justesse. 'Ils SAVAIENT qu'on viendrait', murmure-t-il, livide. Qui a prévenu les brigands ? [+40 or, -20 réputation, unlock: indice 'Traître au Village']"
```

**Objectif** : Chaque mission devient un morceau de puzzle narratif

#### Créer des **arcs narratifs** jour 1 → 2 → 3:
- Jour 1 : Indices dispersés (traces, présence magique, brigands organisés)
- Jour 2 : Connexions (les pièces s'assemblent)
- Jour 3 : Révélations et climax

---

### 1.4 Bâtiments - Descriptions immersives

**État actuel** : "La forge de Phandallin résonne du bruit des marteaux." ← TOO BASIC

**Ce qu'on veut** :

```json
{
  "slug": "forge",
  "name": "Forge de Torval",
  "icon": "🔨",
  "description": "La forge ancestrale de Torval le Noir, où le feu n'a jamais cessé de brûler depuis trois générations. L'odeur du métal chauffé et le rythme des marteaux créent une symphonie industrielle. Torval jure que le four contient encore des braises du premier feu allumé par son grand-père, forgeron légendaire qui créa l'épée du roi.",
  "atmosphere": "Chaleur intense, étincelles, bruit rythmé, odeur de charbon et métal",
  "npc": "Torval le Noir - forgeron bourru mais juste, cache un secret sur une arme légendaire"
}
```

**Pour chaque bâtiment** :
- Description immersive (100-150 mots)
- Atmosphère sensorielle (sons, odeurs, ambiance)
- NPC associé avec personnalité
- Secret/hook narratif caché

---

## 🔥 PHASE 2: Nouveau contenu critique pour deepening

**Prérequis** : Phase 1 terminée (contenu de base solide)

### 2.1 Portraits émotionnels pour dialogues

**Schéma DB existant** : `hero_images.image_type` supporte déjà les émotions

**À créer** : Pour CHAQUE héros (5), générer 5 portraits :
- `happy` : Sourire, regard chaleureux
- `sad` : Tristesse, mélancolie
- `angry` : Colère, tension
- `neutral` : Expression par défaut (déjà existe)
- `surprised` : Étonnement, yeux écarquillés

**Format** : 180x250px, même cadrage/style que portraits existants

**Impact** : Les dialogues deviennent vivants avec changements d'expressions

**Tâche DEV** : Modifier `DialogueModal.tsx` pour utiliser `emotion` → image

---

### 2.2 Ambient texts et flavour

**Nouveau besoin** : Textes d'ambiance courts pour immersion

#### Types à générer :

**A) Location flavour** (5-8 par lieu × 4 lieux = 20-32 textes):
```json
{
  "location_slug": "foret",
  "texts": [
    "Le vent fait bruisser les feuilles. Quelque chose vous observe.",
    "Des traces de pas récentes. Plusieurs personnes sont passées ici.",
    "Un corbeau croasse au loin. Mauvais présage.",
    "L'odeur de fumée... Un campement de brigands à proximité ?",
    "Les arbres sont marqués. Des symboles que vous ne reconnaissez pas."
  ]
}
```

**B) Mission reactions** (3-4 par héros × 5 héros = 15-20):
```json
{
  "hero_slug": "bjorn",
  "context": "mission_assigned",
  "texts": [
    "*Bjorn soupèse sa hache* Ça devrait faire l'affaire.",
    "*grognement* Encore des brigands. Quand apprendront-ils ?",
    "Bien. J'avais besoin de me dégourdir les jambes."
  ]
}
```

**C) Building hover descriptions** (longues, 1 par bâtiment):
- Description détaillée au survol avec vie, NPCs, activité

**Tâche DEV** : Créer table `ambient_texts` + API + composant display

---

### 2.3 Arc narratif complet Days 1-2-3

**Ce qui manque** : Cohérence narrative globale

**À créer avec curator** :

#### Document "Bible narrative":
- **Menace principale** : Qui/quoi est derrière les attaques ?
- **Mystère central** : Secret du village ? Prophétie ? Artefact ?
- **Résolution jour 3** : Comment tout se résout (ou pas)
- **Hooks pour après** : Extension possible jour 4-7

#### Missions spéciales jour 3:
- 1-2 missions "climax" avec textes longs et choix moraux
- Résolutions multiples selon héros assignés

**Format** :
```json
{
  "slug": "day3-final-showdown",
  "title": "Le Secret des Ruines",
  "description": "400-500 mots - Setup climax",
  "success_text_bjorn": "Si Bjorn participe → version combat brutal",
  "success_text_elira": "Si Elira participe → version diplomatie",
  "success_text_vi": "Si Vi participe → version magie/révélation",
  "failure_text": "Conséquences désastreuses, révélation partielle"
}
```

---

## 🌟 PHASE 3: Expansion future (après MVP solide)

### 3.1 Héros additionnels (4 nouveaux = 9 total)

**Nouveaux archétypes** :
- Voleur/Rogue (stealth master)
- Prêtresse/Healer (support)
- Ranger (équilibre)
- Paladin (tank/diplomacy hybrid)

**Pour chaque** :
- Lore complet
- 5 portraits (neutral + 4 émotions)
- Relations avec les 8 autres héros
- 2-3 dialogues personnels

---

### 3.2 Jours 4-7 (extension post-MVP)

**Arc secondaire** : Suite de l'histoire
- 20-25 nouvelles missions
- 2-3 nouveaux lieux
- Révélations supplémentaires
- Boss fight narratif ?

---

### 3.3 Side quests et événements

**Missions optionnelles** avec choix :
- Dilemmes moraux
- Conséquences à long terme
- Unlock de dialogues secrets

**Format événement** :
```json
{
  "title": "Le Mendiant Mystérieux",
  "trigger_chance": 0.3,
  "description": "Un vieil homme vous aborde...",
  "choices": [
    {
      "text": "Lui donner 50 or",
      "consequence": { "gold": -50, "reputation": +10, "unlock_dialogue": "old_man_secret" }
    },
    {
      "text": "L'ignorer",
      "consequence": { "reputation": -5 }
    }
  ]
}
```

---

## 📋 CHECKLIST PHASE 1 (priorité immédiate)

### Texte à générer par le curator:

- [ ] **5 héros refonte complète**
  - [ ] Bjorn : description (200 mots) + lore (400 mots) + relations + voice
  - [ ] Owen : idem
  - [ ] Vi : idem
  - [ ] Durun : idem
  - [ ] Elira : idem

- [ ] **Dialogues**
  - [ ] Améliorer dialogue Bjorn jour 1 (6 échanges)
  - [ ] Améliorer dialogue Owen jour 1 (6 échanges)
  - [ ] CRÉER dialogue Durun jour 1 (5-7 échanges)
  - [ ] CRÉER dialogue Elira jour 1 (5-7 échanges)
  - [ ] Améliorer dialogue Vi jour 2
  - [ ] CRÉER 1-2 dialogues jour 2 (autres héros)
  - [ ] CRÉER 1-2 dialogues jour 3 (climax)

- [ ] **15 missions enrichissement**
  - [ ] Jour 1 : 4 missions (title + description + success + failure réécrits)
  - [ ] Jour 2 : 5 missions (idem)
  - [ ] Jour 3 : 6 missions (idem + variantes selon héros)

- [ ] **5 bâtiments descriptions**
  - [ ] Forge, Hôtel de Ville, Marché, Auberge, Tour de Garde
  - [ ] Description longue + atmosphère + NPC + secret

- [ ] **Bible narrative** (document stratégique)
  - [ ] Arc global jours 1-3
  - [ ] Menace principale
  - [ ] Mystère central
  - [ ] Résolution

---

## 🎨 SPECS TECHNIQUES POUR LE CURATOR

### Style d'écriture :
- **Ton** : Médiéval-fantastique mature (pas enfantin)
- **Inspiration** : The Witcher 3, Dragon Age, Baldur's Gate 3
- **Longueur** : Descriptions denses mais concises
- **Show don't tell** : Montrer la personnalité par actions/dialogues

### Contraintes techniques :
- **Dialogues** : Max 7 échanges (sinon trop long)
- **Missions description** : Max 500 caractères (lisibilité)
- **Success/failure texts** : 2-4 phrases (impact sans noyer)

### Cohérence artistique :
- **Univers** : Cohérent entre héros/lieux/événements
- **Noms** : Style médiéval-fantastique européen
- **Technologie** : Niveau médiéval (pas d'armes à feu)
- **Magie** : Présente mais rare et mystérieuse

---

## 📞 WORKFLOW AVEC LE CURATOR

**Important** : Le curator a un accès direct à la DB Supabase pour déposer son contenu.

### Accès DB Curator

**Connexion fournie** :
- **DATABASE_URL** : Connexion poolée (lecture/écriture)
- **Tables autorisées** : `heroes`, `hero_images`, `missions`, `dialogues`, `dialogue_exchanges`, `buildings`, `building_levels`, `locations`
- **Tables INTERDITES** : `game_saves`, `player_*`, `mission_completions` (tables de sauvegarde joueur)

**Méthode de livraison** :
1. Curator génère le contenu (textes + images)
2. Curator exécute UPDATE SQL pour remplacer le contenu placeholder
3. Curator INSERT SQL pour nouveaux dialogues/échanges
4. Curator upload images dans Supabase Storage (`/portraits/`, `/lieux/`)
5. Notification à l'équipe dev (contenu prêt)

---

### Étape 1 : Brief initial (nous → curator)
- ✅ Envoyer ce document complet
- ✅ Fournir DATABASE_URL (avec droits write sur tables contenu)
- ✅ Fournir credentials Supabase Storage
- ✅ Specs des 5 héros (stats, rôles actuels)
- ✅ État actuel du contenu (exemples)
- ✅ Style attendu (références)

### Étape 2 : Génération et dépôt direct (curator)
- **Batch 1** : Bible narrative + 5 héros complets
  - Curator UPDATE `heroes` table (description, lore)
  - Curator exécute validation SQL (check cohérence)
  - Notification : "Héros enrichis ✓"
  
- **Batch 2** : Dialogues jour 1-2-3
  - Curator UPDATE dialogues existants (amélioration)
  - Curator INSERT nouveaux dialogues + exchanges
  - Validation SQL (check foreign keys, order)
  - Notification : "Dialogues complets ✓"
  
- **Batch 3** : 15 missions enrichies
  - Curator UPDATE `missions` (title, description, success_text, failure_text)
  - Validation : lengths, required_stats cohérence
  - Notification : "Missions enrichies ✓"
  
- **Batch 4** : Bâtiments + images
  - Curator UPDATE `buildings` (description, atmosphere, etc.)
  - Curator upload portraits dans Storage
  - INSERT `hero_images` pour nouveaux portraits
  - Notification : "Bâtiments + assets ✓"

### Étape 3 : Validation et tests (nous)
- ✅ Vérifier contenu en DB (queries SQL)
- ✅ Tester affichage in-game
- ✅ Valider cohérence narrative
- ✅ Feedback au curator si ajustements nécessaires

**Avantages de ce workflow** :
- ⚡ Pas de scripts intermédiaires à maintenir
- ⚡ Curator contrôle la qualité directement en DB
- ⚡ Updates incrémentales possibles
- ⚡ Rollback facile (snapshots Supabase)

---

## 🔒 Sécurité et contrôles

**Permissions curator (Supabase RLS à configurer)** :
```sql
-- Créer un role curator
CREATE ROLE curator_role;

-- Donner accès aux tables de contenu uniquement
GRANT SELECT, INSERT, UPDATE ON heroes TO curator_role;
GRANT SELECT, INSERT, UPDATE ON hero_images TO curator_role;
GRANT SELECT, INSERT, UPDATE ON missions TO curator_role;
GRANT SELECT, INSERT, UPDATE ON dialogues TO curator_role;
GRANT SELECT, INSERT, UPDATE ON dialogue_exchanges TO curator_role;
GRANT SELECT, INSERT, UPDATE ON buildings TO curator_role;
GRANT SELECT, INSERT, UPDATE ON building_levels TO curator_role;
GRANT SELECT, INSERT, UPDATE ON locations TO curator_role;

-- INTERDIRE l'accès aux saves joueurs
REVOKE ALL ON game_saves FROM curator_role;
REVOKE ALL ON player_heroes FROM curator_role;
REVOKE ALL ON player_buildings FROM curator_role;
REVOKE ALL ON player_dialogues FROM curator_role;
REVOKE ALL ON mission_completions FROM curator_role;

-- Créer user curator
CREATE USER curator_user WITH PASSWORD 'secure_password';
GRANT curator_role TO curator_user;
```

**Validation automatique (triggers SQL)** :
```sql
-- Empêcher modification des IDs existants
CREATE OR REPLACE FUNCTION prevent_id_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id != OLD.id THEN
    RAISE EXCEPTION 'ID modification forbidden';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER heroes_no_id_change
  BEFORE UPDATE ON heroes
  FOR EACH ROW EXECUTE FUNCTION prevent_id_change();

-- Valider longueur textes
CREATE OR REPLACE FUNCTION validate_text_length()
RETURNS TRIGGER AS $$
BEGIN
  IF LENGTH(NEW.description) > 1000 THEN
    RAISE EXCEPTION 'Description too long (max 1000 chars)';
  END IF;
  IF LENGTH(NEW.lore) > 2000 THEN
    RAISE EXCEPTION 'Lore too long (max 2000 chars)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER heroes_validate_length
  BEFORE INSERT OR UPDATE ON heroes
  FOR EACH ROW EXECUTE FUNCTION validate_text_length();
```

---

**Dernière mise à jour** : 23 novembre 2025  
**Version** : 2.0  
**Status** : PRÊT À ENVOYER AU CURATOR
