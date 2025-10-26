import { create } from 'zustand'

export interface Favorite {
  id: string
  name: string
  canvasData: string // JSON 字符串
  thumbnail: string // Base64 图片数据
  createdAt: number // 时间戳
  updatedAt: number
}

interface FavoritesStore {
  favorites: Favorite[]

  // 加载收藏
  loadFavorites: () => void

  // 添加收藏
  addFavorite: (canvasData: string, thumbnail: string, name?: string) => string

  // 更新收藏
  updateFavorite: (id: string, canvasData: string, thumbnail: string, name?: string) => void

  // 删除收藏
  removeFavorite: (id: string) => void

  // 获取单个收藏
  getFavorite: (id: string) => Favorite | undefined

  // 获取所有收藏
  getFavorites: () => Favorite[]

  // 清空所有收藏
  clearAllFavorites: () => void
}

const STORAGE_KEY = 'omnicanvas-favorites'

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],

  loadFavorites: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const favorites = JSON.parse(stored) as Favorite[]
        set({ favorites })
        console.log('✅ Favorites loaded:', favorites.length)
      }
    } catch (error) {
      console.error('❌ Failed to load favorites:', error)
    }
  },

  addFavorite: (canvasData, thumbnail, name) => {
    const id = `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = Date.now()
    const newFavorite: Favorite = {
      id,
      name: name || `Saved Canvas ${new Date().toLocaleDateString()}`,
      canvasData,
      thumbnail,
      createdAt: now,
      updatedAt: now
    }

    set((state) => {
      const updated = [...state.favorites, newFavorite]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('❌ Failed to save favorite:', error)
      }
      return { favorites: updated }
    })

    console.log('✅ Favorite added:', id)
    return id
  },

  updateFavorite: (id, canvasData, thumbnail, name) => {
    set((state) => {
      const updated = state.favorites.map((fav) =>
        fav.id === id
          ? {
              ...fav,
              canvasData,
              thumbnail,
              name: name || fav.name,
              updatedAt: Date.now()
            }
          : fav
      )
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('❌ Failed to update favorite:', error)
      }
      return { favorites: updated }
    })

    console.log('✅ Favorite updated:', id)
  },

  removeFavorite: (id) => {
    set((state) => {
      const updated = state.favorites.filter((fav) => fav.id !== id)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('❌ Failed to remove favorite:', error)
      }
      return { favorites: updated }
    })

    console.log('✅ Favorite removed:', id)
  },

  getFavorite: (id) => {
    return get().favorites.find((fav) => fav.id === id)
  },

  getFavorites: () => {
    return get().favorites
  },

  clearAllFavorites: () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      set({ favorites: [] })
      console.log('✅ All favorites cleared')
    } catch (error) {
      console.error('❌ Failed to clear favorites:', error)
    }
  }
}))
