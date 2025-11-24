# 🏗️ Roadmap Projet Curator - Construction du pipeline IA

**Date** : 24 novembre 2025  
**Version** : 1.0  
**Statut** : Planification

---

## 📋 Vue d'ensemble du projet

Le **Curator** est une application autonome locale qui génère automatiquement du contenu narratif et visuel pour Medieval Dispatch en utilisant l'IA.

### Objectifs
- ✅ Générer textes (descriptions, dialogues, missions) via LLM local
- ✅ Générer images (portraits, émotions) via Stable Diffusion local
- ✅ Système de génération par niveaux (style → types → variations)
- ✅ Interface de contrôle et monitoring
- ✅ Déposer le contenu directement dans la DB Supabase

### Architecture technique

```
┌─────────────────────────────────────────────────────┐
│                  CURATOR APPLICATION                 │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────────┐      ┌──────────────────┐    │
│  │  Frontend        │      │  Backend         │    │
│  │  (Next.js 14)    │◄────►│  (Python FastAPI)│    │
│  │                  │ HTTP  │                  │    │
│  │  - Dashboard     │      │  - Generators    │    │
│  │  - Controls      │      │  - Services      │    │
│  │  - Preview       │      │  - API Routes    │    │
│  └──────────────────┘      └─────────┬────────┘    │
│                                       │              │
│                            ┌──────────▼─────────┐   │
│                            │  IA Services       │   │
│                            │                    │   │
│                            │  ┌──────────────┐ │   │
│                            │  │ Ollama LLM   │ │   │
│                            │  │ (llama3:8b)  │ │   │
│                            │  └──────────────┘ │   │
│                            │  ┌──────────────┐ │   │
│                            │  │ Stable Diff  │ │   │
│                            │  │ (WebUI API)  │ │   │
│                            │  └──────────────┘ │   │
│                            └────────────────────┘   │
└──────────────────────────────┬──────────────────────┘
                               │
                               │ READ/WRITE
                               ▼
                    ┌─────────────────────┐
                    │   Supabase DB       │
                    │   (PostgreSQL)      │
                    │                     │
                    │   Tables contenu:   │
                    │   - heroes          │
                    │   - missions        │
                    │   - dialogues       │
                    │   - buildings       │
                    └─────────────────────┘
```

### Stack technologique

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Zustand (state management)

**Backend**
- Python 3.11+
- FastAPI
- psycopg2 (PostgreSQL)
- Ollama Python SDK
- Requests (Stable Diffusion API)

**IA Locale**
- Ollama (LLM) - Port 11434
- Stable Diffusion WebUI - Port 7860

**Infrastructure**
- Docker Compose
- PostgreSQL (Supabase distant)

---

## 🎯 SPRINT 0 : Recherche technologique (2-3 jours)

**Objectif** : Valider la stack IA locale et mesurer les performances

### 0.1 - Installation environnement test

**Prérequis matériel recommandé** :
- CPU : 8 cores minimum
- RAM : 16 GB minimum (32 GB idéal)
- GPU : NVIDIA RTX 3060 12GB minimum (pour Stable Diffusion)
- Stockage : 50 GB SSD libre

**Installation Ollama** :

```bash
# Linux/Mac
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Télécharger depuis https://ollama.com/download

# Démarrer le service
ollama serve

# Tester avec modèle léger
ollama pull llama3:8b
ollama run llama3:8b "Dis bonjour en français"
```

**Installation Stable Diffusion WebUI** :

```bash
# Clone repository
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui

# Lancer (installe automatiquement les dépendances)
./webui.sh --api --listen  # Linux/Mac
webui.bat --api --listen   # Windows

# Télécharger modèle DreamShaper
wget https://civitai.com/api/download/models/128713 -O models/Stable-diffusion/dreamshaper_8.safetensors
```

---

### 0.2 - Tests de performance LLM

**Objectif** : Trouver le meilleur modèle vitesse/qualité

**Modèles à tester** :

