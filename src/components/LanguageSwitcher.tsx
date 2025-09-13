import React, { useState } from 'react'
import { useLanguageStore, Language } from '@store/languageStore'
import { getTranslation } from '@translations/index'
import { Globe } from 'lucide-react'

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguageStore()
  const [isOpen, setIsOpen] = useState(false)
  const t = getTranslation(currentLanguage)

  const languages: { code: Language; flag: string; name: string }[] = [
    { code: 'en', flag: '🇺🇸', name: t.language.en },
    { code: 'zh-TW', flag: '🇹🇼', name: t.language.zhTW },
    { code: 'es', flag: '🇪🇸', name: t.language.es },
    { code: 'ja', flag: '🇯🇵', name: t.language.ja },
    { code: 'fr', flag: '🇫🇷', name: t.language.fr },
  ]

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
      >
        <Globe className="w-4 h-4" />
        <span className="text-lg">{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                  currentLanguage === lang.code 
                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500' 
                    : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {currentLanguage === lang.code && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}