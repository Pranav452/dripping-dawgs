'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'

export function OurServices() {
  const services = [
    {
      title: "DELIVERY ON TIME",
      description: "Swift and reliable delivery service ensuring your DrippingDog gear reaches you exactly when promised",
      image: "/DOT.png"
    },
    {
      title: "BEST QUALITY",
      description: "Premium materials and expert craftsmanship guarantee lasting quality in every piece",
      image: "/pprg.png"
    },
    {
      title: "24/7 ONLINE CHAT SUPPORT",
      description: "Round-the-clock customer service ready to assist you with any questions or concerns",
      image: "/22.png"
    }
  ]

  const wobbleAnimation = {
    initial: { rotate: 0 },
    wobble: {
      rotate: [0, -3, 3, -3, 3, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        repeat: 0
      }
    }
  }

  return (
    <section className="bg-yellow-400 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Services
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.2 
              }}
              whileHover="wobble"
              variants={wobbleAnimation}
            >
              <motion.div 
                className="relative w-full aspect-square mb-6 bg-yellow-400"
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-contain"
                  priority
                  unoptimized
                />
              </motion.div>
              <motion.h3 
                className="text-xl font-bold text-center mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.2 }}
              >
                {service.title}
              </motion.h3>
              <motion.p 
                className="text-center text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.2 }}
              >
                {service.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 