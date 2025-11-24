# 📝 Curator - Cahier des charges du contenu à générer

**Date** : 24 novembre 2025  
**Version** : 1.0  
**Statut** : Spécifications pour le curator

---

## 📋 Vue d'ensemble

Ce document définit **ce que le curator doit générer** pour enrichir Medieval Dispatch. Le curator est une application IA qui lit le contenu placeholder dans la DB et le remplace par du contenu narratif riche.

### Principe de génération

Chaque type de contenu se génère en **3 niveaux progressifs** :

**Niveau 1 - Fondations** : Style global, ton, contraintes  
**Niveau 2 - Variétés** : Types, catégories, archétypes  
**Niveau 3 - Variations** : Instances finales avec détails uniques

---

## 🎯 État actuel de la base de données

### Contenu existant (placeholders à enrichir)

**5 Héros** :
- Bjorn le Vaillant (Guerrier, strength 18)
- Owen le Roublard (Voleur, stealth 16)
- Vi la Sage (Mage, intelligence 15)
- Durun le Robuste (Artisan, strength 14)
- Elira la Diplomate (Diplomate, diplomacy 17)

**Problèmes actuels** :
- ❌ Descriptions génériques ("un héros de Medieval Dispatch")
- ❌ Lore ridicule ("est prêt à servir votre village")
- ❌ Pas de relations entre héros
- ❌ Pas de personnalité définie

**15 Missions** :
- Jour 1 : 4 missions (escorte, cueillette, patrouille, exploration)
- Jour 2 : 5 missions (investigation, diplomatie, combat, défense, sauvetage)
- Jour 3 : 6 missions (boss, climax, révélations)

**Problèmes actuels** :
- ⚠️ Descriptions trop génériques
- ⚠️ Pas de connexion narrative entre missions
- ⚠️ Textes success/failure basiques

**3 Dialogues** :
- Bjorn jour 1, Owen jour 1, Vi jour 2

**Problèmes actuels** :
- ❌ Manque Durun et Elira
- ❌ Seulement 3 dialogues sur 12 nécessaires (3 jours × 4 héros minimum)

**5 Bâtiments** :
- Forge, Hôtel de Ville, Marché, Auberge, Tour de Garde

**Problèmes actuels** :
- ❌ Descriptions ultra-basiques ("La forge résonne du bruit des marteaux")

---

## 🎨 PHASE 1 : Héros (5 héros à enrichir)

### Objectif
Transformer les placeholders en personnages profonds avec backstory, personnalité, relations, et voice.

### Niveau 1 : Fondations (Style global)

