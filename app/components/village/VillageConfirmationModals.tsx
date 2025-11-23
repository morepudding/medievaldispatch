'use client'

import type { GameState } from '../../types/game'

interface VillageConfirmationModalsProps {
  showNextDay: boolean
  showReset: boolean
  currentDay: number
  isTransitioning: boolean
  gameState: GameState
  onConfirmNextDay: () => void
  onConfirmReset: () => void
  onCancelNextDay: () => void
  onCancelReset: () => void
}

export default function VillageConfirmationModals({
  showNextDay,
  showReset,
  currentDay,
  isTransitioning,
  gameState,
  onConfirmNextDay,
  onConfirmReset,
  onCancelNextDay,
  onCancelReset
}: VillageConfirmationModalsProps) {
  return (
    <>
      {/* Modal Confirmation Jour Suivant */}
      {showNextDay && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 5000,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(15px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div style={{
            backgroundColor: 'rgba(20, 20, 20, 0.95)',
            border: '3px solid #28a745',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '600px',
            width: '90%',
            boxShadow: '0 10px 50px rgba(40, 167, 69, 0.5)',
            animation: 'slideUp 0.4s ease-out',
            textAlign: 'center'
          }}>
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
              }
            `}</style>
            
            {/* Titre */}
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#28a745',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px'
            }}>
              <span>📅</span>
              <span>Passer au Jour {currentDay + 1} ?</span>
            </div>
            
            {/* Récapitulatif */}
            <div style={{
              backgroundColor: 'rgba(40, 40, 40, 0.6)',
              border: '2px solid #444',
              borderRadius: '15px',
              padding: '25px',
              marginBottom: '30px',
              textAlign: 'left'
            }}>
              <div style={{
                fontSize: '18px',
                color: '#bbb',
                marginBottom: '20px',
                fontWeight: 'bold',
                textAlign: 'center',
                borderBottom: '1px solid #555',
                paddingBottom: '15px'
              }}>
                📊 Récapitulatif du Jour {currentDay}
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {/* Or restant */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid #d4af37',
                  borderRadius: '10px'
                }}>
                  <span style={{ fontSize: '16px', color: '#ddd' }}>💰 Or restant</span>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#d4af37' }}>
                    {gameState.gold} or
                  </span>
                </div>
                
                {/* Dialogues lus */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: 'rgba(68, 136, 255, 0.1)',
                  border: '1px solid #4488ff',
                  borderRadius: '10px'
                }}>
                  <span style={{ fontSize: '16px', color: '#ddd' }}>💬 Dialogues lus</span>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#4488ff' }}>
                    {gameState.readDialogues.length} / {gameState.availableDialogues.length}
                  </span>
                </div>
                
                {/* Bâtiments améliorés */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 193, 7, 0.1)',
                  border: '1px solid #ffc107',
                  borderRadius: '10px'
                }}>
                  <span style={{ fontSize: '16px', color: '#ddd' }}>✨ Bâtiments améliorés</span>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffc107' }}>
                    {gameState.buildings.filter(b => b.level > 1).length} / {gameState.buildings.length}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Message d'avertissement */}
            <div style={{
              backgroundColor: 'rgba(255, 193, 7, 0.15)',
              border: '2px solid #ffc107',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '30px',
              fontSize: '14px',
              color: '#ffeb3b',
              lineHeight: '1.6'
            }}>
              ⚠️ <strong>Attention :</strong> En passant au jour suivant, vous démarrerez un nouveau dispatch.
              Assurez-vous d'avoir terminé toutes les actions souhaitées !
            </div>
            
            {/* Boutons */}
            <div style={{
              display: 'flex',
              gap: '15px'
            }}>
              {/* Bouton Annuler */}
              <button
                onClick={onCancelNextDay}
                style={{
                  flex: 1,
                  padding: '18px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5a6268'
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#6c757d'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                ✖️ Annuler
              </button>
              
              {/* Bouton Confirmer */}
              <button
                onClick={onConfirmNextDay}
                style={{
                  flex: 1,
                  padding: '18px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(40, 167, 69, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#218838'
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#28a745'
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.4)'
                }}
              >
                ✓ Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmation Reset */}
      {showReset && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 3300,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div style={{
            backgroundColor: 'rgba(40, 40, 40, 0.95)',
            border: '3px solid #dc3545',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 50px rgba(220, 53, 69, 0.5)',
            animation: 'slideUp 0.3s ease-out'
          }}>
            {/* Titre */}
            <h2 style={{
              fontSize: '28px',
              color: '#dc3545',
              textAlign: 'center',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>
              ⚠️ Confirmer la Réinitialisation
            </h2>

            {/* Message */}
            <div style={{
              fontSize: '16px',
              color: '#ddd',
              lineHeight: '1.6',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              Êtes-vous sûr de vouloir réinitialiser votre partie ?
              <br />
              <br />
              <strong style={{ color: '#ff6b6b' }}>
                Toute votre progression sera perdue :
              </strong>
              <br />
              • Or collecté
              <br />
              • Dialogues lus
              <br />
              • Bâtiments améliorés
              <br />
              • Progression des jours
            </div>

            {/* Boutons */}
            <div style={{
              display: 'flex',
              gap: '15px'
            }}>
              {/* Bouton Annuler */}
              <button
                onClick={onCancelReset}
                style={{
                  flex: 1,
                  padding: '15px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5a6268'
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#6c757d'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                ✖️ Annuler
              </button>
              
              {/* Bouton Confirmer Reset */}
              <button
                onClick={onConfirmReset}
                style={{
                  flex: 1,
                  padding: '15px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(220, 53, 69, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#c82333'
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc3545'
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.4)'
                }}
              >
                🔄 Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay de transition */}
      {isTransitioning && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9998,
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.8s ease-in-out'
        }}>
          <div style={{
            fontSize: '32px',
            color: '#28a745',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌅</div>
            <div>Passage au jour suivant...</div>
          </div>
        </div>
      )}
    </>
  )
}
