# Spécifications Curator - Medieval Dispatch

Ce dossier contient les spécifications de contenu à générer par le système Curator.

## 📁 Structure

```
specs/
  curator-spec-heroes-enrichment.md     ← Sprint 1 (5 héros, 30 images)
  curator-spec-dialogues-day1.md        ← Sprint 2 (À venir)
  curator-spec-missions-enrichment.md   ← Sprint 3 (À venir)
  curator-spec-buildings-atmosphere.md  ← Sprint 4 (À venir)
```

## 🔄 Workflow

1. **Dev** crée une spec `.md` avec :
   - Contexte narratif minimal (information seulement)
   - Placeholders actuels en DB (IDs, slugs)
   - Structure DB technique à remplir (champs, types, contraintes)
   - Format de sortie JSON exact

2. **Curator** (liberté créative totale) génère :
   - Contenu textuel enrichi (OpenLLaMA)
   - Images multi-résolutions (Stable Diffusion)
   - JSON structuré + assets organisés

3. **Dev** importe le contenu :
   - Valide le JSON
   - Upload assets vers Supabase Storage
   - Exécute script d'import Prisma/SQL
   - Teste en jeu
   - Feedback si problèmes techniques uniquement

## 📋 Specs Disponibles

### ✅ curator-spec-heroes-enrichment.md
**Statut** : 🟢 Spec complète - Prêt pour génération  
**Priorité** : 🔴 CRITIQUE  
**Contenu** :
- 5 personnages D&D 5e complets à enrichir (Bjorn, Owen, Vi, Durun, Elira)
- Structure D&D : 6 stats (STR, DEX, CON, INT, WIS, CHA), race, classe, background, traits de personnalité
- 7 champs textuels par héros (description, lore, voice, secret, arc_day1/2/3)
- 6 images par héros (5 portraits émotionnels + 1 icône)
- **Total** : 30 images, ~35 textes narratifs, 5 personnages D&D

**Base de données** :
- ✅ Migration `add_dnd_character_structure` appliquée (24 nov 2025)
- ✅ Table `hero_image_variants` créée
- ✅ Schema Prisma mis à jour avec champs D&D

**Livrables attendus** :
- `curator-output-heroes-enrichment-YYYY-MM-DD.json`
- `assets/heroes/{slug}/portraits/` (5 images par héros, 1024x1024, <500KB)
- `assets/heroes/{slug}/icons/` (1 icône par héros, 256x256, <100KB)

---

### 🔜 curator-spec-dialogues-day1.md
**Statut** : 📝 À créer  
**Priorité** : 🟡 IMPORTANTE  
**Contenu prévu** :
- 3 dialogues existants à enrichir (Bjorn, Owen, Vi jour 1)
- 2 nouveaux dialogues à créer (Durun, Elira jour 1)
- Chaque dialogue : 5-10 échanges hero/player
- Attribution portraits émotionnels appropriés

---

### 🔜 curator-spec-missions-enrichment.md
**Statut** : 📝 À créer  
**Priorité** : 🟡 IMPORTANTE  
**Contenu prévu** :
- 15 missions existantes à enrichir (4 jour1, 5 jour2, 6 jour3)
- Descriptions immersives
- NPCs impliqués
- Textes de résolution narratifs (success/failure)

---

### 🔜 curator-spec-buildings-atmosphere.md
**Statut** : 📝 À créer  
**Priorité** : 🟢 MOYENNE  
**Contenu prévu** :
- 5 bâtiments existants (Forge, Hôtel de Ville, Marché, Auberge, Tour)
- NPCs uniques par bâtiment
- Descriptions atmosphériques
- Secrets/easter eggs

---

## 🎨 Standards de Génération

### Style Visuel
- **Type** : Semi-réaliste (mix illustration/peinture numérique)
- **Inspiration** : Pathfinder, Divinity Original Sin 2, Dragon Age
- **Palette** : Couleurs riches et saturées
- **Cohérence** : Même style pour tous les héros

### Ton Narratif
- **Genre** : Médiéval-fantastique épique mais accessible
- **Mood** : Héroïsme du quotidien, pas "sauveur du monde"
- **Profondeur** : Backstories riches sans être trop sombres
- **Humour** : Présent mais pas dominant

### Contraintes Techniques
- **Images** : WebP optimisé, max 500KB (portraits) / 100KB (icônes)
- **Textes** : UTF-8, pas de caractères spéciaux problématiques
- **JSON** : Valide, conforme aux schémas fournis
- **Nomenclature** : `{slug}-{type}-{resolution}-{emotion}.webp`

---

## 📊 Tracking

| Spec | Statut | Héros | Dialogues | Missions | Images | DB Ready | Progression |
|------|--------|-------|-----------|----------|--------|----------|-------------|
| heroes-enrichment | 🟢 Spec complète | 5 | - | - | 30 | ✅ | Prêt génération |
| dialogues-day1 | 📝 À créer | - | 5 | - | 0 | ⏳ | 0% |
| missions-enrichment | 📝 À créer | - | - | 15 | 0 | ⏳ | 0% |
| buildings-atmosphere | 📝 À créer | - | - | - | 0 | ⏳ | 0% |

---

## 🔗 Ressources

- **Workflow complet** : `docs/curator/workflow-dev-curator.md`
- **Schema Prisma** : `prisma/schema.prisma`
- **Architecture DB** : `docs/architecture/database.md`
- **Exemples sorties** : `docs/curator/examples/` (à venir)

---

**Dernière mise à jour** : 24 novembre 2025
