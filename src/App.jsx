import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Experience } from './scene/Experience.jsx'
import { PROJECTS } from './data.js'
import { PALETTES } from './palettes.js'
import { BootOverlay } from './ui/BootOverlay.jsx'
import { Cursor } from './ui/Cursor.jsx'
import { DetailPanel } from './ui/DetailPanel.jsx'
import { Dock } from './ui/Dock.jsx'
import { IndexRail } from './ui/IndexRail.jsx'
import { TopBar } from './ui/TopBar.jsx'

export default function App() {
  const [themeKey, setThemeKey] = useState('aurora')
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [compact, setCompact] = useState(() => window.innerWidth < 760)
  const [autoRotate, setAutoRotate] = useState(
    () => !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  )
  const [phase, setPhase] = useState('boot')
  const [resetSignal, setResetSignal] = useState(0)

  const cardRefs = useRef({})
  const controlsRef = useRef()

  const palette = PALETTES[themeKey]
  const selectedIndex = selected ? PROJECTS.findIndex((project) => project.id === selected) : -1

  useEffect(() => {
    const onResize = () => setCompact(window.innerWidth < 760)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('exit'), 1850)
    const t2 = setTimeout(() => setPhase('done'), 2550)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  const close = useCallback(() => setSelected(null), [])

  const reset = useCallback(() => {
    setSelected(null)
    setResetSignal((value) => value + 1)
  }, [])

  const navigate = useCallback((direction) => {
    setSelected((previous) => {
      const index = PROJECTS.findIndex((project) => project.id === previous)
      if (index === -1) return PROJECTS[0].id
      const next = (index + direction + PROJECTS.length) % PROJECTS.length
      return PROJECTS[next].id
    })
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      if (phase !== 'done') return
      if (event.key === 'Escape') {
        setSelected(null)
      } else if (event.key === 'ArrowRight' && selected) {
        event.preventDefault()
        navigate(1)
      } else if (event.key === 'ArrowLeft' && selected) {
        event.preventDefault()
        navigate(-1)
      } else if (event.key.toLowerCase() === 'r') {
        reset()
      } else if (/^[1-5]$/.test(event.key)) {
        const project = PROJECTS[Number(event.key) - 1]
        if (project) setSelected(project.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, reset, selected, phase])

  const home = useMemo(
    () => [0, compact ? 0.35 : 3.35, compact ? 13.6 : 11.6],
    [compact],
  )

  return (
    <div
      className="app"
      style={{
        '--accent': palette.accent,
        '--accent-2': palette.accent2,
        '--bg': palette.bg,
        '--glow-a': palette.glowA,
        '--glow-b': palette.glowB,
      }}
    >
      <div className="scene" aria-hidden="true">
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
          camera={{ position: home, fov: 42, near: 0.1, far: 120 }}
          onPointerMissed={close}
        >
          <Suspense fallback={null}>
            <Experience
              palette={palette}
              projects={PROJECTS}
              selected={selected}
              onSelect={setSelected}
              onHover={setHovered}
              compact={compact}
              autoRotate={autoRotate}
              cardRefs={cardRefs}
              controlsRef={controlsRef}
              home={home}
              resetSignal={resetSignal}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="fx fx--vignette" aria-hidden="true" />
      <div className="fx fx--grain" aria-hidden="true" />

      <TopBar />

      <div className="side-note" aria-hidden="true">
        <span className="side-note__dot" />
        <span className="side-note__text">VOL. 01 — OBJECTS IN ORBIT</span>
      </div>

      <IndexRail projects={PROJECTS} selected={selected} onSelect={setSelected} />

      <div className="bottom">
        <div className="hints">
          {selected ? (
            <>
              <span>
                <b>ESC</b> CLOSE FOCUS
              </span>
              <span>
                <b>← →</b> SWITCH PROJECT
              </span>
              <span>
                <b>R</b> RESET ORBIT
              </span>
            </>
          ) : (
            <>
              <span>
                <b>DRAG</b> ORBIT SCENE
              </span>
              <span>
                <b>SCROLL</b> DEPTH
              </span>
              <span>
                <b>CLICK</b> FOCUS PROJECT
              </span>
            </>
          )}
        </div>

        <Dock
          themeKey={themeKey}
          onTheme={setThemeKey}
          autoRotate={autoRotate}
          onToggleRotate={() => setAutoRotate((value) => !value)}
          onReset={reset}
        />

        <div className="bottom__right">
          <span className="counter">
            {selected ? PROJECTS[selectedIndex].index : '00'} <i>/</i>{' '}
            {String(PROJECTS.length).padStart(2, '0')}
          </span>
          <span className="counter__label">
            {selected ? 'FOCUSED' : 'ORBITAL OBJECTS'}
          </span>
        </div>
      </div>

      <DetailPanel
        project={selected ? PROJECTS[selectedIndex] : null}
        count={PROJECTS.length}
        onClose={close}
        onNavigate={navigate}
      />

      <Cursor hot={Boolean(hovered)} />

      {phase !== 'done' && <BootOverlay exiting={phase === 'exit'} />}
    </div>
  )
}