**Guidelines d'écriture** :
- Ton : Médiéval-fantastique mature (inspiration : The Witcher 3, Dragon Age, Baldur's Gate 3)
- Pas de clichés ("héros courageux", "sage puissant")
- Personnages avec nuances, faiblesses, secrets
- Montrer la personnalité par actions/dialogues (show don't tell)

**Contraintes techniques** :
- Description : 150-200 mots
- Lore : 300-400 mots
- Voice : 2-3 phrases descriptives
- Relations : 50-80 mots par héros (× 4 autres)

### Niveau 2 : Archétypes (Types de héros)

**5 Archétypes à développer** :

1. **Le Guerrier pragmatique** (Bjorn)
   - Force brute + expérience de combat
   - Trauma de guerre caché
   - Méfiance envers la magie
   - Relation complexe avec Owen (ancien compagnon)

2. **Le Voleur charismatique** (Owen)
   - Intelligence de rue + débrouillardise
   - Passé mystérieux (noble déchu ?)
   - Cache sa vraie identité
   - Tension avec Vi (elle sait quelque chose)

3. **La Mage énigmatique** (Vi)
   - Puissance magique dangereuse
   - Cherche à contrôler son pouvoir
   - Secret sur l'origine des attaques
   - Isolement volontaire

4. **L'Artisan terre-à-terre** (Durun)
   - Pragmatisme extrême
   - Mépris pour "l'aventure romantique"
   - Cache une invention dangereuse
   - Respect pour Bjorn (guerriers = outils)

5. **La Diplomate observatrice** (Elira)
   - Manipulation subtile
   - Stratège politique
   - Doute sur la loyauté du village
   - Méfiance envers Owen (trop charmeur)

### Niveau 3 : Instances (Contenu final par héros)

**Pour CHAQUE héros, générer** :

#### A) Description enrichie (150-200 mots)

**Format attendu** :
```
Physique détaillé (visage, cicatrices, posture, vêtements)
+ Première impression (comment il se présente aux autres)
+ Trait dominant (ce qui saute aux yeux)
+ Contradiction (détail qui surprend)
```

**Exemple pour Bjorn** :
```
Bjorn Hache-de-Fer se tient comme un mur de pierre, chaque muscle tendu par des années de combat. Sa barbe courte cache mal les cicatrices qui lacèrent sa mâchoire - souvenirs d'une embuscade qu'il refuse de raconter. Ses yeux gris, toujours en alerte, trahissent une fatigue profonde que même l'hydromel ne parvient plus à noyer. Il porte sa hache de guerre comme d'autres portent un bâton de marche, naturellement, presque distraitement. Mais observez ses mains quand quelqu'un mentionne la magie : elles se crispent imperceptiblement, révélant une peur qu'il nierait avec violence. Bjorn ne parle que par phrases courtes, comme s'il économisait ses mots pour un moment crucial. Quand il sourit, c'est toujours d'un seul côté - l'autre moitié de son visage reste figée, incapable d'exprimer la joie. Les villageois le respectent, mais peu osent l'approcher. Il dégage une aura de violence contenue, un orage perpétuellement sur le point d'éclater.
```

#### B) Lore profond (300-400 mots)

**Structure attendue** :
1. **Origines** (d'où vient-il, famille, formation)
2. **Événement traumatique** (ce qui l'a changé)
3. **Motivation cachée** (pourquoi est-il vraiment là)
4. **Secret** (ce qu'il cache aux autres)
5. **Arc narratif** (où va son histoire)

**Exemple pour Owen** :
```
Owen n'a jamais révélé son vrai nom. "Le Roublard" est un surnom qu'il a accepté avec un sourire en coin, comme on accepte un déguisement pratique. Mais ceux qui regardent attentivement remarqueront les détails : la façon dont il tient une fourchette (éducation noble), son vocabulaire choisi quand il oublie de jouer son personnage, les cicatrices de fouet dans son dos qu'il cache sous des chemises à manches longues.

Il était le troisième fils du Baron de Ravencrest, condamné à une vie de prêtre ou de conseiller. Jusqu'au jour où il découvrit les vrais registres comptables de son père - la fortune familiale bâtie sur la traite d'esclaves, les alliances politiques scellées par des assassinats, les villages "pacifiés" par la famine organisée. Owen commit l'erreur de confronter son père. La réponse fut immédiate : accusation publique de vol, vingt coups de fouet sur la place du marché, bannissement. Son père lui murmura à l'oreille pendant la punition : "Si tu reviens, je t'écorche vivant. Si tu parles, je brûle tout le village qui t'abritera."

Owen a appris à survivre dans les rues, à voler, à mentir, à charmer. Mais sa véritable obsession reste la même : réunir assez de preuves pour détruire la maison Ravencrest. Chaque mission, chaque contact, chaque information glanée sert ce but unique. Quand il voit Bjorn - soldat loyal, croyant en l'honneur militaire - il ressent un mélange de jalousie et de mépris. Comment peut-on encore croire en ces idéaux après avoir vu ce qu'Owen a vu ?

Vi semble avoir percé son secret. Elle ne dit rien, mais parfois, il surprend son regard - un mélange de pitié et de compréhension. Ça le terrifie plus que n'importe quelle menace. Si elle parle, tout s'effondre.
```

#### C) Voice (ton de dialogue, 2-3 phrases)

**Exemple pour Durun** :
```
Durun parle comme on forge le fer : précis, économe, sans fioritures. Ses phrases tombent comme des coups de marteau, lourdes de pragmatisme. Il interrompt souvent les explications longues par un "Bref" impatient, pressé d'arriver aux faits concrets.
```

#### D) Relations avec les 4 autres héros (50-80 mots chacune)

**Format** :
```json
{
  "bjorn": "Nature de la relation + raison + tension ou complicité",
  "owen": "...",
  "vi": "...",
  "durun": "...",
  "elira": "..."
}
```

**Exemple pour Vi → Bjorn** :
```
Vi observe Bjorn avec une fascination clinique, comme un phénomène naturel. Sa peur de la magie l'intrigue - elle y voit le symptôme d'une blessure plus profonde qu'une simple méfiance. Elle aimerait comprendre ce qui s'est passé pour graver une telle terreur dans un homme aussi solide. Mais elle garde ses distances : Bjorn est imprévisible, et sa hache tranche plus vite que la raison. Une fois, elle a tenté de le soigner magiquement après une blessure. Il a hurlé comme si elle le brûlait vif. Depuis, ils maintiennent un périmètre de sécurité mutuel.
```

---

## 🗣️ PHASE 2 : Dialogues (12 dialogues à créer/améliorer)

### Objectif
Créer des échanges character-driven qui font avancer le lore global et révèlent la personnalité des héros.

### Niveau 1 : Fondations (Style dialogue)

**Guidelines** :
- Pas d'exposition maladroite ("Comme tu le sais, Bjorn...")
- Montrer la personnalité PAR le dialogue (langage, rythme, réactions)
- Sous-texte : ce qui n'est PAS dit est important
- Émotions progressives : neutral → surprised → angry, etc.

**Contraintes techniques** :
- 4-7 échanges par dialogue
- Alternance hero/player pour créer du rythme
- Émotions disponibles : neutral, happy, sad, angry, surprised

### Niveau 2 : Types de dialogues

**4 Catégories** :

1. **Introduction héros** (Jour 1)
   - Révèle personnalité de base
   - Hook narratif personnel
   - Établit la voice

2. **Développement** (Jour 2)
   - Approfondit relations
   - Révélations partielles
   - Connexions entre héros

3. **Climax** (Jour 3)
   - Révélations majeures
   - Choix moraux
   - Résolution d'arc

4. **Ambient/Réactions** (Optionnel)
   - Commentaires mission
   - Réactions à événements
   - Flavour character

### Niveau 3 : Instances (Dialogues finaux)

**À créer** :

#### Jour 1 (4 dialogues - 1 par héros manquant + 2 enrichissements)

**1. Dialogue Durun jour 1** (CRÉER - Introduction)

**Setup** :
```
Titre: "L'Arme Brisée"
Contexte: Durun examine une arme trouvée après une attaque de brigands
Hook: L'arme n'est pas d'origine locale - quelqu'un arme les brigands
```

**Échanges (6)** :
```
1. [Durun, neutral] "Hmm. Cette lame. Regarde les marques de forge."
2. [Player] "Quelque chose ne va pas ?"
3. [Durun, surprised] "Elle vient de Forgehaut. Acier royal. Les brigands n'ont pas les moyens."
4. [Player] "Quelqu'un les finance ?"
5. [Durun, angry] "Ou quelqu'un les équipe. Écoute : si tu trouves d'autres armes, rapporte-les. Je veux comprendre."
6. [Player] "Tu penses que c'est grave ?"
7. [Durun, neutral] "Bref. Soit c'est un vol organisé, soit c'est pire. Fais attention là-bas."
```

**2. Dialogue Elira jour 1** (CRÉER - Introduction)

**Setup** :
```
Titre: "Regards en Coin"
Contexte: Elira observe les villageois pendant le marché
Hook: Elle remarque des comportements suspects - peur inhabituelle
```

**Échanges (7)** :
```
1. [Elira, neutral] "Vous avez remarqué comment les gens parlent depuis ce matin ?"
2. [Player] "Ils ont peur des brigands, non ?"
3. [Elira, surprised] "Ils avaient peur AVANT les attaques. Regardez Aldric - il sursaute au moindre bruit."
4. [Player] "Tu penses qu'ils savent quelque chose ?"
5. [Elira, neutral] "Je pense qu'ils ont entendu quelque chose. Rumeurs. Avertissements. Peut-être des menaces."
6. [Player] "On devrait les interroger ?"
7. [Elira, sad] "Non. Pas encore. S'ils ont peur de parler, c'est qu'on les surveille. Agissons d'abord. Observons."
8. [Player] "Tu es sûre ?"
9. [Elira, neutral] "En diplomatie, le silence en dit long. Laissons-les se trahir eux-mêmes."
```

**3. Dialogue Bjorn jour 1** (AMÉLIORER l'existant)

**Actuel (problème)** :
```
Trop expositif : "J'ai vu des traces dans la forêt"
Manque de personnalité Bjorn
```

**Amélioration attendue** :
```
1. [Bjorn, neutral] *Bjorn nettoie sa hache sans lever les yeux* "La forêt. T'y vas quand ?"
2. [Player] "Dès que tu m'en dis plus."
3. [Bjorn, angry] *Il crache par terre* "Y'a des traces. Trop organisées. Trop propres."
4. [Player] "Des brigands ?"
5. [Bjorn, surprised] "Des brigands qui effacent leurs traces ? Qui patrouillent en formation ? Non. C'est militaire."
6. [Player] "Tu penses à des soldats ?"
7. [Bjorn, neutral] *Il regarde enfin le joueur* "Je pense à des gens entraînés. Ce qui est pire que des brigands affamés."
```

**4. Dialogue Owen jour 1** (AMÉLIORER l'existant)

**Actuel (problème)** :
```
Manque de charisme d'Owen
Pas de sous-texte
```

**Amélioration attendue** :
```
1. [Owen, happy] *Sourire en coin* "Alors, on joue les héros ?"
2. [Player] "Quelqu'un doit le faire."
3. [Owen, neutral] *Le sourire disparaît* "Méfie-toi des 'quelqu'un'. Souvent, c'est un piège."
4. [Player] "Tu as une autre suggestion ?"
5. [Owen, surprised] "J'ai des INFORMATIONS. Des marchands qui disparaissent. Des patrouilles qui ne rentrent jamais. Et surtout : personne ne pose de questions."
6. [Player] "Parce qu'ils ont peur ?"
7. [Owen, sad] *Regarde ailleurs* "Ou parce qu'ils savent déjà. Ce village cache des choses. Je compte sur toi pour les découvrir."
```

#### Jour 2 (2-3 dialogues - développements)

**5. Dialogue Vi jour 2** (AMÉLIORER l'existant + révélation)

**Ajout attendu** :
```
Vi révèle qu'elle SENT une présence magique
Connexion avec les attaques
Tension avec Bjorn mentionnée
```

**6. Dialogue Bjorn jour 2** (CRÉER - Révélation trauma)

**Setup** :
```
Après une mission difficile, Bjorn est secoué
Le joueur découvre pourquoi il hait la magie
```

**7. Dialogue Owen-Elira jour 2** (CRÉER - Tension)

**Setup** :
```
Elira confronte Owen sur son passé
Dialogue à 3 (Player observe)
Révèle que Elira SAIT qu'Owen ment
```

#### Jour 3 (2-3 dialogues - climax)

**8-10. Dialogues résolution** (CRÉER)
- Révélations finales
- Choix moraux
- Résolution des arcs personnels

---

## ⚔️ PHASE 3 : Missions (15 missions à enrichir)

### Objectif
Transformer missions génériques en morceaux d'un puzzle narratif avec connexions et variantes.

### Niveau 1 : Fondations (Arc narratif global)

**Bible narrative à créer** :

**Menace principale** :
```
[À définir par curator]
Exemple : Culte oublié réveillé / Artefact corrompu / Noble corrompu qui prépare invasion / etc.
```

**Mystère central** :
```
[À définir par curator]
Indices dispersés jour 1 → Connexions jour 2 → Révélation jour 3
```

**Résolution jour 3** :
```
[À définir par curator]
Mission climax avec choix moraux
Conséquences multiples selon héros assignés
```

### Niveau 2 : Types de missions par jour

**Jour 1 (4 missions)** : Indices dispersés
- Escorte marchand → Indice : brigands trop organisés
- Cueillette → Indice : plantes empoisonnées volontairement
- Patrouille → Indice : symboles étranges
- Exploration → Indice : campement abandonné récemment

**Jour 2 (5 missions)** : Connexions
- Investigation → Les indices convergent
- Diplomatie → Découverte de traître potentiel
- Combat → Affrontement avec lieutenant brigand
- Défense → Attaque coordonnée (test)
- Sauvetage → Prisonnier révèle des infos

**Jour 3 (6 missions)** : Révélations + Climax
- 4 missions build-up
- 2 missions climax avec variantes selon héros

### Niveau 3 : Instances (Textes finaux par mission)

**Pour CHAQUE mission, réécrire** :

#### A) Title (évocateur, pas générique)

**Avant** : "Escorte de marchand"
**Après** : "Le Dernier Convoi"

**Avant** : "Patrouille de routine"
**Après** : "Les Symboles Oubliés"

#### B) Description (200-300 mots, hook narratif)

**Format** :
```
Setup (contexte)
+ Détail intrigant (pourquoi cette mission est importante)
+ Question ouverte (hook qui pousse à accepter)
```

**Exemple - "Le Dernier Convoi"** :
```
Aldric le marchand est le dernier à oser la traversée de la Forêt Noire depuis l'augmentation des attaques. Ses concurrents ont tous renoncé, préférant perdre leurs contrats que risquer leurs vies. Mais Aldric semble... différent. Pas téméraire - terrorisé, en fait. Ses mains tremblent quand il charge sa charrette, et il vérifie l'horizon toutes les trente secondes, comme s'il s'attendait à voir surgir quelque chose.

Il prétend transporter des tissus et des épices, mais la façon dont il surveille une caisse particulière, cachée sous une bâche, suggère autre chose. Quand on lui demande ce qu'elle contient, il répond "Des documents. Des papiers commerciaux", avec un regard qui supplie de ne pas insister.

Durun a remarqué quelque chose d'étrange : Aldric a fait réparer les roues de sa charrette hier. Des roues neuves, pour un voyage "commercial". Comme si sa vie en dépendait. Et peut-être que c'est le cas.

La traversée prend deux heures. Les brigands connaissent l'itinéraire. Et si Aldric transporte vraiment ce que vous soupçonnez - des preuves, des informations, quelque chose qui les menace - ils ne le laisseront pas passer vivant.

La question n'est pas "Accepterez-vous cette escorte ?" mais "Qu'est-ce qu'Aldric sait vraiment ?"
```

#### C) Success_text (150-200 mots, conséquences + indice)

**Format** :
```
Résolution immédiate
+ Récompense + réputation
+ Révélation/indice pour suite
+ Unlock nouveau contenu (optionnel)
```

**Exemple - "Le Dernier Convoi" (succès)** :
```
L'embuscade survient au virage du Chêne Mort, exactement comme Aldric le redoutait. Mais cette fois, les brigands trouvent une résistance. Le combat est bref et brutal. Quand la poussière retombe, Aldric s'effondre contre sa charrette, le souffle court, pas de blessure mais du choc pur.

"Vous... vous avez vu ?" balbutie-t-il. "Leurs mouvements. La façon dont ils se sont déployés. Ce ne sont pas des brigands ordinaires."

Il ouvre la caisse secrète avec des mains tremblantes. À l'intérieur : des registres militaires, des cartes de patrouille, des ordres signés avec un sceau que vous ne reconnaissez pas - un corbeau tenant une épée brisée.

"Je les ai volés il y a trois jours," confesse Aldric. "Au campement près des Ruines. Ils préparent quelque chose. Quelque chose de gros. Et je pense... je pense que quelqu'un au village est avec eux."

Il vous tend les documents, trop heureux de s'en débarrasser. Le poids de la révélation est maintenant sur vos épaules.

[+80 or, +50 réputation]  
[Unlock: Indice "Le Corbeau Brisé"]  
[Unlock: Soupçon "Traître au Village"]
```

#### D) Failure_text (150-200 mots, conséquences + indice alternatif)

**Exemple - "Le Dernier Convoi" (échec)** :
```
L'embuscade est parfaite. Trop parfaite. Ils savaient exactement où vous seriez, exactement quand. Aldric crie quelque chose avant qu'un brigand ne le frappe - "Vous avez prévenu...!" mais la fin de la phrase se perd dans le chaos.

Vous parvenez à sauver Aldric, mais la charrette est perdue. Les brigands s'enfuient avec la caisse secrète, laissant le marchand effondré sur le chemin, livide et tremblant.

"Ils savaient," murmure-t-il, les yeux dans le vide. "Quelqu'un leur a dit. Quelqu'un au village. Je n'aurais jamais dû... je n'aurais jamais dû faire confiance..."

Il refuse d'en dire plus, trop secoué. Mais une chose est claire : l'ennemi a des yeux et des oreilles au village. Et maintenant, ils ont récupéré ce qu'Aldric essayait de vous donner.

En fouillant la charrette détruite, vous trouvez un morceau de parchemin échappé : un fragment de carte avec un symbole - un corbeau tenant une épée brisée.

[+40 or, -20 réputation]  
[Unlock: Indice "Le Corbeau Brisé"]  
[Unlock: Certitude "Traître au Village"]
```

---

## 🏛️ PHASE 4 : Bâtiments (5 descriptions immersives)

### Objectif
Remplacer descriptions basiques par des textes sensoriels avec NPCs, secrets, et atmosphère.

### Niveau 1 : Fondations (Style descriptif)

**Guidelines** :
- Description sensorielle (vue, sons, odeurs, toucher)
- Histoire du lieu (qui l'a construit, pourquoi)
- NPC associé avec personnalité
- Secret/hook narratif caché

**Contraintes** :
- Description principale : 100-150 mots
- Atmosphère : 20-30 mots
- NPC : 30-50 mots
- Secret : 20-40 mots

### Niveau 2 : Types de bâtiments

1. **Forge** : Travail, bruit, chaleur, artisan bourru
2. **Hôtel de Ville** : Politique, tensions, bureaucrate secret
3. **Marché** : Commerce, rumeurs, marchand informateur
4. **Auberge** : Repos, confidences, tavernier observateur
5. **Tour de Garde** : Défense, surveillance, capitaine suspicieux

### Niveau 3 : Instances (Descriptions finales)

**Exemple complet - Forge de Torval** :

```json
{
  "slug": "forge",
  "name": "Forge de Torval le Noir",
  "icon": "🔨",
  
  "description": "La forge ancestrale n'a jamais connu le silence depuis que le grand-père de Torval y alluma le premier feu, il y a soixante-trois ans. Les flammes actuelles, jure Torval, contiennent encore des braises de ce feu originel - une superstition qu'il défend avec une ferveur presque religieuse. L'odeur de charbon brûlé et de métal surchauffé imprègne les vêtements dès qu'on franchit le seuil. Les murs sont noirs de suie, constellés de marques de coups de marteau - certaines récentes, d'autres si anciennes qu'elles racontent l'histoire de trois générations de forgerons. Au fond, suspendue au-dessus de l'enclume principale, une épée brisée. Personne n'ose demander son histoire, pas même les clients les plus curieux. Torval se contente de fixer l'arme quand il pense que personne ne regarde, avec une expression où se mêlent fierté et regret.",
  
  "atmosphere": "Chaleur étouffante, étincelles orange dans la pénombre, rythme régulier des marteaux, odeur de charbon et de métal brûlant, fumée qui pique les yeux.",
  
  "npc": {
    "name": "Torval le Noir",
    "role": "Forgeron",
    "personality": "Bourru mais juste, perfectionniste obsessionnel. Refuse de parler pendant qu'il forge. Cache un secret sur l'épée brisée - l'arme qu'il créa pour le roi, et qui coûta la vie de son propre fils lors d'une bataille perdue."
  },
  
  "secret": "L'épée brisée appartenait au fils de Torval. Il peut la réparer, mais refuse - c'est son châtiment pour avoir créé une arme trop parfaite, trop mortelle. Si on lui apporte l'acier royal des brigands, il reconnaîtra immédiatement sa propre fabrication."
}
```

**À créer pour les 4 autres bâtiments** :
- Hôtel de Ville : Bureaucrate qui cache des documents compromettants
- Marché : Marchande qui écoute toutes les rumeurs
- Auberge : Tavernier qui voit tout, dit peu
- Tour de Garde : Capitaine qui soupçonne un de ses hommes

---

## 🎭 PHASE 5 : Contenu additionnel (optionnel mais recommandé)

### 5.1 - Portraits émotionnels (25 images)

**À générer** : Pour chaque héros (5), créer 5 portraits :

| Émotion | Usage | Prompt style |
|---------|-------|--------------|
| `neutral` | Par défaut, exists déjà | - |
| `happy` | Dialogue positif | Sourire chaleureux, yeux pétillants |
| `sad` | Révélation triste | Regard mélancolique, bouche fermée |
| `angry` | Conflit, combat | Sourcils froncés, mâchoire serrée |
| `surprised` | Révélation, choc | Yeux écarquillés, bouche légèrement ouverte |

**Contraintes techniques** :
- Format : PNG, 180×250px
- Style : Semi-réaliste, cohérent avec portrait existant
- Cadrage : Même que `portrait_full`
- Background : Flou, couleur thématique

**Prompts Stable Diffusion** :

**Base commune (tous portraits)** :
```
portrait, character art, {heroName}, {emotion}, medieval fantasy, detailed face, semi-realistic, soft lighting, {specific_clothing_armor}, {hair_style}, professional digital art, high quality
Negative: blurry, low quality, distorted, multiple faces, modern, photo, realistic photo
```

**Exemple - Bjorn happy** :
```
portrait, character art, Bjorn, slight smile, medieval warrior, short beard, strong jaw, chainmail armor, battle-worn, warm expression, relief in eyes, semi-realistic, detailed, high quality
```

**Exemple - Vi angry** :
```
portrait, character art, Vi, angry expression, female mage, purple robes, magical aura, intense glowing eyes, furrowed brows, arcane energy crackling, semi-realistic, dark background, high quality
```

### 5.2 - Ambient Texts (32 textes courts)

**À générer** :

#### A) Location flavour (20-32 textes)

**Forêt (5-8 textes)** :
```
"Le vent fait bruisser les feuilles. Quelque chose vous observe."
"Des traces de pas récentes. Plusieurs personnes sont passées ici."
"Un corbeau croasse au loin. Mauvais présage dans ces contrées."
"L'odeur de fumée... Un campement de brigands à proximité ?"
"Ces arbres portent des marques. Des symboles que vous ne reconnaissez pas."
```

**Grotte (5-8 textes)** :
```
"L'obscurité ici est... anormale. Presque vivante."
"Des ossements. Certains récents. D'autres très, très anciens."
"Un courant d'air glacé. D'où vient-il ?"
"Ces parois portent des gravures. Une langue oubliée."
```

**Ruines (5-8 textes)** :
```
"Ces pierres n'ont pas été taillées par des humains. Trop précises."
"Une inscription : 'Ceux qui oublient seront oubliés'. Inquiétant."
"Le sol vibre légèrement. Comme un cœur qui bat."
"Des restes de campement. Quelqu'un est venu ici récemment."
```

**Village (5-8 textes)** :
```
"Les villageois murmurent sur votre passage. Peur ou respect ?"
"Un enfant vous observe depuis une fenêtre. Il semble terrifié."
"Le forgeron travaille même la nuit. Il forge... quoi exactement ?"
"L'aubergiste compte son or nerveusement. Il attend quelqu'un."
```

#### B) Hero reactions (15-20 textes)

**Pour chaque héros (3-4 reactions)** :

**Bjorn** :
```
*Bjorn soupèse sa hache* "Ça devrait faire l'affaire."
*grognement approbateur* "Enfin une mission sensée."
"Des brigands ? *crache* Quand apprendront-ils ?"
```

**Owen** :
```
*Sourire en coin* "Intéressant. Très intéressant."
"Laisse-moi deviner : dangereux et mal payé ?"
*soupir théâtral* "Bien sûr. J'adorerais risquer ma vie pour ça."
```

**Vi** :
```
*Regard distant* "Je sens quelque chose. Une présence."
"Cette mission... *hésite* ...méfie-toi de la magie là-bas."
*Ferme les yeux brièvement* "Les énergies sont perturbées."
```

**Durun** :
```
*Examine son marteau* "Bref. Allons-y."
"Si tu casses ton équipement, c'est TON problème."
*Grogne* "Encore de l'aventure romantique. Génial."
```

**Elira** :
```
"Intéressant choix. Stratégiquement... risqué."
*Sourire calculateur* "Qui bénéficie vraiment de cette mission ?"
"Observe bien les réactions. Elles en disent long."
```

---

## 📊 Récapitulatif des livrables

| Contenu | Quantité | État actuel | Action |
|---------|----------|-------------|--------|
| **Héros enrichis** | 5 | Placeholders naïfs | ENRICHIR |
| - Descriptions | 5 × 150-200 mots | Génériques | RÉÉCRIRE |
| - Lore | 5 × 300-400 mots | Ridicule | CRÉER |
| - Voice | 5 × 2-3 phrases | Absent | CRÉER |
| - Relations | 5 × 4 relations | Absent | CRÉER |
| **Dialogues** | 12 | 3 existants | CRÉER 9 + AMÉLIORER 3 |
| - Jour 1 | 4 | 2 existants | CRÉER 2 + AMÉLIORER 2 |
| - Jour 2 | 5 | 1 existant | CRÉER 4 + AMÉLIORER 1 |
| - Jour 3 | 3 | Absent | CRÉER 3 |
| **Missions** | 15 | Basique | ENRICHIR |
| - Titles | 15 | Génériques | RÉÉCRIRE |
| - Descriptions | 15 × 200-300 mots | Trop courts | RÉÉCRIRE |
| - Success texts | 15 × 150-200 mots | Basiques | RÉÉCRIRE |
| - Failure texts | 15 × 150-200 mots | Basiques | RÉÉCRIRE |
| **Bâtiments** | 5 | Ultra-basique | ENRICHIR |
| - Descriptions | 5 × 100-150 mots | 1 phrase | RÉÉCRIRE |
| - NPCs | 5 × 30-50 mots | Absent | CRÉER |
| - Secrets | 5 × 20-40 mots | Absent | CRÉER |
| **Bible narrative** | 1 doc | Absent | CRÉER |
| **Portraits émotions** | 25 images | Absent | GÉNÉRER (optionnel) |
| **Ambient texts** | 32 textes | Absent | CRÉER (optionnel) |

---

## 🎨 Contraintes stylistiques globales

### Ton général
- **Inspiration** : The Witcher 3, Dragon Age Origins, Baldur's Gate 3
- **Maturité** : Public adulte (16+), pas enfantin mais pas gore
- **Complexité** : Personnages nuancés, pas de bien/mal absolu
- **Mystère** : Révélations progressives, pas tout expliquer

### Univers cohérent
- **Noms** : Style médiéval-fantastique européen (Bjorn, Aldric, Torval)
- **Technologie** : Niveau médiéval (pas d'armes à feu, pas de technologie moderne)
- **Magie** : Présente mais rare, mystérieuse, légèrement dangereuse
- **Géographie** : Forêt Noire, Ruines anciennes, Village fortifié, Royaume au nord

### Show don't tell
- ✅ "*Bjorn crache par terre*" au lieu de "Bjorn est dégoûté"
- ✅ "Ses mains tremblent" au lieu de "Il a peur"
- ✅ "Elle détourne le regard" au lieu de "Elle ment"

### Longueurs MAX (pour lisibilité)
- Mission description : 500 caractères MAX
- Success/failure text : 1000 caractères MAX
- Dialogue exchange : 200 caractères MAX par message
- Hero description : 1000 caractères MAX
- Hero lore : 2000 caractères MAX

---

## 📋 Checklist de validation

Avant de livrer le contenu, vérifier :

### Cohérence narrative
- [ ] Toutes les missions jour 1 plantent des indices
- [ ] Les indices convergent jour 2
- [ ] La révélation jour 3 explique les indices
- [ ] Aucune contradiction entre dialogues/missions

### Personnages
- [ ] Chaque héros a une voice distincte
- [ ] Les relations sont cohérentes (A→B correspond à B→A)
- [ ] Les secrets sont logiques et révélés progressivement
- [ ] Aucun héros n'est "parfait" (tous ont faiblesses/nuances)

### Technique
- [ ] Longueurs respectées (voir limites ci-dessus)
- [ ] Émotions dialogues valides (neutral, happy, sad, angry, surprised)
- [ ] Pas de typos ou erreurs grammaticales
- [ ] Format JSON valide si applicable

### Style
- [ ] Pas de clichés ("héros courageux", "sage puissant")
- [ ] Show don't tell respecté
- [ ] Descriptions sensorielles (pas juste visuelles)
- [ ] Sous-texte présent dans dialogues importants

---

**Dernière mise à jour** : 24 novembre 2025  
**Version** : 1.0  
**Statut** : Prêt à envoyer au curator
