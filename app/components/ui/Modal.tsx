import React from 'react'
import { COLORS, SPACING, TRANSITIONS, BORDER_RADIUS, SHADOWS, Z_INDEX } from '../../lib/constants/styles'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeMap = {
    sm: '400px',
    md: '600px',
    lg: '800px',
    xl: '1000px',
  }

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background.overlay,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: Z_INDEX.modal,
    padding: SPACING.md,
    animation: 'fadeIn 0.2s ease-out',
  }

  const modalStyle: React.CSSProperties = {
    backgroundColor: COLORS.background.dark,
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: SHADOWS.lg,
    maxWidth: sizeMap[size],
    width: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${COLORS.border.default}`,
    animation: 'slideUp 0.3s ease-out',
  }

  const headerStyle: React.CSSProperties = {
    padding: SPACING.lg,
    borderBottom: `1px solid ${COLORS.border.default}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  const bodyStyle: React.CSSProperties = {
    padding: SPACING.lg,
    overflowY: 'auto',
    flex: 1,
  }

  const footerStyle: React.CSSProperties = {
    padding: SPACING.lg,
    borderTop: `1px solid ${COLORS.border.default}`,
    display: 'flex',
    gap: SPACING.sm,
    justifyContent: 'flex-end',
  }

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: COLORS.text.primary,
    cursor: 'pointer',
    fontSize: '1.5rem',
    padding: SPACING.xs,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: TRANSITIONS.fast,
    opacity: 0.7,
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={modalStyle}>
        {(title || showCloseButton) && (
          <div style={headerStyle}>
            {title && (
              <h2 style={{ margin: 0, color: COLORS.text.primary, fontSize: '1.5rem' }}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                style={closeButtonStyle}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div style={bodyStyle}>{children}</div>
        {footer && <div style={footerStyle}>{footer}</div>}
      </div>
    </div>
  )
}
