import React from 'react'
import { useCanvasStore } from '@store/canvasStore'

export const PropertiesPanel: React.FC = () => {
  const {
    tool
  } = useCanvasStore()

  return (
    <div className="flex-1 p-2">
      {/* Header */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-900">Properties</h3>
      </div>

      {/* Tool-specific properties */}
      {tool === 'select' && (
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Selection Tool</h4>
            <p className="text-xs text-gray-600">
              Click to select objects, drag to move them. 
              Hold Ctrl/Cmd for multi-select.
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-700 mb-1">Tip</h4>
            <p className="text-xs text-blue-600">
              Use the batch import tool to add multiple images at once.
            </p>
          </div>
        </div>
      )}

    </div>
  )
}