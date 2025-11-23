'use client'

import { useState } from 'react'
import { HERO_PORTRAITS } from '../../data/portraits'

interface VillagePlacementModeProps {
  isOpen: boolean
  pendingPosition: { x: number, y: number } | null
  onPlace: (heroSrc: string, heroAlt: string, buildingName: string) => void
  onCancel: () => void
}

const BUILDINGS = [
  '🔨 Forge',
  '🏛️ Hôtel de Ville', 
  '🛒 Marché',
  '🍺 Auberge',
  '🗼 Tour de Garde'
]

export default function VillagePlacementMode({
  isOpen,
  pendingPosition,
  onPlace,
  onCancel
}: VillagePlacementModeProps) {
  const [selectedHero, setSelectedHero] = useState<{ src: string, alt: string } | null>(null)
  
  if (!isOpen || !pendingPosition) return null

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      padding: '30px',
      borderRadius: '20px',
      border: '3px solid #FFD700',
      zIndex: 4000,
      minWidth: '500px'
    }}>
      <h2 style={{ color: '#FFD700', textAlign: 'center', marginBottom: '20px' }}>
        Placer un héros
      </h2>
      
      {/* Sélection du héros */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#FFF', marginBottom: '10px' }}>Choisir le héros :</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '15px'
        }}>
          {HERO_PORTRAITS.map((hero) => (
            <div
              key={hero.src}
              onClick={() => setSelectedHero({ src: hero.src, alt: hero.alt })}
              style={{
                width: '100px',
                height: '100px',
                cursor: 'pointer',
                border: selectedHero?.src === hero.src ? '4px solid #FFD700' : '2px solid #666',
                borderRadius: '50%',
                overflow: 'hidden',
                transition: 'all 0.3s',
                margin: '0 auto'
              }}
              onMouseEnter={(e) => {
                if (selectedHero?.src !== hero.src) {
                  e.currentTarget.style.border = '3px solid #FFD700'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedHero?.src !== hero.src) {
                  e.currentTarget.style.border = '2px solid #666'
                  e.currentTarget.style.transform = 'scale(1)'
                }
              }}
            >
              <img 
                src={hero.src} 
                alt={hero.alt} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }} 
              />
            </div>
          ))}
        </div>
        
        {selectedHero && (
          <div style={{
            marginTop: '10px',
            textAlign: 'center',
            color: '#FFD700',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            ✓ {selectedHero.alt} sélectionné
          </div>
        )}
      </div>
      
      {/* Sélection du bâtiment */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#FFF', marginBottom: '10px' }}>Choisir le bâtiment :</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px'
        }}>
          {BUILDINGS.map((building) => (
            <button
              key={building}
              onClick={() => {
                if (selectedHero) {
                  onPlace(selectedHero.src, selectedHero.alt, building)
                  setSelectedHero(null)
                } else {
                  alert('Sélectionne d\'abord un héros !')
                }
              }}
              style={{
                padding: '12px',
                backgroundColor: '#4a4a4a',
                color: 'white',
                border: '2px solid #666',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFD700'
                e.currentTarget.style.color = '#000'
                e.currentTarget.style.border = '2px solid #FFD700'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4a4a4a'
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.border = '2px solid #666'
              }}
            >
              {building}
            </button>
          ))}
        </div>
      </div>
      
      {/* Info position */}
      <div style={{
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        border: '1px solid #FFD700',
        borderRadius: '8px',
        padding: '10px',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#FFD700',
        fontSize: '14px'
      }}>
        📍 Position : {pendingPosition.x.toFixed(1)}%, {pendingPosition.y.toFixed(1)}%
      </div>
      
      {/* Bouton Annuler */}
      <button
        onClick={() => {
          setSelectedHero(null)
          onCancel()
        }}
        style={{
          width: '100%',
          padding: '12px 24px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#c82333'
          e.currentTarget.style.transform = 'scale(1.02)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#dc3545'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        ✖️ Annuler
      </button>
    </div>
  )
}