```bash
# Installer 3 modèles
ollama pull llama3:8b       # 4.7 GB - Rapide, polyvalent
ollama pull mistral:7b      # 4.1 GB - Bon français
ollama pull neural-chat:7b  # 4.1 GB - Dialogues naturels
```

**Script de test** : `tests/test_ollama.py`

```python
import ollama
import time

models = ['llama3:8b', 'mistral:7b', 'neural-chat:7b']

prompt = """
Génère une description de héros médiéval-fantastique (200 mots).
Nom: Bjorn
Classe: Guerrier
Stats: Force 8, Agilité 4, Intelligence 3
Style: Direct, courageux, légèrement bourru
"""

results = []

for model in models:
    print(f"\n🧪 Test de {model}...")
    
    start = time.time()
    response = ollama.generate(
        model=model,
        prompt=prompt,
        options={
            'temperature': 0.7,
            'num_predict': 300
        }
    )
    duration = time.time() - start
    
    results.append({
        'model': model,
        'duration': duration,
        'text': response['response'],
        'tokens': response['eval_count']
    })
    
    print(f"⏱️ Durée: {duration:.2f}s")
    print(f"📝 Tokens: {response['eval_count']}")
    print(f"📄 Extrait: {response['response'][:200]}...")

# Résultats
print("\n" + "="*60)
print("RÉSUMÉ PERFORMANCES")
print("="*60)
for r in results:
    print(f"{r['model']}: {r['duration']:.2f}s ({r['tokens']} tokens)")
```

**Critères d'évaluation** :
- ✅ Vitesse < 30s pour 200 mots
- ✅ Qualité narrative (cohérence, style)
- ✅ Respect des contraintes (format, personnalité)

---

### 0.3 - Tests de performance Stable Diffusion

**Objectif** : Valider qualité et vitesse génération images

**Modèles à tester** :
1. **DreamShaper 8** - Semi-réaliste équilibré
2. **Anything V5** - Style anime/manga
3. **ReV Animated** - Cartoon semi-réaliste

**Script de test** : `tests/test_stable_diffusion.py`

```python
import requests
import base64
import time
from pathlib import Path

SD_API_URL = "http://localhost:7860/sdapi/v1/txt2img"

test_prompts = [
    {
        "name": "warrior_bjorn",
        "prompt": "portrait of a medieval warrior, Bjorn, short beard, strong jaw, determined eyes, chainmail armor, fantasy art, detailed, semi-realistic",
        "negative": "blurry, low quality, distorted, ugly, modern, photo"
    },
    {
        "name": "mage_vi",
        "prompt": "portrait of a female mage, Vi, purple robes, mysterious eyes, magical aura, staff, fantasy art, detailed, semi-realistic",
        "negative": "blurry, low quality, distorted, ugly, modern, photo"
    }
]

for test in test_prompts:
    print(f"\n🎨 Test de {test['name']}...")
    
    payload = {
        "prompt": test['prompt'],
        "negative_prompt": test['negative'],
        "steps": 30,
        "width": 512,
        "height": 512,
        "cfg_scale": 7,
        "sampler_name": "DPM++ 2M Karras",
        "seed": 42  # Reproductible
    }
    
    start = time.time()
    response = requests.post(SD_API_URL, json=payload, timeout=300)
    duration = time.time() - start
    
    if response.status_code == 200:
        image_data = base64.b64decode(response.json()['images'][0])
        
        output_path = Path(f"tests/output/{test['name']}.png")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_bytes(image_data)
        
        print(f"✅ Succès en {duration:.2f}s")
        print(f"💾 Sauvegardé: {output_path}")
    else:
        print(f"❌ Erreur: {response.status_code}")
```

**Critères d'évaluation** :
- ✅ Temps < 120s pour 512×512px
- ✅ Qualité visuelle (détails, cohérence)
- ✅ Contrôle du style via prompts
- ✅ Reproductibilité (seed fixe)

---

### 0.4 - Choix de la stack finale

