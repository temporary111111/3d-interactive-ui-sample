import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 uBase;
  uniform vec3 uAccent;
  uniform vec3 uAccent2;
  uniform float uTime;

  void main() {
    vec2 p = vUv - 0.5;
    float t = uTime * 0.05;
    vec2 drift = vec2(sin(t) * 0.008, cos(t * 0.83) * 0.006);

    float core = smoothstep(0.62, 0.0, length((p - drift) * vec2(1.0, 1.22)));
    float high = smoothstep(0.52, 0.0, length(p - vec2(0.30, 0.22) + drift * 0.5));
    float low = smoothstep(0.58, 0.0, length(p - vec2(-0.34, -0.28) - drift));

    vec3 col = uBase;
    col += uAccent * 0.13 * pow(core, 1.6);
    col += uAccent2 * 0.09 * pow(high, 2.2);
    col += uAccent2 * 0.06 * pow(low, 2.4);

    float vig = smoothstep(1.08, 0.26, length(p * vec2(1.0, 0.9)));
    col *= mix(0.5, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`

/**
 * Camera-locked gradient backdrop. Drawn first, no depth, so the WebGL
 * scene is fully opaque and post-processing stays reliable.
 */
export function Backdrop({ palette }) {
  const mesh = useRef()
  const { camera, size } = useThree()
  const dist = 14

  const uniforms = useMemo(
    () => ({
      uBase: { value: new THREE.Color(palette.bg) },
      uAccent: { value: new THREE.Color(palette.accent) },
      uAccent2: { value: new THREE.Color(palette.accent2) },
      uTime: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const targets = useMemo(
    () => ({
      base: new THREE.Color(palette.bg),
      accent: new THREE.Color(palette.accent),
      accent2: new THREE.Color(palette.accent2),
    }),
    [palette],
  )

  useFrame((state, delta) => {
    const m = mesh.current
    if (!m) return
    const dt = Math.min(delta, 0.05)
    const k = 1 - Math.exp(-3.5 * dt)

    uniforms.uTime.value += dt
    uniforms.uBase.value.lerp(targets.base, k)
    uniforms.uAccent.value.lerp(targets.accent, k)
    uniforms.uAccent2.value.lerp(targets.accent2, k)

    m.quaternion.copy(camera.quaternion)
    m.position.copy(camera.position)
    m.translateZ(-dist)

    const h = 2 * Math.tan((camera.fov * Math.PI) / 360) * dist
    const w = h * (size.width / Math.max(1, size.height))
    m.scale.set(w, h, 1)
  })

  return (
    <mesh ref={mesh} renderOrder={-100} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}
