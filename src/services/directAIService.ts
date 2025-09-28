import type { 
  TextToImageRequest, 
  ImageToImageRequest,
  AIGeneratedImage, 
  AIServiceProvider 
} from '@/types/ai'
import { useAPIKeyStore } from '@store/apiKeyStore'

// Rate limiting implementation
interface RateLimitInfo {
  count: number
  resetTime: number
}

class DirectAIService {
  private rateLimits: Map<string, RateLimitInfo> = new Map()
  private readonly RATE_LIMIT_WINDOW = 60000 // 1 minute
  private readonly MAX_REQUESTS_PER_WINDOW = 10

  private getAPIKey(service: keyof ReturnType<typeof useAPIKeyStore.getState>['apiKeys']): string | undefined {
    const key = useAPIKeyStore.getState().apiKeys[service]
    // Additional validation before using the key
    if (key && !this.isKeyValid(key)) {
      console.error(`Invalid API key detected for ${service}`)
      return undefined
    }
    return key
  }

  private isKeyValid(key: string): boolean {
    // Basic security check - ensure no script injection attempts
    if (key.includes('<script') || key.includes('javascript:') || key.includes('onclick')) {
      return false
    }
    return true
  }

  private checkRateLimit(service: string): boolean {
    const now = Date.now()
    const limit = this.rateLimits.get(service)
    
    if (!limit || now > limit.resetTime) {
      // Reset or create new limit
      this.rateLimits.set(service, {
        count: 1,
        resetTime: now + this.RATE_LIMIT_WINDOW
      })
      return true
    }
    
    if (limit.count >= this.MAX_REQUESTS_PER_WINDOW) {
      return false
    }
    
    limit.count++
    return true
  }

