'use client'

import { HERO_PORTRAITS } from '../../data/portraits'
import type { VillageHeroPlacement } from '../../types/game'

interface HeroStatsModalProps {
  placement: VillageHeroPlacement | null
  onClose: () => void
}

const HERO_STATS: Record<string, { force: number, dexterite: number, sagesse: number, intelligence: number, vitalite: number }> = {
  'Bjorn': { force: 18, dexterite: 12, sagesse: 8, intelligence: 10, vitalite: 16 },
  'Owen': { force: 12, dexterite: 18, sagesse: 14, intelligence: 10, vitalite: 12 },
  'Vi': { force: 8, dexterite: 14, sagesse: 12, intelligence: 18, vitalite: 10 },
  'Durun': { force: 16, dexterite: 10, sagesse: 14, intelligence: 8, vitalite: 18 },
  'Elira': { force: 10, dexterite: 12, sagesse: 18, intelligence: 14, vitalite: 14 }
}

export default function HeroStatsModal({ placement, onClose }: HeroStatsModalProps) {
  if (!placement) return null
  
  const heroColor = HERO_PORTRAITS.find(h => h.src === placement.heroSrc)?.color || '#FFD700'
  
  return (
    <div 
      onClick={onClose}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5000
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'rgba(20, 20, 20, 0.98)',
          padding: '30px',
          borderRadius: '20px',
          border: `4px solid ${heroColor}`,
          maxWidth: '500px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
        }}
      >
        {/* Portrait */}
        <div style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          overflow: 'hidden',
          margin: '0 auto 20px',
          border: `4px solid ${heroColor}`,
          boxShadow: `0 0 25px ${heroColor}`
        }}>
          <img 
            src={placement.heroSrc} 
            alt={placement.heroAlt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        
        {/* Nom */}
        <h2 style={{
          color: 'white',
          textAlign: 'center',
          fontSize: '28px',
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          {placement.heroAlt}
        </h2>
        
        {/* Localisation */}
        <div style={{
          color: '#FFD700',
          textAlign: 'center',
          fontSize: '16px',
          marginBottom: '25px',
          fontWeight: 'bold'
        }}>
          📍 {placement.buildingName}
        </div>
        
        {/* Stats */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <h3 style={{
            color: '#FFD700',
            marginBottom: '15px',
            fontSize: '18px',
            textAlign: 'center'
          }}>
            📊 Statistiques
          </h3>
          {['force', 'dexterite', 'sagesse', 'intelligence', 'vitalite'].map((stat) => {
            const statValue = HERO_STATS[placement.heroAlt]?.[stat as keyof typeof HERO_STATS['Bjorn']] || 10
            const statNames: Record<string, string> = {
              force: '💪 Force',
              dexterite: '🎯 Dextérité',
              sagesse: '🧙 Sagesse',
              intelligence: '🧠 Intelligence',
              vitalite: '❤️ Vitalité'
            }
            return (
              <div key={stat} style={{ marginBottom: '12px' }}>
                <div style={{
                  color: 'white',
                  fontSize: '14px',
                  marginBottom: '5px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>{statNames[stat]}</span>
                  <span style={{ fontWeight: 'bold', color: '#FFD700' }}>{statValue}</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(statValue / 20) * 100}%`,
                    height: '100%',
                    backgroundColor: heroColor,
                    transition: 'width 0.5s ease-out'
                  }} />
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: '#4a4a4a',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  )
}
