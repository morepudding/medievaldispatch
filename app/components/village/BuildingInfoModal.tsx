'use client'

import type { VillageHeroPlacement } from '../../types/game'

interface BuildingInfoModalProps {
  placement: VillageHeroPlacement | null
  onClose: () => void
}

const BUILDING_INFO: Record<string, { description: string, bonus: string, nextBonus: string, upgradeCost: number }> = {
  '🔨 Forge': {
    description: 'La forge de Phandallin résonne du bruit des marteaux. Le forgeron y travaille des armes et armures de qualité.',
    bonus: '+5% dégâts d\'armes',
    nextBonus: '+10% dégâts d\'armes et +5% défense',
    upgradeCost: 500
  },
  '🏛️ Hôtel de Ville': {
    description: 'Le cœur administratif de la ville. C\'est ici que sont prises les décisions importantes.',
    bonus: '+10% revenus de la ville',
    nextBonus: '+20% revenus et nouvelles quêtes',
    upgradeCost: 1000
  },
  '🛒 Marché': {
    description: 'Un marché animé plein de marchandises en provenance de tout le royaume.',
    bonus: '-10% prix d\'achat',
    nextBonus: '-20% prix et objets rares disponibles',
    upgradeCost: 750
  },
  '🍺 Auberge': {
    description: 'L\'auberge accueillante de Phandallin. Un bon endroit pour se reposer et entendre des rumeurs.',
    bonus: '+10% régénération au repos',
    nextBonus: '+20% régénération et missions spéciales',
    upgradeCost: 600
  },
  '🗼 Tour de Garde': {
    description: 'La tour de garde protège la ville des dangers extérieurs. De son sommet, on peut voir à des kilomètres.',
    bonus: '+5% défense de la ville',
    nextBonus: '+10% défense et alerte précoce sur les menaces',
    upgradeCost: 800
  }
}

export default function BuildingInfoModal({ placement, onClose }: BuildingInfoModalProps) {
  if (!placement) return null
  
  const buildingInfo = BUILDING_INFO[placement.buildingName] || {
    description: 'Un bâtiment important pour la ville.',
    bonus: 'Bonus inconnu',
    nextBonus: 'Amélioration disponible',
    upgradeCost: 500
  }
  
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
          border: '4px solid #8B4513',
          maxWidth: '500px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
        }}
      >
        {/* Nom du bâtiment */}
        <h2 style={{
          color: '#FFD700',
          textAlign: 'center',
          fontSize: '32px',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          {placement.buildingName}
        </h2>
        
        {/* Description */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <p style={{
            color: 'white',
            fontSize: '15px',
            lineHeight: '1.6',
            margin: 0
          }}>
            {buildingInfo.description}
          </p>
        </div>
        
        {/* Bonus actuel */}
        <div style={{
          backgroundColor: 'rgba(40, 167, 69, 0.2)',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '2px solid #28a745'
        }}>
          <h3 style={{
            color: '#28a745',
            marginBottom: '8px',
            fontSize: '16px'
          }}>
            ✨ Bonus actuel
          </h3>
          <p style={{
            color: 'white',
            fontSize: '14px',
            margin: 0
          }}>
            {buildingInfo.bonus}
          </p>
        </div>
        
        {/* Section amélioration */}
        <div style={{
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '2px solid #FFD700'
        }}>
          <h3 style={{
            color: '#FFD700',
            marginBottom: '10px',
            fontSize: '16px'
          }}>
            ⬆️ Prochaine amélioration
          </h3>
          <p style={{
            color: 'white',
            fontSize: '14px',
            marginBottom: '10px'
          }}>
            {buildingInfo.nextBonus}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{
              color: '#FFD700',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              💰 Coût: {buildingInfo.upgradeCost} or
            </span>
          </div>
        </div>
        
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: '#666',
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
