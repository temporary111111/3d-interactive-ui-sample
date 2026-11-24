import { useEffect, useState } from 'react'
import { Logo } from './Logo.jsx'

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export function TopBar() {
  const now = useClock()
  const time = now.toLocaleTimeString('en-GB', { hour12: false })

  return (
    <header className="topbar">
      <div className="brand">
        <Logo className="brand__mark" />
        <span className="brand__text">
          <span className="brand__name">NOVA</span>
          <span className="brand__sub">Spatial Interface</span>
        </span>
      </div>

      <div className="topbar__center" aria-hidden="true">
        <span className="topbar__rule" />
        <span>INTERACTIVE EXHIBITION / 2026</span>
        <span className="topbar__rule" />
      </div>

      <div className="topbar__meta">
        <span className="status">
          <i className="status__dot" />
          SYSTEM ONLINE
        </span>
        <span className="clock">
          {time} <em>LOCAL</em>
        </span>
      </div>
    </header>
  )
}
