import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, ExternalLink, Binary, Server, Code, Network } from 'lucide-react'
import { adsterra } from '../../services/adsterra.service'
import gsap from 'gsap'

const CyberNative = ({ 
  zoneId = null,
  theme = 'dark',
  className = '',
  onLoad = () => {}
}) => {
  const containerRef = useRef(null)
  const [containerId] = useState(`cyber-native-${Math.random().toString(36).substr(2, 9)}`)
  const [isLoaded, setIsLoaded] = useState(false)
  const [nodes, setNodes] = useState([])

  // CREATE NETWORK NODES FOR BACKGROUND
  useEffect(() => {
    const newNodes = Array.from({ length: 15 }).map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      pulse: Math.random() * 2 + 1
    }))
    setNodes(newNodes)
  }, [])

  // NETWORK PULSE ANIMATION
  useEffect(() => {
    if (!containerRef.current) return

    const networkLines = []
    nodes.forEach((node, i) => {
      nodes.slice(i + 1).forEach(target => {
        if (Math.random() > 0.7) {
          networkLines.push({ from: node, to: target })
        }
      })
    })

    const tl = gsap.timeline({ repeat: -1 })
    networkLines.forEach(line => {
      tl.to({}, {
        duration: 0.5,
        onStart: () => {
          const lineEl = document.createElement('div')
          lineEl.className = 'absolute h-[1px] bg-gradient-to-r from-[var(--color-hacker-blue)]/0 via-[var(--color-hacker-blue)]/50 to-[var(--color-hacker-blue)]/0'
          lineEl.style.left = `${line.from.x}%`
          lineEl.style.top = `${line.from.y}%`
          lineEl.style.width = '0%'
          lineEl.style.transformOrigin = 'left center'
          
          const angle = Math.atan2(
            line.to.y - line.from.y,
            line.to.x - line.from.x
          ) * 180 / Math.PI
          
          lineEl.style.transform = `rotate(${angle}deg)`
          containerRef.current?.appendChild(lineEl)

          gsap.to(lineEl, {
            width: `${Math.sqrt(
              Math.pow(line.to.x - line.from.x, 2) + 
              Math.pow(line.to.y - line.from.y, 2)
            )}%`,
            duration: 0.3,
            ease: 'power2.out'
          })

          gsap.to(lineEl, {
            opacity: 0,
            duration: 0.2,
            delay: 0.3,
            onComplete: () => lineEl.remove()
          })
        }
      }, '-=0.4')
    })
  }, [nodes])

  useEffect(() => {
    if (!adsterra.config.ENABLED) {
      setIsLoaded(true)
      onLoad()
      return
    }

    const loadAd = () => {
      const success = adsterra.renderNative(containerId, zoneId)
      if (success) {
        setIsLoaded(true)
        onLoad()
        
        // CYBER-ENTRY EFFECT
        gsap.from(containerRef.current, {
          scale: 0.9,
          rotationX: -10,
          duration: 0.5,
          ease: 'power3.out'
        })
      }
    }

    setTimeout(loadAd, 800)
  }, [containerId, zoneId])

  const themeClasses = theme === 'dark' 
    ? 'bg-gradient-to-br from-[var(--color-terminal-bg)] to-[var(--color-cyber-gray)] border-[var(--color-terminal-border)]'
    : 'bg-gradient-to-br from-[var(--color-cyber-light)] to-[var(--color-terminal-bg)] border-[var(--color-hacker-blue)]'

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        relative rounded-xl border-2 overflow-hidden
        shadow-[0_0_30px_rgba(0,128,255,0.1)]
        hover:shadow-[0_0_40px_rgba(0,128,255,0.2)]
        transition-all duration-300
        hover:border-[var(--color-hacker-blue)]
        ${themeClasses}
        ${className}
      `}
    >
      {/* NETWORK NODES BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {nodes.map(node => (
          <div
            key={node.id}
            className="absolute rounded-full bg-[var(--color-hacker-blue)]"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: `${node.size}px`,
              height: `${node.size}px`,
              animation: `pulse ${node.pulse}s infinite`
            }}
          />
        ))}
      </div>

      <div className="relative p-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Cpu className="h-5 w-5 text-[var(--color-hacker-blue)]" />
              <div className="absolute inset-0 bg-[var(--color-hacker-blue)] blur-sm opacity-50" />
            </div>
            <span className="font-mono text-sm font-bold tracking-wider text-[var(--color-hacker-blue)]">
              QUANTUM_NETWORK
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div 
                  key={i}
                  className="w-1 h-4 bg-[var(--color-matrix-green)] animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <span className="font-mono text-xs text-[var(--color-cyber-gray)]">
              LIVE
            </span>
          </div>
        </div>

        {/* AD CONTAINER */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Binary className="h-4 w-4 text-[var(--color-matrix-green)]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-matrix-green)]">
              SPONSORED TRANSMISSION
            </span>
          </div>
          
          <div
            id={containerId}
            className="native-ad-container min-h-[120px] rounded-lg bg-gradient-to-b from-[var(--color-cyber-dark)]/50 to-transparent p-4"
          >
            {/* CYBER PLACEHOLDER */}
            {!adsterra.config.ENABLED && (
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-mono font-bold text-lg text-[var(--color-hacker-green)] mb-2">
                      CYBER_UPGRADE v3.7
                    </h3>
                    <p className="font-mono text-sm text-[var(--color-hacker-blue)]">
                      Enhance your digital presence with quantum encryption protocols and neural network integration.
                    </p>
                  </div>
                  <Server className="h-10 w-10 text-[var(--color-hacker-purple)] ml-4" />
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-terminal-border)]">
                  <div className="flex items-center gap-2">
                    <Code className="h-3 w-3 text-[var(--color-cyber-gray)]" />
                    <span className="font-mono text-xs text-[var(--color-cyber-gray)]">
                      secure-domain.io
                    </span>
                  </div>
                  <button className="
                    group relative flex items-center gap-1
                    px-3 py-1 rounded
                    border border-[var(--color-hacker-blue)]
                    bg-gradient-to-r from-transparent to-[var(--color-hacker-blue)]/10
                    hover:to-[var(--color-hacker-blue)]/20
                    transition-all duration-300
                  ">
                    <span className="font-mono text-xs text-[var(--color-hacker-blue)]">
                      ACCESS_PROTOCOL
                    </span>
                    <ExternalLink size={12} className="
                      text-[var(--color-hacker-blue)]
                      group-hover:translate-x-1
                      transition-transform
                    " />
                    <div className="absolute -inset-1 bg-[var(--color-hacker-blue)] blur-md opacity-0 group-hover:opacity-10 transition-opacity" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-terminal-border)]">
          <div className="flex items-center gap-2">
            <Network className="h-3 w-3 text-[var(--color-cyber-gray)]" />
            <span className="font-mono text-xs text-[var(--color-cyber-gray)]">
              ENCRYPTED_CONNECTION • NEURAL_LINK_ACTIVE
            </span>
          </div>
          
          <button className="
            font-mono text-xs text-[var(--color-cyber-gray)]
            hover:text-[var(--color-hacker-blue)]
            transition-colors
            relative
          ">
            <span className="relative z-10">QUERY::TRANSMISSION</span>
            <div className="absolute -inset-1 bg-[var(--color-hacker-blue)] blur opacity-0 hover:opacity-10 transition-opacity" />
          </button>
        </div>
      </div>

      {/* SCANNING BEAM EFFECT */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-hacker-blue)] to-transparent animate-scan" />
    </motion.div>
  )
}

export default CyberNative