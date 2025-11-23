'use client'

import { HERO_PORTRAITS } from '../../data/portraits'
import type { VillageHeroPlacement, Dialogue, Building, GameState } from '../../types/game'

interface VillageLightPointProps {
  placement: VillageHeroPlacement
  index: number
  isPlacementMode: boolean
  isHovered: boolean
  showMenu: boolean
  gameState: GameState
  onHover: (index: number | null) => void
  onClick: (index: number) => void
  onDelete: (index: number) => void
  onSelectDialogue: (dialogue: Dialogue) => void
  onSelectBuildingUpgrade: (building: Building) => void
  onShowHeroModal: (placement: VillageHeroPlacement) => void
  onShowBuildingModal: (placement: VillageHeroPlacement) => void
}

export default function VillageLightPoint({
  placement,
  index,
  isPlacementMode,
  isHovered,
  showMenu,
  gameState,
  onHover,
  onClick,
  onDelete,
  onSelectDialogue,
  onSelectBuildingUpgrade,
  onShowHeroModal,
  onShowBuildingModal
}: VillageLightPointProps) {
  const heroInfo = HERO_PORTRAITS.find(h => h.src === placement.heroSrc)
  
  // Vérifier si ce héros a un dialogue disponible
  const heroDialogue = gameState.availableDialogues.find(d => 
    d.heroName.toLowerCase().includes(placement.heroAlt.toLowerCase()) && !d.isRead
  )
  
  // Vérifier si ce bâtiment peut être amélioré
  const buildingName = placement.buildingName
  const building = gameState.buildings.find(b => 
    b.name === buildingName || buildingName.includes(b.name)
  )
  // Vérifier si on peut upgrader avec le coût du niveau suivant
  const canUpgradeBuilding = building && 
    building.level < building.maxLevel && 
    gameState.gold >= building.upgradeCosts[building.level + 1]
  
  const hasNotification = !!heroDialogue || !!canUpgradeBuilding

  return (
    <div
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onClick={(e) => {
        if (!isPlacementMode) {
          e.stopPropagation()
          onClick(index)
        }
      }}
      style={{
        position: 'absolute',
        left: `${placement.x}%`,
        top: `${placement.y}%`,
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        zIndex: isHovered ? 200 : 100
      }}
    >
      {/* Point lumineux */}
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: heroInfo?.color || '#FFD700',
        boxShadow: `0 0 ${isHovered ? '25px' : '15px'} ${heroInfo?.color || '#FFD700'}`,
        animation: hasNotification ? 'pulse 1.5s infinite' : 'glow 2s infinite',
        transition: 'all 0.3s',
        transform: isHovered ? 'scale(1.3)' : 'scale(1)',
        border: '2px solid white',
        position: 'relative'
      }}>
        <style>{`
          @keyframes glow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
          @keyframes pulse {
            0%, 100% { 
              transform: scale(1);
              opacity: 1;
            }
            50% { 
              transform: scale(1.2);
              opacity: 0.7;
            }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
        `}</style>
        
        {/* Badge de notification */}
        {hasNotification && (
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: heroDialogue ? '#ff4444' : '#28a745',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            color: 'white',
            animation: 'bounce 1s infinite'
          }}>
            {heroDialogue ? '💬' : '⚡'}
          </div>
        )}
      </div>
      
      {/* Tooltip au survol */}
      {isHovered && !isPlacementMode && !showMenu && (
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          padding: '12px',
          borderRadius: '12px',
          border: `3px solid ${heroInfo?.color || '#FFD700'}`,
          minWidth: '150px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
          animation: 'slideUp 0.3s ease-out',
          pointerEvents: 'none'
        }}>
          {/* Portrait */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            overflow: 'hidden',
            margin: '0 auto 10px',
            border: `3px solid ${heroInfo?.color || '#FFD700'}`,
            boxShadow: `0 0 15px ${heroInfo?.color || '#FFD700'}`
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
          
          {/* Nom du héros */}
          <div style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '5px'
          }}>
            {placement.heroAlt}
          </div>
          
          {/* Bâtiment */}
          <div style={{
            color: '#FFD700',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {placement.buildingName}
          </div>
          
          {/* Flèche */}
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: `10px solid ${heroInfo?.color || '#FFD700'}`
          }} />
        </div>
      )}
      
      {/* Menu contextuel au clic */}
      {showMenu && !isPlacementMode && (
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          padding: '10px',
          borderRadius: '12px',
          border: `3px solid ${heroInfo?.color || '#FFD700'}`,
          minWidth: '180px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
          animation: 'slideUp 0.3s ease-out',
          zIndex: 300
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Bouton dialogue si disponible */}
            {heroDialogue && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectDialogue(heroDialogue)
                }}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                  animation: 'pulse 1s infinite'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.filter = 'brightness(1.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.filter = 'brightness(1)'
                }}
              >
                <span style={{ fontSize: '18px' }}>💬</span>
                Nouveau dialogue !
              </button>
            )}
            
            {/* Bouton amélioration si disponible */}
            {canUpgradeBuilding && building && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectBuildingUpgrade(building)
                }}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                  animation: 'pulse 1s infinite'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.filter = 'brightness(1.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.filter = 'brightness(1)'
                }}
              >
                <span style={{ fontSize: '18px' }}>⚡</span>
                Améliorer {building.name} ({building.upgradeCosts[building.level + 1]} or)
              </button>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                onShowHeroModal(placement)
              }}
              style={{
                padding: '10px 15px',
                backgroundColor: heroInfo?.color || '#FFD700',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.filter = 'brightness(1.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.filter = 'brightness(1)'
              }}
            >
              <span style={{ fontSize: '18px' }}>👤</span>
              Voir le héros
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                onShowBuildingModal(placement)
              }}
              style={{
                padding: '10px 15px',
                backgroundColor: '#8B4513',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.filter = 'brightness(1.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.filter = 'brightness(1)'
              }}
            >
              <span style={{ fontSize: '18px' }}>🏛️</span>
              Voir le bâtiment
            </button>
          </div>
          
          {/* Flèche */}
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: `10px solid ${heroInfo?.color || '#FFD700'}`
          }} />
        </div>
      )}
      
      {/* Bouton supprimer en mode placement */}
      {isPlacementMode && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(index)
          }}
          style={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#ff4444',
            color: 'white',
            border: '2px solid white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            pointerEvents: 'auto'
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}
