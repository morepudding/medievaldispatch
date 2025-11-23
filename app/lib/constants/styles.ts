// Tokens de style centralisés pour Medieval Dispatch

export const COLORS = {
  primary: {
    gold: '#d4af37',
    goldDark: '#8B4513',
    goldLight: '#FFD700'
  },
  heroes: {
    bjorn: '#ff4444',
    owen: '#44ff44',
    vi: '#aa44ff',
    durun: '#ff8844',
    elira: '#4488ff'
  },
  status: {
    success: '#28a745',
    successLight: '#90ee90',
    successDark: '#218838',
    error: '#dc3545',
    errorLight: '#ff6b6b',
    warning: '#ffc107',
    info: '#17a2b8',
    infoBlue: '#4169E1'
  },
  background: {
    dark: '#1a1a1a',
    darkTransparent: 'rgba(20, 20, 20, 0.9)',
    overlay: 'rgba(0, 0, 0, 0.85)',
    overlayDark: 'rgba(0, 0, 0, 0.9)',
    overlayDarker: 'rgba(0, 0, 0, 0.95)',
    overlayMedium: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(255, 255, 255, 0.98)',
    card: '#2a2a2a',
    cardLight: '#333',
    cardDark: '#555',
    primary: 'white',
    grey: 'rgba(108, 117, 125, 0.9)',
    greyDark: 'rgba(90, 98, 104, 1)',
    greyMedium: 'rgba(100, 100, 100, 0.5)',
    greyDarker: 'rgba(50, 50, 50, 0.5)',
    brownTransparent: 'rgba(139, 69, 19, 0.3)',
    goldTransparent: 'rgba(212, 175, 55, 0.95)',
    successTransparent: 'rgba(40, 167, 69, 0.2)',
    successFull: 'rgba(40, 167, 69, 1)',
    successSemi: 'rgba(40, 167, 69, 0.9)',
    warningTransparent: 'rgba(255, 193, 7, 0.2)',
    errorTransparent: 'rgba(220, 53, 69, 0.2)'
  },
  text: {
    primary: '#ffffff',
    secondary: '#ffecb3',
    muted: '#999',
    mutedLight: '#888',
    mutedDark: '#bbb',
    light: '#ffffff',
    dark: '#000000',
    darkPrimary: '#333'
  },
  accent: {
    brown: '#8B4513'
  },
  border: {
    default: '#444',
    light: '#666',
    dark: '#555',
    gold: '#d4af37',
    hover: '#888',
    primary: '#1E90FF',
    grey: '#6c757d',
    orange: '#FFA500'
  }
} as const

export const SPACING = {
  xs: '5px',
  sm: '10px',
  md: '20px',
  lg: '40px',
  xl: '60px'
} as const

export const TRANSITIONS = {
  fast: 'all 0.2s ease',
  normal: 'all 0.3s ease',
  medium: 'all 0.3s ease',
  slow: 'all 0.5s ease',
  default: 'filter 0.2s'
} as const

export const BORDER_RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '20px',
  pill: '25px',
  circle: '50%',
  full: '50%'
} as const

export const SHADOWS = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
  md: '0 4px 15px rgba(0, 0, 0, 0.4)',
  lg: '0 6px 20px rgba(0, 0, 0, 0.5)',
  xl: '0 8px 30px rgba(0,0,0,0.4)',
  xxl: '0 10px 50px rgba(212, 175, 55, 0.4)',
  xxxl: '0 8px 25px rgba(0,0,0,0.6)',
  gold: '0 4px 15px rgba(212, 175, 55, 0.4)',
  goldMd: '0 4px 20px rgba(212, 175, 55, 0.6)',
  goldLg: '0 6px 30px rgba(212, 175, 55, 0.9)',
  goldXl: '0 4px 15px rgba(255, 215, 0, 0.6)',
  success: '0 4px 15px rgba(40, 167, 69, 0.4)',
  successXl: '0 6px 20px rgba(40, 167, 69, 0.6)',
  warning: '0 10px 50px rgba(255, 193, 7, 0.4)',
  error: '0 4px 20px rgba(0,0,0,0.4)',
  errorLg: '0 6px 25px rgba(0,0,0,0.5)',
  timer: '0 4px 20px rgba(255, 68, 68, 0.6)',
  timerWarning: '0 4px 20px rgba(255, 193, 7, 0.6)',
  timerGold: '0 4px 20px rgba(255, 215, 0, 0.6)'
} as const

export const Z_INDEX = {
  base: 1,
  dropdown: 100,
  overlay: 1000,
  modal: 2000,
  tooltip: 3000
} as const
