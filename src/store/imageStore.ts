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

  addImages: async (files, options = { autoArrange: true, spacing: 20 }) => {
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

        // Position image
        const finalWidth = imgWidth * scale
        const finalHeight = imgHeight * scale
        const spacing = options.spacing || 100
        
        let x = 100 + (i % 2) * (finalWidth + spacing)
        let y = 100 + Math.floor(i / 2) * (finalHeight + spacing)

        if (options.autoArrange) {
          fabricImage.set({ left: x, top: y })
        } else {
          fabricImage.center()
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