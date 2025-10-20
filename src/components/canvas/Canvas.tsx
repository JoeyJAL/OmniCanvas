import React, { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { useCanvasStore } from '@store/canvasStore'
import { useImageStore } from '@store/imageStore'
import { aiService } from '@services/aiService'
import { NewContextMenu } from './NewContextMenu'
import { PromptInputModal } from './PromptInputModal'
import type { CanvasConfig } from '@/types/canvas'

const defaultConfig: CanvasConfig = {
  width: 5000,  // Large virtual canvas size
  height: 5000,
  backgroundColor: '#ffffff',
  selection: true,  // Enable selection
  renderOnAddRemove: true,
  centeredScaling: true,
  centeredRotation: true
}

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    selectedObjects: [] as fabric.Object[]
  })

  const [voicePromptModal, setVoicePromptModal] = useState({
    visible: false,
    selectedObjects: [] as fabric.Object[]
  })

  // Canvas position tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [viewportCenter, setViewportCenter] = useState({ x: 0, y: 0 })
  const [showGrid, setShowGrid] = useState(false)
  
  // Navigation helpers
  const goToOrigin = () => {
    if (canvas) {
      canvas.absolutePan(new fabric.Point(0, 0))
      canvas.setZoom(1)
      setZoom(1)
      canvas.renderAll()
    }
  }
  
  const {
    canvas,
    setCanvas,
    tool,
    brushSize,
    brushColor,
    setIsDrawing,
    addToHistory,
    importImage,
    zoom,
    zoomIn,
    zoomOut,
    resetView,
    setZoom,
  } = useCanvasStore()

  const { setCanvas: setImageCanvas, selectImage, isMultiSelectMode } = useImageStore()

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    // Initialize Fabric.js canvas with viewport size
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      ...defaultConfig,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      // Enable multi-selection with Ctrl/Cmd+Click
      selection: true,
      preserveObjectStacking: true,
      // Enable multi-selection with modifier keys
      fireRightClick: true,
      fireMiddleClick: true,
      skipTargetFind: false,
      targetFindTolerance: 4,
      perPixelTargetFind: false,
      // Enable multi-select with modifier keys
      uniformScaling: true,
      // Additional multi-selection properties
      stopContextMenu: false,
      selectionBorderColor: 'rgba(46, 115, 252, 0.8)',
      selectionLineWidth: 2,
      selectionDashArray: [5, 5]
    })

    // Enable infinite canvas functionality
    fabricCanvas.setDimensions({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight
    })
    
    // Force enable multi-selection
    fabricCanvas.selection = true
    fabricCanvas.preserveObjectStacking = true
    
    console.log('Canvas initialized with multi-selection enabled:', fabricCanvas.selection)
    
    // Add object configuration for all objects added to canvas
    fabricCanvas.on('object:added', (e) => {
      const obj = e.target
      console.log('📦 Object added to canvas:', obj.type)
      
      // Ensure all objects support selection and multi-selection
      if (obj && typeof obj.set === 'function') {
        obj.set({
          selectable: true,
          evented: true,
          hasControls: true,
          hasBorders: true,
          lockMovementX: false,
          lockMovementY: false,
          lockRotation: false,
          lockScalingX: false,
          lockScalingY: false,
          hoverCursor: 'move',
          moveCursor: 'move'
        })
        console.log('✅ Object configured for selection:', obj.type, 'selectable:', obj.selectable)
      }
    })
    
    // Set large virtual canvas size for infinite scroll
    fabricCanvas.setWidth(containerRef.current.clientWidth)
    fabricCanvas.setHeight(containerRef.current.clientHeight)

    // Configure free drawing brush
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas)
    fabricCanvas.freeDrawingBrush.width = brushSize
    fabricCanvas.freeDrawingBrush.color = brushColor

    setCanvas(fabricCanvas)
    setImageCanvas(fabricCanvas)

    // Canvas event listeners with debouncing
    let historyTimeout: number | null = null
    
    const addToHistoryDebounced = () => {
      // Skip history if flag is set (during undo/redo)
      if ((fabricCanvas as any)._skipHistory) return
      
      if (historyTimeout) clearTimeout(historyTimeout)
      historyTimeout = setTimeout(() => {
        const data = JSON.stringify(fabricCanvas.toJSON())
        addToHistory(data)
      }, 300) // 300ms delay
    }

    fabricCanvas.on('path:created', (e: any) => {
      console.log('📝 Path created')
      addToHistoryDebounced()
    })

    fabricCanvas.on('object:modified', addToHistoryDebounced)

    // Handle object selection for images
    fabricCanvas.on('selection:created', (e) => {
      console.log('🎯 Selection created:', e.selected?.length || 0, 'objects')
      if (e.selected) {
        e.selected.forEach((obj: any) => {
          console.log('  - Selected object type:', obj.type)
        })
      }
      
      if (isMultiSelectMode && e.selected) {
        e.selected.forEach((obj: any) => {
          if (obj.type === 'image') {
            // Find the image ID and select it
            const imageId = obj.imageId || `img_${obj.cacheKey}`
            selectImage(imageId, true)
          }
        })
      }
    })

    fabricCanvas.on('selection:updated', (e) => {
      console.log('🔄 Selection updated:', e.selected?.length || 0, 'objects')
      if (e.selected) {
        e.selected.forEach((obj: any) => {
          console.log('  - Updated selection object type:', obj.type)
        })
      }
    })

    fabricCanvas.on('selection:cleared', () => {
      console.log('🗑️ Selection cleared')
      setContextMenu(prev => ({ ...prev, selectedObjects: [] }))
    })

    // Consolidated mouse:down handler for pan, selection, and context menu
    fabricCanvas.on('mouse:down', (options) => {
      const evt = options.e
      console.log('🖱️ Mouse down - Button:', evt.button, 'Shift:', evt.shiftKey, 'Ctrl:', evt.ctrlKey, 'Cmd:', evt.metaKey)
      
      setIsDrawing(true)
      
      if (evt.button === 2) { 
        // Right click - show context menu
        console.log('🔥 RIGHT CLICK DETECTED! Preventing default...')
        evt.preventDefault()
        evt.stopPropagation()
        
        const activeObject = fabricCanvas.getActiveObject()
        const selectedObjects = activeObject ? [activeObject] : []
        
        // Get multiple selected objects if available
        if (activeObject && activeObject.type === 'activeSelection') {
          const selection = activeObject as fabric.ActiveSelection
          selectedObjects.length = 0
          selection.forEachObject((obj) => selectedObjects.push(obj))
        }
        
        console.log('🔥 SHOWING CONTEXT MENU! activeObject:', activeObject, 'selectedObjects:', selectedObjects.length)
        
        setContextMenu({
          visible: true,
          x: evt.clientX,
          y: evt.clientY,
          selectedObjects
        })
      } else {
        // Left click - handle pan vs selection vs drawing
        setContextMenu(prev => ({ ...prev, visible: false }))

        // Check if we're clicking on an object vs empty canvas
        const target = fabricCanvas.findTarget(evt, false)
        console.log('🎯 Target found:', target?.type || 'none')

        if (evt.shiftKey && !target) {
          // Shift+drag on empty space = pan canvas
          console.log('🖐️ Starting pan mode (Shift+drag on empty space)')
          isDragging = true
          ;(fabricCanvas as any).isDragging = true
          fabricCanvas.selection = false
          lastPosX = evt.clientX
          lastPosY = evt.clientY
        } else {
          // Not panning - ensure selection is enabled for multi-selection
          console.log('✅ Ensuring selection is enabled for multi-selection')
          fabricCanvas.selection = true
          ;(fabricCanvas as any).isDragging = false

          // Log modifier keys for debugging multi-selection
          if (evt.ctrlKey || evt.metaKey) {
            console.log('🔥 Ctrl/Cmd detected - multi-selection should work!')
          }
        }
      }
    })

    fabricCanvas.on('mouse:up', () => {
      setIsDrawing(false)

      if (isDragging) {
        console.log('🖐️ Ending pan mode')
        isDragging = false
        ;(fabricCanvas as any).isDragging = false
        fabricCanvas.selection = true
      }
    })

    // Disable browser's default context menu on canvas and container
    const canvasElement = fabricCanvas.getElement()
    const canvasContainer = canvasElement.parentElement
    
    const preventContextMenu = (e: Event) => {
      console.log('🔥 PREVENTING CONTEXT MENU on:', e.target)
      e.preventDefault()
      e.stopPropagation()
      return false
    }
    
    canvasElement.addEventListener('contextmenu', preventContextMenu)
    if (canvasContainer) {
      canvasContainer.addEventListener('contextmenu', preventContextMenu)
    }
    if (containerRef.current) {
      containerRef.current.addEventListener('contextmenu', preventContextMenu)
    }

    // Handle resize
    const handleResize = () => {
      if (containerRef.current) {
        fabricCanvas.setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        })
        fabricCanvas.renderAll()
      }
    }

    window.addEventListener('resize', handleResize)

    // Zoom functionality
    const handleWheel = (opt: any) => {
      const e = opt.e
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY
        let zoom = fabricCanvas.getZoom()
        zoom *= 0.999 ** delta
        
        if (zoom > 5) zoom = 5
        if (zoom < 0.1) zoom = 0.1
        
        const point = new fabric.Point(opt.e.offsetX, opt.e.offsetY)
        fabricCanvas.zoomToPoint(point, zoom)
        setZoom(zoom)
      }
    }

    fabricCanvas.on('mouse:wheel', handleWheel)

    // Pan functionality with trackpad or Shift+drag
    let isDragging = false
    let lastPosX = 0
    let lastPosY = 0

    fabricCanvas.on('mouse:move', (opt) => {
      // Update mouse position for display
      const pointer = fabricCanvas.getPointer(opt.e)
      setMousePos({ x: Math.round(pointer.x), y: Math.round(pointer.y) })
      
      // Update viewport center
      const center = fabricCanvas.getCenter()
      setViewportCenter({ x: Math.round(center.left), y: Math.round(center.top) })
      
      if (isDragging) {
        const e = opt.e
        const vpt = fabricCanvas.viewportTransform!
        vpt[4] += e.clientX - lastPosX
        vpt[5] += e.clientY - lastPosY
        fabricCanvas.requestRenderAll()
        lastPosX = e.clientX
        lastPosY = e.clientY
      }
    })

    // Trackpad pan (without modifier keys)
    fabricCanvas.on('mouse:wheel', (opt) => {
      const e = opt.e
      if (!e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        const vpt = fabricCanvas.viewportTransform!
        vpt[4] -= e.deltaX || 0
        vpt[5] -= e.deltaY || 0
        fabricCanvas.requestRenderAll()
      }
    })

    // Don't add initial history - wait for user actions

    return () => {
      window.removeEventListener('resize', handleResize)
      fabricCanvas.dispose()
    }
  }, [])

  // Update brush settings when they change (CanvasStore handles all tool settings)
  useEffect(() => {
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = brushSize
      canvas.freeDrawingBrush.color = brushColor
    }
    console.log('🔧 Canvas tool changed to:', tool)
  }, [canvas, brushSize, brushColor, tool])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvas) return

      // Prevent default browser shortcuts
      if ((e.ctrlKey || e.metaKey) && ['z', 'y', 'a', 'c', 'v', 'x', '+', '-', '=', '0'].includes(e.key.toLowerCase())) {
        e.preventDefault()
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        // Undo
        useCanvasStore.getState().undo()
      } else if (
        (e.ctrlKey || e.metaKey) && e.key === 'y' || 
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z')
      ) {
        // Redo
        useCanvasStore.getState().redo()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        // Select all
        const objects = canvas.getObjects()
        canvas.discardActiveObject()
        const selection = new fabric.ActiveSelection(objects, { canvas })
        canvas.setActiveObject(selection)
        canvas.requestRenderAll()
      } else if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        // Zoom in
        zoomIn()
      } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        // Zoom out
        zoomOut()
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        // Reset zoom and pan
        resetView()
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        // Check if the focus is on an input field, textarea, or contenteditable element
        const activeElement = document.activeElement
        const isInputField = activeElement && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.getAttribute('contenteditable') === 'true'
        )
        
        // Only delete canvas objects if not typing in an input field
        if (!isInputField) {
          // Delete selected objects
          const activeObject = canvas.getActiveObject()
          if (activeObject) {
            if (activeObject.type === 'activeSelection') {
              // Multiple objects selected
              const selection = activeObject as fabric.ActiveSelection
              selection.forEachObject((obj) => {
                canvas.remove(obj)
              })
              canvas.discardActiveObject()
            } else {
              // Single object selected
              canvas.remove(activeObject)
            }
            canvas.requestRenderAll()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canvas])

  // Context menu handlers
  const handleMergeImages = async () => {
    if (contextMenu.selectedObjects.length < 2) return
    
    try {
      // Convert selected objects to image URLs
      const imageUrls = contextMenu.selectedObjects
        .filter(obj => obj.type === 'image')
        .map(obj => (obj as any)._originalElement?.src || (obj as any).src)
        .filter(Boolean)
      
      if (imageUrls.length < 2) {
        alert('請選擇至少 2 張圖片來合併')
        return
      }

      const prompt = window.prompt('請輸入合併指令：', '將這些圖片融合成藝術拼貼')
      if (!prompt) return

      const result = await aiService.mergeImages(imageUrls, prompt)
      await importImage(result)
      alert('圖片合併完成！')
    } catch (error) {
      console.error('合併失敗:', error)
      alert('合併失敗: ' + error)
    }
  }

  const handleStyleTransfer = async () => {
    if (contextMenu.selectedObjects.length === 0) return
    
    const imageObj = contextMenu.selectedObjects.find(obj => obj.type === 'image')
    if (!imageObj) {
      alert('請選擇一張圖片來套用風格')
      return
    }

    const style = window.prompt('請輸入風格描述：', '梵高星夜風格')
    if (!style) return

    try {
      const imageUrl = (imageObj as any)._originalElement?.src || (imageObj as any).src
      const result = await aiService.transferStyle({ imageUrl, style })
      await importImage(result)
      alert('風格轉換完成！')
    } catch (error) {
      alert('風格轉換失敗: ' + error)
    }
  }

  const handleDuplicate = () => {
    if (!canvas || contextMenu.selectedObjects.length === 0) return
    
    contextMenu.selectedObjects.forEach(obj => {
      obj.clone((cloned: fabric.Object) => {
        cloned.set({
          left: (cloned.left || 0) + 20,
          top: (cloned.top || 0) + 20
        })
        canvas.add(cloned)
      })
    })
    canvas.renderAll()
  }

  const handleDelete = () => {
    if (!canvas || contextMenu.selectedObjects.length === 0) return
    
    contextMenu.selectedObjects.forEach(obj => {
      canvas.remove(obj)
    })
    canvas.renderAll()
  }

  const handleBringToFront = () => {
    if (!canvas || contextMenu.selectedObjects.length === 0) return
    
    contextMenu.selectedObjects.forEach(obj => {
      canvas.bringToFront(obj)
    })
    canvas.renderAll()
  }

  const handleSendToBack = () => {
    if (!canvas || contextMenu.selectedObjects.length === 0) return
    
    contextMenu.selectedObjects.forEach(obj => {
      canvas.sendToBack(obj)
    })
    canvas.renderAll()
  }

  const handleRotate = () => {
    if (!canvas || contextMenu.selectedObjects.length === 0) return
    
    contextMenu.selectedObjects.forEach(obj => {
      const currentAngle = obj.angle || 0
      obj.set({ angle: currentAngle + 90 })
    })
    canvas.renderAll()
  }

  const handleGenerateSimilar = async () => {
    if (contextMenu.selectedObjects.length === 0) return
    
    console.log('🌟 Generating similar images from selected objects:', contextMenu.selectedObjects.length)
    
    const prompt = 'Generate a very similar object or item with the same category, style, and visual characteristics. Keep the same type of object, similar colors, materials, and overall appearance. Maintain the same scene context and background style.'

    try {
      // Create progress indicator
      const progressImg = createProgressImage('🌟 Analyzing selected objects and generating similar content...', 1)
      
      // Extract images from selected objects
      const imageUrls = []
      for (const obj of contextMenu.selectedObjects) {
        if (obj.type === 'image') {
          const imgObj = obj as fabric.Image
          let imageUrl: string | undefined

          // Try different methods to get the image URL
          if (imgObj.getSrc && typeof imgObj.getSrc === 'function') {
            imageUrl = imgObj.getSrc()
          } else if ((obj as any)._originalElement?.src) {
            imageUrl = (obj as any)._originalElement.src
          } else if ((obj as any).src) {
            imageUrl = (obj as any).src
          }

          // Ensure it's a valid string URL
          if (typeof imageUrl === 'string' && imageUrl.length > 0) {
            imageUrls.push(imageUrl)
          }
        }
      }

      if (imageUrls.length === 0) {
        removeProgressImage()
        alert('Please select at least one image to generate similar content')
        return
      }

      console.log('🎯 Using images for similarity generation:', imageUrls.length)

      // Generate similar image using the backend API
      const result = await aiService.generateSimilar({
        images: imageUrls,
        prompt: `Create an image of the exact same type of object/item as shown in the reference image(s). If it's sunglasses, generate different sunglasses. If it's a car, generate a different car. ${prompt}. Do NOT change the object category - keep it as the same type of item but with variations in design, color, or style.`,
        aspectRatio: '1:1'
      })

      // Remove progress and import generated image
      removeProgressImage()
      
      if (result) {
        await importImage(result)
        console.log('✅ Similar image generated and added to canvas!')
      } else {
        console.error('❌ No image generated from similarity API')
        alert('Failed to generate similar image - no result returned')
      }
      
    } catch (error) {
      console.error('❌ Generate similar error:', error)
      removeProgressImage()
      alert('Failed to generate similar image: ' + error)
    }
  }

  const handleExportSelected = async () => {
    if (!canvas || contextMenu.selectedObjects.length === 0) return

    console.log('🖼️ Exporting selected objects:', contextMenu.selectedObjects.length)

    try {
      // 創建選中物件的群組來計算整體邊界
      const group = new fabric.Group(contextMenu.selectedObjects, {
        left: 0,
        top: 0
      })

      // 獲取群組的實際邊界（包括所有變換）
      const groupBounds = group.getBoundingRect(true)
      const padding = 20

      const exportWidth = groupBounds.width + padding * 2
      const exportHeight = groupBounds.height + padding * 2

      console.log('📐 Export bounds:', {
        width: groupBounds.width,
        height: groupBounds.height,
        exportWidth,
        exportHeight
      })

      // 創建臨時畫布
      const tempCanvasEl = document.createElement('canvas')
      tempCanvasEl.width = exportWidth
      tempCanvasEl.height = exportHeight
      const tempCanvas = new fabric.Canvas(tempCanvasEl)

      tempCanvas.setWidth(exportWidth)
      tempCanvas.setHeight(exportHeight)
      tempCanvas.backgroundColor = 'transparent'

      // 分解群組並複製每個物件到臨時畫布
      const clonePromises = group.getObjects().map((obj: fabric.Object) => {
        return new Promise<void>((resolve) => {
          obj.clone((cloned: fabric.Object) => {
            // 計算物件在群組中的相對位置
            const objCoords = fabric.util.transformPoint(
              { x: obj.left || 0, y: obj.top || 0 },
              group.calcTransformMatrix()
            )

            // 設定物件在新畫布上的位置
            cloned.set({
              left: objCoords.x - groupBounds.left + padding,
              top: objCoords.y - groupBounds.top + padding,
              // 保持原始的變換屬性
              scaleX: obj.scaleX,
              scaleY: obj.scaleY,
              angle: obj.angle,
              flipX: obj.flipX,
              flipY: obj.flipY,
              skewX: obj.skewX,
              skewY: obj.skewY
            })

            tempCanvas.add(cloned)
            console.log('📦 Cloned object:', cloned.type, 'at', cloned.left, cloned.top)
            resolve()
          })
        })
      })

      // 清理群組（不影響原始物件）
      group.destroy()

      // 等待所有複製完成
      await Promise.all(clonePromises)

      // 強制渲染
      tempCanvas.renderAll()

      // 等待渲染完成後匯出
      setTimeout(() => {
        const dataUrl = tempCanvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 2  // Export at 2x resolution for better quality
        })

        // 檢查是否成功生成圖片
        if (dataUrl && dataUrl !== 'data:,') {
          const link = document.createElement('a')
          link.download = `selected-objects-${Date.now()}.png`
          link.href = dataUrl
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          console.log('✅ Export completed successfully')
        } else {
          console.error('❌ Failed to generate image data')
          alert('圖片匯出失敗，請重試')
        }

        tempCanvas.dispose()
      }, 300) // 增加等待時間確保渲染完成

    } catch (error) {
      console.error('❌ Export error:', error)
      alert('圖片匯出失敗：' + error)
    }
  }

  // Helper function to create progress image on canvas
  const createProgressImage = (message: string, stage: number = 0): any => {
    if (!canvas) return null

    // Use fabric.js utility to get the proper viewport center
    const vpt = canvas.viewportTransform!
    const zoom = canvas.getZoom()

    // Get canvas container dimensions
    const canvasContainer = canvas.getElement().parentElement
    const containerWidth = canvasContainer?.clientWidth || canvas.getWidth()
    const containerHeight = canvasContainer?.clientHeight || canvas.getHeight()

    // Calculate true center point of the visible viewport
    const centerPoint = fabric.util.transformPoint(
      { x: containerWidth / 2, y: containerHeight / 2 },
      fabric.util.invertTransform(vpt)
    )

    console.log('📐 PROGRESS INDICATOR optimized center:', {
      centerPoint: { x: centerPoint.x.toFixed(0), y: centerPoint.y.toFixed(0) },
      containerSize: { width: containerWidth, height: containerHeight },
      zoom: zoom,
      vpt: vpt
    })

    // Create modern, elegant progress indicator
    const progressSvg = `
      <svg width="300" height="120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="progress-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e293b;stop-opacity:0.95" />
            <stop offset="100%" style="stop-color:#334155;stop-opacity:0.95" />
          </linearGradient>
          <linearGradient id="progress-bar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Background with modern styling -->
        <rect width="100%" height="100%" rx="16" fill="url(#progress-bg)" stroke="#64748b" stroke-width="1"/>

        <!-- Spinner -->
        <circle cx="60" cy="60" r="18" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" opacity="0.3"/>
        <circle cx="60" cy="60" r="18" fill="none" stroke="#60a5fa" stroke-width="3" stroke-linecap="round"
                stroke-dasharray="56.5" stroke-dashoffset="56.5">
          <animate attributeName="stroke-dasharray" values="0 56.5;42 14.5;42 14.5;0 56.5" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="stroke-dashoffset" values="0;-14.5;-28.5;-42.5" dur="1.5s" repeatCount="indefinite"/>
        </circle>

        <!-- Message -->
        <text x="110" y="55" fill="#f1f5f9" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500">
          ${message}
        </text>

        <!-- Progress bar -->
        <rect x="110" y="70" width="160" height="6" rx="3" fill="rgba(255,255,255,0.1)"/>
        <rect x="110" y="70" width="${Math.max(6, stage * 160)}" height="6" rx="3" fill="url(#progress-bar)" filter="url(#glow)">
          <animate attributeName="width" values="${stage * 160};${Math.min(160, (stage + 0.1) * 160)};${stage * 160}" dur="2s" repeatCount="indefinite"/>
        </rect>

        <!-- Percentage -->
        <text x="280" y="85" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="11" text-anchor="end">
          ${Math.round(stage * 100)}%
        </text>
      </svg>
    `

    const dataUrl = `data:image/svg+xml,${encodeURIComponent(progressSvg)}`

    return new Promise((resolve) => {
      fabric.Image.fromURL(dataUrl, (img) => {
        if (img) {
          img.set({
            left: centerPoint.x,
            top: centerPoint.y,
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false,
            isProgressImage: true,
            // Ensure loading indicator is always visible at proper scale
            scaleX: 1 / zoom,
            scaleY: 1 / zoom
          } as any)
          canvas.add(img)
          canvas.bringToFront(img)
          canvas.renderAll()
          resolve(img)
        }
      })
    })
  }

  // Helper function to remove progress image
  const removeProgressImage = () => {
    if (!canvas) return
    const progressImages = canvas.getObjects().filter((obj: any) => obj.isProgressImage)
    progressImages.forEach(img => canvas.remove(img))
    canvas.renderAll()
  }

  // Helper function to update progress image
  const updateProgressImage = async (progressImg: any, message: string, stage: number) => {
    if (!canvas || !progressImg) return
    
    // Remove old progress image
    canvas.remove(progressImg)
    
    // Create new one with updated progress
    return await createProgressImage(message, stage)
  }

  // 🧠 Advanced AI Composition Handlers
  const handleIntelligentCompose = async () => {
    if (contextMenu.selectedObjects.length < 2) return
    
    let progressTimeout: number
    let currentProgressImg: any = null
    
    try {
      const imageUrls = contextMenu.selectedObjects
        .filter(obj => obj.type === 'image')
        .map(obj => (obj as any)._originalElement?.src || (obj as any).src)
        .filter(Boolean)
      
      if (imageUrls.length < 2) {
        alert('Please select at least 2 images for AI composition')
        return
      }

      setContextMenu(prev => ({ ...prev, visible: false }))
      
      // Create initial progress image on canvas
      currentProgressImg = await createProgressImage(`Analyzing ${imageUrls.length} images`, 0.1)
      
      // Set up a backup timeout
      progressTimeout = setTimeout(() => {
        console.warn('⚠️ Progress timeout - removing progress image')
        removeProgressImage()
        alert('AI processing took too long - please try again')
      }, 30000)
      
      // Update progress stages
      setTimeout(async () => {
        if (currentProgressImg) {
          currentProgressImg = await updateProgressImage(currentProgressImg, 'AI is composing your masterpiece', 0.4)
        }
      }, 1000)
      
      setTimeout(async () => {
        if (currentProgressImg) {
          currentProgressImg = await updateProgressImage(currentProgressImg, 'Rendering high-quality result', 0.7)
        }
      }, 2000)
      
      // Start AI processing
      const result = await aiService.mergeImages(imageUrls, 'Intelligent auto-compose - merge the key subjects and elements naturally into a cohesive, professional composition')
      
      // Clear timeout
      clearTimeout(progressTimeout)
      
      // Final progress update
      if (currentProgressImg) {
        currentProgressImg = await updateProgressImage(currentProgressImg, 'Adding final touches', 0.9)
      }
      
      // Brief delay then replace progress with result
      setTimeout(async () => {
        try {
          // Remove progress image
          removeProgressImage()
          
          // Add the generated image
          await importImage(result)
          console.log(`✅ AI Smart Composition completed! Merged ${imageUrls.length} images intelligently.`)
        } catch (error) {
          console.error('Failed to import generated image:', error)
          removeProgressImage()
          alert('Image generation completed but failed to display on canvas: ' + error)
        }
      }, 500)
      
    } catch (error) {
      console.error('AI Composition failed:', error)
      if (progressTimeout) clearTimeout(progressTimeout)
      removeProgressImage()
      alert('AI Composition failed: ' + error)
    }
  }

  const handleWearAccessory = async () => {
    if (contextMenu.selectedObjects.length < 2) return
    
    try {
      const imageUrls = contextMenu.selectedObjects
        .filter(obj => obj.type === 'image')
        .map(obj => (obj as any)._originalElement?.src || (obj as any).src)
        .filter(Boolean)

      if (imageUrls.length < 2) return

      setContextMenu(prev => ({ ...prev, visible: false }))
      const result = await aiService.mergeImages(imageUrls, 'Make the person wear or use the accessories/items naturally. Ensure realistic lighting, shadows, and proportions.')
      await importImage(result)
      alert('🥽 Accessory composition completed! Items naturally integrated.')
    } catch (error) {
      console.error('Accessory composition failed:', error)
      alert('Accessory composition failed: ' + error)
    }
  }

  const handleSceneCompose = async () => {
    if (contextMenu.selectedObjects.length < 2) return
    
    try {
      const imageUrls = contextMenu.selectedObjects
        .filter(obj => obj.type === 'image')
        .map(obj => (obj as any)._originalElement?.src || (obj as any).src)
        .filter(Boolean)

      if (imageUrls.length < 2) return

      setContextMenu(prev => ({ ...prev, visible: false }))
      const result = await aiService.mergeImages(imageUrls, 'Create a realistic scene by placing subjects into backgrounds naturally. Match lighting, shadows, and perspective perfectly.')
      await importImage(result)
      alert('🏞️ Scene integration completed! Objects naturally placed in scene.')
    } catch (error) {
      console.error('Scene composition failed:', error)
      alert('Scene composition failed: ' + error)
    }
  }

  const handleCreativeBlend = async () => {
    if (contextMenu.selectedObjects.length < 2) return
    
    try {
      const imageUrls = contextMenu.selectedObjects
        .filter(obj => obj.type === 'image')
        .map(obj => (obj as any)._originalElement?.src || (obj as any).src)
        .filter(Boolean)

      if (imageUrls.length < 2) return

      setContextMenu(prev => ({ ...prev, visible: false }))
      const result = await aiService.mergeImages(imageUrls, 'Create an artistic, creative blend that combines the best elements from all images in an innovative and visually stunning way.')
      await importImage(result)
      alert('✨ Creative blend completed! Innovative artistic fusion created.')
    } catch (error) {
      console.error('Creative blend failed:', error)
      alert('Creative blend failed: ' + error)
    }
  }

  const handleGroupSelection = () => {
    if (!canvas || contextMenu.selectedObjects.length <= 1) return

    const group = new fabric.Group(contextMenu.selectedObjects, {
      left: Math.min(...contextMenu.selectedObjects.map(obj => obj.left || 0)),
      top: Math.min(...contextMenu.selectedObjects.map(obj => obj.top || 0))
    })

    contextMenu.selectedObjects.forEach(obj => canvas.remove(obj))
    canvas.add(group)
    canvas.setActiveObject(group)
    canvas.renderAll()
  }

  // 🎤 Voice Prompt Handlers
  const handleVoicePrompt = () => {
    if (contextMenu.selectedObjects.length === 0) return

    console.log('🎤 Opening voice prompt modal for', contextMenu.selectedObjects.length, 'objects')

    setVoicePromptModal({
      visible: true,
      selectedObjects: [...contextMenu.selectedObjects]
    })

    setContextMenu(prev => ({ ...prev, visible: false }))
  }

  const handleVoicePromptSubmit = async (prompt: string, isVoice: boolean) => {
    if (!prompt.trim() || voicePromptModal.selectedObjects.length === 0) return

    let progressImg: any = null

    try {
      console.log('🎤 Processing voice/text prompt:', prompt)
      console.log('🖼️ Selected objects:', voicePromptModal.selectedObjects.length)

      // Create progress indicator
      progressImg = await createProgressImage(
        isVoice ? '🎤 Processing voice command...' : '📝 Processing text command...',
        0.1
      )

      // Extract image URLs from selected objects
      const imageUrls = voicePromptModal.selectedObjects
        .filter(obj => obj.type === 'image')
        .map(obj => {
          const imgObj = obj as fabric.Image
          let imageUrl: string | undefined

          // Try different methods to get the image URL
          if (imgObj.getSrc && typeof imgObj.getSrc === 'function') {
            imageUrl = imgObj.getSrc()
          } else if ((obj as any)._originalElement?.src) {
            imageUrl = (obj as any)._originalElement.src
          } else if ((obj as any).src) {
            imageUrl = (obj as any).src
          }

          // Ensure it's a valid string URL and validate it
          if (typeof imageUrl === 'string' && imageUrl.length > 0) {
            // Additional validation to prevent indexOf errors in backend
            try {
              // Test that the string supports indexOf before sending to backend
              if (typeof imageUrl.indexOf === 'function') {
                return imageUrl
              } else {
                console.warn('String URL does not support indexOf method:', typeof imageUrl)
                return null
              }
            } catch (err) {
              console.warn('Error validating image URL:', err)
              return null
            }
          }

          console.warn('無法提取圖片URL，物件:', obj)
          return null
        })
        .filter((url): url is string => typeof url === 'string' && url.length > 0)

      console.log('🎤 提取的圖片URLs:', imageUrls)

      if (imageUrls.length === 0) {
        removeProgressImage()
        alert('請選擇至少一張圖片來執行語音指令')
        return
      }

      // Update progress
      if (progressImg) {
        progressImg = await updateProgressImage(progressImg, 'AI 正在理解您的指令...', 0.4)
      }

      // Use imageToImage for single image with prompt, or mergeImages for multiple
      let result: string

      if (imageUrls.length === 1) {
        console.log('🎯 Single image voice command processing')

        // Additional safety check for debugging
        const imageUrl = imageUrls[0]
        console.log('🔍 Debug - imageUrl type:', typeof imageUrl, 'value:', imageUrl)

        if (typeof imageUrl !== 'string') {
          throw new Error(`Invalid imageUrl type: expected string, got ${typeof imageUrl}`)
        }

        result = await aiService.imageToImage({
          imageUrl: imageUrl,
          prompt: `${prompt}. IMPORTANT: Preserve the exact features, identity, and characteristics of ALL main subjects and objects in the image (people, furniture, vehicles, animals, products, etc.). Maintain the original style, quality, shape, texture, color, and distinctive details of all important elements while making only the requested changes naturally. Keep the core identity and recognizable features of every main object completely consistent.`,
          strength: 0.5, // 降低強度以維持所有主要物件穩定性
          width: 512,
          height: 512
        })
      } else {
        console.log('🎯 Multi-image voice command processing')

        // Additional safety check for multi-image case
        console.log('🔍 Debug - imageUrls types:', imageUrls.map((url, i) => `[${i}]: ${typeof url}`))
        console.log('🔍 Debug - imageUrls values:', imageUrls.map((url, i) => `[${i}]: ${url}`))

        // Validate all URLs are strings
        const invalidUrls = imageUrls.filter(url => typeof url !== 'string')
        if (invalidUrls.length > 0) {
          throw new Error(`Invalid imageUrl types in array: ${invalidUrls.map(url => typeof url).join(', ')}`)
        }

        result = await aiService.mergeImages(
          imageUrls,
          `${prompt}. IMPORTANT: Preserve the exact features, identity, and characteristics of ALL main subjects and objects in all images (people, furniture, vehicles, animals, products, etc.). Maintain consistent shape, texture, color, distinctive details, and core identity of every important element. Apply this instruction to combine and edit the images naturally while keeping all main subjects and objects completely recognizable and stable.`
        )
      }

      // Update progress
      if (progressImg) {
        progressImg = await updateProgressImage(progressImg, '🎨 Finalizing your creation...', 0.9)
      }

      // Import the result - extract URL from object if needed
      const imageUrl = typeof result === 'string' ? result : result.url
      console.log('🔍 Debug - final imageUrl type:', typeof imageUrl, 'value:', typeof imageUrl === 'string' ? imageUrl.substring(0, 50) + '...' : imageUrl)

      if (typeof imageUrl !== 'string') {
        throw new Error(`Invalid final imageUrl type: expected string, got ${typeof imageUrl}`)
      }

      await importImage(imageUrl)

      // Remove progress and show success
      removeProgressImage()

      console.log('✅ Voice/text command completed successfully!')

      const successMessage = isVoice
        ? `🎤 語音指令「${prompt}」執行完成！`
        : `📝 文字指令「${prompt}」執行完成！`

      // Show brief success notification
      setTimeout(() => {
        alert(successMessage)
      }, 500)

    } catch (error) {
      console.error('❌ Voice/text prompt failed:', error)
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      removeProgressImage()

      // More detailed error message
      let errorMessage = isVoice
        ? `語音指令處理失敗`
        : `文字指令處理失敗`

      if (error.message && error.message.includes('indexOf')) {
        errorMessage += ': 圖片格式處理錯誤，請重新嘗試'
      } else if (error.message) {
        errorMessage += `: ${error.message}`
      } else {
        errorMessage += `: ${error}`
      }

      alert(errorMessage)
    }
  }

  const handleCloseVoicePrompt = () => {
    setVoicePromptModal({
      visible: false,
      selectedObjects: []
    })
  }

  return (
    <div 
      ref={containerRef}
      className="canvas-container flex-1 relative"
      onContextMenu={(e) => {
        console.log('🔥 CONTAINER RIGHT CLICK!')
        e.preventDefault()
        e.stopPropagation()
        return false
      }}
      onMouseDown={(e) => {
        console.log('🔥 CONTAINER MOUSE DOWN - Button:', e.button)
        if (e.button === 2) {
          console.log('🔥 CONTAINER RIGHT CLICK DETECTED!')
          e.preventDefault()
          e.stopPropagation()
          
          setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            selectedObjects: canvas?.getActiveObjects() || []
          })
        }
      }}
    >
      <canvas ref={canvasRef} />
      
      
      {/* Canvas Navigator - Top Right */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg px-3 py-2 shadow-lg border border-gray-200">
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span>📍 Mouse:</span>
            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">x:{mousePos.x} y:{mousePos.y}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>🎯 Center:</span>
            <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">x:{viewportCenter.x} y:{viewportCenter.y}</span>
          </div>
          <div className="flex items-center space-x-1 pt-1">
            <button
              onClick={goToOrigin}
              className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
              title="Go to origin (0,0)"
            >
              🏠 Origin
            </button>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                showGrid 
                  ? 'bg-purple-200 text-purple-700' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Toggle grid"
            >
              ⊞ Grid
            </button>
          </div>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2">
        <button 
          onClick={zoomOut}
          className="bg-white bg-opacity-75 hover:bg-opacity-100 rounded p-2 text-gray-600 transition-all"
          title="Zoom out (Ctrl+Mouse wheel)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>
        
        <button 
          onClick={resetView}
          className="bg-white bg-opacity-75 hover:bg-opacity-100 rounded px-3 py-1 text-sm text-gray-600 min-w-[60px] transition-all"
          title="Reset zoom and pan"
        >
          {Math.round(zoom * 100)}%
        </button>
        
        <button 
          onClick={zoomIn}
          className="bg-white bg-opacity-75 hover:bg-opacity-100 rounded p-2 text-gray-600 transition-all"
          title="Zoom in (Ctrl+Mouse wheel)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>
      </div>

      {/* Canvas navigation hints */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg px-3 py-2 text-xs text-gray-600 shadow-lg border border-gray-200">
        <div className="space-y-1">
          <div>🔍 <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Cmd</kbd> + Trackpad: Zoom</div>
          <div>🖐️ Trackpad: Move canvas</div>
          <div>✨ <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Shift</kbd> + Click: Multi-select</div>
          <div>🎯 <kbd className="px-1 py-0.5 bg-purple-100 rounded text-xs">Cmd</kbd> + Click: Add/Remove selection</div>
        </div>
      </div>

      {/* Right-click Context Menu */}
      <NewContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        selectedCount={contextMenu.selectedObjects.length}
        onClose={() => setContextMenu(prev => ({ ...prev, visible: false }))}
        onMergeImages={handleMergeImages}
        onStyleTransfer={handleStyleTransfer}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onBringToFront={handleBringToFront}
        onSendToBack={handleSendToBack}
        onRotate={handleRotate}
        onGenerateSimilar={handleGenerateSimilar}
        onExportSelected={handleExportSelected}
        onIntelligentCompose={handleIntelligentCompose}
        onWearAccessory={handleWearAccessory}
        onSceneCompose={handleSceneCompose}
        onCreativeBlend={handleCreativeBlend}
        onGroupSelection={handleGroupSelection}
        onVoicePrompt={handleVoicePrompt}
      />

      {/* Voice Prompt Modal */}
      <PromptInputModal
        visible={voicePromptModal.visible}
        selectedCount={voicePromptModal.selectedObjects.length}
        onClose={handleCloseVoicePrompt}
        onSubmit={handleVoicePromptSubmit}
      />
    </div>
  )
}