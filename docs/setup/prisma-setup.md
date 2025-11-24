# Medieval Dispatch - Prisma Configuration

## 📦 Installation effectuée

✅ Prisma et Prisma Client installés
✅ Schéma Prisma créé avec 13 tables
✅ Configuration Supabase ajoutée

## 🗄️ Structure du schéma

### Tables de Contenu (CMS)
1. **heroes** - Héros jouables (5 initialement)
2. **hero_images** - Images des héros (portraits, émotions)
3. **locations** - Lieux sur la carte (~4 lieux)
4. **missions** - Missions disponibles (~15 missions)
5. **dialogues** - Dialogues avec héros (3 dialogues)
6. **dialogue_exchanges** - Échanges dans les dialogues
7. **buildings** - Bâtiments constructibles (5 bâtiments)
8. **building_levels** - Niveaux des bâtiments

### Tables de Sauvegarde (Jeu)
9. **game_saves** - Sauvegardes de partie
10. **player_heroes** - État des héros par sauvegarde
11. **player_buildings** - État des bâtiments par sauvegarde
12. **player_dialogues** - Dialogues lus
13. **mission_completions** - Missions complétées

## ⚙️ Configuration nécessaire

### 1. Récupérer le mot de passe de la base de données

Va sur le dashboard Supabase :
👉 https://supabase.com/dashboard/project/hfusvyadhtmviezelabi/settings/database

Copie le mot de passe de la base de données.

### 2. Mettre à jour `.env.local`

Décommente et complète ces lignes dans `.env.local` :

```bash
DATABASE_URL="postgresql://postgres.hfusvyadhtmviezelabi:[TON-MOT-DE-PASSE]@aws-0-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.hfusvyadhtmviezelabi:[TON-MOT-DE-PASSE]@aws-0-eu-west-3.pooler.supabase.com:5432/postgres"
```

## 🚀 Prochaines étapes

### 1. Appliquer le schéma à Supabase

Une fois le mot de passe configuré :

```bash
# Créer la première migration
npx prisma migrate dev --name init

# Ou générer le SQL pour application manuelle
npx prisma migrate dev --create-only --name init
```

### 2. Générer le client Prisma

```bash
npx prisma generate
```

### 3. Vérifier la connexion

```bash
npx prisma studio
```

Cela ouvrira une interface web pour explorer ta base de données.

## 📝 Notes importantes

- **DATABASE_URL** : Utilise le connection pooler (port 6543) pour les requêtes normales
- **DIRECT_URL** : Connexion directe (port 5432) nécessaire pour les migrations
- Les deux URLs sont nécessaires pour Prisma avec Supabase
- Le schéma est prêt pour Sprint 1 (création des tables)

## 🔄 Migration vers Sprint 1

Une fois les tables créées, Sprint 1 consistera à :
1. Créer des seeds de test
2. Créer le projet CMS (medieval-cms)
3. Implémenter les interfaces CRUD
4. Uploader les images existantes vers Supabase Storage

---

**Dernière mise à jour** : 23 novembre 2025
