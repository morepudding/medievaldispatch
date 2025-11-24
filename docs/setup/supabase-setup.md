# 🗄️ Configuration Supabase - Medieval Dispatch

## ✅ Projets créés

Deux projets Supabase ont été créés avec succès le 23 novembre 2025.

---

## 🔧 Projet DEV (Développement)

### Informations générales
- **Nom** : `medieval-dispatch-dev`
- **ID** : `hfusvyadhtmviezelabi`
- **Région** : `eu-west-3` (Paris)
- **Status** : `ACTIVE_HEALTHY` ✅
- **PostgreSQL** : v17.6.1
- **Date de création** : 20 novembre 2025

### URLs et Endpoints
- **URL API** : `https://hfusvyadhtmviezelabi.supabase.co`
- **Database Host** : `db.hfusvyadhtmviezelabi.supabase.co`
- **Dashboard** : `https://supabase.com/dashboard/project/hfusvyadhtmviezelabi`

### Clés d'API
```env
NEXT_PUBLIC_SUPABASE_URL=https://hfusvyadhtmviezelabi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmdXN2eWFkaHRtdmllemVsYWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Nzk1NDIsImV4cCI6MjA3OTI1NTU0Mn0.lAhJ_C7Q44YqmqbD39F54N5HGdKSaj6eVfxEu7Keh4k
```

---

## 🚀 Projet PROD (Production)

### Informations générales
- **Nom** : `medieval-dispatch-prod`
- **ID** : `hucuamdwunhstiiotwkv`
- **Région** : `eu-west-3` (Paris)
- **Status** : `ACTIVE_HEALTHY` ✅
- **PostgreSQL** : v17.6.1
- **Date de création** : 20 novembre 2025

### URLs et Endpoints
- **URL API** : `https://hucuamdwunhstiiotwkv.supabase.co`
- **Database Host** : `db.hucuamdwunhstiiotwkv.supabase.co`
- **Dashboard** : `https://supabase.com/dashboard/project/hucuamdwunhstiiotwkv`

### Clés d'API
```env
NEXT_PUBLIC_SUPABASE_URL=https://hucuamdwunhstiiotwkv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Y3VhbWR3dW5oc3RpaW90d2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Nzk1NTYsImV4cCI6MjA3OTI1NTU1Nn0.59q62-d1DwzgLsDBlnI1ziFPwAC_fMN7qsgd7-8gOxk
```

---

## 📝 Configuration du projet Medieval Dispatch

### 1. Créer le fichier `.env.local` (pour dev local)

```bash
# Supabase DEV
NEXT_PUBLIC_SUPABASE_URL=https://hfusvyadhtmviezelabi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmdXN2eWFkaHRtdmllemVsYWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Nzk1NDIsImV4cCI6MjA3OTI1NTU0Mn0.lAhJ_C7Q44YqmqbD39F54N5HGdKSaj6eVfxEu7Keh4k

# Pour les migrations et opérations admin (à récupérer du dashboard)
SUPABASE_SERVICE_ROLE_KEY=<à_récupérer_du_dashboard>
```

### 2. Configuration Prisma

Créer/mettre à jour `prisma/schema.prisma` :

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// Les modèles seront ajoutés dans le Sprint 1
```

Dans `.env.local`, ajouter :

```bash
# Connection pooling via Supavisor
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.hfusvyadhtmviezelabi.supabase.co:6543/postgres?pgbouncer=true"

# Direct connection (pour migrations)
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.hfusvyadhtmviezelabi.supabase.co:5432/postgres"
```

**Note** : Le mot de passe est disponible dans le dashboard Supabase, section "Project Settings > Database".

---

## 🚀 Configuration Vercel

### Variables d'environnement à ajouter dans Vercel

#### Pour le projet Medieval Dispatch (jeu) :

**Development** :
- `NEXT_PUBLIC_SUPABASE_URL` = `https://hfusvyadhtmviezelabi.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmdXN2eWFkaHRtdmllemVsYWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Nzk1NDIsImV4cCI6MjA3OTI1NTU0Mn0.lAhJ_C7Q44YqmqbD39F54N5HGdKSaj6eVfxEu7Keh4k`

