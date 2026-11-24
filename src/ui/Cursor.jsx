import { useEffect, useRef, useState } from 'react'

export function Cursor({ hot }) {
  const dot = useRef(null)
  const ring = useRef(null)
  const [uiHot, setUiHot] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    let raf = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y

    const onMove = (event) => {
      x = event.clientX
      y = event.clientY
      if (!visible) setVisible(true)
      if (dot.current) {
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      }
    }

    const onOver = (event) => {
      setUiHot(Boolean(event.target.closest?.('button, a, [data-cursor="hot"]')))
    }

    const tick = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [visible])

  const active = hot || uiHot

  return (
    <>
      <div ref={ring} className={`cursor-ring ${active ? 'is-hot' : ''} ${visible ? 'is-visible' : ''}`} />
      <div ref={dot} className={`cursor-dot ${visible ? 'is-visible' : ''}`} />
    </>
  )
}
