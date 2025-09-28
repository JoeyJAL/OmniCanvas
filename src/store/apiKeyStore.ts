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

// Simple obfuscation for display (not security, just UI)
const obfuscateKey = (key: string): string => {
  if (key.length <= 8) return '••••••••'
  return `${key.slice(0, 4)}••••${key.slice(-4)}`
}

export const useAPIKeyStore = create<APIKeyStore>()(
  persist(
    (set, get) => ({
      apiKeys: {},
      isConfigured: false,
      
      setAPIKey: (service, key) => {
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            [service]: key
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
        set({
          apiKeys: {},
          isConfigured: false
        })
      },
      
      validateAPIKey: async (service, key) => {
        // Basic validation - just check format for now
        // In production, you'd want to make a test API call
        switch (service) {
          case 'openai':
            return key.startsWith('sk-') && key.length > 20
          case 'anthropic':
            return key.startsWith('sk-ant-') && key.length > 20
          case 'falai':
            return key.length > 20
          case 'replicate':
            return key.length > 20
          case 'stabilityai':
            return key.startsWith('sk-') && key.length > 20
          default:
            return false
        }
      },
      
      getObfuscatedKey: (service) => {
        const key = get().apiKeys[service]
        return key ? obfuscateKey(key) : undefined
      }
    }),
    {
      name: 'api-keys-storage',
      // Encrypt the storage (basic protection)
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          try {
            // Simple Base64 encoding (not real encryption, but better than plain text)
            const decoded = atob(JSON.parse(str).state)
            return { state: JSON.parse(decoded) }
          } catch {
            return null
          }
        },
        setItem: (name, value) => {
          // Simple Base64 encoding for basic obfuscation
          const encoded = btoa(JSON.stringify(value.state))
          localStorage.setItem(name, JSON.stringify({ state: encoded }))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        }
      }
    }
  )
)