import type { 
  TextToImageRequest, 
  ImageToImageRequest,
  AIGeneratedImage, 
  ImageEditRequest,
  StyleTransferRequest,
  AIServiceProvider 
} from '@/types/ai'
import { compressDataURLs, compressDataURL, getDataURLSize } from '@/utils/imageCompression'
import { useAPIKeyStore } from '@store/apiKeyStore'

interface BackendAPIConfig {
  baseUrl: string
  endpoints: {
    generateImage: string
    mergeImages: string
    transferStyle: string
    generateSimilar: string
    elevenlabs?: string
    generateComic: string
    editWithWords: string
    blendProduct: string
    generateVideo: string
    generateText: string
  }
}

class AIService {
  private config: BackendAPIConfig

  constructor() {
    this.config = {
      baseUrl: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3004/api',
      endpoints: {
        generateImage: '/ai/generate-image',
        mergeImages: '/ai/merge-images',
        transferStyle: '/ai/transfer-style', 
        generateSimilar: '/ai/generate-similar',
        elevenlabs: '/ai/elevenlabs',
        generateComic: '/ai/generate-comic',
        editWithWords: '/ai/edit-with-words',
        blendProduct: '/ai/blend-product',
        generateVideo: '/ai/generate-video',
        generateText: '/ai/generate-text',
        nanoBananaPhotoToVideo: '/ai/nano-banana-photo-to-video',
        nanoBananaImageFusion: '/ai/nano-banana-image-fusion',
      }
    }
  }

  configure(baseUrl?: string) {
    if (baseUrl) {
      this.config.baseUrl = baseUrl
    }
  }

  private getGeminiAPIKey(): string {
    const geminiKey = useAPIKeyStore.getState().apiKeys.gemini
    if (!geminiKey) {
      throw new Error('Please configure your Gemini API key in Settings to use AI features')
    }
    return geminiKey
  }