**Décision basée sur les tests** :

```yaml
LLM_CHOICE: "llama3:8b"  # ou "mistral:7b" selon résultats
SD_MODEL: "DreamShaper 8"  # Style semi-réaliste

CONFIGURATION:
  llm:
    temperature: 0.7
    max_tokens: 500
    num_predict: 500
    
  stable_diffusion:
    steps: 30
    cfg_scale: 7
    sampler: "DPM++ 2M Karras"
    width: 512
    height: 512
```

---

## 🏗️ SPRINT 1 : Structure de base (1 semaine)

**Objectif** : Créer l'architecture curator avec frontend + backend

### 1.1 - Setup projet et Docker Compose

**Structure des dossiers** :

```
curator/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   └── app/
└── tests/
    ├── test_ollama.py
    └── test_stable_diffusion.py
```

**Fichier** : `curator/docker-compose.yml`

```yaml
version: '3.8'

services:
  # Backend Python FastAPI
  curator-backend:
    build: ./backend
    container_name: curator-backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - OLLAMA_HOST=http://host.docker.internal:11434
      - SD_API_URL=http://host.docker.internal:7860
    extra_hosts:
      - "host.docker.internal:host-gateway"
    depends_on:
      - curator-frontend

  # Frontend Next.js
  curator-frontend:
    build: ./frontend
    container_name: curator-frontend
    ports:
      - "3001:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000

networks:
  default:
    name: curator-network
```

**Fichier** : `curator/.env.example`

```env
# Database Supabase
DATABASE_URL=postgresql://user:pass@db.xxx.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://user:pass@db.xxx.supabase.co:5432/postgres

# IA Services (local)
OLLAMA_HOST=http://localhost:11434
SD_API_URL=http://localhost:7860

# Configuration
LLM_MODEL=llama3:8b
SD_MODEL=dreamshaper_8
TEMPERATURE=0.7
```

---

### 1.2 - Backend Python FastAPI

**Structure complète** :

```
backend/
├── Dockerfile
├── requirements.txt
├── main.py              # Point d'entrée FastAPI
├── config.py            # Configuration depuis .env
├── database.py          # Connexion PostgreSQL
├── models/
│   ├── __init__.py
│   ├── hero.py          # Pydantic models
│   ├── mission.py
│   └── dialogue.py
├── services/
│   ├── __init__.py
│   ├── llm_service.py   # Interface Ollama
│   ├── image_service.py # Interface Stable Diffusion
│   └── db_service.py    # CRUD database
├── generators/
│   ├── __init__.py
│   ├── hero_generator.py
│   ├── mission_generator.py
│   └── dialogue_generator.py
└── routers/
    ├── __init__.py
    ├── heroes.py        # Endpoints /api/heroes
    ├── missions.py      # Endpoints /api/missions
    └── generation.py    # Endpoints /api/generate
```

**Fichier** : `backend/Dockerfile`

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Installer dépendances système
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copier requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier code
COPY . .

# Exposer port
EXPOSE 8000

# Commande de démarrage
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

**Fichier** : `backend/requirements.txt`

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
pydantic-settings==2.1.0
psycopg2-binary==2.9.9
python-dotenv==1.0.0
ollama==0.1.0
requests==2.31.0
Pillow==10.1.0
```

**Fichier** : `backend/config.py`

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    database_url: str
    direct_url: str
    
    # IA Services
    ollama_host: str = "http://localhost:11434"
    sd_api_url: str = "http://localhost:7860"
    
    # Models
    llm_model: str = "llama3:8b"
    sd_model: str = "dreamshaper_8"
    
    # Generation params
    temperature: float = 0.7
    max_tokens: int = 500
    
    class Config:
        env_file = ".env"

settings = Settings()
```

