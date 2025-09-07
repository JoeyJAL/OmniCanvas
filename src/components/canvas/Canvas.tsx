import React, { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { useCanvasStore } from '@store/canvasStore'
import { useImageStore } from '@store/imageStore'
import { aiService } from '@services/aiService'
import { NewContextMenu } from './NewContextMenu'
import type { CanvasConfig } from '@/types/canvas'

const defaultConfig: CanvasConfig = {
  width: 800,
  height: 600,
  backgroundColor: '#ffffff',
  selection: true,
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
  
  const {
    canvas,
    setCanvas,
    tool,
    brushSize,
    brushColor,
    setIsDrawing,
    addToHistory,
    importImage
  } = useCanvasStore()

  const { setCanvas: setImageCanvas, selectImage, isMultiSelectMode } = useImageStore()

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    // Initialize Fabric.js canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      ...defaultConfig,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight
    })

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

    fabricCanvas.on('path:created', addToHistoryDebounced)

    fabricCanvas.on('object:added', () => {
      if (!fabricCanvas.isDrawingMode) {
        addToHistoryDebounced()
      }
    })

    fabricCanvas.on('object:modified', addToHistoryDebounced)

    fabricCanvas.on('mouse:down', () => {
      setIsDrawing(true)
    })

    fabricCanvas.on('mouse:up', () => {
      setIsDrawing(false)
    })

    // Handle object selection for images
    fabricCanvas.on('selection:created', (e) => {
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

    fabricCanvas.on('selection:cleared', () => {
      setContextMenu(prev => ({ ...prev, selectedObjects: [] }))
    })

    // Right click context menu - FORCE UPDATE v3.0
    fabricCanvas.on('mouse:down', (options) => {
      console.log('🔥 MOUSE DOWN EVENT - Button:', options.e.button)
      if (options.e.button === 2) { // Right click
        console.log('🔥 RIGHT CLICK DETECTED! Preventing default...')
        options.e.preventDefault()
        options.e.stopPropagation()
        
        const activeObject = fabricCanvas.getActiveObject()
        const selectedObjects = activeObject ? [activeObject] : []
        
        // Get multiple selected objects if available
        if (activeObject && activeObject.type === 'activeSelection') {
          const selection = activeObject as fabric.ActiveSelection
          selectedObjects.length = 0
          selection.forEachObject((obj) => selectedObjects.push(obj))
        }
        
        console.log('🔥 SHOWING CONTEXT MENU! activeObject:', activeObject, 'selectedObjects:', selectedObjects.length)
        console.log('🔥 Context menu position:', options.e.clientX, options.e.clientY)
        
        setContextMenu({
          visible: true,
          x: options.e.clientX,
          y: options.e.clientY,
          selectedObjects
        })
        
        console.log('🔥 CONTEXT MENU STATE SET!')
      } else {
        // Hide context menu on left click
        setContextMenu(prev => ({ ...prev, visible: false }))
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

    // Don't add initial history - wait for user actions

    return () => {
      window.removeEventListener('resize', handleResize)
      fabricCanvas.dispose()
    }
  }, [])

  // Update brush settings when they change
  useEffect(() => {
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = brushSize
      canvas.freeDrawingBrush.color = brushColor
    }
  }, [canvas, brushSize, brushColor])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvas) return

      // Prevent default browser shortcuts
      if ((e.ctrlKey || e.metaKey) && ['z', 'y', 'a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
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
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
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
          if (imgObj.getSrc) {
            imageUrls.push(imgObj.getSrc())
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
      // 計算所有選中物件的邊界
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      
      contextMenu.selectedObjects.forEach(obj => {
        const boundingRect = obj.getBoundingRect()
        minX = Math.min(minX, boundingRect.left)
        minY = Math.min(minY, boundingRect.top)
        maxX = Math.max(maxX, boundingRect.left + boundingRect.width)
        maxY = Math.max(maxY, boundingRect.top + boundingRect.height)
      })
      
      const padding = 20
      const exportWidth = maxX - minX + padding * 2
      const exportHeight = maxY - minY + padding * 2
      
      console.log('📐 Export bounds:', { minX, minY, maxX, maxY, exportWidth, exportHeight })
      
      // 創建臨時畫布
      const tempCanvasEl = document.createElement('canvas')
      tempCanvasEl.width = exportWidth
      tempCanvasEl.height = exportHeight
      const tempCanvas = new fabric.Canvas(tempCanvasEl)
      
      tempCanvas.setWidth(exportWidth)
      tempCanvas.setHeight(exportHeight)
      tempCanvas.backgroundColor = 'transparent'
      
      // 複製物件到臨時畫布
      const clonePromises = contextMenu.selectedObjects.map(obj => {
        return new Promise<void>((resolve) => {
          obj.clone((cloned: fabric.Object) => {
            // 調整位置到新的座標系統
            const objBounds = obj.getBoundingRect()
            cloned.set({
              left: objBounds.left - minX + padding,
              top: objBounds.top - minY + padding
            })
            tempCanvas.add(cloned)
            console.log('📦 Cloned object:', cloned.type, 'at', cloned.left, cloned.top)
            resolve()
          })
        })
      })
      
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
        }
        
        tempCanvas.dispose()
      }, 200)
      
    } catch (error) {
      console.error('❌ Export error:', error)
    }
  }

  // Helper function to create progress image on canvas
  const createProgressImage = (message: string, stage: number = 0) => {
    if (!canvas) return null
    
    // Create SVG progress indicator
    const progressSvg = `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="progress-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:0.9" />
          </linearGradient>
          <linearGradient id="progress-bar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#4ade80;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#22c55e;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="100%" height="100%" rx="12" fill="url(#progress-bg)" stroke="#ffffff" stroke-width="2"/>
        
        <!-- Progress bar background -->
        <rect x="30" y="140" width="340" height="8" rx="4" fill="rgba(255,255,255,0.2)"/>
        
        <!-- Progress bar -->
        <rect x="30" y="140" width="${Math.max(10, stage * 85)}" height="8" rx="4" fill="url(#progress-bar)">
          <animate attributeName="width" values="${stage * 85};${(stage + 0.2) * 85};${stage * 85}" dur="2s" repeatCount="indefinite"/>
        </rect>
        
        <!-- Icon -->
        <circle cx="200" cy="80" r="25" fill="rgba(255,255,255,0.2)" stroke="#ffffff" stroke-width="2">
          <animate attributeName="r" values="25;30;25" dur="2s" repeatCount="indefinite"/>
        </circle>
        <text x="200" y="88" text-anchor="middle" fill="#ffffff" font-size="24">✨</text>
        
        <!-- Message -->
        <text x="200" y="125" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
          ${message}
        </text>
        
        <!-- Dots animation -->
        <text x="330" y="125" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="14">
          <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>
          .
        </text>
        <text x="340" y="125" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="14">
          <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>
          .
        </text>
        <text x="350" y="125" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="14">
          <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="1s" repeatCount="indefinite"/>
          .
        </text>
      </svg>
    `
    
    const dataUrl = `data:image/svg+xml,${encodeURIComponent(progressSvg)}`
    
    return new Promise((resolve) => {
      fabric.Image.fromURL(dataUrl, (img) => {
        if (img) {
          img.set({
            left: canvas.width! / 2,
            top: canvas.height! / 2,
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false,
            isProgressImage: true
          })
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
    
    let progressTimeout: NodeJS.Timeout
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
      
      
      {/* Grid toggle and zoom controls could go here */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2">
        <button className="bg-white bg-opacity-75 hover:bg-opacity-100 rounded p-2 text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <span className="bg-white bg-opacity-75 rounded px-2 py-1 text-sm text-gray-600">
          100%
        </span>
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
      />
    </div>
  )
}