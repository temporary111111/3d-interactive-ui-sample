import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aSeed;
  varying float vTwinkle;
  varying float vFade;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float tw = 0.55 + 0.45 * sin(uTime * 0.45 + aSeed * 6.2831);
    vTwinkle = tw;
    vFade = smoothstep(55.0, 10.0, -mvPosition.z);

    float size = aSize * uPixelRatio * (100.0 / max(1.0, -mvPosition.z)) * (0.7 + tw * 0.5);
    gl_PointSize = clamp(size, 0.4, 4.5);
  }
`

const FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  varying float vTwinkle;
  varying float vFade;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.06, d);
    float core = smoothstep(0.16, 0.0, d);
    vec3 col = mix(uColor, vec3(1.0), core * 0.65);
    gl_FragColor = vec4(col, a * (0.1 + vTwinkle * 0.42) * vFade);
  }
`

export function Starfield({ palette, count = 1200 }) {
  const points = useRef()
  const gl = useThree((state) => state.gl)

  const { positions, sizes, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const r = 12 + Math.random() * 26
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.62
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
      sizes[i] = 0.35 + Math.pow(Math.random(), 3) * 1.7
      seeds[i] = Math.random() * 10
    }
    return { positions, sizes, seeds }
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uColor: { value: new THREE.Color(palette.star) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const target = useMemo(() => new THREE.Color(palette.star), [palette.star])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    uniforms.uTime.value += dt
    uniforms.uColor.value.lerp(target, 1 - Math.exp(-3.5 * dt))
    uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 2)
    if (points.current) {
      points.current.rotation.y += dt * 0.006
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.02
    }
  })

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aSeed" count={count} array={seeds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}
