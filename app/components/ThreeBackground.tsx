'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Create scene, camera, and renderer with transparency
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true }) // Alpha for transparency
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0) // Transparent background

    // Append renderer to mountRef div
    mountRef.current.appendChild(renderer.domElement)

    // Create particles geometry
    const geometry = new THREE.BufferGeometry()
    const vertices = []

    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 20
      vertices.push(x, y, z)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

    const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.05 })
    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    camera.position.z = 5

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      particles.rotation.x += 0.001
      particles.rotation.y += 0.001
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full" style={{ zIndex: -10 }} />
}
