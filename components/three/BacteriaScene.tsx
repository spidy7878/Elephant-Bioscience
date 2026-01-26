'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface BacteriaSceneProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

export default function BacteriaScene({ scrollProgress, mouseX, mouseY }: BacteriaSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const organismRef = useRef<THREE.Group | null>(null)
  const frameIdRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(4, 0, 10)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create organism
    const organism = createOrganism()
    scene.add(organism)
    organismRef.current = organism

    // Create background particles
    const particles = createParticles()
    scene.add(particles)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
    scene.add(ambientLight)

    const keyLight = new THREE.PointLight(0xff6b2c, 3, 50)
    keyLight.position.set(10, 10, 10)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0x00d4ff, 1.5, 50)
    fillLight.position.set(-10, 2, 5)
    scene.add(fillLight)

    const rimLight = new THREE.PointLight(0xff2d55, 2.5, 40)
    rimLight.position.set(0, -5, -10)
    scene.add(rimLight)

    const topLight = new THREE.PointLight(0xffffff, 0.5, 30)
    topLight.position.set(0, 15, 0)
    scene.add(topLight)

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameIdRef.current)
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Animation loop
  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.008

      const organism = organismRef.current
      const camera = cameraRef.current
      const renderer = rendererRef.current
      const scene = sceneRef.current

      if (!organism || !camera || !renderer || !scene) {
        frameIdRef.current = requestAnimationFrame(animate)
        return
      }

      // Base rotation
      organism.rotation.y += 0.003
      organism.rotation.x += 0.001

      // Mouse influence
      organism.rotation.x += (mouseY * 0.3 - organism.rotation.x) * 0.02
      organism.rotation.y += (mouseX * 0.3 - organism.rotation.y) * 0.02

      // Pulse effect
      const pulse = 1 + Math.sin(timeRef.current * 2) * 0.05

      // Scroll-based transformation
      const heroProgress = Math.min(scrollProgress * 3, 1)
      const scrollZoom = 1 + heroProgress * 3
      const scrollScale = pulse * scrollZoom

      organism.scale.set(scrollScale, scrollScale, scrollScale)

      // Position based on scroll
      const startX = 5
      const startZ = 0

      if (heroProgress < 0.3) {
        const t = heroProgress / 0.3
        organism.position.x = startX - t * 2
        organism.position.z = startZ
        organism.position.y = Math.sin(timeRef.current) * 0.3
      } else {
        const t = (heroProgress - 0.3) / 0.7
        const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

        organism.position.x = 3 - easeT * 8
        organism.position.z = easeT * 20
        organism.position.y = Math.sin(timeRef.current) * 0.3 * (1 - t)

        organism.rotation.y += easeT * 0.02
        organism.rotation.z += easeT * 0.01
      }

      // Camera follows slightly
      camera.position.x = 4 + Math.sin(timeRef.current * 0.3) * 0.3 - heroProgress * 2
      camera.position.y = Math.cos(timeRef.current * 0.2) * 0.2

      renderer.render(scene, camera)
      frameIdRef.current = requestAnimationFrame(animate)
    }

    frameIdRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frameIdRef.current)
  }, [scrollProgress, mouseX, mouseY])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  )
}

// Create the spiky organism
function createOrganism(): THREE.Group {
  const group = new THREE.Group()

  // Core sphere with organic deformation
  const coreGeometry = new THREE.IcosahedronGeometry(2, 4)
  const positions = coreGeometry.attributes.position

  // Apply noise to vertices for organic look
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const y = positions.getY(i)
    const z = positions.getZ(i)

    const noise = simplex3D(x * 0.5, y * 0.5, z * 0.5) * 0.3
    const len = Math.sqrt(x * x + y * y + z * z)
    const newLen = len + noise

    positions.setX(i, (x / len) * newLen)
    positions.setY(i, (y / len) * newLen)
    positions.setZ(i, (z / len) * newLen)
  }

  coreGeometry.computeVertexNormals()

  // Core material - metallic orange
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff6b2c,
    metalness: 0.4,
    roughness: 0.4,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    emissive: 0x331100,
    emissiveIntensity: 0.3,
  })

  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  group.add(core)

  // Create spikes
  const spikeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffb800,
    metalness: 0.5,
    roughness: 0.3,
    emissive: 0x442200,
    emissiveIntensity: 0.4,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  })

  const spikeCount = 60

  for (let i = 0; i < spikeCount; i++) {
    // Fibonacci sphere distribution for even spacing
    const phi = Math.acos(1 - (2 * (i + 0.5)) / spikeCount)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i

    const x = Math.sin(phi) * Math.cos(theta)
    const y = Math.sin(phi) * Math.sin(theta)
    const z = Math.cos(phi)

    // Varying spike length
    const spikeLength = 0.8 + Math.random() * 1.2 + simplex3D(x * 2, y * 2, z * 2) * 0.5
    const spikeRadius = 0.08 + Math.random() * 0.12

    const spikeGeometry = new THREE.ConeGeometry(spikeRadius, spikeLength, 8, 1)
    spikeGeometry.translate(0, spikeLength / 2, 0)

    const spike = new THREE.Mesh(spikeGeometry, spikeMaterial)

    // Position at surface
    spike.position.set(x * 2, y * 2, z * 2)

    // Orient outward
    spike.lookAt(x * 10, y * 10, z * 10)
    spike.rotateX(Math.PI / 2)

    // Slight random rotation for organic feel
    spike.rotation.z += (Math.random() - 0.5) * 0.3

    group.add(spike)
  }

  // Add floating particles around the organism
  const particleCount = 100
  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const radius = 3 + Math.random() * 4
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI

    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    particlePositions[i * 3 + 2] = radius * Math.cos(phi)
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xff6b2c,
    size: 0.05,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  group.add(particles)

  return group
}

