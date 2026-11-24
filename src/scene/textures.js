import * as THREE from 'three'

const SANS = '"Space Grotesk", "Segoe UI", system-ui, sans-serif'
const MONO = '"JetBrains Mono", ui-monospace, "Cascadia Mono", monospace'

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.lineTo(x + w - rr, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr)
  ctx.lineTo(x + w, y + h - rr)
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h)
  ctx.lineTo(x + rr, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr)
  ctx.lineTo(x, y + rr)
  ctx.quadraticCurveTo(x, y, x + rr, y)
  ctx.closePath()
}

function hexA(hex, alpha) {
  const h = hex.replace('#', '')
  const n = parseInt(h, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function setSpacing(ctx, value) {
  try {
    ctx.letterSpacing = value
  } catch {
    /* not supported */
  }
}

/**
 * Draws a project card face onto a canvas and returns a Three texture.
 * 1024 x 640 — matched to a 2.56 x 1.6 plane.
 */
export function createCardTexture(project, palette) {
  const W = 1024
  const H = 640
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Panel body
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, 'rgba(18, 26, 40, 0.94)')
  grad.addColorStop(0.52, 'rgba(9, 14, 23, 0.94)')
  grad.addColorStop(1, 'rgba(4, 7, 12, 0.96)')
  roundRect(ctx, 9, 9, W - 18, H - 18, 28)
  ctx.fillStyle = grad
  ctx.fill()

  // Accent sheen, top-left
  const sheen = ctx.createRadialGradient(90, 20, 10, 90, 20, 760)
  sheen.addColorStop(0, hexA(palette.accent, 0.13))
  sheen.addColorStop(0.45, hexA(palette.accent, 0.03))
  sheen.addColorStop(1, 'rgba(0,0,0,0)')
  roundRect(ctx, 9, 9, W - 18, H - 18, 28)
  ctx.fillStyle = sheen
  ctx.fill()

  // Giant index watermark
  ctx.save()
  ctx.textAlign = 'right'
  ctx.font = `700 400px ${SANS}`
  ctx.fillStyle = hexA(palette.accent, 0.03)
  ctx.fillText(project.index, W - 34, H * 0.66)
  ctx.restore()

  // Border
  roundRect(ctx, 10.5, 10.5, W - 21, H - 21, 27)
  ctx.strokeStyle = hexA(palette.accent, 0.4)
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Corner ticks
  const tick = 20
  const pad = 26
  ctx.strokeStyle = hexA(palette.accent, 0.75)
  ctx.lineWidth = 2
  const corners = [
    [pad, pad, 1, 1],
    [W - pad, pad, -1, 1],
    [pad, H - pad, 1, -1],
    [W - pad, H - pad, -1, -1],
  ]
  for (const [x, y, sx, sy] of corners) {
    ctx.beginPath()
    ctx.moveTo(x + sx * tick, y)
    ctx.lineTo(x, y)
    ctx.lineTo(x, y + sy * tick)
    ctx.stroke()
  }

  // Top meta
  setSpacing(ctx, '7px')
  ctx.font = `500 22px ${MONO}`
  ctx.fillStyle = palette.accent
  ctx.fillText(project.index, 64, 100)

  setSpacing(ctx, '3px')
  ctx.font = `500 20px ${MONO}`
  ctx.fillStyle = 'rgba(225, 233, 245, 0.44)'
  ctx.textAlign = 'right'
  ctx.fillText(project.kind.toUpperCase(), W - 64, 100)
  ctx.textAlign = 'left'
  setSpacing(ctx, '0px')

  // Divider
  ctx.beginPath()
  ctx.moveTo(64, 136)
  ctx.lineTo(W - 64, 136)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Title
  ctx.font = `600 100px ${SANS}`
  ctx.fillStyle = '#f3f7fc'
  ctx.fillText(project.title, 60, 296)

  // Subtitle
  ctx.font = `400 29px ${SANS}`
  ctx.fillStyle = 'rgba(228, 236, 246, 0.58)'
  ctx.fillText(project.subtitle, 64, 350)

  // Small technical row
  setSpacing(ctx, '2px')
  ctx.font = `400 17px ${MONO}`
  ctx.fillStyle = 'rgba(228, 236, 246, 0.3)'
  ctx.fillText(`REF / ${project.index}.${project.year}`, 64, 404)
  setSpacing(ctx, '0px')

  // Bottom divider
  const by = H - 118
  ctx.beginPath()
  ctx.moveTo(64, by)
  ctx.lineTo(W - 64, by)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)'
  ctx.stroke()

  // CTA
  setSpacing(ctx, '4px')
  ctx.font = `500 19px ${MONO}`
  ctx.fillStyle = hexA(palette.accent, 0.9)
  ctx.fillText('OPEN PROJECT', 64, H - 64)
  setSpacing(ctx, '0px')

  // Arrow disc
  const cx = W - 96
  const cy = H - 76
  ctx.beginPath()
  ctx.arc(cx, cy, 30, 0, Math.PI * 2)
  ctx.fillStyle = hexA(palette.accent, 0.08)
  ctx.fill()
  ctx.strokeStyle = hexA(palette.accent, 0.55)
  ctx.lineWidth = 1.4
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(cx - 9, cy)
  ctx.lineTo(cx + 9, cy)
  ctx.moveTo(cx + 3, cy - 6)
  ctx.lineTo(cx + 9, cy)
  ctx.lineTo(cx + 3, cy + 6)
  ctx.strokeStyle = palette.accent
  ctx.lineWidth = 1.8
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.stroke()

  // Card number, bottom right of text block
  ctx.font = `500 17px ${MONO}`
  ctx.fillStyle = 'rgba(228, 236, 246, 0.25)'
  ctx.textAlign = 'right'
  setSpacing(ctx, '3px')
  ctx.fillText('NOVA / ARCHIVE', W - 64, 404)
  ctx.textAlign = 'left'
  setSpacing(ctx, '0px')

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

let radialTexture = null

/** Soft radial falloff used for auras and sprite glows. */
export function getRadialTexture() {
  if (radialTexture) return radialTexture
  const S = 256
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.22, 'rgba(255,255,255,0.5)')
  g.addColorStop(0.5, 'rgba(255,255,255,0.14)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  radialTexture = new THREE.CanvasTexture(canvas)
  radialTexture.colorSpace = THREE.SRGBColorSpace
  radialTexture.minFilter = THREE.LinearFilter
  radialTexture.magFilter = THREE.LinearFilter
  radialTexture.needsUpdate = true
  return radialTexture
}

let glowTexture = null

/** Soft rounded-rect glow used behind each card. Shared + tinted per material. */
export function getGlowTexture() {
  if (glowTexture) return glowTexture
  const W = 512
  const H = 320
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  ctx.shadowColor = 'rgba(255,255,255,0.9)'
  ctx.shadowBlur = 64
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'
  ctx.lineWidth = 7
  roundRect(ctx, 92, 52, W - 184, H - 104, 26)
  ctx.stroke()
  ctx.stroke()

  ctx.shadowBlur = 26
  ctx.fillStyle = 'rgba(255,255,255,0.14)'
  ctx.fill()

  glowTexture = new THREE.CanvasTexture(canvas)
  glowTexture.colorSpace = THREE.SRGBColorSpace
  glowTexture.minFilter = THREE.LinearFilter
  glowTexture.magFilter = THREE.LinearFilter
  glowTexture.needsUpdate = true
  return glowTexture
}
