export interface TextToImageRequest {
  prompt: string
  negativePrompt?: string
  width?: number
  height?: number
  steps?: number
  guidance?: number
  seed?: number
  style?: string
}

export interface AIGeneratedImage {
  id: string
  url: string
  prompt: string
  timestamp: number
  metadata: {
    model: string
    settings: TextToImageRequest
    error?: string
    textResponse?: string
    enhancedDescription?: string
    note?: string
  }
}

export interface ImageEditRequest {
  imageUrl: string
  maskUrl?: string
  prompt: string
  strength?: number
  guidance?: number
}

export interface StyleTransferRequest {
  imageUrl: string
  style: string | 'custom'
  customStyleUrl?: string
  strength?: number
}

export type AIServiceProvider = 'google-ai-studio' | 'fal-ai' | 'elevenlabs'

export interface AIServiceConfig {
  provider: AIServiceProvider
  apiKey: string
  baseUrl?: string
  model?: string
}