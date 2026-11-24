import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Faint parking orbits beneath the card ring. They give the scene a floor
 * without adding a solid plane, and two slow satellites keep the outer
 * composition alive.
 */
export function OrbitTrack({ palette, radius = 4.2 }) {
  const dotA = useRef()
  const dotB = useRef()
  const matA = useRef()
  const matB = useRef()
  const accent = useMemo(() => new THREE.Color(palette.accent), [palette.accent])
  const accent2 = useMemo(() => new THREE.Color(palette.accent2), [palette.accent2])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const k = 1 - Math.exp(-4.5 * Math.min(delta, 0.2))
    const outer = radius + 0.55

    if (dotA.current) {
      dotA.current.position.set(Math.cos(t * 0.22) * radius, 0, Math.sin(t * 0.22) * radius)
    }
    if (dotB.current) {
      dotB.current.position.set(
        Math.cos(-t * 0.14 + 2.4) * outer,
        0,
        Math.sin(-t * 0.14 + 2.4) * outer,
      )
    }
    if (matA.current) matA.current.color.lerp(accent, k)
    if (matB.current) matB.current.color.lerp(accent2, k)
  })

  return (
    <group position={[0, -1.35, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.0045, 4, 260]} />
        <meshBasicMaterial
          color={palette.accent}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius + 0.55, 0.0035, 4, 280]} />
        <meshBasicMaterial
          color={palette.accent2}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={dotA}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshBasicMaterial ref={matA} color={palette.accent} toneMapped={false} />
      </mesh>

      <mesh ref={dotB}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial ref={matB} color={palette.accent2} toneMapped={false} />
      </mesh>
    </group>
  )
}
