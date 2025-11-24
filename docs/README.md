# 📚 Documentation - Medieval Dispatch

**Projet** : Medieval Dispatch - Time-management RPG médiéval-fantastique  
**Tech Stack** : Next.js 14, TypeScript, Prisma, PostgreSQL (Supabase)  
**Dernière mise à jour** : 24 novembre 2025

---

## 🎯 Document Principal : État du Projet

📊 **[`etat-du-projet.md`](etat-du-projet.md)** - **COMMENCEZ ICI**

**Audit complet de la codebase** (500+ lignes) généré le 24 novembre 2025 :
- ✅ **État actuel du projet** : Features implémentées, sprints terminés
- 🗄️ **Base de données** : 13 tables Prisma, contenu actuel détaillé
- 🔌 **12 API routes** documentées avec mapping complet
- 🧩 **44 fichiers TS/TSX** inventoriés (composants, utils, contexts)
- ⚠️ **Gaps & Limitations** identifiés (6 points critiques)
- 🎯 **Recommandations priorisées** (actions concrètes à prendre)
- 📊 **Métriques** : ~7,425 lignes de code, complexité par composant

**Ce document est la source de vérité sur l'état RÉEL du projet.**

---

## 🗂️ Structure de la documentation

```
docs/
├── README.md                    # ← Vous êtes ici
├── etat-du-projet.md           # 📊 ÉTAT ACTUEL DU PROJET (audit complet)
├── architecture/                # Architecture technique et base de données
├── roadmaps/                    # Roadmaps de développement
├── curator/                     # Pipeline IA de génération de contenu
├── setup/                       # Guides de configuration (Supabase, Prisma)
└── refactoring/                 # Sprints de refactoring validés
```

---

## 📁 Architecture & Base de données

**Dossier** : `architecture/`

Documentation de l'architecture technique et schéma de base de données.

| Fichier | Description |
|---------|-------------|
| [`database.md`](architecture/database.md) | Schéma complet de la base de données (13 tables) - Référence technique |
| [`consoleserveur.md`](architecture/consoleserveur.md) | Logs et configurations serveur |

**Quand consulter** :
- Pour comprendre la structure des tables (héros, missions, dialogues, saves)
- Avant d'ajouter/modifier une table Prisma
- Pour comprendre l'architecture deux-database (contenu vs saves)

**Note** : Pour l'état actuel de la migration DB, voir [`etat-du-projet.md`](etat-du-projet.md) section "État de la Base de Données".

---

## 🗺️ Roadmaps de développement

**Dossier** : `roadmaps/`

Feuilles de route pour l'intégration du contenu curator.

| Fichier | Description |
|---------|-------------|
| [`roadmap-dev-curatorV2.md`](roadmaps/roadmap-dev-curatorV2.md) | Roadmap côté DEV pour intégrer le contenu curator |

**Quand consulter** :
- Pour préparer les structures DB avant génération de contenu
- Pour comprendre le workflow Dev ↔ Curator

**Note** : Les anciennes roadmaps et plans de refactoring ont été consolidés dans [`etat-du-projet.md`](etat-du-projet.md) qui documente l'état réel du projet au 24 novembre 2025.

---

## 🎨 Pipeline Curator (IA)

**Dossier** : `curator/`

Documentation complète du système de génération de contenu par IA.

| Fichier | Description |
|---------|-------------|
| [`roadmap-curator-projet.md`](curator/roadmap-curator-projet.md) | **Comment CONSTRUIRE le curator** (architecture, tech stack, sprints) |
| [`curator-specs-contenu.md`](curator/curator-specs-contenu.md) | **Ce que le curator doit GÉNÉRER** (héros, missions, dialogues) |
| [`workflow-curator-dev.md`](curator/workflow-curator-dev.md) | Workflow complet Curator → Dev |

**Quand consulter** :
- `roadmap-curator-projet.md` : Pour construire l'application curator (Ollama, Stable Diffusion, Docker)
- `curator-specs-contenu.md` : Cahier des charges du contenu à générer (style, contraintes, exemples)
- `workflow-curator-dev.md` : Comprendre le flux de données curator → DB → jeu

**Important** : Le curator génère le contenu narratif/visuel, nous créons les mécaniques de jeu.

---

## ⚙️ Configuration & Setup

**Dossier** : `setup/`

Guides d'installation et configuration des outils.

| Fichier | Description |
|---------|-------------|
| [`supabase-setup.md`](setup/supabase-setup.md) | Configuration Supabase (projets DEV/PROD, credentials) |
| [`prisma-setup.md`](setup/prisma-setup.md) | Configuration Prisma (DATABASE_URL, migrations) |

**Quand consulter** :
- Lors du setup initial du projet
- Pour récupérer les credentials Supabase
- Avant de lancer des migrations Prisma

---

## 🔧 Refactoring & Validation

**Dossier** : `refactoring/`

Validations de sprints et historiques de refactoring.

| Fichier | Description |
|---------|-------------|
| [`sprint2-validation.md`](refactoring/sprint2-validation.md) | Validation Sprint 2 (API routes, tests SQL) |

**Quand consulter** :
- Pour voir les validations de sprints passés

**Note** : Les plans de refactoring et analyses de dette technique ont été consolidés dans [`etat-du-projet.md`](etat-du-projet.md) sections "Gaps & Limitations" et "Recommandations Priorisées".

