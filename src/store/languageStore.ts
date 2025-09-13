import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'en' | 'zh-TW' | 'es' | 'ja' | 'fr'

interface LanguageStore {
  currentLanguage: Language
  setLanguage: (lang: Language) => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      currentLanguage: 'en',
      setLanguage: (lang) => set({ currentLanguage: lang }),
    }),
    {
      name: 'language-storage',
    }
  )
)