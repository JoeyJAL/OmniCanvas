import React, { useEffect, useState } from 'react'
import { Sparkles, Wand2, Brain, Zap } from 'lucide-react'

interface MagicProgressOverlayProps {
  isVisible: boolean
  message?: string
  stage?: 'analyzing' | 'composing' | 'rendering' | 'finalizing'
}

export const MagicProgressOverlay: React.FC<MagicProgressOverlayProps> = ({
  isVisible,
  message = 'AI is weaving magic...',
  stage = 'composing'
}) => {
  const [dots, setDots] = useState('')
  const [sparklePositions, setSparklePositions] = useState<Array<{x: number, y: number, size: number, delay: number}>>([])

  useEffect(() => {
    if (!isVisible) return

    // Animate dots
    const dotInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return ''
        return prev + '.'
      })
    }, 500)

    // Generate random sparkle positions
    const sparkles = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.5 + 0.5,
      delay: Math.random() * 2
    }))
    setSparklePositions(sparkles)

    return () => clearInterval(dotInterval)
  }, [isVisible])

  if (!isVisible) return null

  const stageConfig = {
    analyzing: {
      icon: Brain,
      color: 'text-blue-400',
      bgGradient: 'from-blue-900/80 via-indigo-900/80 to-purple-900/80',
      message: 'Analyzing images with AI vision'
    },
    composing: {
      icon: Wand2,
      color: 'text-purple-400',
      bgGradient: 'from-purple-900/80 via-pink-900/80 to-indigo-900/80',
      message: 'AI is composing your masterpiece'
    },
    rendering: {
      icon: Zap,
      color: 'text-yellow-400',
      bgGradient: 'from-orange-900/80 via-red-900/80 to-pink-900/80',
      message: 'Rendering high-quality result'
    },
    finalizing: {
      icon: Sparkles,
      color: 'text-green-400',
      bgGradient: 'from-emerald-900/80 via-teal-900/80 to-cyan-900/80',
      message: 'Adding final magical touches'
    }
  }

  const config = stageConfig[stage]
  const Icon = config.icon

  return (
    <div 
      className={`fixed inset-0 z-50 bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm flex items-center justify-center cursor-pointer`}
      onClick={() => window.location.reload()} // Emergency reset
      title="Click to refresh if stuck"
    >
      {/* Animated sparkles background */}
      <div className="absolute inset-0 overflow-hidden">
        {sparklePositions.map((sparkle, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              transform: `scale(${sparkle.size})`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: '2s'
            }}
          >
            <Sparkles className="w-4 h-4 text-white/20" />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center p-8">
        {/* Spinning magical icon */}
        <div className="relative mb-6">
          <div className="animate-spin-slow">
            <div className="relative">
              <Icon className={`w-16 h-16 mx-auto ${config.color} drop-shadow-lg`} />
              {/* Glowing effect */}
              <div className="absolute inset-0 animate-ping">
                <Icon className={`w-16 h-16 mx-auto ${config.color} opacity-20`} />
              </div>
            </div>
          </div>
          
          {/* Orbiting sparkles */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
            <Sparkles className="absolute w-4 h-4 text-yellow-300 -top-2 left-1/2 transform -translate-x-1/2" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
            <Sparkles className="absolute w-3 h-3 text-pink-300 top-1/2 -right-2 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Progress text */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">
            ✨ Magic in Progress ✨
          </h3>
          <p className="text-lg text-white/90">
            {message || config.message}{dots}
          </p>
          
          {/* Animated progress bar */}
          <div className="w-64 mx-auto bg-black/30 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 animate-pulse">
              <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
          
          <p className="text-sm text-white/70 animate-bounce">
            🎨 Creating something amazing...
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  )
}