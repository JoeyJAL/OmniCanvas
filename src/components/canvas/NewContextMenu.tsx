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
    // 🎨 Advanced AI Composition Zone
    ...(selectedCount >= 2 ? [
      {
        icon: Brain,
        label: `🧠 AI Smart Compose (${selectedCount})`,
        onClick: onIntelligentCompose,
        className: 'text-blue-600 hover:bg-blue-50 font-semibold',
        separator: false
      },
      {
        icon: Glasses,
        label: '🥽 Wear/Use Items',
        onClick: onWearAccessory,
        className: 'text-indigo-600 hover:bg-indigo-50',
        separator: false
      },
      {
        icon: Camera,
        label: '🏞️ Scene Integration',
        onClick: onSceneCompose,
        className: 'text-emerald-600 hover:bg-emerald-50',
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
    
    ...(selectedCount >= 1 ? [
      {
        icon: Palette,
        label: '🎨 Style Transfer',
        onClick: onStyleTransfer,
        className: 'text-purple-600 hover:bg-purple-50',
        separator: false
      },
      {
        icon: Sparkles,
        label: '🌟 Generate Similar',
        onClick: onGenerateSimilar,
        className: 'text-green-600 hover:bg-green-50',
        separator: true
      }
    ] : []),

    // Basic Operations
    ...(selectedCount >= 1 ? [
      {
        icon: Copy,
        label: selectedCount > 1 ? `Duplicate ${selectedCount} Objects` : 'Duplicate',
        onClick: onDuplicate,
        className: 'hover:bg-gray-50',
        separator: false
      },
      {
        icon: Download,
        label: 'Export Selected',
        onClick: onExportSelected,
        className: 'hover:bg-gray-50',
        separator: true
      }
    ] : []),

    // Arrangement
    ...(selectedCount >= 1 ? [
      {
        icon: Move,
        label: 'Bring to Front',
        onClick: onBringToFront,
        className: 'hover:bg-gray-50',
        separator: false
      },
      {
        icon: Move,
        label: 'Send to Back',
        onClick: onSendToBack,
        className: 'hover:bg-gray-50',
        separator: false
      },
      {
        icon: RotateCw,
        label: 'Rotate 90°',
        onClick: onRotate,
        className: 'hover:bg-gray-50',
        separator: selectedCount > 1
      }
    ] : []),

    // Group Operations
    ...(selectedCount > 1 ? [
      {
        icon: Eye,
        label: `Group Selection (${selectedCount})`,
        onClick: onGroupSelection,
        className: 'hover:bg-gray-50',
        separator: true
      }
    ] : []),

    // Delete Operations
    ...(selectedCount >= 1 ? [
      {
        icon: Trash2,
        label: selectedCount > 1 ? `🗑️ Delete ${selectedCount} Objects` : '🗑️ Delete',
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
          🚀 NEW AI MENU v2.0 - {selectedCount} selected
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