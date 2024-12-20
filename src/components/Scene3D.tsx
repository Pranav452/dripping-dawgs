"use client"
import * as THREE from 'three'
import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, OrbitControls, PerspectiveCamera, Text3D, Center } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const environments = [
  
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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }

      checkMobile()

      window.addEventListener('resize', checkMobile)

      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return isMobile
}

function Scene({ environment }: { environment: string }) {
  const textRef = useRef<THREE.Group>(null)
  const [forward, setForward] = useState(true)
  const progress = useRef(0)

  useFrame((state, delta) => {
    if (textRef.current) {
      if (forward) {
        progress.current += delta * 0.2
        if (progress.current >= 1) {
          progress.current = 1
          setForward(false)
        }
      } else {
        progress.current -= delta * 0.2
        if (progress.current <= 0) {
          progress.current = 0
          setForward(true)
        }
      }

      textRef.current.rotation.y = Math.PI * 0.5 * progress.current
    }
  })

  return (
    <>
      <Environment 
        preset={environment as any} 
        background 
      />
      <Center ref={textRef}>
        <group position={[0, 0.8, 0]}>
          <Text3D
            font="/fonts/akira.json"
            size={0.8}
            height={0.2}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.01}
            bevelSize={0.01}
            bevelOffset={0}
            bevelSegments={5}
          >
            DRIPPING
            <meshStandardMaterial 
              metalness={0.8}
              roughness={0.2}
              color="#FFFFFF"
              envMapIntensity={2}
            />
          </Text3D>
        </group>
        <group position={[0, -0.3, 0]}>
          <Text3D
            font="/fonts/akira.json"
            size={0.8}
            height={0.2}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.01}
            bevelSize={0.01}
            bevelOffset={0}
            bevelSegments={5}
          >
            {'    '}DOG
            <meshStandardMaterial 
              metalness={0.8}
              roughness={0.2}
              color="#FFFFFF"
              envMapIntensity={2}
            />
          </Text3D>
        </group>
      </Center>
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <ambientLight intensity={0.7} />
    </>
  )
}

export function Scene3D() {
  const [currentEnv, setCurrentEnv] = useState(0)
  const isMobile = useIsMobile()

  const nextEnv = () => {
    setCurrentEnv((prev) => (prev + 1) % environments.length)
  }

  const prevEnv = () => {
    setCurrentEnv((prev) => (prev - 1 + environments.length) % environments.length)
  }

  return (
    <div className="w-full h-full relative">
      <div className={`w-full h-full ${isMobile ? 'pointer-events-none' : ''}`}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 6]} />
          <Scene environment={environments[currentEnv]} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            enabled={!isMobile}
          />
        </Canvas>
      </div>
      
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Button 
          onClick={prevEnv} 
          variant="outline" 
          size="icon"
          className="pointer-events-auto"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <Button 
          onClick={nextEnv} 
          variant="outline" 
          size="icon"
          className="pointer-events-auto"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}