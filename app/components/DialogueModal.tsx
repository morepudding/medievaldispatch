'use client'

import { useState } from 'react'
import { Dialogue } from '../types/game'

interface DialogueModalProps {
  dialogue: Dialogue
  onClose: () => void
}

const HERO_PORTRAITS: { [key: string]: string } = {
  'bjorn': '/portraits/bjorn.png',
  'owen': '/portraits/owen.png',
  'vi': '/portraits/vi.png',
  'durun': '/portraits/durun.png',
  'elira': '/portraits/elira.png'
}

export default function DialogueModal({ dialogue, onClose }: DialogueModalProps) {
  const [currentExchangeIndex, setCurrentExchangeIndex] = useState(0)
  
  const currentExchange = dialogue.exchanges[currentExchangeIndex]
  const isLastExchange = currentExchangeIndex === dialogue.exchanges.length - 1
  
  const heroPortrait = HERO_PORTRAITS[dialogue.heroName.toLowerCase()] || '/portraits/bjorn.png'

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case 'happy': return '#ffd700'
      case 'sad': return '#6495ed'
      case 'angry': return '#ff4444'
      case 'surprised': return '#da70d6'
      default: return '#d1d5db'
    }
  }

  const getEmotionIcon = (emotion?: string) => {
    switch (emotion) {
      case 'happy': return '😊'
      case 'sad': return '😔'
      case 'angry': return '😠'
      case 'surprised': return '😲'
      case 'neutral': return '😐'
      default: return '💬'
    }
  }
  
  const handleNext = () => {
    if (!isLastExchange) {
      setCurrentExchangeIndex(prev => prev + 1)
    } else {
      onClose()
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5000,
        padding: '20px',
        animation: 'fadeIn 0.3s ease-in-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'rgba(20, 20, 20, 0.98)',
          border: '3px solid #d4af37',
          borderRadius: '20px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 10px 50px rgba(212, 175, 55, 0.4)',
          animation: 'slideUp 0.3s ease-out',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header avec portrait */}
        <div style={{
          padding: '25px',
          borderBottom: '2px solid #d4af37',
          backgroundColor: 'rgba(139, 69, 19, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          {/* Portrait du héros */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #d4af37',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)',
            flexShrink: 0
          }}>
            <img 
              src={heroPortrait}
              alt={dialogue.heroName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#d4af37',
              marginBottom: '5px'
            }}>
              Conversation avec {dialogue.heroName}
            </h2>
            <div style={{
              fontSize: '14px',
              color: '#bbb',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>💬 Échange {currentExchangeIndex + 1}/{dialogue.exchanges.length}</span>
              {!dialogue.isRead && (
                <span style={{
                  backgroundColor: '#4488ff',
                  color: 'white',
                  padding: '3px 8px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  NOUVEAU
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            style={{
              fontSize: '32px',
              color: '#666',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '5px 10px',
              transition: 'all 0.2s',
              lineHeight: 1
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#666'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            ×
          </button>
        </div>

        {/* Corps du dialogue */}
        <div style={{
          flex: 1,
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '300px',
          overflow: 'auto'
        }}>
          <div
            style={{
              animation: 'slideUp 0.4s ease-out',
              display: 'flex',
              justifyContent: currentExchange.speaker === 'player' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                backgroundColor: currentExchange.speaker === 'player' 
                  ? 'rgba(68, 136, 255, 0.2)' 
                  : 'rgba(212, 175, 55, 0.2)',
                border: `3px solid ${currentExchange.speaker === 'player' ? '#4488ff' : '#d4af37'}`,
                borderRadius: '20px',
                padding: '25px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* En-tête du message */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {currentExchange.speaker === 'hero' && currentExchange.emotion && (
                  <span style={{ 
                    fontSize: '28px',
                    animation: 'bounce 1s infinite'
                  }}>
                    {getEmotionIcon(currentExchange.emotion)}
                  </span>
                )}
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '18px',
                  color: currentExchange.speaker === 'player' ? '#4488ff' : '#d4af37'
                }}>
                  {currentExchange.speaker === 'player' ? '🗨️ Vous' : `⚔️ ${dialogue.heroName}`}
                </span>
                {currentExchange.emotion && currentExchange.speaker === 'hero' && (
                  <span style={{
                    fontSize: '12px',
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    ({currentExchange.emotion})
                  </span>
                )}
              </div>

              {/* Texte du message */}
              <p style={{
                color: getEmotionColor(currentExchange.emotion),
                fontSize: '18px',
                lineHeight: '1.7',
                margin: 0
              }}>
                {currentExchange.text}
              </p>
            </div>
          </div>
        </div>

        {/* Footer avec boutons */}
        <div style={{
          padding: '20px 25px',
          borderTop: '2px solid #d4af37',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          gap: '15px',
          alignItems: 'center'
        }}>
          {/* Indicateur de progression */}
          <div style={{
            flex: 1,
            display: 'flex',
            gap: '5px'
          }}>
            {dialogue.exchanges.map((_, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: index <= currentExchangeIndex ? '#d4af37' : '#333',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>

          {/* Boutons */}
          <button
            onClick={handleNext}
            style={{
              padding: '15px 35px',
              backgroundColor: isLastExchange ? '#28a745' : '#d4af37',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}
          >
            {isLastExchange ? (
              <>
                ✓ Fermer
              </>
            ) : (
              <>
                Suivant →
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