// Create background particles
function createParticles(): THREE.Points {
  const particleCount = 500
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0xff6b2c,
    size: 0.03,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
  })

  return new THREE.Points(geometry, material)
}

// Simple 3D Simplex noise
function simplex3D(x: number, y: number, z: number): number {
  const perm = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69,
    142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219,
    203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
    74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230,
    220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76,
    132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173,
    186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
    59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163,
    70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
    178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162,
    241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204,
    176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141,
    128, 195, 78, 66, 215, 61, 156, 180,
  ]

  const p = new Array(512)
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255]

  const F3 = 1 / 3
  const G3 = 1 / 6

  let s = (x + y + z) * F3
  let i = Math.floor(x + s)
  let j = Math.floor(y + s)
  let k = Math.floor(z + s)

  let t = (i + j + k) * G3
  let X0 = i - t
  let Y0 = j - t
  let Z0 = k - t

  let x0 = x - X0
  let y0 = y - Y0
  let z0 = z - Z0

  let i1, j1, k1, i2, j2, k2

  if (x0 >= y0) {
    if (y0 >= z0) {
      i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0
    } else if (x0 >= z0) {
      i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1
    } else {
      i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1
    }
  } else {
    if (y0 < z0) {
      i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1
    } else if (x0 < z0) {
      i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1
    } else {
      i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0
    }
  }

  let x1 = x0 - i1 + G3
  let y1 = y0 - j1 + G3
  let z1 = z0 - k1 + G3
  let x2 = x0 - i2 + 2 * G3
  let y2 = y0 - j2 + 2 * G3
  let z2 = z0 - k2 + 2 * G3
  let x3 = x0 - 1 + 3 * G3
  let y3 = y0 - 1 + 3 * G3
  let z3 = z0 - 1 + 3 * G3

  let ii = i & 255
  let jj = j & 255
  let kk = k & 255

  const grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
  ]

  const dot = (g: number[], x: number, y: number, z: number) => g[0] * x + g[1] * y + g[2] * z

  let n0, n1, n2, n3

  let t0 = 0.5 - x0 * x0 - y0 * y0 - z0 * z0
  if (t0 < 0) n0 = 0
  else {
    t0 *= t0
    let gi0 = p[ii + p[jj + p[kk]]] % 12
    n0 = t0 * t0 * dot(grad3[gi0], x0, y0, z0)
  }

  let t1 = 0.5 - x1 * x1 - y1 * y1 - z1 * z1
  if (t1 < 0) n1 = 0
  else {
    t1 *= t1
    let gi1 = p[ii + i1 + p[jj + j1 + p[kk + k1]]] % 12
    n1 = t1 * t1 * dot(grad3[gi1], x1, y1, z1)
  }

  let t2 = 0.5 - x2 * x2 - y2 * y2 - z2 * z2
  if (t2 < 0) n2 = 0
  else {
    t2 *= t2
    let gi2 = p[ii + i2 + p[jj + j2 + p[kk + k2]]] % 12
    n2 = t2 * t2 * dot(grad3[gi2], x2, y2, z2)
  }

  let t3 = 0.5 - x3 * x3 - y3 * y3 - z3 * z3
  if (t3 < 0) n3 = 0
  else {
    t3 *= t3
    let gi3 = p[ii + 1 + p[jj + 1 + p[kk + 1]]] % 12
    n3 = t3 * t3 * dot(grad3[gi3], x3, y3, z3)
  }

  return 32 * (n0 + n1 + n2 + n3)
}