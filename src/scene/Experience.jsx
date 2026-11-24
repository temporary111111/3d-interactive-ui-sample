import { useEffect, useMemo, useRef } from 'react'
import { OrbitControls, Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useThree } from '@react-three/fiber'
import { Backdrop } from './Backdrop.jsx'
import { Starfield } from './Starfield.jsx'
import { Core } from './Core.jsx'
import { OrbitTrack } from './OrbitTrack.jsx'
import { ProjectCard } from './ProjectCard.jsx'
import { CameraRig } from './CameraRig.jsx'

function ResponsiveCamera({ home }) {
  const { camera } = useThree()
  const controls = useThree((state) => state.controls)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    camera.position.fromArray(home)
    camera.lookAt(0, 0.12, 0)
    if (controls) {
      controls.target.set(0, 0.12, 0)
      controls.update()
    }
  }, [home, camera, controls])

  return null
}

export function Experience({
  palette,
  projects,
  selected,
  onSelect,
  onHover,
  compact,
  autoRotate,
  cardRefs,
  controlsRef,
  home,
  resetSignal,
}) {
  const ringRadius = compact ? 2.4 : 4.2
  const cardScale = compact ? 0.88 : 0.92

  const positions = useMemo(() => {
    const n = projects.length
    if (compact) {
      return projects.map((_, i) => {
        const t = i - (n - 1) / 2
        return [i % 2 === 0 ? 0.88 : -0.88, t * 1.28, -Math.abs(t) * 0.5]
      })
    }
    return projects.map((_, i) => {
      const a = (i / n) * Math.PI * 2 + Math.PI * 0.19
      return [
        Math.cos(a) * ringRadius,
        Math.sin(i * 1.9) * 0.34,
        Math.sin(a) * ringRadius,
      ]
    })
  }, [projects, ringRadius, compact])

  const registerCard = useMemo(() => {
    return (id, node) => {
      cardRefs.current[id] = node
    }
  }, [cardRefs])

  return (
    <>
      <Backdrop palette={palette} />
      <Starfield palette={palette} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 7, 6]} intensity={1.9} color="#ffffff" />
      <directionalLight position={[-6, -1, -4]} intensity={0.6} color={palette.accent2} />
      <pointLight position={[-6, 2, -3]} intensity={30} distance={16} color={palette.accent2} />
      <pointLight position={[5, -3, 5]} intensity={14} distance={14} color={palette.accent} />

      <Environment key={palette.key} resolution={128} frames={1}>
        <Lightformer
          intensity={4}
          color={palette.accent}
          position={[0, 5, -7]}
          scale={[9, 3, 1]}
        />
        <Lightformer
          intensity={2.5}
          color={palette.accent2}
          position={[-6, -2, 4]}
          scale={[6, 2, 1]}
          rotation={[0, Math.PI / 3, 0]}
        />
        <Lightformer
          form="ring"
          intensity={3.5}
          color="#ffffff"
          position={[5, 4, 5]}
          scale={2.6}
        />
        <Lightformer
          intensity={2.2}
          color="#ffffff"
          position={[0, 1, 8]}
          scale={[8, 5, 1]}
        />
        <Lightformer
          intensity={1.4}
          color="#ffffff"
          position={[0, -6, 0]}
          rotation-x={Math.PI / 2}
          scale={[8, 8, 1]}
        />
      </Environment>

      <Core palette={palette} compact={compact} />
      {!compact && <OrbitTrack palette={palette} radius={ringRadius} />}

      {projects.map((project, i) => (
        <group key={project.id} scale={cardScale}>
          <ProjectCard
            project={project}
            palette={palette}
            position={positions[i]}
            seed={i * 1.37}
            active={selected === project.id}
            onSelect={onSelect}
            onHover={onHover}
            registerCard={registerCard}
          />
        </group>
      ))}

      <CameraRig
        selected={selected}
        cardRefs={cardRefs}
        controlsRef={controlsRef}
        compact={compact}
        home={home}
        resetSignal={resetSignal}
      />

      <ResponsiveCamera home={home} />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        target={[0, 0.12, 0]}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.45}
        zoomSpeed={0.6}
        minDistance={compact ? 12 : 6.8}
        maxDistance={compact ? 28 : 14}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.78}
        autoRotate={autoRotate && !selected}
        autoRotateSpeed={0.32}
      />

      <EffectComposer multisampling={compact ? 0 : 4}>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.78}
          luminanceSmoothing={0.25}
          mipmapBlur
          radius={0.6}
        />
      </EffectComposer>
    </>
  )
}
