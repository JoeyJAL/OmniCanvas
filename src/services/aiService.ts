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
  }
}

class AIService {
  private config: BackendAPIConfig

  constructor() {
    this.config = {
      baseUrl: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3011/api',
      endpoints: {
        generateImage: '/ai/generate-image',
        mergeImages: '/ai/merge-images',
        transferStyle: '/ai/transfer-style', 
        generateSimilar: '/ai/generate-similar',
        elevenlabs: '/ai/elevenlabs'
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

  async generateSimilar(request: TextToImageRequest): Promise<AIGeneratedImage> {
    try {
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.generateSimilar}`, {
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
        throw new Error(`Generate similar error: ${response.status} - ${errorText}`)
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