---

## 🎯 Guides rapides par tâche

### Je débute sur le projet
1. **[`etat-du-projet.md`](etat-du-projet.md)** - Lire le résumé exécutif (section 1)
2. [`setup/supabase-setup.md`](setup/supabase-setup.md) - Configurer Supabase
3. [`setup/prisma-setup.md`](setup/prisma-setup.md) - Configurer Prisma

### Je veux comprendre le code actuel
1. **[`etat-du-projet.md`](etat-du-projet.md)** - Architecture complète (sections 2-4)
2. [`architecture/database.md`](architecture/database.md) - Schéma des 13 tables
3. `.github/copilot-instructions.md` - Patterns de code

### Je veux développer une feature
1. **[`etat-du-projet.md`](etat-du-projet.md)** - Voir "Recommandations Priorisées"
2. [`architecture/database.md`](architecture/database.md) - Vérifier le schéma DB
3. `app/components/village/README.md` - Patterns composants (si UI)

### Je veux configurer le projet
1. [`setup/supabase-setup.md`](setup/supabase-setup.md) - Configurer Supabase
2. [`setup/prisma-setup.md`](setup/prisma-setup.md) - Configurer Prisma
3. **[`etat-du-projet.md`](etat-du-projet.md)** - Section "État de la Base de Données"

### Je veux générer du contenu avec l'IA
1. [`curator/roadmap-curator-projet.md`](curator/roadmap-curator-projet.md) - Construire le curator
2. [`curator/curator-specs-contenu.md`](curator/curator-specs-contenu.md) - Specs du contenu
3. [`curator/workflow-curator-dev.md`](curator/workflow-curator-dev.md) - Intégrer le contenu

### Je veux corriger un bug ou refactorer
1. **[`etat-du-projet.md`](etat-du-projet.md)** - Voir "Gaps & Limitations Identifiés"
2. [`architecture/database.md`](architecture/database.md) - Vérifier la logique DB
3. `.github/copilot-instructions.md` - Patterns à respecter

---

## 📊 Métriques du projet (24 novembre 2025)

**Codebase** :
- ~7,425 lignes de code TypeScript/TSX
- 44 fichiers (12 API routes, 24 composants, 8 utils/types)
- GameContext : 803 lignes (état global du jeu)

**Base de données** :
- 13 tables Prisma opérationnelles
- 8 tables contenu (gérées par curator)
- 5 tables sauvegarde (gérées par jeu)

**Contenu actuel** :
- 5 héros (descriptions à enrichir)
- 15 missions (4 jour 1, 5 jour 2, 6 jour 3)
- 3 dialogues jour 1 (manque jours 2-3)
- 5 bâtiments (tous avec 3 niveaux)

**Documentation** :
- 1 audit complet (`etat-du-projet.md` - 900+ lignes)
- 7 documents techniques actifs
- 3 dossiers organisés (architecture, setup, curator)

**Sprints Complétés** :
- ✅ Sprint 0 : Setup Supabase + Prisma (13 tables créées)
- ✅ Sprint 1 : Migration données vers DB (5 héros, 15 missions)
- ✅ Sprint 5C : Refactor VillageModal (-70% lignes)

**Pour métriques détaillées** : Voir [`etat-du-projet.md`](etat-du-projet.md) section "Métriques du Projet".

---

## 🔗 Liens externes

- **Supabase Dashboard DEV** : https://supabase.com/dashboard/project/hfusvyadhtmviezelabi
- **Supabase Dashboard PROD** : https://supabase.com/dashboard/project/hucuamdwunhstiiotwkv
- **Repository GitHub** : morepudding/medievaldispatch

---

## 📝 Notes importantes

### Architecture en 2 projets
1. **Medieval Dispatch** (ce projet) : Jeu Next.js, lit la DB
2. **Curator** (à créer) : Application IA locale, écrit dans la DB

### Séparation des responsabilités
- **Tables contenu** (`heroes`, `missions`, etc.) : Curator en écriture, jeu en lecture
- **Tables save** (`game_saves`, `player_*`) : Jeu uniquement

### Workflow typique
```
1. Dev crée structure DB (Prisma schema)
2. Dev crée placeholders en DB
3. Curator enrichit contenu (UPDATE SQL direct)
4. Dev intègre contenu dans UI
5. Jeu lit et affiche le contenu
```

---

## 🔄 Historique des Consolidations

**24 novembre 2025** : Consolidation majeure de la documentation
- ✅ Création de `etat-du-projet.md` (audit complet 900+ lignes)
- ✅ Suppression de 5 fichiers obsolètes :
  - `roadmaps/roadmap.md` (784 lignes) → consolidé dans etat-du-projet.md
  - `roadmaps/roadmap-refactoring.md` (1,451 lignes) → consolidé
  - `architecture/databaseroadmap.md` (744 lignes) → consolidé
  - `refactoring/refactoring.md` (775 lignes) → consolidé
  - `refactoring/analyserefactoring.md` → consolidé
- ✅ README.md mis à jour avec liens vers document principal

**Bénéfices** :
- Source de vérité unique (`etat-du-projet.md`)
- Pas de confusion entre docs obsolètes et état réel
- Métriques précises au 24 novembre 2025

---

**Dernière organisation** : 24 novembre 2025  
**Structure créée par** : GitHub Copilot  
**Statut** : ✅ Documentation consolidée et à jour
