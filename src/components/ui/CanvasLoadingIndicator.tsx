import React, { useEffect, useState } from 'react'
import { Brain, Palette, ImageIcon, Sparkles } from 'lucide-react'
import { useTranslation } from '@hooks/useTranslation'

interface CanvasLoadingIndicatorProps {
  isVisible: boolean
  stage?: 'analyzing' | 'composing' | 'rendering' | 'finalizing'
  className?: string
}

const stageConfig = {
  analyzing: {
    icon: Brain,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  composing: {
    icon: Palette,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  rendering: {
    icon: ImageIcon,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  finalizing: {
    icon: Sparkles,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  }
}

export const CanvasLoadingIndicator: React.FC<CanvasLoadingIndicatorProps> = ({
  isVisible,
  stage = 'analyzing',
  className = ''
}) => {
  const t = useTranslation()
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // 計算畫布置中位置（與 canvasStore 和 imageStore 使用相同的邏輯）
  useEffect(() => {
    if (!isVisible) return

    const calculateCanvasCenter = () => {
      console.log('🎯 CANVAS LOADING INDICATOR - 計算置中位置 - TIMESTAMP:', new Date().toISOString())

      // 使用與 canvasStore/imageStore 相同的邏輯來檢測右側面板
      const panelSelectors = [
        'div',
        '[class*="panel"]',
        '[class*="sidebar"]',
        '[class*="assistant"]',
        '.ai-assistant-panel',
        '.right-panel',
        '[data-panel]',
        'aside',
        'section',
        '[style*="position: fixed"]',
        '[style*="position: absolute"]'
      ]

      let rightPanel = null
      let panelWidth = 0

      for (const selector of panelSelectors) {
        const panels = document.querySelectorAll(selector)
        for (const panel of panels) {
          const rect = panel.getBoundingClientRect()
          const isReasonablePanel = rect.width > 250 && rect.width < window.innerWidth * 0.6
          const isOnRightSide = rect.right >= window.innerWidth - 100
          const isNotFullWidth = rect.width < window.innerWidth - 100
          const isTallEnough = rect.height > 300

          if (isReasonablePanel && isOnRightSide && isNotFullWidth && isTallEnough) {
            rightPanel = panel
            panelWidth = rect.width
            console.log('🎯 Loading Indicator - 找到右側面板:', selector, 'class:', panel.className, 'width:', panelWidth)
            break
          }
        }
        if (rightPanel) break
      }

      if (!rightPanel) {
        console.log('🎯 Loading Indicator - 沒有檢測到右側面板，使用全螢幕寬度')
      }

      // 計算可用的視窗區域（扣除右側面板寬度）
      const viewportWidth = window.innerWidth - panelWidth
      const viewportHeight = window.innerHeight

      // 載入指示器顯示在視窗中央
      const centerX = viewportWidth / 2
      const centerY = viewportHeight / 2

      console.log('🎯 Loading Indicator 計算結果:')
      console.log('   - 視窗尺寸:', window.innerWidth, 'x', window.innerHeight)
      console.log('   - 右側面板寬度:', panelWidth)
      console.log('   - 可用視窗寬度:', viewportWidth)
      console.log('   - 置中位置:', centerX.toFixed(0), centerY.toFixed(0))

      setPosition({ x: centerX, y: centerY })
    }

    calculateCanvasCenter()

    // 監聽視窗大小變化
    const handleResize = () => calculateCanvasCenter()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isVisible])

  if (!isVisible) return null

  const config = stageConfig[stage]
  const IconComponent = config.icon
  const stageTranslation = t.loadingIndicator.stages[stage]

  return (
    <div
      className={`
        fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2
        ${className}
      `}
      style={{
        left: position.x,
        top: position.y
      }}
    >
      {/* 主要載入卡片 */}
      <div className={`
        ${config.bgColor} ${config.borderColor}
        border-2 rounded-lg shadow-lg backdrop-blur-sm
        p-4 min-w-[200px]
        animate-pulse
      `}>
        {/* 標題列with圖示和階段 */}
        <div className="flex items-center space-x-3 mb-2">
          <div className={`${config.color} p-2 rounded-full bg-white shadow-sm`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <div className={`font-medium ${config.color}`}>
              {stageTranslation.text}
            </div>
            <div className="text-xs text-gray-500">
              {stageTranslation.description}
            </div>
          </div>
        </div>

        {/* 進度條 */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              stage === 'analyzing' ? 'bg-blue-500 w-1/4' :
              stage === 'composing' ? 'bg-purple-500 w-1/2' :
              stage === 'rendering' ? 'bg-orange-500 w-3/4' :
              'bg-green-500 w-full'
            }`}
          />
        </div>

        {/* 動畫點點 */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 ${config.color.replace('text-', 'bg-')} rounded-full animate-bounce`}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>

      {/* 浮動星星效果 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    </div>
  )
}