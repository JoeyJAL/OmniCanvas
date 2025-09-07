import { create } from 'zustand'
import { fabric } from 'fabric'
import type { CanvasState, DrawingTool, CanvasHistory, BrushSettings } from '@/types/canvas'

interface CanvasStore extends CanvasState {
  // Actions
  setCanvas: (canvas: fabric.Canvas) => void
  setTool: (tool: DrawingTool) => void
  setBrushSize: (size: number) => void
  setBrushColor: (color: string) => void
  setIsDrawing: (isDrawing: boolean) => void
  
  // History management
  addToHistory: (data: string) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  
  // Canvas operations
  clearCanvas: () => void
  exportCanvas: (format: 'png' | 'jpg' | 'pdf') => string | null
  importImage: (imageUrl: string) => Promise<void>
  
  // Brush settings
  updateBrushSettings: (settings: Partial<BrushSettings>) => void
  
  // Infinite canvas controls
  zoom: number
  panX: number
  panY: number
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  zoomIn: () => void
  zoomOut: () => void
  resetView: () => void
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  canvas: null,
  tool: 'select',
  brushSize: 5,
  brushColor: '#000000',
  isDrawing: false,
  history: [],
  historyIndex: -1,
  zoom: 1,
  panX: 0,
  panY: 0,

  setCanvas: (canvas) => set({ canvas }),
  
  setTool: (tool) => {
    const { canvas, brushSize, brushColor } = get()
    if (!canvas) return
    
    // Configure canvas based on selected tool
    switch (tool) {
      case 'select':
        canvas.isDrawingMode = false
        canvas.selection = true
        // Reset composite operation
        (canvas.getContext() as any).globalCompositeOperation = 'source-over'
        break
      case 'brush':
        canvas.isDrawingMode = true
        canvas.selection = false
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
        canvas.freeDrawingBrush.width = brushSize
        canvas.freeDrawingBrush.color = brushColor
        // Reset composite operation
        (canvas.getContext() as any).globalCompositeOperation = 'source-over'
        break
      case 'eraser':
        canvas.isDrawingMode = true
        canvas.selection = false
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
        canvas.freeDrawingBrush.width = brushSize
        // Set eraser mode by changing composite operation
        (canvas.getContext() as any).globalCompositeOperation = 'destination-out'
        canvas.freeDrawingBrush.color = 'rgba(0,0,0,1)' // Color doesn't matter for destination-out
        break
      default:
        canvas.isDrawingMode = false
        canvas.selection = true
    }
    
    set({ tool })
  },
  
