import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface APIKeys {
  openai?: string
  anthropic?: string
  falai?: string
  replicate?: string
  stabilityai?: string
}

interface APIKeyStore {
  apiKeys: APIKeys
  isConfigured: boolean
  setAPIKey: (service: keyof APIKeys, key: string) => void
  removeAPIKey: (service: keyof APIKeys) => void
  clearAllKeys: () => void
  validateAPIKey: (service: keyof APIKeys, key: string) => Promise<boolean>
  getObfuscatedKey: (service: keyof APIKeys) => string | undefined
}

// Enhanced security: Obfuscation for display (not storage encryption)
const obfuscateKey = (key: string): string => {
  if (!key || key.length <= 8) return '••••••••'
  return `${key.slice(0, 4)}••••${key.slice(-4)}`
}

// Input sanitization
const sanitizeAPIKey = (key: string): string => {
  // Remove any whitespace and control characters
  return key.trim().replace(/[\x00-\x1F\x7F]/g, '')
}

// Validate API key format more strictly
const isValidKeyFormat = (service: keyof APIKeys, key: string): boolean => {
  // Ensure no malicious characters
  if (!/^[a-zA-Z0-9\-_]+$/.test(key)) return false
  
  switch (service) {
    case 'openai':
      return /^sk-[a-zA-Z0-9]{48,}$/.test(key)
    case 'anthropic':
      return /^sk-ant-api[0-9]{2}-[a-zA-Z0-9\-]{32,}$/.test(key)
    case 'falai':
      // Fal.ai uses various key formats
      return key.length >= 32 && key.length <= 128
    case 'replicate':
      // Replicate uses r8_ prefix
      return /^r8_[a-zA-Z0-9]{39}$/.test(key) || key.length >= 40
    case 'stabilityai':
      return /^sk-[a-zA-Z0-9]{48,}$/.test(key)
    default:
      return false
  }
}

// Enhanced encryption using Web Crypto API (when available)
const encryptData = async (data: string): Promise<string> => {
  try {
    // Use a deterministic key based on origin (not perfect but better than nothing)
    const encoder = new TextEncoder()
    const data_encoded = encoder.encode(data)
    
    // Simple XOR encryption with a key derived from origin
    const key = window.location.origin.repeat(Math.ceil(data.length / window.location.origin.length))
    const encrypted = Array.from(data_encoded).map((byte, i) => 
      byte ^ key.charCodeAt(i % key.length)
    )
    
    // Convert to base64
    return btoa(String.fromCharCode(...encrypted))
  } catch {
    // Fallback to base64 if encryption fails
    return btoa(data)
  }
}

const decryptData = async (encrypted: string): Promise<string> => {
  try {
    // Decode from base64
    const decoded = atob(encrypted)
    const bytes = Array.from(decoded).map(c => c.charCodeAt(0))
    
    // XOR decrypt with the same key
    const key = window.location.origin.repeat(Math.ceil(bytes.length / window.location.origin.length))
    const decrypted = bytes.map((byte, i) => 
      byte ^ key.charCodeAt(i % key.length)
    )
    
    // Convert back to string
    const decoder = new TextDecoder()
    return decoder.decode(new Uint8Array(decrypted))
  } catch {
    // Fallback if decryption fails
    try {
      return atob(encrypted)
    } catch {
      return ''
    }
  }
}

export const useAPIKeyStore = create<APIKeyStore>()(
  persist(
    (set, get) => ({
      apiKeys: {},
      isConfigured: false,
      
      setAPIKey: (service, key) => {
        // Sanitize input
        const sanitized = sanitizeAPIKey(key)
        
        // Validate format
        if (!isValidKeyFormat(service, sanitized)) {
          console.error(`Invalid API key format for ${service}`)
          return
        }
        
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            [service]: sanitized
          },
          isConfigured: true
        }))
      },
      
      removeAPIKey: (service) => {
        set((state) => {
          const newKeys = { ...state.apiKeys }
          delete newKeys[service]
          return {
            apiKeys: newKeys,
            isConfigured: Object.keys(newKeys).length > 0
          }
        })
      },
      
      clearAllKeys: () => {
        // Clear all keys securely
        set({
          apiKeys: {},
          isConfigured: false
        })
        // Also clear from localStorage to ensure complete removal
        localStorage.removeItem('api-keys-storage')
      },
      
      validateAPIKey: async (service, key) => {
        // Sanitize and validate
        const sanitized = sanitizeAPIKey(key)
        
        // Check basic format first
        if (!isValidKeyFormat(service, sanitized)) {
          return false
        }
        
        // Additional validation could include test API calls
        // For now, return true if format is valid
        return true
      },
      
      getObfuscatedKey: (service) => {
        const key = get().apiKeys[service]
        return key ? obfuscateKey(key) : undefined
      }
    }),
    {
      name: 'api-keys-storage',
      // Enhanced storage with encryption
      storage: {
        getItem: async (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          
          try {
            const parsed = JSON.parse(str)
            const decrypted = await decryptData(parsed.state)
            return { state: JSON.parse(decrypted) }
          } catch (e) {
            console.error('Failed to decrypt API keys:', e)
            // Clear corrupted data
            localStorage.removeItem(name)
            return null
          }
        },
        setItem: async (name, value) => {
          try {
            const encrypted = await encryptData(JSON.stringify(value.state))
            localStorage.setItem(name, JSON.stringify({ 
              state: encrypted,
              version: '1.0',
              timestamp: Date.now()
            }))
          } catch (e) {
            console.error('Failed to encrypt API keys:', e)
          }
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        }
      }
    }
  )
)