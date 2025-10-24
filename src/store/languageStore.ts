import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'en' | 'zh-TW' | 'es' | 'ja' | 'fr'

interface LanguageStore {
  currentLanguage: Language
  setLanguage: (lang: Language) => void
  isInitialized: boolean
  initializeLanguage: () => void
}

// 自動檢測使用者的偏好語言
const detectUserLanguage = (): Language => {
  try {
    // 檢查瀏覽器語言設定
    const browserLang = navigator.language || navigator.languages?.[0] || 'en'

    // 語言對應表
    const languageMap: Record<string, Language> = {
      'zh': 'zh-TW',
      'zh-TW': 'zh-TW',
      'zh-CN': 'zh-TW',
      'zh-HK': 'zh-TW',
      'es': 'es',
      'es-ES': 'es',
      'es-MX': 'es',
      'ja': 'ja',
      'ja-JP': 'ja',
      'fr': 'fr',
      'fr-FR': 'fr',
      'en': 'en',
      'en-US': 'en',
      'en-GB': 'en'
    }

    // 完全匹配
    if (languageMap[browserLang]) {
      console.log('🌍 Language detected:', browserLang, '→', languageMap[browserLang])
      return languageMap[browserLang]
    }

    // 部分匹配（前兩個字符）
    const langPrefix = browserLang.substring(0, 2)
    if (languageMap[langPrefix]) {
      console.log('🌍 Language detected (prefix):', langPrefix, '→', languageMap[langPrefix])
      return languageMap[langPrefix]
    }

    // 預設英文
    console.log('🌍 Language defaulted to English for:', browserLang)
    return 'en'
  } catch (error) {
    console.log('🌍 Language detection failed, defaulting to English:', error)
    return 'en'
  }
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: 'en', // 初始值，會被 initializeLanguage 覆蓋
      isInitialized: false,
      setLanguage: (lang) => set({ currentLanguage: lang }),
      initializeLanguage: () => {
        const state = get()
        if (!state.isInitialized) {
          const detectedLang = detectUserLanguage()
          set({
            currentLanguage: detectedLang,
            isInitialized: true
          })
        }
      },
    }),
    {
      name: 'language-storage',
      // 只持久化語言設定，不持久化初始化狀態
      partialize: (state) => ({ currentLanguage: state.currentLanguage }),
    }
  )
)