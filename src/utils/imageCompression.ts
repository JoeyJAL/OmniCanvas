/**
 * Client-side image compression utility for canvas data URLs
 * Implements 2024 best practices for handling Vercel 4.5MB limits
 */

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeKB?: number
  format?: 'jpeg' | 'png' | 'webp'
}

export interface CompressionResult {
  dataURL: string
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

/**
 * Calculate data URL size in bytes
 */
export function getDataURLSize(dataURL: string): number {
  // Remove the header (data:image/jpeg;base64,)
  const base64 = dataURL.split(',')[1] || dataURL
  // Base64 encoding increases size by ~33%, so decode to get actual bytes
  return Math.floor(base64.length * 0.75)
}

/**
 * Compress a data URL using canvas with iterative quality reduction
 */
export async function compressDataURL(
  dataURL: string, 
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.8,
    maxSizeKB = 3500, // Stay well under 4.5MB limit
    format = 'jpeg'
  } = options

  const originalSize = getDataURLSize(dataURL)

  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        // Calculate dimensions maintaining aspect ratio
        let { width, height } = calculateDimensions(img.width, img.height, maxWidth, maxHeight)

        canvas.width = width
        canvas.height = height

        // Draw image with anti-aliasing
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        // Start with high quality and reduce iteratively
        let currentQuality = quality
        let compressedDataURL: string
        let compressedSize: number

        do {
          compressedDataURL = canvas.toDataURL(`image/${format}`, currentQuality)
          compressedSize = getDataURLSize(compressedDataURL)

          console.log(`🔧 Compression attempt: ${Math.round(compressedSize/1024)}KB at quality ${currentQuality}`)

          // If still too large, reduce quality or dimensions
          if (compressedSize > maxSizeKB * 1024) {
            if (currentQuality > 0.3) {
              currentQuality -= 0.1 // Reduce quality
            } else {
              // If quality is too low, reduce dimensions
              width = Math.floor(width * 0.8)
              height = Math.floor(height * 0.8)
              canvas.width = width
              canvas.height = height
              ctx.clearRect(0, 0, width, height)
              ctx.drawImage(img, 0, 0, width, height)
              currentQuality = 0.7 // Reset quality
            }
          }
        } while (compressedSize > maxSizeKB * 1024 && (currentQuality > 0.2 || width > 200))

        const compressionRatio = originalSize / compressedSize

        console.log(`✅ Image compressed: ${Math.round(originalSize/1024)}KB → ${Math.round(compressedSize/1024)}KB (${Math.round(compressionRatio * 100)/100}x reduction)`)

        resolve({
          dataURL: compressedDataURL,
          originalSize,
          compressedSize,
          compressionRatio
        })
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => reject(new Error('Failed to load image for compression'))
    img.src = dataURL
  })
}

/**
 * Calculate optimal dimensions maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number, 
  originalHeight: number, 
  maxWidth: number, 
  maxHeight: number
): { width: number, height: number } {
  let width = originalWidth
  let height = originalHeight

  // Scale down if needed
  if (width > maxWidth) {
    height = (height * maxWidth) / width
    width = maxWidth
  }

  if (height > maxHeight) {
    width = (width * maxHeight) / height
    height = maxHeight
  }

  return { 
    width: Math.floor(width), 
    height: Math.floor(height) 
  }
}

/**
 * Compress an array of data URLs
 */
export async function compressDataURLs(
  dataURLs: string[], 
  options: CompressionOptions = {}
): Promise<CompressionResult[]> {
  const results = []
  
  for (const dataURL of dataURLs) {
    try {
      const result = await compressDataURL(dataURL, options)
      results.push(result)
    } catch (error) {
      console.error('Failed to compress image:', error)
      // Return original if compression fails
      const originalSize = getDataURLSize(dataURL)
      results.push({
        dataURL,
        originalSize,
        compressedSize: originalSize,
        compressionRatio: 1
      })
    }
  }

  return results
}

/**
 * Helper to convert canvas selection to compressed data URL
 */
export async function getCompressedCanvasSelection(
  canvas: fabric.Canvas,
  options: CompressionOptions = {}
): Promise<string | null> {
  const activeObjects = canvas.getActiveObjects()
  
  if (activeObjects.length === 0) {
    console.warn('No objects selected for compression')
    return null
  }

  // Create data URL from selection
  const dataURL = canvas.toDataURL({
    format: 'png',
    quality: 1,
    multiplier: 1
  })

  try {
    const result = await compressDataURL(dataURL, {
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.7,
      format: 'jpeg',
      maxSizeKB: 2000,
      ...options
    })
    
    return result.dataURL
  } catch (error) {
    console.error('Canvas selection compression failed:', error)
    return null
  }
}