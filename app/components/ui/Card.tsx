import React from 'react'
import { COLORS, SPACING, TRANSITIONS, BORDER_RADIUS, SHADOWS } from '../../lib/constants/styles'

export interface CardProps {
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  hoverable?: boolean
  onClick?: () => void
  variant?: 'default' | 'highlighted' | 'gold'
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  className = '',
  style = {},
  hoverable = false,
  onClick,
  variant = 'default',
}) => {
  const [isHovered, setIsHovered] = React.useState(false)

  const variantStyles: Record<typeof variant, React.CSSProperties> = {
    default: {
      backgroundColor: COLORS.background.card,
      border: `1px solid ${COLORS.border.default}`,
    },
    highlighted: {
      backgroundColor: COLORS.background.cardLight,
      border: `1px solid ${COLORS.border.light}`,
    },
    gold: {
      backgroundColor: COLORS.background.card,
      border: `2px solid ${COLORS.border.gold}`,
      boxShadow: SHADOWS.gold,
    },
  }

  const baseStyle: React.CSSProperties = {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    transition: TRANSITIONS.normal,
    cursor: onClick ? 'pointer' : 'default',
    ...variantStyles[variant],
  }

  const hoverStyle: React.CSSProperties =
    (hoverable || onClick) && isHovered
      ? {
          transform: 'translateY(-2px)',
          boxShadow: SHADOWS.md,
          borderColor: COLORS.border.hover,
        }
      : {}

  const headerStyle: React.CSSProperties = {
    padding: SPACING.md,
    borderBottom: `1px solid ${COLORS.border.default}`,
  }

  const bodyStyle: React.CSSProperties = {
    padding: SPACING.md,
  }

  const footerStyle: React.CSSProperties = {
    padding: SPACING.md,
    borderTop: `1px solid ${COLORS.border.default}`,
  }

  return (
    <div
      className={className}
      style={{ ...baseStyle, ...hoverStyle, ...style }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {header && <div style={headerStyle}>{header}</div>}
      <div style={bodyStyle}>{children}</div>
      {footer && <div style={footerStyle}>{footer}</div>}
    </div>
  )
}
