"use client"
import * as THREE from 'three'
import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const environments = [
  "apartment",
  "city",
  "dawn",
  "forest",
  "lobby",
  "night",
  "park",
  "studio",
  "sunset",
  "warehouse",
]

function Scene({ environment }: { environment: string }) {
  const torusRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (torusRef.current) {
      torusRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <>
      <Environment preset={environment as any} background />
      <mesh ref={torusRef}>
        <torusKnotGeometry args={[0.7, 0.3, 128, 32]} />
        <meshStandardMaterial metalness={0.9} roughness={0.1} />
      </mesh>
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
    </>
  )
}

export function Scene3D() {
  const [currentEnv, setCurrentEnv] = useState(0)

  const nextEnv = () => {
    setCurrentEnv((prev) => (prev + 1) % environments.length)
  }

  const prevEnv = () => {
    setCurrentEnv((prev) => (prev - 1 + environments.length) % environments.length)
  }

  return (
    <div className="w-full h-full relative">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <Scene environment={environments[currentEnv]} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      
      {/* Left Arrow */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Button onClick={prevEnv} variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Right Arrow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <Button onClick={nextEnv} variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}