**Production** :
- `NEXT_PUBLIC_SUPABASE_URL` = `https://hucuamdwunhstiiotwkv.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Y3VhbWR3dW5oc3RpaW90d2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Nzk1NTYsImV4cCI6MjA3OTI1NTU1Nn0.59q62-d1DwzgLsDBlnI1ziFPwAC_fMN7qsgd7-8gOxk`

---

## 🛠️ Commandes MCP Supabase utiles

### Vérifier le statut des projets
```bash
# Via MCP Supabase
mcp_supabase_get_project --id hfusvyadhtmviezelabi  # DEV
mcp_supabase_get_project --id hucuamdwunhstiiotwkv  # PROD
```

### Lister les tables
```bash
mcp_supabase_list_tables --project_id hfusvyadhtmviezelabi
```

### Exécuter du SQL
```bash
mcp_supabase_execute_sql --project_id hfusvyadhtmviezelabi --query "SELECT version();"
```

### Voir les logs
```bash
mcp_supabase_get_logs --project_id hfusvyadhtmviezelabi --service postgres
```

---

## 📦 Prochaines étapes (Sprint 1)

1. **Installer Prisma dans le projet**
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

2. **Configurer le schéma Prisma**
   - Créer les modèles Hero, HeroImage, Location, Mission, etc.
   - Définir les relations

3. **Créer les migrations**
   ```bash
   npx prisma migrate dev --name init_heroes
   ```

4. **Appliquer via MCP**
   ```bash
   mcp_supabase_apply_migration --project_id hfusvyadhtmviezelabi --name init_heroes --query "..."
   ```

5. **Créer les buckets Storage**
   - `hero-images` pour les portraits de héros
   - `location-images` pour les images de lieux

---

## 🔒 Sécurité

### À faire avant la production :

1. **Récupérer la Service Role Key** depuis le dashboard Supabase
2. **Ne jamais commiter** les clés dans Git
3. **Utiliser les variables d'environnement** Vercel
4. **Configurer Row Level Security (RLS)** sur les tables sensibles
5. **Limiter les permissions** de l'anon key

---

## 📚 Ressources

- **Dashboard Dev** : https://supabase.com/dashboard/project/hfusvyadhtmviezelabi
- **Dashboard Prod** : https://supabase.com/dashboard/project/hucuamdwunhstiiotwkv
- **Documentation Supabase** : https://supabase.com/docs
- **Documentation Prisma** : https://www.prisma.io/docs

---

## ✅ Sprint 0 - Checklist

- [x] Créer projet Supabase DEV
- [x] Créer projet Supabase PROD
- [x] Récupérer les URLs et clés d'API
- [x] Documenter la configuration
- [x] Installer Prisma dans le projet
- [x] Créer le schéma Prisma complet (13 tables)
- [x] Configurer .env.local
- [x] Appliquer les migrations sur Supabase DEV (13 tables créées)
- [ ] Créer le repo Git pour le CMS
- [ ] Connecter Medieval Dispatch à Vercel
- [ ] Configurer les variables d'environnement Vercel

**Date de création** : 23 novembre 2025  
**Status** : ✅ Sprint 0 terminé ! 13 tables créées sur Supabase DEV

## 📊 Tables créées (Sprint 1 complété)

### Tables de Contenu (8)
1. ✅ **heroes** - 13 colonnes
2. ✅ **hero_images** - 6 colonnes
3. ✅ **locations** - 9 colonnes
4. ✅ **missions** - 21 colonnes
5. ✅ **dialogues** - 6 colonnes
6. ✅ **dialogue_exchanges** - 8 colonnes
7. ✅ **buildings** - 7 colonnes
8. ✅ **building_levels** - 7 colonnes

### Tables de Sauvegarde (5)
9. ✅ **game_saves** - 8 colonnes
10. ✅ **player_heroes** - 12 colonnes
11. ✅ **player_buildings** - 6 colonnes
12. ✅ **player_dialogues** - 4 colonnes
13. ✅ **mission_completions** - 5 colonnes