**Fichier** : `backend/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import heroes, missions, generation

app = FastAPI(
    title="Medieval Dispatch Curator API",
    version="1.0.0"
)

# CORS pour Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(heroes.router, prefix="/api/heroes", tags=["heroes"])
app.include_router(missions.router, prefix="/api/missions", tags=["missions"])
app.include_router(generation.router, prefix="/api/generate", tags=["generation"])

@app.get("/")
def root():
    return {
        "message": "Medieval Dispatch Curator API",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    return {
        "status": "ok",
        "services": {
            "database": "connected",
            "ollama": "available",
            "stable_diffusion": "available"
        }
    }
```

**Fichier** : `backend/services/llm_service.py`

```python
import ollama
from typing import Dict, Any
from config import settings

class LLMService:
    def __init__(self):
        self.model = settings.llm_model
        self.temperature = settings.temperature
        self.max_tokens = settings.max_tokens
    
    def generate_text(
        self, 
        prompt: str, 
        temperature: float = None,
        max_tokens: int = None
    ) -> str:
        """Génère du texte via Ollama"""
        response = ollama.generate(
            model=self.model,
            prompt=prompt,
            options={
                "temperature": temperature or self.temperature,
                "num_predict": max_tokens or self.max_tokens
            }
        )
        return response['response']
    
    def generate_with_template(
        self, 
        template: str, 
        variables: Dict[str, Any]
    ) -> str:
        """Génère avec un template de prompt"""
        prompt = template.format(**variables)
        return self.generate_text(prompt)

# Instance globale
llm_service = LLMService()
```

**Fichier** : `backend/services/image_service.py`

```python
import requests
import base64
from pathlib import Path
from config import settings

class ImageService:
    def __init__(self):
        self.api_url = settings.sd_api_url
    
    def generate_image(
        self,
        prompt: str,
        negative_prompt: str = "blurry, low quality, distorted",
        width: int = 512,
        height: int = 512,
        steps: int = 30,
        seed: int = -1
    ) -> bytes:
        """Génère une image via Stable Diffusion API"""
        payload = {
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "width": width,
            "height": height,
            "steps": steps,
            "cfg_scale": 7,
            "sampler_name": "DPM++ 2M Karras",
            "seed": seed
        }
        
        response = requests.post(
            f"{self.api_url}/sdapi/v1/txt2img",
            json=payload,
            timeout=300
        )
        response.raise_for_status()
        
        image_data = response.json()['images'][0]
        return base64.b64decode(image_data)
    
    def save_image(self, image_bytes: bytes, filepath: Path):
        """Sauvegarde l'image générée"""
        filepath.parent.mkdir(parents=True, exist_ok=True)
        with open(filepath, 'wb') as f:
            f.write(image_bytes)

# Instance globale
image_service = ImageService()
```

**Fichier** : `backend/database.py`

```python
import psycopg2
from psycopg2.extras import RealDictCursor
from config import settings

class DatabaseService:
    def __init__(self):
        self.conn_params = settings.database_url
    
    def get_connection(self):
        """Crée une connexion à la DB"""
        return psycopg2.connect(
            self.conn_params,
            cursor_factory=RealDictCursor
        )
    
    def execute_query(self, query: str, params: tuple = None):
        """Exécute une query SELECT"""
        with self.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchall()
    
    def execute_update(self, query: str, params: tuple = None):
        """Exécute une query UPDATE/INSERT"""
        with self.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                conn.commit()
                return cursor.rowcount

# Instance globale
db_service = DatabaseService()
```

---

### 1.3 - Frontend Next.js

**Structure** :

```
frontend/
├── Dockerfile
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── app/
│   ├── layout.tsx
│   ├── page.tsx          # Dashboard
│   ├── heroes/
│   │   └── page.tsx
│   ├── missions/
│   │   └── page.tsx
│   └── generate/
│       └── page.tsx
├── components/
│   ├── Dashboard.tsx
│   ├── GenerationPanel.tsx
│   ├── ContentPreview.tsx
│   └── ProgressBar.tsx
└── lib/
    ├── api.ts
    └── types.ts
```

