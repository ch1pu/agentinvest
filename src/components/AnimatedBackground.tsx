import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Enhanced Gradient Orbs with Multiple Colors */}
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,65,0.25) 0%, rgba(0,255,65,0.05) 50%, transparent 100%)'
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 150, 0],
          scale: [1, 1.3, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(0,217,255,0.25) 0%, rgba(0,217,255,0.05) 50%, transparent 100%)'
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, -150, 0],
          scale: [1, 1.4, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(176,48,255,0.15) 0%, rgba(176,48,255,0.03) 50%, transparent 100%)'
        }}
        animate={{
          x: [-150, 150, -150],
          y: [-150, 150, -150],
          scale: [1, 1.5, 1],
          rotate: [0, 180, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Additional Accent Orb */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(0,128,255,0.15) 0%, rgba(0,128,255,0.03) 50%, transparent 100%)'
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Animated Grid with Perspective */}
      <motion.div
        className="absolute inset-0 cyber-grid opacity-30"
        style={{
          transform: 'perspective(1000px) rotateX(60deg) translateZ(-200px)',
          transformOrigin: 'center bottom',
        }}
      />

      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-neon-green/5 via-transparent to-neon-cyan/5 mix-blend-overlay" />

      {/* Optimized Floating Particles - Reduced Count */}
      {[...Array(15)].map((_, i) => {
        const size = Math.random() * 2 + 1
        const colors = ['neon-green', 'neon-cyan', 'neon-blue', 'neon-purple']
        const color = colors[Math.floor(Math.random() * colors.length)]
        return (
          <motion.div
            key={i}
            className={`absolute rounded-full bg-${color}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${size * 3}px currentColor`,
            }}
            animate={{
              y: [0, -40 - Math.random() * 30, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        )
      })}

      {/* Multiple Scanning Lines */}
      <motion.div
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-neon-green to-transparent shadow-[0_0_20px_rgba(0,255,65,0.8)]"
        animate={{
          top: ['0%', '100%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent"
        animate={{
          top: ['100%', '0%'],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Vertical Scan Lines */}
      <motion.div
        className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-neon-purple/40 to-transparent"
        animate={{
          left: ['0%', '100%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-neon-green/30" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-neon-cyan/30" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-neon-blue/30" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-neon-purple/30" />
    </div>
  )
}
