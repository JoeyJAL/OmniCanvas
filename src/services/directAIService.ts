import type { 
  TextToImageRequest, 
  ImageToImageRequest,
  AIGeneratedImage, 
  AIServiceProvider 
} from '@/types/ai'
import { useAPIKeyStore } from '@store/apiKeyStore'

class DirectAIService {
  private getAPIKey(service: keyof ReturnType<typeof useAPIKeyStore.getState>['apiKeys']): string | undefined {
    return useAPIKeyStore.getState().apiKeys[service]
  }

  async generateImage(request: TextToImageRequest): Promise<AIGeneratedImage> {
    const falApiKey = this.getAPIKey('falai')
    
    if (!falApiKey) {
      throw new Error('Please configure your Fal.ai API key in Settings to generate images')
    }

    try {
      const response = await fetch('https://fal.run/fal-ai/flux-lora', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${falApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
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
        prompt: request.prompt,
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
    const falApiKey = this.getAPIKey('falai')
    
    if (!falApiKey) {
      throw new Error('Please configure your Fal.ai API key in Settings to use image-to-image generation')
    }

    try {
      const response = await fetch('https://fal.run/fal-ai/creative-upscaler', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${falApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: request.imageUrl,
          prompt: request.prompt,
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
        prompt: request.prompt,
        provider: 'fal' as AIServiceProvider,
        metadata: {
          timestamp: Date.now(),
          model: 'creative-upscaler',
          originalImage: request.imageUrl
        }
      }
    } catch (error) {
      console.error('Image-to-image error:', error)
      throw error
    }
  }

  async generateVideo(prompt: string, imageUrl?: string, duration: number = 5): Promise<{ url: string }> {
    const falApiKey = this.getAPIKey('falai')
    
    if (!falApiKey) {
      throw new Error('Please configure your Fal.ai API key in Settings to generate videos')
    }

    try {
      const response = await fetch('https://fal.run/fal-ai/stable-video', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${falApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: imageUrl,
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
    const openaiKey = this.getAPIKey('openai')
    const anthropicKey = this.getAPIKey('anthropic')
    
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
              { role: 'system', content: context || 'You are a helpful assistant.' },
              { role: 'user', content: prompt }
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
                content: context ? `${context}\n\n${prompt}` : prompt 
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
}

export const directAIService = new DirectAIService()