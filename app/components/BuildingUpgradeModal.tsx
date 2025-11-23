'use client'

import { useState } from 'react'
import { Building } from '../types/game'

interface BuildingUpgradeModalProps {
  building: Building
  currentGold: number
  onUpgrade: () => void
  onClose: () => void
}

export default function BuildingUpgradeModal({
  building,
  currentGold,
  onUpgrade,
  onClose
}: BuildingUpgradeModalProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  
  const canUpgrade = building.level < building.maxLevel
  // Le coût pour upgrader est le coût du niveau suivant (level + 1)
  const upgradeCost = canUpgrade ? building.upgradeCosts[building.level + 1] : 0
  const hasEnoughGold = currentGold >= upgradeCost
  const currentBonus = building.bonuses.find(b => b.level === building.level)
  const nextBonus = building.bonuses.find(b => b.level === building.level + 1)

  const handleUpgradeClick = () => {
    if (hasEnoughGold && canUpgrade) {
      setShowConfirmation(true)
    }
  }

  const handleConfirmUpgrade = () => {
    setIsUpgrading(true)
    
    // Animation d'amélioration
    setTimeout(() => {
      onUpgrade()
      setIsUpgrading(false)
    }, 1500)
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5000,
        padding: '20px',
        animation: 'fadeIn 0.3s ease-in-out'
      }}
      onClick={!isUpgrading ? onClose : undefined}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          25% { transform: scale(1.2) rotate(90deg); opacity: 0.8; }
          50% { transform: scale(0.8) rotate(180deg); opacity: 0.6; }
          75% { transform: scale(1.2) rotate(270deg); opacity: 0.8; }
        }
        @keyframes upgrading {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
      
      <div
        style={{
          backgroundColor: 'rgba(20, 20, 20, 0.98)',
          border: '3px solid #ffc107',
          borderRadius: '20px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 10px 50px rgba(255, 193, 7, 0.4)',
          animation: isUpgrading ? 'upgrading 0.5s infinite' : 'slideUp 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animation d'amélioration */}
        {isUpgrading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '20px',
            zIndex: 10
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '80px',
                marginBottom: '20px',
                animation: 'sparkle 1s infinite'
              }}>
                ✨
              </div>
              <div style={{
                fontSize: '24px',
                color: '#ffc107',
                fontWeight: 'bold'
              }}>
                Amélioration en cours...
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && !isUpgrading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            borderRadius: '20px',
            zIndex: 10,
            padding: '40px'
          }}>
            <div style={{
              backgroundColor: 'rgba(40, 40, 40, 0.98)',
              border: '3px solid #ffc107',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '400px',
              width: '100%',
              animation: 'slideUp 0.3s ease-out'
            }}>
              <h3 style={{
                fontSize: '24px',
                color: '#ffc107',
                marginBottom: '20px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                ⚠️ Confirmation
              </h3>
              
              <p style={{
                fontSize: '16px',
                color: '#ddd',
                marginBottom: '25px',
                textAlign: 'center',
                lineHeight: '1.6'
              }}>
                Voulez-vous améliorer<br/>
                <strong style={{ color: '#ffc107' }}>{building.name}</strong><br/>
                au niveau <strong style={{ color: '#ffc107' }}>{building.level + 1}</strong> ?
              </p>

              <div style={{
                backgroundColor: 'rgba(139, 69, 19, 0.3)',
                border: '2px solid #d4af37',
                borderRadius: '10px',
                padding: '15px',
                marginBottom: '25px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#ffecb3', marginBottom: '5px' }}>
                  Coût
                </div>
                <div style={{ fontSize: '28px', color: '#d4af37', fontWeight: 'bold' }}>
                  💰 {upgradeCost} or
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '15px'
              }}>
                <button
                  onClick={() => setShowConfirmation(false)}
                  style={{
                    flex: 1,
                    padding: '15px',
                    backgroundColor: '#555',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#666'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#555'
                  }}
                >
                  Annuler
                </button>
                
                <button
                  onClick={handleConfirmUpgrade}
                  style={{
                    flex: 1,
                    padding: '15px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#218838'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#28a745'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  ✓ Confirmer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{
          padding: '30px',
          borderBottom: '2px solid #ffc107',
          backgroundColor: 'rgba(139, 69, 19, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '10px'
              }}>
                <span style={{ fontSize: '48px' }}>{building.icon}</span>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#ffc107',
                  margin: 0
                }}>
                  {building.name}
                </h2>
              </div>
              <p style={{
                color: '#bbb',
                margin: 0,
                fontSize: '16px'
              }}>
                {building.description}
              </p>
            </div>
            
            <button
              onClick={onClose}
              disabled={isUpgrading}
              style={{
                fontSize: '32px',
                color: '#666',
                background: 'none',
                border: 'none',
                cursor: isUpgrading ? 'not-allowed' : 'pointer',
                padding: '5px 10px',
                transition: 'all 0.2s',
                lineHeight: 1,
                opacity: isUpgrading ? 0.3 : 1
              }}
              onMouseEnter={(e) => {
                if (!isUpgrading) {
                  e.currentTarget.style.color = '#fff'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Corps */}
        <div style={{ padding: '30px' }}>
          {/* Niveau actuel */}
          <div style={{
            backgroundColor: 'rgba(50, 50, 50, 0.5)',
            border: '2px solid #555',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '25px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '15px'
            }}>
              <span style={{
                color: '#ffc107',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                📊 Niveau actuel
              </span>
              <span style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                {building.level} / {building.maxLevel}
              </span>
            </div>
            
            {/* Barre de progression */}
            <div style={{
              height: '8px',
              backgroundColor: '#333',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '15px'
            }}>
              <div
                style={{
                  height: '100%',
                  backgroundColor: '#ffc107',
                  width: `${(building.level / building.maxLevel) * 100}%`,
                  transition: 'all 0.5s ease-out'
                }}
              />
            </div>

            {currentBonus && (
              <div style={{
                color: '#28a745',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>✓</span>
                <span>{currentBonus.description}</span>
              </div>
            )}
          </div>

          {/* Amélioration ou Max Level */}
          {canUpgrade ? (
            <div style={{
              backgroundColor: 'rgba(255, 193, 7, 0.2)',
              border: '3px solid #ffc107',
              borderRadius: '15px',
              padding: '25px'
            }}>
              <h3 style={{
                color: '#ffc107',
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '15px'
              }}>
                ⬆️ Amélioration → Niveau {building.level + 1}
              </h3>
              
              {nextBonus && (
                <div style={{
                  color: '#90ee90',
                  fontSize: '16px',
                  marginBottom: '20px',
                  padding: '15px',
                  backgroundColor: 'rgba(40, 167, 69, 0.2)',
                  borderRadius: '10px',
                  border: '2px solid rgba(40, 167, 69, 0.4)'
                }}>
                  <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                    ⚡ Nouveau bonus :
                  </div>
                  <div>{nextBonus.description}</div>
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                backgroundColor: 'rgba(139, 69, 19, 0.3)',
                borderRadius: '10px',
                border: '2px solid #d4af37'
              }}>
                <span style={{ color: '#ffecb3', fontSize: '18px' }}>
                  💰 Coût d'amélioration :
                </span>
                <span style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: hasEnoughGold ? '#d4af37' : '#ff4444'
                }}>
                  {upgradeCost} or
                </span>
              </div>

              {!hasEnoughGold && (
                <div style={{
                  color: '#ff4444',
                  fontSize: '14px',
                  marginTop: '15px',
                  textAlign: 'center',
                  padding: '10px',
                  backgroundColor: 'rgba(255, 68, 68, 0.2)',
                  borderRadius: '8px'
                }}>
                  ⚠️ Or insuffisant (vous avez {currentGold} pièces, il manque {upgradeCost - currentGold} or)
                </div>
              )}
            </div>
          ) : (
            <div style={{
              backgroundColor: 'rgba(40, 167, 69, 0.2)',
              border: '3px solid #28a745',
              borderRadius: '15px',
              padding: '30px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏆</div>
              <p style={{
                color: '#28a745',
                fontSize: '20px',
                fontWeight: 'bold',
                margin: 0
              }}>
                Bâtiment au niveau maximum !
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 30px',
          borderTop: '2px solid #ffc107',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          gap: '15px'
        }}>
          <button
            onClick={onClose}
            disabled={isUpgrading}
            style={{
              flex: 1,
              padding: '15px',
              backgroundColor: '#555',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isUpgrading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              opacity: isUpgrading ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!isUpgrading) {
                e.currentTarget.style.backgroundColor = '#666'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#555'
            }}
          >
            Fermer
          </button>
          
          {canUpgrade && (
            <button
              onClick={handleUpgradeClick}
              disabled={!hasEnoughGold || isUpgrading}
              style={{
                flex: 1,
                padding: '15px',
                backgroundColor: hasEnoughGold && !isUpgrading ? '#28a745' : '#444',
                color: hasEnoughGold && !isUpgrading ? 'white' : '#888',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: hasEnoughGold && !isUpgrading ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (hasEnoughGold && !isUpgrading) {
                  e.currentTarget.style.backgroundColor = '#218838'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = hasEnoughGold && !isUpgrading ? '#28a745' : '#444'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {hasEnoughGold ? '⚡ Améliorer' : '🔒 Or insuffisant'}
            </button>
          )}
        </div>

        {/* Note MVP */}
        <p style={{
          color: '#666',
          fontSize: '12px',
          textAlign: 'center',
          padding: '10px',
          margin: 0,
          fontStyle: 'italic'
        }}>
          Note : Les bonus sont actuellement visuels uniquement (MVP)
        </p>
      </div>
    </div>
  )
}
