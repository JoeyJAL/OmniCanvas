import React from 'react'
import { useImageStore } from '@store/imageStore'
import { Check, Trash2 } from 'lucide-react'

export const ImagePanel: React.FC = () => {
  const {
    images,
    selectedImages,
    isMultiSelectMode,
    selectImage,
    selectAllImages,
    clearSelection,
    removeImage,
    arrangeImages
  } = useImageStore()

  const handleImageClick = (imageId: string, event: React.MouseEvent) => {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey
    selectImage(imageId, isCtrlOrCmd || isMultiSelectMode)
  }

  const isSelected = (imageId: string) => selectedImages.includes(imageId)

  return (
    <div className="flex-1 border-b border-gray-200 bg-white">
      {/* Header */}
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Images</h3>
            <p className="text-xs text-gray-500">
              {images.length} total, {selectedImages.length} selected
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {images.length > 0 && (
              <>
                {selectedImages.length > 0 ? (
                  <button
                    onClick={clearSelection}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    Clear
                  </button>
                ) : (
                  <button
                    onClick={selectAllImages}
                    className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                  >
                    Select All
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Quick arrange buttons when images are selected */}
        {selectedImages.length > 1 && (
          <div className="mt-3 flex items-center space-x-1">
            <span className="text-xs text-gray-500 mr-2">Arrange:</span>
            <button
              onClick={() => arrangeImages('grid')}
              className="text-xs px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-colors"
            >
              Grid
            </button>
            <button
              onClick={() => arrangeImages('horizontal')}
              className="text-xs px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-colors"
            >
              Row
            </button>
            <button
              onClick={() => arrangeImages('vertical')}
              className="text-xs px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-colors"
            >
              Column
            </button>
          </div>
        )}
      </div>

      {/* Image Grid */}
      <div className="flex-1 overflow-y-auto p-2">
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm">No images imported</p>
            <p className="text-xs mt-1">Use the batch import tool to add images</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {images.map((image) => (
              <div
                key={image.id}
                className={`
                  relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
                  ${isSelected(image.id) 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                  }
                `}
                onClick={(e) => handleImageClick(image.id, e)}
              >
                {/* Image Thumbnail */}
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={image.thumbnail}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Selection Indicator */}
                  {isSelected(image.id) && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {/* Hover Controls */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(image.id)
                        }}
                        className="p-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-900 truncate" title={image.name}>
                    {image.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.round(image.width)} × {Math.round(image.height)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with selection info */}
      {selectedImages.length > 0 && (
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">
              {selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} selected
            </span>
            <div className="text-xs text-blue-600">
              {isMultiSelectMode ? 'Multi-select ON' : 'Hold Ctrl/Cmd for multi-select'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}