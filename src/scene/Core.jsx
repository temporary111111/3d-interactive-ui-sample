import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getRadialTexture } from './textures.js'

export function Core({ palette, compact = false }) {
  const parallax = useRef()
  const nucleus = useRef()
  const nucleusMat = useRef()
  const auraMat = useRef()
  const flareMat = useRef()
  const dust = useRef()
  const bandRef = useRef()
  const bandMat = useRef()
  const bandDot = useRef()
  const ringGroupA = useRef()
  const ringGroupB = useRef()
  const ringMatA = useRef()
  const ringMatB = useRef()
  const dotA = useRef()
  const dotB = useRef()
  const dotMatA = useRef()
  const dotMatB = useRef()

  const radial = useMemo(() => getRadialTexture(), [])
  const accent = useMemo(() => new THREE.Color(palette.accent), [palette.accent])
  const accent2 = useMemo(() => new THREE.Color(palette.accent2), [palette.accent2])
  const coreTint = useMemo(() => new THREE.Color(palette.coreTint), [palette.coreTint])

  const dustGeometry = useMemo(() => {
    const count = 120
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 0.75 + Math.pow(Math.random(), 0.7) * 1.9
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi)
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const dt = Math.min(delta, 0.05)
    const k = 1 - Math.exp(-4.5 * dt)

    if (parallax.current) {
      parallax.current.position.x += (state.pointer.x * 0.22 - parallax.current.position.x) * k * 0.6
      parallax.current.position.y += (state.pointer.y * 0.14 - parallax.current.position.y) * k * 0.6
      parallax.current.rotation.z = Math.sin(t * 0.1) * 0.025
    }

    if (nucleus.current) {
      const pulse = 1 + Math.sin(t * 2.1) * 0.08
      nucleus.current.scale.setScalar(pulse)
    }
    if (nucleusMat.current) nucleusMat.current.color.lerp(coreTint, k)
    if (auraMat.current) {
      auraMat.current.color.lerp(accent, k)
      auraMat.current.opacity = 0.2 + Math.sin(t * 1.2) * 0.035
    }
    if (flareMat.current) {
      flareMat.current.color.lerp(accent, k)
      flareMat.current.opacity = 0.55 + Math.sin(t * 1.6) * 0.06
    }
    if (dust.current) {
      dust.current.rotation.y = t * 0.05
      dust.current.rotation.x = Math.sin(t * 0.13) * 0.1
    }
    if (bandRef.current) bandRef.current.rotation.z = -t * 0.35
    if (bandMat.current) bandMat.current.color.lerp(accent, k)
    if (bandDot.current) {
      bandDot.current.position.set(Math.cos(t * 0.7) * 1.36, Math.sin(t * 0.7) * 1.36, 0)
    }

    if (ringGroupA.current) ringGroupA.current.rotation.z = 0.4 + t * 0.12
    if (ringGroupB.current) ringGroupB.current.rotation.z = -0.8 - t * 0.09
    if (ringMatA.current) ringMatA.current.color.lerp(accent, k)
    if (ringMatB.current) ringMatB.current.color.lerp(accent2, k)
    if (dotMatA.current) dotMatA.current.color.lerp(accent, k)
    if (dotMatB.current) dotMatB.current.color.lerp(accent2, k)

    if (dotA.current) {
      dotA.current.position.set(Math.cos(t * 0.55) * 2.32, Math.sin(t * 0.55) * 2.32, 0)
    }
    if (dotB.current) {
      dotB.current.position.set(Math.cos(-t * 0.4 + 2) * 2.72, Math.sin(-t * 0.4 + 2) * 2.72, 0)
    }
  })

  return (
    <group ref={parallax} scale={compact ? 0.58 : 0.92}>
      <sprite scale={[8.4, 8.4, 1]} position={[0, 0, -0.4]}>
        <spriteMaterial
          ref={auraMat}
          map={radial}
          color={palette.accent}
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      <sprite scale={[5.2, 5.2, 1]}>
        <spriteMaterial
          map={radial}
          color={palette.accent}
          transparent
          opacity={0.26}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      <sprite scale={[9.5, 0.62, 1]}>
        <spriteMaterial
          map={radial}
          color={palette.coreTint}
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      <sprite scale={[2.1, 2.1, 1]}>
        <spriteMaterial
          ref={flareMat}
          map={radial}
          color={palette.accent}
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      <mesh ref={nucleus}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial ref={nucleusMat} color="#ffffff" toneMapped={false} />
      </mesh>

      <points ref={dust} geometry={dustGeometry}>
        <pointsMaterial
          size={0.024}
          sizeAttenuation
          color={palette.accent}
          transparent
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>

      <group ref={bandRef} rotation={[1.35, 0.3, 0.2]}>
        <mesh>
          <torusGeometry args={[1.36, 0.008, 6, 180]} />
          <meshBasicMaterial
            ref={bandMat}
            color={palette.accent}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh ref={bandDot}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </group>

      <group ref={ringGroupA} rotation={[1.24, 0.18, 0.4]}>
        <mesh>
          <torusGeometry args={[2.32, 0.006, 6, 200]} />
          <meshBasicMaterial
            ref={ringMatA}
            color={palette.accent}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh ref={dotA}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial ref={dotMatA} color={palette.accent} toneMapped={false} />
        </mesh>
      </group>

      <group ref={ringGroupB} rotation={[-1.05, -0.35, -0.8]}>
        <mesh>
          <torusGeometry args={[2.72, 0.004, 6, 220]} />
          <meshBasicMaterial
            ref={ringMatB}
            color={palette.accent2}
            transparent
            opacity={0.36}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh ref={dotB}>
          <sphereGeometry args={[0.026, 16, 16]} />
          <meshBasicMaterial ref={dotMatB} color={palette.accent2} toneMapped={false} />
        </mesh>
      </group>

      <pointLight color={palette.accent} intensity={4} distance={5.5} decay={2} />
    </group>
  )
}
