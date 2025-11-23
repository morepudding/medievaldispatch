'use client'

import { useGame } from '../contexts/GameContext'

export default function GameStateIndicator() {
  const { gameState, isSaving } = useGame()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '12px 20px',
      backgroundColor: 'rgba(20, 20, 20, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
      animation: 'slideDown 0.3s ease-out'
    }}>
      {/* Day Counter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        border: '1px solid #d4af37',
        borderRadius: '8px'
      }}>
        <span style={{ fontSize: '16px' }}>📅</span>
        <span style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#d4af37'
        }}>
          Jour {gameState.currentDay}/3
        </span>
      </div>

      {/* Gold Counter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        border: '1px solid #d4af37',
        borderRadius: '8px'
      }}>
        <span style={{ fontSize: '16px' }}>💰</span>
        <span style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#d4af37'
        }}>
          {gameState.gold} or
        </span>
      </div>

      {/* Dispatch Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: gameState.isInDispatch 
          ? 'rgba(255, 193, 7, 0.2)' 
          : 'rgba(40, 167, 69, 0.2)',
        border: `1px solid ${gameState.isInDispatch ? '#ffc107' : '#28a745'}`,
        borderRadius: '8px'
      }}>
        <span style={{ 
          fontSize: '16px',
          animation: gameState.isInDispatch ? 'pulse 2s infinite' : 'none'
        }}>
          {gameState.isInDispatch ? '⏳' : '✓'}
        </span>
        <span style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: gameState.isInDispatch ? '#ffc107' : '#28a745'
        }}>
          {gameState.isInDispatch ? 'Dispatch en cours' : 'Dispatch terminé'}
        </span>
      </div>

      {/* Save Indicator */}
      {isSaving && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 10px',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          border: '1px solid #3b82f6',
          borderRadius: '8px',
          animation: 'pulse 1s ease-in-out infinite'
        }}>
          <span style={{ fontSize: '12px', color: '#3b82f6' }}>💾</span>
          <span style={{
            fontSize: '12px',
            color: '#3b82f6'
          }}>
            Sauvegarde...
          </span>
        </div>
      )}
    </div>
  )
}
