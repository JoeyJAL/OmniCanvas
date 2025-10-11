import React, { useState } from 'react'
import { useCanvasStore } from '@store/canvasStore'
import { useImageStore } from '@store/imageStore'
import { aiService } from '@services/aiService'
import type { DrawingTool } from '@/types/canvas'
import {
  Undo,
  Redo,
  Trash2,
  Image
} from 'lucide-react'

const tools: Array<{
  id: DrawingTool
  icon: React.ComponentType<{ className?: string }>
  label: string
  shortcut?: string
}> = [
  // Magic eraser tool removed
]

export const Toolbar: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    tool,
    setTool,
    undo,
    redo,
    canUndo,
    canRedo,
    clearCanvas,
    getSelectedImages
  } = useCanvasStore()

  const {
    addImages
  } = useImageStore()

  const handleToolSelect = (selectedTool: DrawingTool) => {
    setTool(selectedTool)
  }


  const handleBatchImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files && files.length > 0) {
        await addImages(files, {
          autoArrange: true,
          spacing: 20,
          maxWidth: 200,
          maxHeight: 200
        })
      }
    }
    input.click()
  }


  return (
    <div className="tool-panel relative">
      <div className="w-16 flex flex-col items-center py-4 space-y-2">
        {/* Import Images - Top Priority */}
        <div className="flex flex-col space-y-1">
          <button
            onClick={handleBatchImport}
            className="w-10 h-10 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-all duration-200"
            title="Import Multiple Images"
          >
            <Image className="w-5 h-5" />
          </button>
        </div>

      {/* Separator */}
      <div className="w-8 h-px bg-gray-300 my-2"></div>

      {/* Drawing Tools */}
      <div className="flex flex-col space-y-1">
        {tools.map((toolItem) => {
          const Icon = toolItem.icon
          const isActive = tool === toolItem.id
          
          return (
            <button
              key={toolItem.id}
              onClick={() => handleToolSelect(toolItem.id)}
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
                ${isActive 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }
              `}
              title={`${toolItem.label} (${toolItem.shortcut})`}
            >
              <Icon className="w-5 h-5" />
            </button>
          )
        })}
      </div>

      {/* History Controls */}
      <div className="flex flex-col space-y-1">
        <button
          onClick={undo}
          disabled={!canUndo()}
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
            ${canUndo()
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              : 'bg-gray-50 text-gray-300 cursor-not-allowed'
            }
          `}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-5 h-5" />
        </button>
        
        <button
          onClick={redo}
          disabled={!canRedo()}
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
            ${canRedo()
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              : 'bg-gray-50 text-gray-300 cursor-not-allowed'
            }
          `}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-5 h-5" />
        </button>
      </div>

      {/* Separator */}
      <div className="w-8 h-px bg-gray-300 my-2"></div>

      {/* Clear Canvas */}
      <div className="flex flex-col space-y-1">
        <button
          onClick={clearCanvas}
          className="w-10 h-10 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-all duration-200"
          title="Clear Canvas"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>

    </div>
  )
}