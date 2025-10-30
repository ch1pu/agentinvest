import { motion } from 'framer-motion'

export function RecommendationSkeleton() {
  return (
    <div className="glass-morphism rounded-2xl p-6 border border-white/10">
      <div className="animate-pulse space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="w-16 h-16 rounded-xl bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-white/10 rounded w-24" />
              <div className="h-4 bg-white/10 rounded w-48" />
              <div className="h-8 bg-white/10 rounded w-32" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-8 bg-white/10 rounded w-24" />
            <div className="h-10 bg-white/10 rounded w-16" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-32" />
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-white/10 rounded" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-white/10 rounded w-full" />
              <div className="h-6 bg-white/10 rounded w-full" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="h-12 bg-white/10 rounded" />
          <div className="h-12 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <div className="glass-morphism rounded-2xl p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-white/10 rounded w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-morphism rounded-xl p-4 space-y-2">
              <div className="h-4 bg-white/10 rounded w-24" />
              <div className="h-8 bg-white/10 rounded w-32" />
              <div className="h-4 bg-white/10 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="glass-morphism rounded-2xl p-6">
      <div className="animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-white/10 rounded w-40" />
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-12 bg-white/10 rounded" />
            ))}
          </div>
        </div>
        <div className="h-80 bg-white/5 rounded-lg" />
      </div>
    </div>
  )
}

export function PulsatingDot() {
  return (
    <motion.div
      className="w-2 h-2 rounded-full bg-cyber-blue"
      animate={{
        scale: [1, 1.5, 1],
        opacity: [1, 0.5, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}