  private getRequestHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'X-API-Key': this.getGeminiAPIKey()
    }
  }

  async generateImage(request: TextToImageRequest): Promise<AIGeneratedImage> {
    try {
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.generateImage}`, {
        method: 'POST',
        headers: this.getRequestHeaders(),
        body: JSON.stringify({
          prompt: request.prompt,
          width: request.width || 512,
          height: request.height || 512,
          provider: 'gemini'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Backend API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      
      return {
        url: data.imageUrl || data.url,
        width: data.width || request.width || 512,
        height: data.height || request.height || 512,
        prompt: request.prompt,
        provider: 'gemini' as AIServiceProvider,
        metadata: {
          timestamp: Date.now(),
          model: 'gemini-2.5-flash-image',
          ...data.metadata
        }
      }
    } catch (error) {
      console.error('Image generation error:', error)
      throw error
    }
  }

  // New method for image-to-image generation using Nano Banana
  async imageToImage(request: ImageToImageRequest): Promise<AIGeneratedImage> {
    try {
      console.log('🎨 Frontend AI Image-to-Image called!')
      console.log('📝 Request details:', {
        prompt: typeof request.prompt === 'string' ? request.prompt.substring(0, 100) + '...' : request.prompt,
        imageUrl: typeof request.imageUrl === 'string' ? request.imageUrl.substring(0, 50) + '...' : request.imageUrl,
        width: request.width,
        height: request.height,
        strength: request.strength
      })
      
      // Compress the reference image if it's a data URL
      let processedImageUrl = request.imageUrl
      
      if (request.imageUrl.startsWith('data:')) {
        console.log('🔧 Compressing reference image for image-to-image...')
        const originalSize = getDataURLSize(request.imageUrl)
        console.log(`📏 Original image size: ${Math.round(originalSize / 1024)}KB`)
        
        const compressionResult = await compressDataURL(request.imageUrl, {
          maxWidth: 768,
          maxHeight: 768,
          quality: 0.8,
          format: 'jpeg',
          maxSizeKB: 2000
        })
        
        processedImageUrl = compressionResult.dataURL
        console.log(`✅ Compressed image size: ${Math.round(compressionResult.compressedSize / 1024)}KB`)
      }
      
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.generateImage}`, {
        method: 'POST',
        headers: this.getRequestHeaders(),
        body: JSON.stringify({
          prompt: request.prompt,
          imageUrl: processedImageUrl,  // Reference image (compressed if needed)
          width: request.width || 512,
          height: request.height || 512,
          strength: request.strength || 0.7,  // How much to follow reference image
          provider: 'gemini',
          mode: 'image-to-image'  // Specify mode
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Backend API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()

      console.log('📦 Backend response received:', {
        hasImageUrl: !!data.imageUrl,
        hasUrl: !!data.url,
        imageUrlType: typeof data.imageUrl,
        urlType: typeof data.url,
        dataKeys: Object.keys(data)
      })

      // Enhanced URL extraction with detailed logging
      let resultUrl = data.imageUrl || data.url

      if (!resultUrl) {
        console.error('❌ No imageUrl or url found in response:', data)
        throw new Error('Backend did not return a valid image URL')
      }

      if (typeof resultUrl !== 'string') {
        console.error('❌ imageUrl is not a string:', typeof resultUrl, resultUrl)
        throw new Error(`Invalid imageUrl type: expected string, got ${typeof resultUrl}`)
      }

      if (resultUrl.length === 0) {
        console.error('❌ imageUrl is empty string')
        throw new Error('Backend returned empty imageUrl')
      }

      console.log('✅ Successfully extracted imageUrl:', resultUrl.substring(0, 50) + '...')

      return {
        url: resultUrl,
        width: data.width || request.width || 512,
        height: data.height || request.height || 512,
        prompt: request.prompt,
        provider: 'gemini' as AIServiceProvider,
        metadata: {
          timestamp: Date.now(),
          model: 'gemini-2.5-flash-image',
          mode: 'image-to-image',
          referenceImage: request.imageUrl,
          strength: request.strength || 0.7,
          ...data.metadata
        }
      }
    } catch (error) {
      console.error('Image-to-image generation error:', error)
      throw error
    }
  }

  async mergeImages(imageUrls: string[], prompt: string): Promise<string> {
    try {
      console.log('🎨 Backend AI Merge - Images:', imageUrls.length, 'Prompt:', prompt)
      
      // Check if any images are data URLs that need compression
      const dataUrls = imageUrls.filter(url => url.startsWith('data:'))
      const regularUrls = imageUrls.filter(url => !url.startsWith('data:'))
      
      let processedUrls = [...regularUrls]
      
      if (dataUrls.length > 0) {
        console.log('🔧 Compressing', dataUrls.length, 'data URLs on client side...')
        
        // Log original sizes
        const originalSizes = dataUrls.map(url => getDataURLSize(url))
        const totalOriginalSize = originalSizes.reduce((sum, size) => sum + size, 0)
        console.log(`📏 Original total size: ${Math.round(totalOriginalSize / 1024)}KB`)
        
        // Compress data URLs
        const compressionResults = await compressDataURLs(dataUrls, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.6,
          format: 'jpeg',
          maxSizeKB: 1500 // Conservative limit for each image
        })
        
        const compressedUrls = compressionResults.map(result => result.dataURL)
        const totalCompressedSize = compressionResults.reduce((sum, result) => sum + result.compressedSize, 0)
        
        console.log(`✅ Compressed total size: ${Math.round(totalCompressedSize / 1024)}KB (${Math.round(totalOriginalSize / totalCompressedSize * 100)/100}x reduction)`)
        
        processedUrls = [...regularUrls, ...compressedUrls]
      }
      
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.mergeImages}`, {
        method: 'POST',
        headers: this.getRequestHeaders(),
        body: JSON.stringify({
          imageUrls: processedUrls,
          prompt,
          provider: 'gemini'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Backend merge error:', errorText)
        throw new Error(`Backend merge error: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Backend merge successful:', data)

      console.log('📦 Merge response received:', {
        hasImageUrl: !!data.imageUrl,
        hasUrl: !!data.url,
        imageUrlType: typeof data.imageUrl,
        urlType: typeof data.url,
        dataKeys: Object.keys(data)
      })

      // Enhanced URL extraction with detailed logging
      let resultUrl = data.imageUrl || data.url

      if (!resultUrl) {
        console.error('❌ No imageUrl or url found in merge response:', data)
        throw new Error('Backend merge did not return a valid image URL')
      }

      if (typeof resultUrl !== 'string') {
        console.error('❌ Merge imageUrl is not a string:', typeof resultUrl, resultUrl)
        throw new Error(`Invalid merge imageUrl type: expected string, got ${typeof resultUrl}`)
      }

      if (resultUrl.length === 0) {
        console.error('❌ Merge imageUrl is empty string')
        throw new Error('Backend merge returned empty imageUrl')
      }

      console.log('✅ Successfully extracted merge imageUrl:', resultUrl.substring(0, 50) + '...')

      return resultUrl
    } catch (error) {
      console.error('Backend merge failed:', error)
      throw error
    }
  }

  async transferStyle(request: StyleTransferRequest): Promise<string> {
    try {
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.transferStyle}`, {
        method: 'POST',
        headers: this.getRequestHeaders(),
        body: JSON.stringify({
          imageUrl: request.imageUrl,
          style: request.style,
          provider: 'gemini'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Style transfer error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return data.imageUrl || data.url
    } catch (error) {
      console.error('Style transfer error:', error)
      throw error
    }
  }

  async generateSimilar(request: { images: string[], prompt: string, aspectRatio?: string }): Promise<string> {
    try {
      console.log('🌟 Calling generateSimilar API with', request.images.length, 'images')
      
      // Compress large data URLs
      const dataUrls = request.images.filter(url => url.startsWith('data:'))
      const regularUrls = request.images.filter(url => !url.startsWith('data:'))
      
      let processedImages = [...regularUrls]
      
      if (dataUrls.length > 0) {
        console.log('🔧 Compressing', dataUrls.length, 'data URLs for generateSimilar...')
        
        const compressionResults = await compressDataURLs(dataUrls, {
          maxWidth: 768,
          maxHeight: 768,
          quality: 0.7,
          format: 'jpeg',
          maxSizeKB: 1800
        })
        
        const compressedUrls = compressionResults.map(result => result.dataURL)
        processedImages = [...regularUrls, ...compressedUrls]
      }
      
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.generateSimilar}`, {
        method: 'POST',
        headers: this.getRequestHeaders(),
        body: JSON.stringify({
          imageUrls: processedImages,
          prompt: request.prompt,
          aspectRatio: request.aspectRatio || '1:1',
          provider: 'gemini'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Generate similar API error:', errorText)
        throw new Error(`Generate similar error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ Generate similar API response:', data)
      
      return data.imageUrl || data.url
    } catch (error) {
      console.error('Generate similar error:', error)
      throw error
    }
  }

  async generateVoice(text: string, voiceId?: string): Promise<string> {
    try {
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.elevenlabs}`, {
        method: 'POST',
        headers: this.getRequestHeaders(),
        body: JSON.stringify({
          text,
          voiceId: voiceId || 'default',
          provider: 'elevenlabs'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Voice generation error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return data.audioUrl || data.url
    } catch (error) {
      console.error('Voice generation error:', error)
      throw error
    }
  }

  // StoryShop specific methods
  async generateComic(request: {
    storyPrompt: string
    characterImage?: string
    productImage?: string
    style: string
    panelCount?: number
  }): Promise<string[]> {
    try {
      console.log('📚 Generating comic with StoryShop API')
      
      // Compress character and product images if they are data URLs
      let processedCharacterImage = request.characterImage
      let processedProductImage = request.productImage

      if (request.characterImage && request.characterImage.startsWith('data:')) {
        console.log('🔧 Compressing character image for comic generation...')
        const compressionResult = await compressDataURL(request.characterImage, {
          maxWidth: 512,
          maxHeight: 512,
          quality: 0.7,
          format: 'jpeg',
          maxSizeKB: 1200
        })
        processedCharacterImage = compressionResult.dataURL
        console.log(`✅ Character image compressed: ${Math.round(compressionResult.compressedSize / 1024)}KB`)
      }

      if (request.productImage && request.productImage.startsWith('data:')) {
        console.log('🔧 Compressing product image for comic generation...')
        const compressionResult = await compressDataURL(request.productImage, {
          maxWidth: 512,
          maxHeight: 512,
          quality: 0.7,
          format: 'jpeg',
          maxSizeKB: 1200
        })
        processedProductImage = compressionResult.dataURL
        console.log(`✅ Product image compressed: ${Math.round(compressionResult.compressedSize / 1024)}KB`)
      }
      
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.generateComic}`, {
        method: 'POST',
        headers: this.getRequestHeaders(),
        body: JSON.stringify({
          storyPrompt: request.storyPrompt,
          characterImage: processedCharacterImage,
          productImage: processedProductImage,
          style: request.style,
          panelCount: request.panelCount || 4,
          provider: 'gemini'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Comic generation error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return data.panelUrls || []
    } catch (error) {
      console.error('Comic generation error:', error)
      throw error
    }
  }

  async editWithWords(request: {
    imageUrl: string
    editPrompt: string
    maskUrl?: string
  }): Promise<string> {
    try {
      // Compress images if they are data URLs
      let processedImageUrl = request.imageUrl
      let processedMaskUrl = request.maskUrl

      if (request.imageUrl.startsWith('data:')) {
        console.log('🔧 Compressing image for editWithWords...')
        const compressionResult = await compressDataURL(request.imageUrl, {
          maxWidth: 768,
          maxHeight: 768,
          quality: 0.8,
          format: 'jpeg',
          maxSizeKB: 2000
        })
        processedImageUrl = compressionResult.dataURL
      }

      if (request.maskUrl && request.maskUrl.startsWith('data:')) {
        console.log('🔧 Compressing mask for editWithWords...')
        const compressionResult = await compressDataURL(request.maskUrl, {
          maxWidth: 768,
          maxHeight: 768,
          quality: 0.8,
          format: 'png', // Keep mask as PNG to preserve transparency
          maxSizeKB: 1000
        })
        processedMaskUrl = compressionResult.dataURL
      }
      
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.editWithWords}`, {
        method: 'POST',
        headers: this.getRequestHeaders(),
        body: JSON.stringify({
          imageUrl: processedImageUrl,
          editPrompt: request.editPrompt,
          maskUrl: processedMaskUrl,
          provider: 'gemini'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Edit with words error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return data.imageUrl || data.url
    } catch (error) {
      console.error('Edit with words error:', error)
      throw error
    }
  }

  async blendProduct(request: {
    sceneImageUrl: string
    productImageUrl: string
    blendPrompt: string
  }): Promise<string> {
    try {
      // Compress images if they are data URLs
      let processedSceneUrl = request.sceneImageUrl
      let processedProductUrl = request.productImageUrl

      if (request.sceneImageUrl.startsWith('data:')) {
        console.log('🔧 Compressing scene image for blendProduct...')
        const compressionResult = await compressDataURL(request.sceneImageUrl, {
          maxWidth: 768,
          maxHeight: 768,
          quality: 0.8,
          format: 'jpeg',
          maxSizeKB: 2000
        })
        processedSceneUrl = compressionResult.dataURL
      }

      if (request.productImageUrl.startsWith('data:')) {
        console.log('🔧 Compressing product image for blendProduct...')
        const compressionResult = await compressDataURL(request.productImageUrl, {
          maxWidth: 512,
          maxHeight: 512,
          quality: 0.8,
          format: 'jpeg',
          maxSizeKB: 1500
        })
        processedProductUrl = compressionResult.dataURL
      }
      
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.blendProduct}`, {
        method: 'POST',
        headers: this.getRequestHeaders(),
        body: JSON.stringify({
          sceneImageUrl: processedSceneUrl,
          productImageUrl: processedProductUrl,
          blendPrompt: request.blendPrompt,
          provider: 'gemini'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Product blend error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return data.imageUrl || data.url
    } catch (error) {
      console.error('Product blend error:', error)
      throw error
    }
  }

  async generateVideoFromPanels(request: {
    panelUrls: string[]
    narrationText: string
    voiceId?: string
    duration?: number
  }): Promise<string> {
    try {
      console.log('🎬 Generating video from panels...')
      
      // Compress panel images if they are data URLs
      const dataUrls = request.panelUrls.filter(url => url.startsWith('data:'))
      const regularUrls = request.panelUrls.filter(url => !url.startsWith('data:'))
      
      let processedPanelUrls = [...regularUrls]
      
      if (dataUrls.length > 0) {
        console.log('🔧 Compressing', dataUrls.length, 'panel images for video generation...')
        
        // Calculate original total size
        const originalSizes = dataUrls.map(url => getDataURLSize(url))
        const totalOriginalSize = originalSizes.reduce((sum, size) => sum + size, 0)
        console.log(`📏 Original panels total size: ${Math.round(totalOriginalSize / 1024)}KB`)
        
        // Compress panel images with video-specific settings
        const compressionResults = await compressDataURLs(dataUrls, {
          maxWidth: 720,  // HD-ready size for video
          maxHeight: 720,
          quality: 0.75,  // Good quality for video frames
          format: 'jpeg',
          maxSizeKB: 1000 // Conservative limit per panel
        })
        
        const compressedUrls = compressionResults.map(result => result.dataURL)
        const totalCompressedSize = compressionResults.reduce((sum, result) => sum + result.compressedSize, 0)
        
        console.log(`✅ Compressed panels total size: ${Math.round(totalCompressedSize / 1024)}KB (${Math.round(totalOriginalSize / totalCompressedSize * 100)/100}x reduction)`)
        
        processedPanelUrls = [...regularUrls, ...compressedUrls]
      }
      
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.generateVideo}`, {
        method: 'POST',
        headers: this.getRequestHeaders(),
        body: JSON.stringify({
          panelUrls: processedPanelUrls,
          narrationText: request.narrationText,
          voiceId: request.voiceId || 'default',
          duration: request.duration || 8,
          provider: 'fal-ai'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Video generation error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return data.videoUrl || data.url
    } catch (error) {
      console.error('Video generation error:', error)
      throw error
    }
  }

  async generateText(request: {
    prompt: string
    maxLength?: number
  }): Promise<string> {
    try {
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.generateText}`, {
        method: 'POST',
        headers: this.getRequestHeaders(),
        body: JSON.stringify({
          prompt: request.prompt,
          maxLength: request.maxLength || 100
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Text generation error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return data.text
    } catch (error) {
      console.error('Text generation error:', error)
      throw error
    }
  }

  // Nano Banana specific methods
  async nanoBananaPhotoToVideo(request: {
    imageUrl: string
    prompt?: string
    duration?: number
    quality?: string
  }): Promise<string> {
    try {
      console.log('🍌 Nano Banana: Converting photo to 8-second video...')

      // Compress image if it's a data URL
      let processedImageUrl = request.imageUrl
      if (request.imageUrl.startsWith('data:')) {
        console.log('🔧 Compressing image for Nano Banana video generation...')
        const compressionResult = await compressDataURL(request.imageUrl, {
          maxWidth: 720,
          maxHeight: 720,
          quality: 0.8,
          format: 'jpeg',
          maxSizeKB: 2000
        })
        processedImageUrl = compressionResult.dataURL
        console.log(`✅ Compressed for video: ${Math.round(compressionResult.compressedSize / 1024)}KB`)
      }

      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.nanoBananaPhotoToVideo}`, {
        method: 'POST',
        headers: this.getRequestHeaders(),
        body: JSON.stringify({
          imageUrl: processedImageUrl,
          prompt: request.prompt || 'Create an 8-second animated video with natural movement and depth',
          duration: request.duration || 8,
          quality: request.quality || '720p',
          provider: 'gemini-nano-banana'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Nano Banana photo to video error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ Nano Banana video generated successfully!')
      return data.videoUrl || data.url
    } catch (error) {
      console.error('Nano Banana photo to video error:', error)
      throw error
    }
  }

  async nanoBananaImageFusion(request: {
    imageUrls: string[]
    prompt?: string
    style?: string
  }): Promise<string> {
    try {
      console.log('🍌 Nano Banana: Fusing', request.imageUrls.length, 'images...')

      // Compress images if they are data URLs
      const dataUrls = request.imageUrls.filter(url => url.startsWith('data:'))
      const regularUrls = request.imageUrls.filter(url => !url.startsWith('data:'))

      let processedUrls = [...regularUrls]

      if (dataUrls.length > 0) {
        console.log('🔧 Compressing', dataUrls.length, 'images for Nano Banana fusion...')

        const compressionResults = await compressDataURLs(dataUrls, {
          maxWidth: 512,
          maxHeight: 512,
          quality: 0.8,
          format: 'jpeg',
          maxSizeKB: 1500
        })

        const compressedUrls = compressionResults.map(result => result.dataURL)
        processedUrls = [...regularUrls, ...compressedUrls]

        const totalCompressedSize = compressionResults.reduce((sum, result) => sum + result.compressedSize, 0)
        console.log(`✅ Compressed for fusion: ${Math.round(totalCompressedSize / 1024)}KB total`)
      }

      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.nanoBananaImageFusion}`, {
        method: 'POST',
        headers: this.getRequestHeaders(),
        body: JSON.stringify({
          imageUrls: processedUrls,
          prompt: request.prompt || 'Create a natural and seamless fusion blending all images harmoniously',
          style: request.style || 'natural',
          maxImages: 8,
          provider: 'gemini-nano-banana'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Nano Banana image fusion error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ Nano Banana image fusion completed successfully!')
      return data.imageUrl || data.url
    } catch (error) {
      console.error('Nano Banana image fusion error:', error)
      throw error
    }
  }



  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: 'GET'
      })
      return response.ok
    } catch (error) {
      console.error('Backend connection test failed:', error)
      return false
    }
  }
}

export const aiService = new AIService()

// Client-side compression enabled for all image operations

export function configureAIServices(config?: any) {
  console.log('AI services now use backend API - frontend configuration ignored')
  if (config?.baseUrl) {
    aiService.configure(config.baseUrl)
  }
}

export default aiService