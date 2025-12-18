import React, { useEffect, useState } from 'react'
import CyberBanner from './CyberBanner'
import CyberNative from './CyberNative'
import { adsterra } from '../../services/adsterra.service'
import { Terminal, Cpu, Shield, Lock, Unlock } from 'lucide-react'

const CyberAdManager = ({ 
  children, 
  enablePopunder = true,
  showTerminal = false,
  stealthMode = false
}) => {
  const [adsEnabled, setAdsEnabled] = useState(true)
  const [systemStatus, setSystemStatus] = useState('BOOTING...')
  const [terminalVisible, setTerminalVisible] = useState(showTerminal)

  useEffect(() => {
    // INITIALIZE CYBER SYSTEM
    const initialize = async () => {
      setSystemStatus('INITIALIZING_AD_PROTOCOL')
      
      try {
        await adsterra.initialize()
        setSystemStatus('SYSTEM_READY')
        
        // LOG SYSTEM STATUS
        console.log('%c[ADSTERRA-CYBER] :: SYSTEM ONLINE', 
          'color: #00ff41; font-family: monospace; font-size: 14px;')
        console.log('%c[ADSTERRA-CYBER] :: STEALTH MODE: ' + (stealthMode ? 'ACTIVE' : 'INACTIVE'), 
          'color: #0080ff; font-family: monospace;')
      } catch (error) {
        setSystemStatus('SYSTEM_ERROR')
        console.error('%c[ADSTERRA-CYBER] :: INITIALIZATION FAILED', 
          'color: #ff003c; font-family: monospace; font-size: 14px;')
      }
    }

    initialize()

    // CYBER-EFFECTS ON SCROLL
    const handleScroll = () => {
      if (stealthMode) return
      
      const scrollY = window.scrollY
      const cyberElements = document.querySelectorAll('.cyber-pulse')
      
      cyberElements.forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.style.setProperty('--pulse-intensity', 
            Math.min(1, (window.innerHeight - rect.top) / window.innerHeight))
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [stealthMode])

  const toggleAds = () => {
    setAdsEnabled(!adsEnabled)
    setSystemStatus(!adsEnabled ? 'ADS_ENABLED' : 'ADS_DISABLED')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-cyber-dark)] to-[var(--color-terminal-bg)]">
      {/* SYSTEM STATUS BAR */}
      {/* <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-terminal-header)] border-b border-[var(--color-terminal-border)]">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[var(--color-matrix-green)] animate-pulse" />
                <span className="font-mono text-sm text-[var(--color-hacker-green)]">
                  ADSTERRA v2.0
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`
                  w-2 h-2 rounded-full
                  ${systemStatus === 'SYSTEM_READY' ? 'bg-[var(--color-matrix-green)]' : 
                    systemStatus.includes('ERROR') ? 'bg-[var(--color-hacker-red)] animate-pulse' : 
                    'bg-[var(--color-hacker-blue)] animate-pulse'}
                `} />
                <span className={`
                  font-mono text-xs
                  ${systemStatus === 'SYSTEM_READY' ? 'text-[var(--color-matrix-green)]' : 
                    systemStatus.includes('ERROR') ? 'text-[var(--color-hacker-red)]' : 
                    'text-[var(--color-hacker-blue)]'}
                `}>
                  {systemStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleAds}
                className={`
                  group relative flex items-center gap-2 px-3 py-1 rounded
                  border ${adsEnabled ? 'border-[var(--color-matrix-green)]' : 'border-[var(--color-hacker-red)]'}
                  bg-gradient-to-r from-transparent ${adsEnabled ? 'to-[var(--color-matrix-green)]/10' : 'to-[var(--color-hacker-red)]/10'}
                  hover:scale-105 transition-all duration-300
                `}
              >
                {adsEnabled ? (
                  <Lock className="h-3 w-3 text-[var(--color-matrix-green)]" />
                ) : (
                  <Unlock className="h-3 w-3 text-[var(--color-hacker-red)]" />
                )}
                <span className={`
                  font-mono text-xs
                  ${adsEnabled ? 'text-[var(--color-matrix-green)]' : 'text-[var(--color-hacker-red)]'}
                `}>
                  {adsEnabled ? 'ADS::ACTIVE' : 'ADS::DISABLED'}
                </span>
                <div className={`
                  absolute -inset-1 blur-md opacity-0 group-hover:opacity-20 transition-opacity
                  ${adsEnabled ? 'bg-[var(--color-matrix-green)]' : 'bg-[var(--color-hacker-red)]'}
                `} />
              </button>

              <button
                onClick={() => setTerminalVisible(!terminalVisible)}
                className="p-1 rounded border border-[var(--color-terminal-border)] hover:border-[var(--color-hacker-blue)]"
              >
                <Terminal className="h-4 w-4 text-[var(--color-hacker-blue)]" />
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/* TERMINAL OVERLAY */}
      {terminalVisible && (
        <div className="fixed top-12 left-4 right-4 z-40 bg-[var(--color-terminal-bg)] border border-[var(--color-terminal-border)] rounded-lg shadow-2xl">
          <div className="p-3 border-b border-[var(--color-terminal-border)] bg-[var(--color-terminal-header)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[var(--color-matrix-green)]" />
                <span className="font-mono text-sm text-[var(--color-hacker-green)]">
                  ADSTERRA_DEBUG_TERMINAL
                </span>
              </div>
              <button
                onClick={() => setTerminalVisible(false)}
                className="text-[var(--color-cyber-gray)] hover:text-[var(--color-hacker-red)]"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="p-4 h-64 overflow-auto">
            <pre className="font-mono text-xs text-[var(--color-hacker-green)]">
              {adsterra.getStatus()?.logs?.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </pre>
          </div>
        </div>
      )}

      {/* TOP BANNER */}
      {adsEnabled && (
        <div className="pt-12">
          <div className="container mx-auto px-4 py-4">
            <CyberBanner 
              format="horizontal"
              showClose={true}
              stealthMode={stealthMode}
              className="cyber-pulse"
            />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR ADS */}
          <aside className="lg:col-span-1 space-y-6">
            {adsEnabled && (
              <>
                <CyberNative 
                  theme="dark"
                  className="cyber-pulse"
                />
                <CyberBanner 
                  format="vertical"
                  className="cyber-pulse"
                />
              </>
            )}
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-3">
            {children}
            
            {/* IN-CONTENT ADS */}
            {adsEnabled && (
              <div className="my-12">
                <CyberBanner 
                  format="rectangle"
                  className="cyber-pulse"
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* BOTTOM BANNER */}
      {adsEnabled && (
        <div className="sticky bottom-0 z-40 bg-[var(--color-terminal-header)] border-t border-[var(--color-terminal-border)]">
          <div className="container mx-auto px-4 py-3">
            <CyberBanner 
              format="leaderboard"
              showClose={false}
              className="cyber-pulse"
            />
          </div>
        </div>
      )}

      {/* MATRIX RAIN OVERLAY */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-[var(--color-matrix-green)] text-xs font-mono animate-[matrixRain_3s_linear_infinite]"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CyberAdManager