**Fichier** : `frontend/Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copier package files
COPY package*.json ./

# Installer dépendances
RUN npm install

# Copier code
COPY . .

# Exposer port
EXPOSE 3000

# Commande dev
CMD ["npm", "run", "dev"]
```

**Fichier** : `frontend/package.json`

```json
{
  "name": "curator-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3"
  }
}
```

**Fichier** : `frontend/lib/api.ts`

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const curatorAPI = {
  // Health check
  async health() {
    const res = await fetch(`${API_URL}/health`)
    return res.json()
  },

  // Récupérer placeholders depuis DB
  async getPlaceholderHeroes() {
    const res = await fetch(`${API_URL}/api/heroes/placeholders`)
    return res.json()
  },

  // Générer contenu pour un héros
  async generateHeroContent(heroId: string) {
    const res = await fetch(`${API_URL}/api/generate/hero/${heroId}`, {
      method: 'POST'
    })
    return res.json()
  },

  // Générer portrait
  async generateHeroPortrait(heroId: string, emotion: string) {
    const res = await fetch(`${API_URL}/api/generate/hero/${heroId}/portrait`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emotion })
    })
    return res.json()
  },

  // Batch generation
  async generateAllHeroes() {
    const res = await fetch(`${API_URL}/api/generate/heroes/batch`, {
      method: 'POST'
    })
    return res.json()
  }
}
```

**Fichier** : `frontend/app/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { curatorAPI } from '@/lib/api'