  setBrushSize: (size) => {
    const { canvas, tool } = get()
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = size
      // Ensure correct composite operation based on current tool
      if (tool === 'eraser') {
        (canvas.getContext() as any).globalCompositeOperation = 'destination-out'
      } else {
        (canvas.getContext() as any).globalCompositeOperation = 'source-over'
      }
    }
    set({ brushSize: size })
  },
  
  setBrushColor: (color) => {
    const { canvas, tool } = get()
    if (canvas && canvas.freeDrawingBrush && tool !== 'eraser') {
      canvas.freeDrawingBrush.color = color
    }
    set({ brushColor: color })
  },
  
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  
  addToHistory: (data) => {
    const { history, historyIndex } = get()
    const newHistory: CanvasHistory = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      data
    }
    
    // Remove any history after current index (for when we add after undo)
    const truncatedHistory = history.slice(0, historyIndex + 1)
    const updatedHistory = [...truncatedHistory, newHistory]
    
    // Keep only last 50 history states
    const finalHistory = updatedHistory.slice(-50)
    
    set({
      history: finalHistory,
      historyIndex: finalHistory.length - 1
    })
  },
  
  undo: () => {
    const { canvas, history, historyIndex } = get()
    if (!canvas || historyIndex <= 0) return
    
    const previousState = history[historyIndex - 1]
    
    // Set a flag to prevent history recording during undo
    ;(canvas as any)._skipHistory = true
    
    canvas.loadFromJSON(previousState.data, () => {
      canvas.renderAll()
      // Remove the flag after a short delay
      setTimeout(() => {
        delete (canvas as any)._skipHistory
      }, 100)
    })
    
    set({ historyIndex: historyIndex - 1 })
  },
  
  redo: () => {
    const { canvas, history, historyIndex } = get()
    if (!canvas || historyIndex >= history.length - 1) return
    
    const nextState = history[historyIndex + 1]
    
    // Set a flag to prevent history recording during redo
    ;(canvas as any)._skipHistory = true
    
    canvas.loadFromJSON(nextState.data, () => {
      canvas.renderAll()
      // Remove the flag after a short delay
      setTimeout(() => {
        delete (canvas as any)._skipHistory
      }, 100)
    })
    
    set({ historyIndex: historyIndex + 1 })
  },
  
  canUndo: () => {
    const { historyIndex } = get()
    return historyIndex > 0
  },
  
  canRedo: () => {
    const { history, historyIndex } = get()
    return historyIndex < history.length - 1
  },
  
  clearCanvas: () => {
    const { canvas } = get()
    if (canvas) {
      canvas.clear()
      canvas.backgroundColor = '#ffffff'
      canvas.renderAll()
      
      // Add to history
      const data = JSON.stringify(canvas.toJSON())
      get().addToHistory(data)
    }
  },
  
  exportCanvas: (format) => {
    const { canvas } = get()
    if (!canvas) return null
    
    switch (format) {
      case 'png':
        return canvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 2  // Export at 2x resolution
        })
      case 'jpg':
        return canvas.toDataURL({
          format: 'jpeg',
          quality: 0.9,
          multiplier: 2  // Export at 2x resolution
        })
      case 'pdf':
        // TODO: Implement PDF export
        console.warn('PDF export not yet implemented')
        return null
      default:
        return null
    }
  },
  
  importImage: async (imageUrl) => {
    const { canvas } = get()
    if (!canvas) return
    
    console.log('🖼️ Importing image to canvas:', imageUrl.substring(0, 50) + '...')
    
    return new Promise((resolve, reject) => {
      try {
        fabric.Image.fromURL(
          imageUrl, 
          (img) => {
            try {
              if (img && img.width && img.height) {
                console.log('✅ Image loaded successfully:', img.width, 'x', img.height)
                
                // Apply same scaling logic as imageStore for consistency
                const imgWidth = img.width || 1
                const imgHeight = img.height || 1
                const maxDimension = Math.max(imgWidth, imgHeight)
                
                console.log('📏 Original AI image size:', imgWidth, 'x', imgHeight)
                
                // Only scale down if image is too large to avoid blurriness
                const maxReasonableSize = 600  // Same as imageStore
                
                let scale = 1
                
                if (maxDimension > maxReasonableSize) {
                  // Only scale down if too large
                  scale = maxReasonableSize / maxDimension
                  console.log('🔽 Scaling down large AI image:', scale)
                } else {
                  // Keep original size if reasonable
                  console.log('✅ Using original AI image size (good quality)')
                }
                
                img.scale(scale)
                console.log('✅ Final AI image display size:', (imgWidth * scale).toFixed(0), 'x', (imgHeight * scale).toFixed(0))
                
                img.center()
                
                // Add a unique identifier for AI-generated images
                try {
                  if (imageUrl.startsWith('data:image/')) {
                    img.set('isAIGenerated', true)
                    img.set('imageId', `ai_generated_${Date.now()}`)
                  }
                } catch (metaError) {
                  console.warn('Failed to set metadata:', metaError)
                }
                
                canvas.add(img)
                canvas.renderAll()
                console.log('✅ Image added to canvas and rendered')
                
                // Add to history
                const data = JSON.stringify(canvas.toJSON())
                get().addToHistory(data)
                
                resolve()
              } else {
                console.error('❌ Failed to load image - img object is null or has no dimensions')
                reject(new Error('Failed to load image - invalid image data'))
              }
            } catch (callbackError) {
              console.error('❌ Error in image load callback:', callbackError)
              reject(callbackError)
            }
          },
          {
            crossOrigin: 'anonymous'
          }
        )
      } catch (outerError) {
        console.error('❌ Error calling fabric.Image.fromURL:', outerError)
        reject(outerError)
      }
    })
  },
  
  updateBrushSettings: (settings) => {
    const { canvas, brushSize, brushColor } = get()
    const newSize = settings.size ?? brushSize
    const newColor = settings.color ?? brushColor
    
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = newSize
      canvas.freeDrawingBrush.color = newColor
      
      if (settings.opacity) {
        // TODO: Implement brush opacity
      }
    }
    
    set({
      brushSize: newSize,
      brushColor: newColor
    })
  },

  // Infinite canvas controls
  setZoom: (zoom) => {
    const { canvas } = get()
    if (canvas) {
      const center = canvas.getCenter()
      canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom)
      canvas.renderAll()
    }
    set({ zoom })
  },

  setPan: (x, y) => {
    const { canvas } = get()
    if (canvas) {
      canvas.absolutePan(new fabric.Point(x, y))
      canvas.renderAll()
    }
    set({ panX: x, panY: y })
  },

  zoomIn: () => {
    const { zoom, setZoom } = get()
    const newZoom = Math.min(zoom * 1.2, 5) // Max zoom 5x
    setZoom(newZoom)
  },

  zoomOut: () => {
    const { zoom, setZoom } = get()
    const newZoom = Math.max(zoom / 1.2, 0.1) // Min zoom 0.1x
    setZoom(newZoom)
  },

  resetView: () => {
    const { canvas, setZoom, setPan } = get()
    if (canvas) {
      setZoom(1)
      setPan(0, 0)
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
      canvas.renderAll()
    }
  }
}))