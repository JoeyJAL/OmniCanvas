import type { 
  TextToImageRequest, 
  AIGeneratedImage, 
  ImageEditRequest,
  StyleTransferRequest,
  AIServiceProvider 
} from '@/types/ai'

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
  }
}

class AIService {
  private config: BackendAPIConfig

  constructor() {
    this.config = {
      baseUrl: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3002/api',
      endpoints: {
        generateImage: '/ai/generate-image',
        mergeImages: '/ai/merge-images',
        transferStyle: '/ai/transfer-style', 
        generateSimilar: '/ai/generate-similar',
        elevenlabs: '/ai/elevenlabs',
        generateComic: '/ai/generate-comic',
        editWithWords: '/ai/edit-with-words',
        blendProduct: '/ai/blend-product',
        generateVideo: '/ai/generate-video'
      }
    }
  }

  configure(baseUrl?: string) {
    if (baseUrl) {
      this.config.baseUrl = baseUrl
    }
  }

  async generateImage(request: TextToImageRequest): Promise<AIGeneratedImage> {
    try {
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.generateImage}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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

  async mergeImages(imageUrls: string[], prompt: string): Promise<string> {
    try {
      console.log('🎨 Backend AI Merge - Images:', imageUrls.length, 'Prompt:', prompt)
      
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.mergeImages}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageUrls,
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
      
      return data.imageUrl || data.url
    } catch (error) {
      console.error('Backend merge failed:', error)
      throw error
    }
  }

  async transferStyle(request: StyleTransferRequest): Promise<string> {
    try {
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.transferStyle}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
      
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.generateSimilar}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageUrls: request.images,
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
        headers: {
          'Content-Type': 'application/json'
        },
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
      
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.generateComic}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          storyPrompt: request.storyPrompt,
          characterImage: request.characterImage,
          productImage: request.productImage,
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
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.editWithWords}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageUrl: request.imageUrl,
          editPrompt: request.editPrompt,
          maskUrl: request.maskUrl,
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
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.blendProduct}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sceneImageUrl: request.sceneImageUrl,
          productImageUrl: request.productImageUrl,
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
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.generateVideo}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          panelUrls: request.panelUrls,
          narrationText: request.narrationText,
          voiceId: request.voiceId || 'default',
          duration: request.duration || 15,
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

export function configureAIServices(config?: any) {
  console.log('AI services now use backend API - frontend configuration ignored')
  if (config?.baseUrl) {
    aiService.configure(config.baseUrl)
  }
}

export default aiService