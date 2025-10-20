import { create } from 'zustand'
import { fabric } from 'fabric'
import type { ImportedImage, ImageImportOptions, ImageSelection } from '@/types/image'

interface ImageStore {
  images: ImportedImage[]
  selectedImages: string[]
  isMultiSelectMode: boolean
  
  // Actions
  addImages: (files: FileList, options?: ImageImportOptions) => Promise<void>
  removeImage: (imageId: string) => void
  selectImage: (imageId: string, multiSelect?: boolean) => void
  selectAllImages: () => void
  clearSelection: () => void
  deleteSelectedImages: () => void
  toggleMultiSelectMode: () => void
  arrangeImages: (type: 'grid' | 'horizontal' | 'vertical') => void
  getSelectedImages: () => ImportedImage[]
  getSelectionBounds: () => ImageSelection | null
  
  // Canvas integration
  canvas: fabric.Canvas | null
  setCanvas: (canvas: fabric.Canvas) => void
}

export const useImageStore = create<ImageStore>((set, get) => ({
  images: [],
  selectedImages: [],
  isMultiSelectMode: false,
  canvas: null,

  setCanvas: (canvas) => set({ canvas }),

  addImages: async (files, options = { autoArrange: false, spacing: 20 }) => {
    const { canvas, images } = get()
    if (!canvas) return

    const newImages: ImportedImage[] = []
    const fileArray = Array.from(files)
    
    // Process each file
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      if (!file.type.startsWith('image/')) continue

      try {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(file)
        })

        const fabricImage = await new Promise<fabric.Image>((resolve, reject) => {
          fabric.Image.fromURL(dataUrl, (img) => {
            if (img) {
              // Configure image
              img.set({
                selectable: true,
                hasControls: true,
                hasBorders: true,
                cornerColor: '#2563eb',
                cornerStyle: 'circle',
                borderColor: '#2563eb'
              })
              resolve(img)
            } else {
              reject(new Error('Failed to load image'))
            }
          })
        })

        // Improved scaling for better visibility
        const imgWidth = fabricImage.width || 1
        const imgHeight = fabricImage.height || 1
        const maxDimension = Math.max(imgWidth, imgHeight)
        
        console.log('📏 Original image size:', imgWidth, 'x', imgHeight)
        
        // Only scale down if image is too large to avoid blurriness
        const maxReasonableSize = 600  // Maximum reasonable display size
        
        let scale = 1
        
        if (maxDimension > maxReasonableSize) {
          // Only scale down if too large
          scale = maxReasonableSize / maxDimension
          console.log('🔽 Scaling down large image:', scale)
        } else {
          // Keep original size if reasonable
          console.log('✅ Using original size (good quality)')
        }
        
        fabricImage.scale(scale)
        console.log('✅ Final display size:', (imgWidth * scale).toFixed(0), 'x', (imgHeight * scale).toFixed(0))

        // Position image based on current viewport center
        const finalWidth = imgWidth * scale
        const finalHeight = imgHeight * scale
        const spacing = options.spacing || 100

        // Calculate current viewport center using a more direct approach
        const zoom = canvas.getZoom()
        const vpt = canvas.viewportTransform!
        const canvasEl = canvas.getElement()

        // 🔥 MANUAL TRANSFORM MATRIX CALCULATION! 🔥
        console.log('🚨 EXECUTING MANUAL MATRIX CALCULATION - TIMESTAMP:', new Date().toISOString())

        // MANUAL METHOD: Calculate viewport center using transform matrix math
        // Transform matrix: [scaleX, skewY, skewX, scaleY, translateX, translateY]
        // To convert screen point to canvas point: (screenX - translateX) / scaleX, (screenY - translateY) / scaleY

        // Get actual VIEWPORT size, not canvas element size
        // Check if right panel is visible and subtract its width
        // First, scan all elements on the right side for debugging
        const allElements = document.querySelectorAll('*')
        const rightSideElements = []
        for (const el of allElements) {
          const rect = el.getBoundingClientRect()
          if (rect.width > 250 && rect.right >= window.innerWidth - 100 && rect.height > 300) {
            rightSideElements.push({
              tag: el.tagName,
              className: el.className,
              id: el.id,
              width: rect.width,
              height: rect.height,
              right: rect.right,
              left: rect.left
            })
          }
        }
        console.log('🔍 All potential right-side panels found:', rightSideElements)

        // Try multiple selectors to find the right panel
        const panelSelectors = [
          'div',  // Try all divs first
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
            // STRICT check - must be a reasonable panel size, not full window width
            const isReasonablePanel = rect.width > 250 && rect.width < window.innerWidth * 0.6 // Max 60% of window width
            const isOnRightSide = rect.right >= window.innerWidth - 100
            const isNotFullWidth = rect.width < window.innerWidth - 100 // Must not be full width
            const isTallEnough = rect.height > 300

            if (isReasonablePanel && isOnRightSide && isNotFullWidth && isTallEnough) {
              rightPanel = panel
              panelWidth = rect.width
              console.log('🎯 Found right panel:', selector, 'class:', panel.className, 'width:', panelWidth, 'rect:', rect)
              break
            }
          }
          if (rightPanel) break
        }

        if (!rightPanel) {
          console.log('⚠️ No right panel detected, using full viewport')
          console.log('   - Window dimensions:', window.innerWidth, 'x', window.innerHeight)
          console.log('   - Checked', rightSideElements.length, 'potential elements')
        }

        const viewportWidth = window.innerWidth - panelWidth
        const viewportHeight = window.innerHeight
        const screenCenterX = viewportWidth / 2
        const screenCenterY = viewportHeight / 2

        const scaleX = vpt[0]
        const scaleY = vpt[3]
        const translateX = vpt[4]
        const translateY = vpt[5]

        // Convert screen center to canvas coordinates
        const viewportCenterX = (screenCenterX - translateX) / scaleX
        const viewportCenterY = (screenCenterY - translateY) / scaleY

        console.log('🔥 MANUAL CALCULATION RESULT:', viewportCenterX.toFixed(0), viewportCenterY.toFixed(0))
        console.log('📊 Transform values: scale=', scaleX.toFixed(2), scaleY.toFixed(2), 'translate=', translateX.toFixed(0), translateY.toFixed(0))
        console.log('🔍 VIEWPORT vs CANVAS SIZE:')
        console.log('   - Window size:', window.innerWidth, 'x', window.innerHeight, '(full window)')
        console.log('   - Right panel width:', panelWidth, '(detected panel)')
        console.log('   - Available viewport size:', viewportWidth, 'x', viewportHeight, '(available canvas area)')
        console.log('   - Canvas element size:', canvasEl.width, 'x', canvasEl.height, '(canvas element)')
        console.log('   - Viewport center:', screenCenterX, screenCenterY)

        console.log('✅ USING FABRIC.JS BUILT-IN TRANSFORMATION - SHOULD BE CORRECT NOW!')

        // Show the difference
        console.log('🎯 Using Method 2 (direct calculation) for positioning')
        console.log('📏 Transform matrix details:')
        console.log('   - Canvas size:', canvasEl.width, 'x', canvasEl.height)
        console.log('   - Screen center:', canvasEl.width / 2, canvasEl.height / 2)
        console.log('   - Transform scale:', vpt[0], vpt[3])
        console.log('   - Transform translate:', vpt[4], vpt[5])

        console.log('📐 DETAILED Viewport center calculation:', {
          zoom,
          canvasSize: { width: canvasEl.width, height: canvasEl.height },
          vpt: {
            full: vpt,
            scaleX: vpt[0], scaleY: vpt[3],
            translateX: vpt[4], translateY: vpt[5]
          },
          screenCenter: { x: canvasEl.width / 2, y: canvasEl.height / 2 },
          invertedTransform: fabric.util.invertTransform(vpt),
          finalCalculatedCenter: { x: viewportCenterX.toFixed(0), y: viewportCenterY.toFixed(0) },
          fileArrayLength: fileArray.length,
          autoArrangeEnabled: options.autoArrange,
          willUseGridLayout: options.autoArrange && fileArray.length > 1
        })

        if (options.autoArrange && fileArray.length > 1) {
          // Arrange multiple images in a grid starting from viewport center
          const colCount = Math.ceil(Math.sqrt(fileArray.length)) // Dynamic grid based on number of images
          const row = Math.floor(i / colCount)
          const col = i % colCount

          // Calculate grid start position (top-left of the grid)
          const gridWidth = colCount * (finalWidth + spacing) - spacing
          const gridHeight = Math.ceil(fileArray.length / colCount) * (finalHeight + spacing) - spacing
          const startX = viewportCenterX - gridWidth / 2
          const startY = viewportCenterY - gridHeight / 2

          const x = startX + col * (finalWidth + spacing)
          const y = startY + row * (finalHeight + spacing)

          fabricImage.set({
            left: x + finalWidth / 2,
            top: y + finalHeight / 2,
            originX: 'center',
            originY: 'center'
          })
          console.log(`📍 Positioned image ${i + 1} at viewport-centered grid:`, x.toFixed(0), y.toFixed(0))
        } else {
          // Center single image at viewport center (both autoArrange=false or single image)
          // Position the image so its visual center appears at viewport center
          fabricImage.set({
            left: viewportCenterX,
            top: viewportCenterY,
            originX: 'center',
            originY: 'center'
          })
          console.log('📍 Centered image at viewport center:', viewportCenterX.toFixed(0), viewportCenterY.toFixed(0))
        console.log('🔍 Raw viewport transform values:', {
          vpt_array: vpt,
          scaleX: vpt[0],
          skewY: vpt[1],
          skewX: vpt[2],
          scaleY: vpt[3],
          translateX: vpt[4],
          translateY: vpt[5]
        })
        console.log('🔍 Canvas element size:', { width: canvasEl.width, height: canvasEl.height })
        console.log('🔍 Center point calculation:', { x: canvasEl.width / 2, y: canvasEl.height / 2 })
        }

        // Add to canvas
        canvas.add(fabricImage)

        // Create image record
        const imageRecord: ImportedImage = {
          id: `img_${Date.now()}_${i}`,
          name: file.name,
          url: dataUrl,
          fabricObject: fabricImage,
          width: fabricImage.width || 0,
          height: fabricImage.height || 0,
          selected: false,
          position: { x: fabricImage.left || 0, y: fabricImage.top || 0 },
          scale,
          thumbnail: dataUrl
        }

        newImages.push(imageRecord)

      } catch (error) {
        console.error(`Failed to load image ${file.name}:`, error)
      }
    }

    canvas.renderAll()
    set({ images: [...images, ...newImages] })

    // Add to history
    if (canvas && newImages.length > 0) {
      // This would need to be integrated with the canvas store
      console.log('Added', newImages.length, 'images to canvas')
    }
  },

  removeImage: (imageId) => {
    const { canvas, images, selectedImages } = get()
    if (!canvas) return

    const image = images.find(img => img.id === imageId)
    if (image && image.fabricObject) {
      canvas.remove(image.fabricObject)
      canvas.renderAll()
    }

    set({
      images: images.filter(img => img.id !== imageId),
      selectedImages: selectedImages.filter(id => id !== imageId)
    })
  },

  selectImage: (imageId, multiSelect = false) => {
    const { selectedImages, isMultiSelectMode } = get()
    
    if (multiSelect || isMultiSelectMode) {
      // Multi-select mode
      const newSelection = selectedImages.includes(imageId)
        ? selectedImages.filter(id => id !== imageId)
        : [...selectedImages, imageId]
      
      set({ selectedImages: newSelection })
    } else {
      // Single select
      set({ selectedImages: [imageId] })
    }

    // Update fabric objects selection state
    const { images, canvas } = get()
    if (canvas) {
      const selectedImageIds = get().selectedImages
      images.forEach(img => {
        if (img.fabricObject) {
          const isSelected = selectedImageIds.includes(img.id)
          img.fabricObject.set({ 
            borderColor: isSelected ? '#ef4444' : '#2563eb',
            cornerColor: isSelected ? '#ef4444' : '#2563eb'
          })
        }
      })
      canvas.renderAll()
    }
  },

  selectAllImages: () => {
    const { images } = get()
    set({ selectedImages: images.map(img => img.id) })
    
    // Update visual selection
    const { canvas } = get()
    if (canvas) {
      images.forEach(img => {
        if (img.fabricObject) {
          img.fabricObject.set({ 
            borderColor: '#ef4444',
            cornerColor: '#ef4444'
          })
        }
      })
      canvas.renderAll()
    }
  },

  clearSelection: () => {
    set({ selectedImages: [] })
    
    // Update visual selection
    const { images, canvas } = get()
    if (canvas) {
      images.forEach(img => {
        if (img.fabricObject) {
          img.fabricObject.set({ 
            borderColor: '#2563eb',
            cornerColor: '#2563eb'
          })
        }
      })
      canvas.renderAll()
    }
  },

  deleteSelectedImages: () => {
    const { selectedImages } = get()
    selectedImages.forEach(imageId => {
      get().removeImage(imageId)
    })
    set({ selectedImages: [] })
  },

  toggleMultiSelectMode: () => {
    const { isMultiSelectMode } = get()
    set({ isMultiSelectMode: !isMultiSelectMode })
    
    if (!isMultiSelectMode) {
      get().clearSelection()
    }
  },

  arrangeImages: (type) => {
    const { images, canvas } = get()
    if (!canvas || images.length === 0) return

    const canvasWidth = canvas.width || 800
    const canvasHeight = canvas.height || 600
    const padding = 20
    const availableWidth = canvasWidth - padding * 2
    const availableHeight = canvasHeight - padding * 2

    images.forEach((img, index) => {
      if (!img.fabricObject) return

      let x = padding
      let y = padding

      switch (type) {
        case 'grid':
          const cols = Math.ceil(Math.sqrt(images.length))
          const itemWidth = availableWidth / cols
          const itemHeight = availableHeight / Math.ceil(images.length / cols)
          
          x = padding + (index % cols) * itemWidth + itemWidth / 2
          y = padding + Math.floor(index / cols) * itemHeight + itemHeight / 2
          break

        case 'horizontal':
          const itemWidthH = availableWidth / images.length
          x = padding + index * itemWidthH + itemWidthH / 2
          y = canvasHeight / 2
          break

        case 'vertical':
          const itemHeightV = availableHeight / images.length
          x = canvasWidth / 2
          y = padding + index * itemHeightV + itemHeightV / 2
          break
      }

      img.fabricObject.set({ left: x, top: y })
      img.position = { x, y }
    })

    canvas.renderAll()
  },

  getSelectedImages: () => {
    const { images, selectedImages } = get()
    return images.filter(img => selectedImages.includes(img.id))
  },

  getSelectionBounds: () => {
    const selectedImages = get().getSelectedImages()
    if (selectedImages.length === 0) return null

    const fabricObjects = selectedImages
      .map(img => img.fabricObject)
      .filter(obj => obj !== null) as fabric.Image[]

    if (fabricObjects.length === 0) return null

    // Calculate bounding box
    const bounds = {
      left: Math.min(...fabricObjects.map(obj => obj.left || 0)),
      top: Math.min(...fabricObjects.map(obj => obj.top || 0)),
      right: Math.max(...fabricObjects.map(obj => (obj.left || 0) + (obj.width || 0) * (obj.scaleX || 1))),
      bottom: Math.max(...fabricObjects.map(obj => (obj.top || 0) + (obj.height || 0) * (obj.scaleY || 1)))
    }

    return {
      images: selectedImages,
      bounds: {
        left: bounds.left,
        top: bounds.top,
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top
      }
    }
  }
}))