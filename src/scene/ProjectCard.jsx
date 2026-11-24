import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { createCardTexture, getGlowTexture } from './textures.js'

export function ProjectCard({
  project,
  palette,
  position,
  seed = 0,
  active = false,
  onSelect,
  onHover,
  registerCard,
}) {
  const anchor = useRef()
  const billboard = useRef()
  const lift = useRef()
  const frameMat = useRef()
  const glowMat = useRef()
  const [hovered, setHovered] = useState(false)
  const pointerDown = useRef(null)

  const texture = useMemo(() => createCardTexture(project, palette), [project, palette])
  const glow = useMemo(() => getGlowTexture(), [])

  useEffect(() => () => texture.dispose(), [texture])

  useEffect(() => {
    if (anchor.current) registerCard(project.id, anchor.current)
  }, [project.id, registerCard])

  const accent = useMemo(() => new THREE.Color(palette.accent), [palette.accent])
  const scaleTarget = useMemo(() => new THREE.Vector3(1, 1, 1), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const dt = Math.min(delta, 0.2)
    const k = 1 - Math.exp(-8 * dt)
    const lifted = hovered && !active

    if (anchor.current) {
      anchor.current.position.y = position[1] + Math.sin(t * 0.6 + seed) * 0.075
    }

    if (billboard.current) {
      billboard.current.quaternion.slerp(state.camera.quaternion, 1 - Math.exp(-4.5 * dt))
    }

    if (lift.current) {
      lift.current.position.z += ((lifted ? 0.34 : 0) - lift.current.position.z) * k
      const s = lifted ? 1.05 : active ? 1.02 : 1
      scaleTarget.setScalar(s)
      lift.current.scale.lerp(scaleTarget, k)
    }

    if (frameMat.current) {
      frameMat.current.emissive.lerp(accent, k)
      frameMat.current.emissiveIntensity +=
        ((lifted ? 0.5 : active ? 0.32 : 0.1) - frameMat.current.emissiveIntensity) * k
    }

    if (glowMat.current) {
      glowMat.current.color.lerp(accent, k)
      glowMat.current.opacity +=
        ((lifted ? 0.7 : active ? 0.55 : 0.24) - glowMat.current.opacity) * k
    }
  })

  const handleDown = (e) => {
    e.stopPropagation()
    pointerDown.current = {
      x: e.nativeEvent?.clientX ?? 0,
      y: e.nativeEvent?.clientY ?? 0,
    }
  }

  const handleUp = (e) => {
    e.stopPropagation()
    const start = pointerDown.current
    pointerDown.current = null
    if (!start) return
    const dx = (e.nativeEvent?.clientX ?? 0) - start.x
    const dy = (e.nativeEvent?.clientY ?? 0) - start.y
    if (Math.hypot(dx, dy) < 8) onSelect(project.id)
  }

  return (
    <group ref={anchor} position={position}>
      <group ref={billboard}>
        <group ref={lift}>
          <mesh position={[0, 0, -0.06]} scale={[1.09, 1.14, 1]}>
            <planeGeometry args={[2.56, 1.6]} />
            <meshBasicMaterial
              ref={glowMat}
              map={glow}
              color={palette.accent}
              transparent
              opacity={0.24}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          <RoundedBox args={[2.66, 1.7, 0.08]} radius={0.07} smoothness={4}>
            <meshPhysicalMaterial
              ref={frameMat}
              color="#0a0f18"
              metalness={0.9}
              roughness={0.28}
              clearcoat={1}
              clearcoatRoughness={0.2}
              emissive={palette.accent}
              emissiveIntensity={0.1}
            />
          </RoundedBox>

          <mesh position={[0, 0, 0.0415]}>
            <planeGeometry args={[2.56, 1.6]} />
            <meshBasicMaterial map={texture} transparent toneMapped={false} />
          </mesh>

          <mesh
            position={[0, 0, 0.07]}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHovered(true)
              onHover?.(project.id)
            }}
            onPointerOut={(e) => {
              e.stopPropagation()
              setHovered(false)
              onHover?.(null)
            }}
            onPointerDown={handleDown}
            onPointerUp={handleUp}
            onPointerCancel={() => {
              pointerDown.current = null
            }}
          >
            <planeGeometry args={[2.72, 1.8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
