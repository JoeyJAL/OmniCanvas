import { create } from 'zustand'

export interface SharedCanvas {
  id: string
  canvasData: string // JSON 字符串
  thumbnail: string // Base64 图片数据
  creatorName: string // 创作者名称
  createdAt: number // 时间戳
  viewCount: number // 浏览次数
  expiresAt?: number // 过期时间（可选）
}

interface ShareStore {
  // 本地缓存的分享
  sharedCanvases: Map<string, SharedCanvas>

  // 创建分享链接
  createShare: (canvasData: string, thumbnail: string, creatorName?: string) => Promise<string>

  // 获取分享
  getShare: (shareId: string) => Promise<SharedCanvas | null>

  // 删除分享
  deleteShare: (shareId: string) => Promise<void>

  // 获取生成的分享URL
  getShareUrl: (shareId: string) => string
}

const API_BASE = import.meta.env.VITE_BACKEND_API_URL || '/api'

export const useShareStore = create<ShareStore>((set, get) => ({
  sharedCanvases: new Map(),

  createShare: async (canvasData, thumbnail, creatorName = 'Anonymous') => {
    try {
      const response = await fetch(`${API_BASE}/shares`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          canvasData,
          thumbnail,
          creatorName,
          createdAt: Date.now()
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to create share: ${response.statusText}`)
      }

      const data = await response.json()
      const shareId = data.id || data.shareId

      console.log('✅ Share created:', shareId)
      return shareId
    } catch (error) {
      console.error('❌ Failed to create share:', error)
      // 如果后端不可用，使用本地存储作为备份
      return get().createLocalShare(canvasData, thumbnail, creatorName)
    }
  },

  getShare: async (shareId: string) => {
    try {
      // 首先检查本地缓存
      const cached = get().sharedCanvases.get(shareId)
      if (cached) {
        return cached
      }

      const response = await fetch(`${API_BASE}/shares/${shareId}`)

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`Failed to fetch share: ${response.statusText}`)
      }

      const data = await response.json()

      // 缓存到本地
      get().sharedCanvases.set(shareId, data)

      console.log('✅ Share fetched:', shareId)
      return data
    } catch (error) {
      console.error('❌ Failed to fetch share:', error)
      return null
    }
  },

  deleteShare: async (shareId: string) => {
    try {
      const response = await fetch(`${API_BASE}/shares/${shareId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`Failed to delete share: ${response.statusText}`)
      }

      get().sharedCanvases.delete(shareId)
      console.log('✅ Share deleted:', shareId)
    } catch (error) {
      console.error('❌ Failed to delete share:', error)
    }
  },

  getShareUrl: (shareId: string) => {
    const baseUrl = window.location.origin
    return `${baseUrl}/share/${shareId}`
  },

  // 本地分享备份方法
  createLocalShare: (canvasData: string, thumbnail: string, creatorName: string) => {
    const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const share: SharedCanvas = {
      id: shareId,
      canvasData,
      thumbnail,
      creatorName,
      createdAt: Date.now(),
      viewCount: 0
    }
    get().sharedCanvases.set(shareId, share)
    return shareId
  }
}))
