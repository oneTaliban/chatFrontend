// CYBER-AD CONFIGURATION CENTER
// MANUAL ENV FALLBACK SYSTEM - BYPASS VITE ENV ISSUES

export const CYBER_CONFIG = {
  // ADSTERRA ZONE IDs - SET THESE MANUALLY OR VIA ENV
  ZONES: {
    // BANNER ADS (728x90, 300x250, 970x90)
    BANNER: import.meta.env.VITE_BANNER_ZONE_ID || 'YOUR_BANNER_ZONE_ID_HERE',
    
    // NATIVE ADS (Responsive)
    NATIVE: import.meta.env.VITE_NATIVE_ZONE_ID || 'YOUR_NATIVE_ZONE_ID_HERE',
    
    // POPUNDER ADS
    POPUNDER: import.meta.env.VITE_POPUNDER_ZONE_ID || 'YOUR_POPUNDER_ZONE_ID_HERE',
    
    // ADDITIONAL ZONES FOR REDUNDANCY
    BANNER_728x90: import.meta.env.VITE_BANNER_728x90 || 'YOUR_BANNER_728x90_ZONE',
    BANNER_300x250: import.meta.env.VITE_BANNER_300x250 || 'YOUR_BANNER_300x250_ZONE',
    BANNER_970x90: import.meta.env.VITE_BANNER_970x90 || 'YOUR_BANNER_970x90_ZONE',
    NATIVE_300x250: import.meta.env.VITE_NATIVE_300x250 || 'YOUR_NATIVE_300x250_ZONE'
  },
  
  // SYSTEM CONTROLS
  ENABLED: import.meta.env.VITE_ADSTERRA_ENABLED === 'true' || process.env.NODE_ENV === 'production',
  DEBUG: import.meta.env.VITE_ADSTERRA_DEBUG === 'true' || process.env.NODE_ENV === 'development',
  STEALTH_MODE: import.meta.env.VITE_STEALTH_MODE === 'true',
  
  // PERFORMANCE SETTINGS
  LOAD_DELAY: parseInt(import.meta.env.VITE_AD_LOAD_DELAY) || 1000,
  POPUNDER_DELAY: parseInt(import.meta.env.VITE_POPUNDER_DELAY) || 5000,
  RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_RETRY_ATTEMPTS) || 3,
  
  // UI SETTINGS
  THEME: {
    PRIMARY: '#00ff41',     // Matrix Green
    SECONDARY: '#0080ff',   // Hacker Blue
    ACCENT: '#bf00ff',      // Hacker Purple
    DANGER: '#ff003c',      // Hacker Red
    BG_DARK: '#0a0a0a',     // Terminal BG
    BG_HEADER: '#1a1a1a',   // Terminal Header
    BORDER: 'rgba(50, 50, 50, 0.8)'
  },
  
  // ANIMATION SETTINGS
  ANIMATIONS: {
    GLITCH_DURATION: 0.3,
    ENTRY_DURATION: 0.5,
    PULSE_INTERVAL: 2
  }
}

// FALLBACK CHECK - LOG WARNINGS FOR MISSING CONFIG
export const validateConfig = () => {
  const warnings = []
  
  if (CYBER_CONFIG.ZONES.BANNER.includes('YOUR_')) {
    warnings.push('BANNER_ZONE_ID not configured. Using placeholder.')
  }
  
  if (CYBER_CONFIG.ZONES.NATIVE.includes('YOUR_')) {
    warnings.push('NATIVE_ZONE_ID not configured. Using placeholder.')
  }
  
  if (CYBER_CONFIG.ZONES.POPUNDER.includes('YOUR_')) {
    warnings.push('POPUNDER_ZONE_ID not configured. Popunder disabled.')
  }
  
  if (warnings.length > 0 && CYBER_CONFIG.DEBUG) {
    console.warn('%c[CYBER-CONFIG] :: CONFIGURATION WARNINGS:', 
      'color: #ffaa00; font-family: monospace; font-weight: bold;')
    warnings.forEach(warning => {
      console.warn(`%c  ⚠ ${warning}`, 'color: #ffaa00; font-family: monospace;')
    })
  }
  
  return {
    isValid: !CYBER_CONFIG.ZONES.BANNER.includes('YOUR_') || 
             !CYBER_CONFIG.ZONES.NATIVE.includes('YOUR_'),
    warnings
  }
}

// SYSTEM STATUS
export const SYSTEM_STATUS = {
  INITIALIZING: 'INITIALIZING',
  READY: 'SYSTEM_READY',
  ERROR: 'SYSTEM_ERROR',
  DISABLED: 'SYSTEM_DISABLED',
  DEV_MODE: 'DEV_MODE_ACTIVE'
}