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
  Glasses
} from 'lucide-react'

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
  onCreativeBlend
}) => {
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
    // 🎨 AI Composition (only for 2+ selected items)
    ...(selectedCount >= 2 ? [
      {
        icon: Brain,
        label: `🧠 AI Smart Compose (${selectedCount})`,
        onClick: onIntelligentCompose,
        className: 'text-blue-600 hover:bg-blue-50 font-semibold',
        separator: false
      },
      {
        icon: Wand2,
        label: '✨ Creative Blend',
        onClick: onCreativeBlend,
        className: 'text-pink-600 hover:bg-pink-50',
        separator: true
      }
    ] : []),
    
    // Single item AI operations
    ...(selectedCount >= 1 ? [
      {
        icon: Sparkles,
        label: '🌟 Generate Similar',
        onClick: onGenerateSimilar,
        className: 'text-green-600 hover:bg-green-50',
        separator: true
      }
    ] : []),

    // Essential Operations
    ...(selectedCount >= 1 ? [
      {
        icon: Download,
        label: 'Save Selected',
        onClick: onExportSelected,
        className: 'text-blue-600 hover:bg-blue-50',
        separator: false
      },
      {
        icon: Copy,
        label: selectedCount > 1 ? `Duplicate ${selectedCount}` : 'Duplicate',
        onClick: onDuplicate,
        className: 'hover:bg-gray-50',
        separator: false
      },
      {
        icon: Trash2,
        label: selectedCount > 1 ? `Delete ${selectedCount}` : 'Delete',
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
          ✨ AI Actions - {selectedCount} selected
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