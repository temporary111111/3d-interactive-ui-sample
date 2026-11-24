import { useEffect, useState } from 'react'
import { Logo } from './Logo.jsx'

export function BootOverlay({ exiting }) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1650)
      const eased = 1 - Math.pow(1 - t, 3)
      setPct(Math.round(eased * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className={`boot ${exiting ? 'is-exiting' : ''}`} aria-hidden="true">
      <div className="boot__grid" />

      <div className="boot__top">
        <span>NOVA / SPATIAL INTERFACE</span>
        <span>BUILD 2.6.0 — WEBGL</span>
      </div>

      <div className="boot__center">
        <Logo className="boot__mark" />
        <h1 className="boot__word">NOVA</h1>
        <p className="boot__tag">INTERACTIVE SPATIAL INTERFACE</p>

        <div className="boot__progress">
          <div className="boot__track">
            <span style={{ width: `${pct}%` }} />
          </div>
          <span className="boot__pct">{String(pct).padStart(3, '0')}%</span>
        </div>

        <div className="boot__logs">
          <span style={{ '--d': '0.15s' }}>OPTICAL CALIBRATION</span>
          <span style={{ '--d': '0.5s' }}>PARTICLE FIELD LINK</span>
          <span style={{ '--d': '0.95s' }}>SPATIAL INDEX READY</span>
        </div>
      </div>

      <div className="boot__bottom">
        <span>© 2026 NOVA STUDIO</span>
        <span>THREE.JS / R3F</span>
      </div>
    </div>
  )
}
