import React from 'react'
import {
  Palette,
  Copy,
  Trash2,
  Move,
  RotateCw,
  Sparkles,
  Download,
  Eye,
  Wand2,
  Brain,
  Camera,
  Glasses,
  Play,
  Mic,
  MessageCircle
} from 'lucide-react'
import { useTranslation } from '@hooks/useTranslation'

interface NewContextMenuProps {
  x: number
  y: number
  visible: boolean
  selectedCount: number
  onClose: () => void
  onMergeImages: () => void
  onStyleTransfer: () => void
  onDuplicate: () => void
  onDelete: () => void
  onBringToFront: () => void
  onSendToBack: () => void
  onRotate: () => void
  onGenerateSimilar: () => void
  onExportSelected: () => void
  onGroupSelection: () => void
  // New advanced AI composition functions
  onIntelligentCompose: () => void
  onWearAccessory: () => void
  onSceneCompose: () => void
  onCreativeBlend: () => void
  // Video playback function
  onPlayVideo?: () => void
  hasVideoThumbnail?: boolean
  // Voice prompt function
  onVoicePrompt?: () => void
}

export const NewContextMenu: React.FC<NewContextMenuProps> = ({
  x,
  y,
  visible,
  selectedCount,
  onClose,
  onMergeImages,
  onStyleTransfer,
  onDuplicate,
  onDelete,
  onBringToFront,
  onSendToBack,
  onRotate,
  onGenerateSimilar,
  onExportSelected,
  onGroupSelection,
  onIntelligentCompose,
  onWearAccessory,
  onSceneCompose,
  onCreativeBlend,
  onPlayVideo,
  hasVideoThumbnail,
  onVoicePrompt
}) => {
  const t = useTranslation()

  if (!visible) return null

  console.log('🔥🔥🔥 NEW AI CONTEXT MENU RENDERING! Time:', new Date().toLocaleTimeString())
  console.log('🔥 NewContextMenu props:', { visible, x, y, selectedCount })
  console.log('🔥 AI handlers available:', {
    onIntelligentCompose: !!onIntelligentCompose,
    onWearAccessory: !!onWearAccessory,
    onSceneCompose: !!onSceneCompose,
    onCreativeBlend: !!onCreativeBlend
  })

  const menuItems = [
    // 🎬 Video Operations (only if video thumbnail is selected)
    ...(hasVideoThumbnail && selectedCount === 1 && onPlayVideo ? [
      {
        icon: Play,
        label: t.contextMenu.playVideo,
        onClick: onPlayVideo,
        className: 'text-orange-600 hover:bg-orange-50 font-semibold',
        separator: true
      }
    ] : []),
    
    // 🎨 AI Composition (only for 2+ selected items)
    ...(selectedCount >= 2 ? [
      {
        icon: Brain,
        label: `${t.contextMenu.aiSmartCompose} (${selectedCount})`,
        onClick: onIntelligentCompose,
        className: 'text-blue-600 hover:bg-blue-50 font-semibold',
        separator: false
      },
      {
        icon: Wand2,
        label: t.contextMenu.creativeBlend,
        onClick: onCreativeBlend,
        className: 'text-pink-600 hover:bg-pink-50',
        separator: true
      }
    ] : []),
    
    // Single item AI operations
    ...(selectedCount >= 1 ? [
      {
        icon: Sparkles,
        label: t.contextMenu.generateSimilar,
        onClick: onGenerateSimilar,
        className: 'text-green-600 hover:bg-green-50',
        separator: false
      }
    ] : []),

    // Nano Banana prompt input function
    ...(selectedCount >= 1 && onVoicePrompt ? [
      {
        icon: MessageCircle,
        label: t.contextMenu.nanoBananaPrompt,
        onClick: onVoicePrompt,
        className: 'text-purple-600 hover:bg-purple-50 font-semibold',
        separator: true
      }
    ] : []),

    // Essential Operations
    ...(selectedCount >= 1 ? [
      {
        icon: Download,
        label: t.contextMenu.saveSelected,
        onClick: onExportSelected,
        className: 'text-blue-600 hover:bg-blue-50',
        separator: false
      },
      {
        icon: Copy,
        label: selectedCount > 1 ? `${t.contextMenu.duplicateMultiple} ${selectedCount}` : t.contextMenu.duplicate,
        onClick: onDuplicate,
        className: 'hover:bg-gray-50',
        separator: false
      },
      {
        icon: Trash2,
        label: selectedCount > 1 ? `${t.contextMenu.deleteMultiple} ${selectedCount}` : t.contextMenu.delete,
        onClick: onDelete,
        className: 'text-red-600 hover:bg-red-50',
        separator: false
      }
    ] : [])
  ]

  // Adjust menu position to prevent overflow
  const menuStyle = {
    left: Math.min(x, window.innerWidth - 250),
    top: Math.min(y, window.innerHeight - menuItems.length * 40)
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-10" 
        onClick={onClose}
      />
      
      {/* Context Menu */}
      <div
        className="fixed z-20 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[200px]"
        style={menuStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gradient-to-r from-blue-50 to-purple-50">
          {t.contextMenu.header} - {selectedCount} selected
        </div>
        
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  item.onClick()
                  onClose()
                }}
                className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 transition-colors ${item.className}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
              </button>
              {item.separator && <div className="border-t border-gray-100 my-1" />}
            </div>
          )
        })}
      </div>
    </>
  )
}