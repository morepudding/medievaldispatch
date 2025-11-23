'use client'

import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: 'rgba(40, 167, 69, 0.95)',
          borderColor: '#28a745',
          icon: '✓'
        }
      case 'error':
        return {
          backgroundColor: 'rgba(220, 53, 69, 0.95)',
          borderColor: '#dc3545',
          icon: '✖'
        }
      case 'info':
        return {
          backgroundColor: 'rgba(68, 136, 255, 0.95)',
          borderColor: '#4488ff',
          icon: 'ℹ'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: styles.backgroundColor,
        color: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        border: `2px solid ${styles.borderColor}`,
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        maxWidth: '500px',
        animation: isExiting ? 'toastExit 0.3s ease-in-out' : 'toastEnter 0.3s ease-in-out',
        backdropFilter: 'blur(10px)'
      }}
    >
      <style>{`
        @keyframes toastEnter {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes toastExit {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `}</style>

      {/* Icon */}
      <div style={{
        fontSize: '24px',
        fontWeight: 'bold',
        flexShrink: 0
      }}>
        {styles.icon}
      </div>

      {/* Message */}
      <div style={{
        fontSize: '16px',
        fontWeight: '500',
        flex: 1,
        lineHeight: '1.4'
      }}>
        {message}
      </div>

      {/* Close button */}
      <button
        onClick={() => {
          setIsExiting(true)
          setTimeout(onClose, 300)
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '4px',
          opacity: 0.7,
          transition: 'opacity 0.2s',
          lineHeight: 1
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.7'
        }}
      >
        ×
      </button>
    </div>
  )
}

// Toast container component
interface ToastContainerProps {
  toasts: Array<{
    id: string
    message: string
    type: ToastType
    duration?: number
  }>
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            position: 'fixed',
            top: `${20 + index * 90}px`,
            right: '20px',
            zIndex: 10000 - index // Higher toasts have lower z-index so they slide under
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </>
  )
}

// Hook for using toasts
export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string
    message: string
    type: ToastType
    duration?: number
  }>>([])

  const showToast = (message: string, type: ToastType, duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return {
    toasts,
    showToast,
    removeToast,
    showSuccess: (message: string, duration?: number) => showToast(message, 'success', duration),
    showError: (message: string, duration?: number) => showToast(message, 'error', duration),
    showInfo: (message: string, duration?: number) => showToast(message, 'info', duration)
  }
}
