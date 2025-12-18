import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, RefreshCw, Zap, Terminal, Shield } from 'lucide-react'
import { adsterra } from '../../services/adsterra.service'
import gsap from 'gsap'

const CyberBanner = ({ 
  zoneId = null,
  format = 'horizontal',
  className = '',
  showClose = true,
  onClose = () => {},
  onLoad = () => {},
  onError = () => {},
  stealthMode = false
}) => {
  const containerRef = useRef(null)
  const adContainerRef = useRef(null)
  const glitchRef = useRef(null)
  const [containerId] = useState(`cyber-ad-${Math.random().toString(36).substr(2, 9)}`)
  const [isVisible, setIsVisible] = useState(true)
  const [status, setStatus] = useState('INITIALIZING')
  const [glitchActive, setGlitchActive] = useState(false)
  const [hackProgress, setHackProgress] = useState(0)

  const dimensions = {
    horizontal: { width: 728, height: 90 },
    vertical: { width: 300, height: 600 },
    rectangle: { width: 300, height: 250 },
    leaderboard: { width: 970, height: 90 }
  }

  const { width, height } = dimensions[format] || dimensions.horizontal

  // CYBER-GLITCH EFFECT
  const triggerGlitch = () => {
    if (!glitchRef.current) return
    
    setGlitchActive(true)
    
    const glitch = gsap.timeline()
    glitch.to(glitchRef.current, {
      x: () => Math.random() * 10 - 5,
      y: () => Math.random() * 10 - 5,
      duration: 0.05,
      repeat: 15,
      onComplete: () => {
        gsap.to(glitchRef.current, { x: 0, y: 0, duration: 0.1 })
        setGlitchActive(false)
      }
    })
  }

  // HACKER-LOADING ANIMATION
  const simulateHack = () => {
    const hackTimeline = gsap.timeline()
    const progressSteps = [0, 25, 50, 75, 100]
    
    progressSteps.forEach((step, index) => {
      hackTimeline.to({}, {
        duration: 0.3,
        onStart: () => {
          setHackProgress(step)
          if (index % 2 === 0) triggerGlitch()
        }
      })
    })
    
    return hackTimeline
  }

  useEffect(() => {
    if (!adsterra.config.ENABLED) {
      setStatus('DEV_MODE')
      simulateHack().play()
      return
    }

    setStatus('CONNECTING...')
    const hackAnimation = simulateHack()
    
    const adTimeout = setTimeout(() => {
      hackAnimation.play().then(() => {
        if (adContainerRef.current) {
          const success = adsterra.renderBanner(containerId, zoneId)
          
          if (success) {
            setStatus('CONNECTED')
            onLoad()
            
            // CYBER-ENTRY ANIMATION
            gsap.from(containerRef.current, {
              opacity: 0,
              scale: 0.8,
              rotation: 5,
              duration: 0.5,
              ease: 'back.out(1.7)'
            })
            
            // PULSING BORDER
            gsap.to(containerRef.current, {
              borderColor: 'var(--color-hacker-green)',
              duration: 0.3,
              repeat: 3,
              yoyo: true
            })
          } else {
            setStatus('CONNECTION_FAILED')
            onError()
            triggerGlitch()
          }
        }
      })
    }, stealthMode ? 2000 : 500)

    return () => {
      clearTimeout(adTimeout)
      adsterra.cleanup(containerId)
    }
  }, [containerId, zoneId])

  // SHAKE ON ERROR
  useEffect(() => {
    if (status === 'CONNECTION_FAILED' && containerRef.current) {
      gsap.to(containerRef.current, {
        x: [0, 10, -10, 8, -8, 0],
        duration: 0.5,
        ease: 'power2.out'
      })
    }
  }, [status])

  const handleClose = () => {
    if (containerRef.current) {
      // CYBER-SHUTDOWN SEQUENCE
      const shutdown = gsap.timeline()
      
      shutdown
        .to(containerRef.current, {
          scale: 1.1,
          duration: 0.1
        })
        .to(containerRef.current, {
          scale: 0,
          opacity: 0,
          rotation: -15,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            setIsVisible(false)
            onClose()
            adsterra.cleanup(containerId)
          }
        })
    }
  }

  const handleRetry = () => {
    setStatus('REINITIALIZING...')
    adsterra.cleanup(containerId)
    triggerGlitch()
    
    setTimeout(() => {
      const success = adsterra.renderBanner(containerId, zoneId)
      setStatus(success ? 'RECONNECTED' : 'FAILED')
    }, 1000)
  }

  if (!isVisible) return null

  const statusColor = {
    'INITIALIZING': 'var(--color-hacker-blue)',
    'CONNECTING...': 'var(--color-hacker-blue)',
    'CONNECTED': 'var(--color-matrix-green)',
    'DEV_MODE': 'var(--color-hacker-purple)',
    'CONNECTION_FAILED': 'var(--color-hacker-red)',
    'REINITIALIZING...': 'var(--color-hacker-blue)',
    'RECONNECTED': 'var(--color-matrix-green)',
    'FAILED': 'var(--color-hacker-red)'
  }[status]

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative overflow-hidden rounded border-2
        ${className}
        ${glitchActive ? 'border-[var(--color-hacker-red)]' : 'border-[var(--color-terminal-border)]'}
        bg-[var(--color-terminal-bg)]
        shadow-[0_0_20px_rgba(0,255,65,0.1)]
        transition-all duration-300
        hover:shadow-[0_0_30px_rgba(0,255,65,0.2)]
        hover:border-[var(--color-matrix-green)]
      `}
    >
      {/* GLITCH OVERLAY */}
      <div
        ref={glitchRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: glitchActive 
            ? 'linear-gradient(45deg, transparent 49%, var(--color-hacker-red) 50%, transparent 51%)'
            : 'none',
          opacity: glitchActive ? 0.3 : 0
        }}
      />

      {/* STATUS BAR */}
      <div className="flex items-center justify-between px-3 py-2 bg-[var(--color-terminal-header)] border-b border-[var(--color-terminal-border)]">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[var(--color-matrix-green)]" />
          <span className="font-mono text-xs tracking-wider text-[var(--color-hacker-green)]">
            AD::BANNER
          </span>
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: statusColor }}
          />
          <span 
            className="font-mono text-xs"
            style={{ color: statusColor }}
          >
            {status}
          </span>
        </div>

        {showClose && (
          <button
            onClick={handleClose}
            className="
              group relative p-1 rounded
              border border-[var(--color-terminal-border)]
              hover:border-[var(--color-hacker-red)]
              hover:bg-[var(--color-hacker-red)]/10
              transition-all duration-200
            "
            aria-label="Terminate connection"
          >
            <X 
              size={14} 
              className="
                text-[var(--color-cyber-gray)]
                group-hover:text-[var(--color-hacker-red)]
                transition-colors
              " 
            />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--color-hacker-red)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      {/* PROGRESS BAR */}
      {status.includes('INIT') || status.includes('CONNECT') ? (
        <div className="px-3 py-2">
          <div className="h-1 w-full bg-[var(--color-cyber-gray)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--color-hacker-blue)] to-[var(--color-matrix-green)]"
              initial={{ width: '0%' }}
              animate={{ width: `${hackProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-mono text-xs text-[var(--color-hacker-blue)]">
              LOADING::AD_PROTOCOL
            </span>
            <span className="font-mono text-xs text-[var(--color-matrix-green)]">
              {hackProgress}%
            </span>
          </div>
        </div>
      ) : null}

      {/* AD CONTAINER */}
      <div className="p-4">
        <div className="flex items-center justify-center mb-2">
          <Shield size={16} className="text-[var(--color-hacker-purple)] mr-2" />
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-hacker-purple)]">
            SECURE CONNECTION
          </span>
        </div>

        <div
          ref={adContainerRef}
          id={containerId}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            minWidth: `${width}px`,
            minHeight: `${height}px`,
          }}
          className={`
            relative mx-auto flex items-center justify-center
            bg-gradient-to-br from-[var(--color-cyber-dark)] to-[var(--color-cyber-gray)]
            border border-[var(--color-terminal-border)]
            rounded
            overflow-hidden
          `}
        >
          {/* HACKER-STYLE PLACEHOLDER */}
          {!adsterra.config.ENABLED || status === 'DEV_MODE' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="relative">
                <Zap className="h-12 w-12 text-[var(--color-matrix-green)] mb-4 animate-pulse" />
                <div className="absolute inset-0 bg-[var(--color-matrix-green)] blur-lg opacity-20" />
              </div>
              
              <div className="font-mono text-center">
                <div className="text-lg font-bold text-[var(--color-hacker-green)] mb-2">
                  CYBER-AD SPACE
                </div>
                <div className="text-sm text-[var(--color-hacker-blue)] mb-1">
                  {width} × {height}
                </div>
                <div className="text-xs text-[var(--color-cyber-gray)]">
                  [PRODUCTION MODE ACTIVATES ADS]
                </div>
              </div>

              {/* MATRIX RAIN EFFECT */}
              <div className="absolute inset-0 overflow-hidden opacity-10">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-[var(--color-matrix-green)] text-xs font-mono animate-[matrixRain_2s_linear_infinite]"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random() * 2}s`
                    }}
                  >
                    {Math.random() > 0.5 ? '1' : '0'}
                  </div>
                ))}
              </div>
            </div>
          ) : status === 'CONNECTION_FAILED' || status === 'FAILED' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <AlertTriangle className="h-10 w-10 text-[var(--color-hacker-red)] mb-4 animate-bounce" />
              <p className="font-mono text-sm text-[var(--color-hacker-red)] mb-2">
                CONNECTION TERMINATED
              </p>
              <button
                onClick={handleRetry}
                className="
                  group relative flex items-center gap-2
                  px-4 py-2 rounded
                  border border-[var(--color-hacker-red)]
                  bg-gradient-to-r from-transparent to-[var(--color-hacker-red)]/10
                  hover:to-[var(--color-hacker-red)]/20
                  transition-all duration-300
                  hover:scale-105
                "
              >
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform" />
                <span className="font-mono text-xs text-[var(--color-hacker-red)]">
                  REINITIALIZE
                </span>
                <div className="absolute -inset-1 bg-[var(--color-hacker-red)] blur-md opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>
            </div>
          ) : null}
        </div>

        {/* FOOTER */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-cyber-gray)]/50">
            <div className="w-1 h-1 rounded-full bg-[var(--color-matrix-green)] animate-pulse" />
            <span className="font-mono text-xs text-[var(--color-cyber-gray)]">
              ADS FUND CYBER-INFRASTRUCTURE
            </span>
            <div className="w-1 h-1 rounded-full bg-[var(--color-matrix-green)] animate-pulse" />
          </div>
        </div>
      </div>

      {/* PULSING BORDER EFFECT */}
      <div className="absolute inset-0 border-2 border-transparent rounded animate-pulse pointer-events-none" 
        style={{ animation: 'pulseBorder 2s infinite' }} />
    </motion.div>
  )
}

export default CyberBanner