  async generateImage(request: TextToImageRequest): Promise<AIGeneratedImage> {
    // Rate limiting check
    if (!this.checkRateLimit('falai')) {
      throw new Error('Rate limit exceeded. Please wait a moment before trying again.')
    }

    const falApiKey = this.getAPIKey('falai')
    
    if (!falApiKey) {
      throw new Error('Please configure your Fal.ai API key in Settings to generate images')
    }

    // Sanitize prompt to prevent injection
    const sanitizedPrompt = this.sanitizeInput(request.prompt)

    try {
      const response = await fetch('https://fal.run/fal-ai/flux-lora', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${falApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: sanitizedPrompt,
          image_size: {
            width: request.width || 1024,
            height: request.height || 1024
          },
          num_inference_steps: request.quality === 'high' ? 50 : 25,
          guidance_scale: 7.5,
          num_images: 1,
          enable_safety_checker: true
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Fal.ai API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      const imageUrl = data.images?.[0]?.url || data.url

      if (!imageUrl) {
        throw new Error('No image URL returned from Fal.ai')
      }

      return {
        url: imageUrl,
        width: request.width || 1024,
        height: request.height || 1024,
        prompt: sanitizedPrompt,
        provider: 'fal' as AIServiceProvider,
        metadata: {
          timestamp: Date.now(),
          model: 'flux-lora',
          ...data.metadata
        }
      }
    } catch (error) {
      console.error('Image generation error:', error)
      throw error
    }
  }

  async imageToImage(request: ImageToImageRequest): Promise<AIGeneratedImage> {
    // Rate limiting check
    if (!this.checkRateLimit('falai')) {
      throw new Error('Rate limit exceeded. Please wait a moment before trying again.')
    }

    const falApiKey = this.getAPIKey('falai')
    
    if (!falApiKey) {
      throw new Error('Please configure your Fal.ai API key in Settings to use image-to-image generation')
    }

    // Sanitize inputs
    const sanitizedPrompt = this.sanitizeInput(request.prompt)
    const sanitizedImageUrl = this.sanitizeUrl(request.imageUrl)

    try {
      const response = await fetch('https://fal.run/fal-ai/creative-upscaler', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${falApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: sanitizedImageUrl,
          prompt: sanitizedPrompt,
          creativity: request.strength || 0.5,
          resemblance: 1 - (request.strength || 0.5),
          scale: 2
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Fal.ai API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      const imageUrl = data.image?.url || data.url

      if (!imageUrl) {
        throw new Error('No image URL returned from Fal.ai')
      }

      return {
        url: imageUrl,
        width: request.width || 1024,
        height: request.height || 1024,
        prompt: sanitizedPrompt,
        provider: 'fal' as AIServiceProvider,
        metadata: {
          timestamp: Date.now(),
          model: 'creative-upscaler',
          originalImage: sanitizedImageUrl
        }
      }
    } catch (error) {
      console.error('Image-to-image error:', error)
      throw error
    }
  }

  async generateVideo(prompt: string, imageUrl?: string, duration: number = 5): Promise<{ url: string }> {
    // Rate limiting check
    if (!this.checkRateLimit('falai')) {
      throw new Error('Rate limit exceeded. Please wait a moment before trying again.')
    }

    const falApiKey = this.getAPIKey('falai')
    
    if (!falApiKey) {
      throw new Error('Please configure your Fal.ai API key in Settings to generate videos')
    }

    // Sanitize inputs
    const sanitizedImageUrl = imageUrl ? this.sanitizeUrl(imageUrl) : undefined

    try {
      const response = await fetch('https://fal.run/fal-ai/stable-video', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${falApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: sanitizedImageUrl,
          motion_bucket_id: 127,
          cond_aug: 0.02,
          fps: 25,
          num_inference_steps: 25
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Fal.ai API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      
      return {
        url: data.video?.url || data.url
      }
    } catch (error) {
      console.error('Video generation error:', error)
      throw error
    }
  }

  async generateText(prompt: string, context?: string): Promise<string> {
    // Rate limiting check
    if (!this.checkRateLimit('text-generation')) {
      throw new Error('Rate limit exceeded. Please wait a moment before trying again.')
    }

    const openaiKey = this.getAPIKey('openai')
    const anthropicKey = this.getAPIKey('anthropic')
    
    // Sanitize inputs
    const sanitizedPrompt = this.sanitizeInput(prompt)
    const sanitizedContext = context ? this.sanitizeInput(context) : undefined
    
    // Try OpenAI first, then Anthropic
    if (openaiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4-turbo-preview',
            messages: [
              { role: 'system', content: sanitizedContext || 'You are a helpful assistant.' },
              { role: 'user', content: sanitizedPrompt }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        })

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`)
        }

        const data = await response.json()
        return data.choices[0].message.content
      } catch (error) {
        console.error('OpenAI error:', error)
        // Fall through to try Anthropic
      }
    }

    if (anthropicKey) {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 500,
            messages: [
              { 
                role: 'user', 
                content: sanitizedContext ? `${sanitizedContext}\n\n${sanitizedPrompt}` : sanitizedPrompt 
              }
            ]
          })
        })

        if (!response.ok) {
          throw new Error(`Anthropic API error: ${response.status}`)
        }

        const data = await response.json()
        return data.content[0].text
      } catch (error) {
        console.error('Anthropic error:', error)
      }
    }

    // Fallback to a simple response if no API keys are configured
    throw new Error('Please configure either an OpenAI or Anthropic API key in Settings to generate text')
  }

  async testConnection(): Promise<boolean> {
    const apiKeys = useAPIKeyStore.getState().apiKeys
    
    // Check if at least one key is configured
    if (Object.keys(apiKeys).length === 0) {
      return false
    }

    // For now, just check if Fal.ai key is present (since it's required)
    return !!apiKeys.falai
  }

  // Helper method to check if service is configured
  isConfigured(): boolean {
    const { isConfigured } = useAPIKeyStore.getState()
    return isConfigured
  }

  // Get configured services
  getConfiguredServices(): string[] {
    const apiKeys = useAPIKeyStore.getState().apiKeys
    return Object.keys(apiKeys).filter(key => !!apiKeys[key as keyof typeof apiKeys])
  }

  // Security: Input sanitization methods
  private sanitizeInput(input: string): string {
    // Remove any potential script tags or malicious content
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()
      .substring(0, 2000) // Limit length to prevent DoS
  }

  private sanitizeUrl(url: string): string {
    // Validate URL format
    try {
      const parsed = new URL(url)
      // Only allow http(s) and data URLs
      if (!['http:', 'https:', 'data:'].includes(parsed.protocol)) {
        throw new Error('Invalid URL protocol')
      }
      return url
    } catch {
      // If it's a data URL, validate it
      if (url.startsWith('data:image/')) {
        return url
      }
      throw new Error('Invalid image URL')
    }
  }
}

export const directAIService = new DirectAIService()