export default function Dashboard() {
  const [stats, setStats] = useState({
    heroes: { total: 5, enriched: 0 },
    missions: { total: 15, enriched: 0 },
    dialogues: { total: 12, enriched: 0 }
  })

  const [status, setStatus] = useState<'idle' | 'generating' | 'error'>('idle')

  useEffect(() => {
    // Charger stats depuis backend
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const health = await curatorAPI.health()
      console.log('Backend status:', health)
      // TODO: Fetch real stats
    } catch (error) {
      console.error('Failed to connect to backend:', error)
      setStatus('error')
    }
  }

  const handleGenerateAll = async (type: 'heroes' | 'missions' | 'dialogues') => {
    setStatus('generating')
    try {
      if (type === 'heroes') {
        const result = await curatorAPI.generateAllHeroes()
        console.log('Generation result:', result)
      }
      setStatus('idle')
    } catch (error) {
      console.error('Generation error:', error)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Medieval Dispatch Curator</h1>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Carte Héros */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl mb-4">Héros</h2>
          <div className="text-5xl font-bold mb-2">
            {stats.heroes.enriched}/{stats.heroes.total}
          </div>
          <p className="text-gray-400 mb-4">Enrichis</p>
          <button 
            onClick={() => handleGenerateAll('heroes')}
            disabled={status === 'generating'}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded transition"
          >
            {status === 'generating' ? 'Génération...' : 'Générer tout'}
          </button>
        </div>

        {/* Carte Missions */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl mb-4">Missions</h2>
          <div className="text-5xl font-bold mb-2">
            {stats.missions.enriched}/{stats.missions.total}
          </div>
          <p className="text-gray-400 mb-4">Enrichies</p>
          <button 
            onClick={() => handleGenerateAll('missions')}
            disabled={status === 'generating'}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded transition"
          >
            {status === 'generating' ? 'Génération...' : 'Générer tout'}
          </button>
        </div>

        {/* Carte Dialogues */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl mb-4">Dialogues</h2>
          <div className="text-5xl font-bold mb-2">
            {stats.dialogues.enriched}/{stats.dialogues.total}
          </div>
          <p className="text-gray-400 mb-4">Enrichis</p>
          <button 
            onClick={() => handleGenerateAll('dialogues')}
            disabled={status === 'generating'}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded transition"
          >
            {status === 'generating' ? 'Génération...' : 'Générer tout'}
          </button>
        </div>
      </div>

      {status === 'error' && (
        <div className="mt-6 bg-red-900 border border-red-700 text-red-200 p-4 rounded">
          ❌ Erreur de connexion au backend. Vérifiez que les services sont démarrés.
        </div>
      )}
    </div>
  )
}
```

---

### 1.4 - Commandes de démarrage

**Fichier** : `curator/README.md`

```markdown
# Curator - Guide de démarrage

## Prérequis

1. Docker et Docker Compose installés
2. Ollama installé et en cours d'exécution (port 11434)
3. Stable Diffusion WebUI en cours d'exécution (port 7860)
4. Accès à la DB Supabase

## Installation

```bash
# 1. Copier .env
cp .env.example .env
# Éditer .env avec les vraies credentials

# 2. Démarrer les services
docker-compose up -d

# 3. Vérifier les logs
docker-compose logs -f
```

## Accès

- Frontend: http://localhost:3001
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Arrêt

```bash
docker-compose down
```
```

---

## 📋 SPRINT 2-6 : Generators par niveaux (4 semaines)

**Note** : Les sprints 2-6 implémentent la logique de génération par niveaux pour chaque type de contenu (héros, missions, dialogues, etc.)

**Structure détaillée dans un document séparé** : `docs/roadmap-curator-generators.md`

### Aperçu des sprints

| Sprint | Contenu | Durée | Livrables |
|--------|---------|-------|-----------|
| Sprint 2 | Héros (Niveau 1-3) | 1 semaine | 5 héros + 25 portraits |
| Sprint 3 | Missions (Niveau 1-3) | 1 semaine | 15 missions + variantes |
| Sprint 4 | Dialogues (Niveau 1-3) | 1 semaine | 12 dialogues complets |
| Sprint 5 | Bâtiments & Ambient | 3-4 jours | 5 bâtiments + 32 textes |
| Sprint 6 | Mission climax | 3-4 jours | 1 mission interactive |

---

## 📋 Checklist complète

### Sprint 0 - Recherche (2-3 jours)
- [ ] Installer Ollama + tester 3 modèles LLM
- [ ] Installer Stable Diffusion + tester 3 modèles visuels
- [ ] Script `tests/test_ollama.py`
- [ ] Script `tests/test_stable_diffusion.py`
- [ ] Validation vitesse/qualité
- [ ] Choix stack finale documenté

### Sprint 1 - Structure (1 semaine)
- [ ] Créer `docker-compose.yml`
- [ ] Backend FastAPI complet
  - [ ] `main.py` avec routes
  - [ ] `config.py` configuration
  - [ ] `database.py` connexion DB
  - [ ] `services/llm_service.py`
  - [ ] `services/image_service.py`
  - [ ] `services/db_service.py`
- [ ] Frontend Next.js
  - [ ] Dashboard principal
  - [ ] API client (`lib/api.ts`)
  - [ ] Composants de base
- [ ] Docker build et test local
- [ ] Connexion DB Supabase validée
- [ ] Health check `/health` fonctionnel

### Sprint 2-6 - Generators
- [ ] Voir document séparé `roadmap-curator-generators.md`

---

## ⏱️ Estimation globale

| Phase | Durée | Description |
|-------|-------|-------------|
| **Sprint 0** | 2-3 jours | Recherche et validation stack IA |
| **Sprint 1** | 5-7 jours | Architecture backend + frontend |
| **Sprint 2-6** | 20-28 jours | Implémentation generators |
| **TOTAL** | **27-38 jours** | Pipeline complet opérationnel |

---

## 🚀 Commandes rapides

```bash
# Démarrer Ollama (dans un terminal séparé)
ollama serve

# Démarrer Stable Diffusion (dans un terminal séparé)
cd stable-diffusion-webui/
./webui.sh --api --listen

# Démarrer Curator
cd curator/
docker-compose up -d

# Voir logs
docker-compose logs -f curator-backend

# Arrêter tout
docker-compose down
```

---

**Dernière mise à jour** : 24 novembre 2025  
**Version** : 1.0  
**Statut** : Prêt pour Sprint 0
