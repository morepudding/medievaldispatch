import React from 'react'
import { COLORS, SPACING, TRANSITIONS, BORDER_RADIUS } from '../../lib/constants/styles'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  icon?: React.ReactNode
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    fontWeight: 500,
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: `all ${TRANSITIONS.normal}`,
    opacity: disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
    fontFamily: 'inherit',
  }

  // Size styles
  const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    sm: {
      padding: `${SPACING.xs} ${SPACING.sm}`,
      fontSize: '0.875rem',
      borderRadius: BORDER_RADIUS.sm,
    },
    md: {
      padding: `${SPACING.sm} ${SPACING.md}`,
      fontSize: '1rem',
      borderRadius: BORDER_RADIUS.md,
    },
    lg: {
      padding: `${SPACING.md} ${SPACING.lg}`,
      fontSize: '1.125rem',
      borderRadius: BORDER_RADIUS.lg,
    },
  }

  // Variant styles
  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: COLORS.primary.gold,
      color: COLORS.text.dark,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    secondary: {
      backgroundColor: COLORS.background.cardLight,
      color: COLORS.text.light,
      border: `1px solid ${COLORS.border.default}`,
    },
    danger: {
      backgroundColor: COLORS.status.error,
      color: '#fff',
      boxShadow: '0 2px 4px rgba(220,53,69,0.3)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: COLORS.text.light,
      border: `1px solid ${COLORS.border.light}`,
    },
    success: {
      backgroundColor: COLORS.status.success,
      color: '#fff',
      boxShadow: '0 2px 4px rgba(40,167,69,0.3)',
    },
  }

  // Hover styles
  const getHoverStyles = (): React.CSSProperties => {
    if (disabled || loading) return {}

    const hoverMap: Record<ButtonVariant, React.CSSProperties> = {
      primary: {
        backgroundColor: COLORS.primary.goldDark,
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
      },
      secondary: {
        backgroundColor: COLORS.background.card,
        borderColor: COLORS.border.hover,
      },
      danger: {
        backgroundColor: '#c82333',
        transform: 'translateY(-1px)',
      },
      ghost: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderColor: COLORS.border.default,
      },
      success: {
        backgroundColor: '#218838',
        transform: 'translateY(-1px)',
      },
    }

    return hoverMap[variant]
  }

  const [isHovered, setIsHovered] = React.useState(false)

  const finalStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...(isHovered ? getHoverStyles() : {}),
  }

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={className}
      style={finalStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {loading && (
        <span
          className="animate-spin"
          style={{
            display: 'inline-block',
            width: '1em',
            height: '1em',
            borderRadius: '50%',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
          }}
        />
      )}
      {icon && !loading && icon}
      {children}
    </button>
  )
}
