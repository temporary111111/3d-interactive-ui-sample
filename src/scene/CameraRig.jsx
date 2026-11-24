import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const LOOK_HOME = new THREE.Vector3(0, 0.12, 0)

export function CameraRig({ selected, cardRefs, controlsRef, compact, home, resetSignal }) {
  const { camera } = useThree()
  const size = useThree((state) => state.size)

  const homeVec = useMemo(() => new THREE.Vector3().fromArray(home), [home])
  const look = useRef(LOOK_HOME.clone())
  const returning = useRef(false)
  const hadSelection = useRef(false)

  const cardPos = useMemo(() => new THREE.Vector3(), [])
  const desired = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])
  const right = useMemo(() => new THREE.Vector3(), [])
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), [])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    if (selected) {
      returning.current = false
      controls.enabled = false
      hadSelection.current = true
    } else if (hadSelection.current) {
      returning.current = true
      controls.enabled = false
    }
  }, [selected, controlsRef])

  useEffect(() => {
    if (!resetSignal) return
    returning.current = true
    if (controlsRef.current) controlsRef.current.enabled = false
  }, [resetSignal, controlsRef])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.5)
    const k = 1 - Math.exp(-3.2 * dt)
    const controls = controlsRef.current

    if (selected && !compact) {
      const node = cardRefs.current[selected]
      if (!node) return

      node.getWorldPosition(cardPos)
      dir.copy(cardPos).normalize()
      right.crossVectors(up, dir).normalize()

      // Sit outside the ring, just above the card's plane, so the selected
      // card faces us with the core glowing behind it.
      desired.copy(cardPos).multiplyScalar(2.55).addScaledVector(up, 0.08)
      camera.position.lerp(desired, k)

      // Bias the framing left so the detail panel doesn't cover the card.
      const distance = desired.distanceTo(cardPos)
      const halfWidth =
        Math.tan((camera.fov * Math.PI) / 360) * distance * (size.width / size.height)
      const panelWidth = Math.min(408, size.width * 0.46)
      const freeWidth = Math.max(240, size.width - panelWidth - 24)
      const shift = (size.width / 2 - freeWidth / 2) / (size.width / 2)
      target.copy(cardPos).addScaledVector(right, shift * halfWidth)
      look.current.lerp(target, k)
      camera.lookAt(look.current)
    } else if (returning.current) {
      camera.position.lerp(homeVec, k)
      look.current.lerp(LOOK_HOME, k)
      camera.lookAt(look.current)

      if (camera.position.distanceTo(homeVec) < 0.06) {
        returning.current = false
        if (controls) {
          controls.target.set(0, 0.12, 0)
          controls.enabled = true
          controls.update()
        }
      }
    }
  })

  return null
}
