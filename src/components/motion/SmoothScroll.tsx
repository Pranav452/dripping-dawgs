'use client'
import { useEffect } from 'react'
import { useScroll, motion, useSpring } from 'framer-motion'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    // Add smooth scroll behavior to html element
    document.documentElement.style.scrollBehavior = 'smooth'
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-yellow-400 transform origin-left z-50"
        style={{ scaleX }}
      />
      {children}
    </>
  )
} 