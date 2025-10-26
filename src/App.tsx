import React, { useState, useEffect } from 'react'
import { Settings, PanelRightClose, PanelRightOpen, BookOpen, Menu, X, Heart, Share2 } from 'lucide-react'
import { Canvas } from '@components/canvas/Canvas'
import { Toolbar } from '@components/toolbar/Toolbar'
import { AIPanel } from '@components/panels/AIPanel'
import { SettingsPanel } from '@components/panels/SettingsPanel'
import { ServiceGuidePanel } from '@components/panels/ServiceGuidePanel'
import { FavoritesPanel } from '@components/panels/FavoritesPanel'
import { SharePanel } from '@components/panels/SharePanel'
import { LanguageSwitcher } from '@components/LanguageSwitcher'
import { useTranslation } from '@hooks/useTranslation'
import { useLanguageStore } from '@store/languageStore'
import { analyticsService } from '@services/analyticsService'

function App() {
  const t = useTranslation()
  const { initializeLanguage } = useLanguageStore()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isServiceGuideOpen, setIsServiceGuideOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 首次訪問檢測和語言初始化
  useEffect(() => {
    // 初始化語言（首次訪問時自動檢測，返回訪問時使用保存的設定）
    initializeLanguage()

    const isFirstVisit = !localStorage.getItem('omnicanvas_visited')
    if (isFirstVisit) {
      localStorage.setItem('omnicanvas_visited', 'true')

      // 追蹤首次訪問的語言偏好
      analyticsService.trackFeatureUsage('first_visit', {
        detected_language: navigator.language,
        user_agent: navigator.userAgent,
        timestamp: Date.now()
      })

      // 延遲顯示服務指南，讓用戶先看到主界面
      setTimeout(() => {
        setIsServiceGuideOpen(true)
      }, 1500)
    }
  }, [initializeLanguage])
  
  // Initialize analytics and track app usage
  useEffect(() => {
    // Track initial app load
    analyticsService.trackPageView('/')
    analyticsService.trackFeatureUsage('app_loaded', {
      timestamp: Date.now(),
      user_agent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    })

    // Track when user closes the app
    const handleBeforeUnload = () => {
      analyticsService.trackUserEngagement()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // Trigger window resize event when panel visibility changes
  // This ensures Canvas component recalculates its dimensions
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 300) // Wait for CSS transition to complete

    return () => clearTimeout(timer)
  }, [isPanelOpen])

  // Track panel usage
  useEffect(() => {
    analyticsService.trackFeatureUsage('panel_toggle', {
      panel_state: isPanelOpen ? 'open' : 'closed',
      timestamp: Date.now()
    })
  }, [isPanelOpen])

  // 處理打開 AI 面板
  const handleOpenAIPanel = () => {
    setIsPanelOpen(true)
    analyticsService.trackFeatureUsage('ai_panel_opened_from_guide', {
      source: 'service_guide',
      timestamp: Date.now()
    })
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between relative">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">OmniCanvas</h1>
          <span className="text-xs md:text-sm text-gray-500 hidden sm:block">AI Creative Canvas</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={() => {
              setIsShareOpen(true)
              analyticsService.trackFeatureUsage('share_opened', {
                source: 'desktop_header',
                timestamp: Date.now()
              })
            }}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded-lg transition-colors"
            title="Share Canvas"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={() => {
              setIsFavoritesOpen(true)
              analyticsService.trackFeatureUsage('favorites_opened', {
                source: 'desktop_header',
                timestamp: Date.now()
              })
            }}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            title="Open Favorites"
          >
            <Heart className="w-4 h-4" />
            <span>Favorites</span>
          </button>
          <button
            onClick={() => {
              setIsServiceGuideOpen(true)
              analyticsService.trackFeatureUsage('service_guide_opened', {
                source: 'desktop_header',
                timestamp: Date.now()
              })
            }}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.serviceGuide.title}</span>
          </button>
          <button
            onClick={() => {
              setIsSettingsOpen(true)
              analyticsService.trackFeatureUsage('settings_opened', {
                source: 'desktop_header',
                timestamp: Date.now()
              })
            }}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>{t.common.settings}</span>
          </button>
          <LanguageSwitcher />
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
            title={isPanelOpen ? "Hide AI Assistant" : "Show AI Assistant"}
          >
            {isPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            <span>{isPanelOpen ? "Hide Panel" : "Show Panel"}</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
            title={isPanelOpen ? "Hide AI Assistant" : "Show AI Assistant"}
          >
            {isPanelOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <LanguageSwitcher />
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg md:hidden">
            <div className="p-4 space-y-3">
              <button
                onClick={() => {
                  setIsShareOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={() => {
                  setIsFavoritesOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                <Heart className="w-4 h-4" />
                <span>Favorites</span>
              </button>
              <button
                onClick={() => {
                  setIsSettingsOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>{t.common.settings}</span>
              </button>
              <button
                onClick={() => {
                  setIsServiceGuideOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t.serviceGuide.title}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Toolbar - Hidden on mobile when AI panel is open */}
        <div className={`${isPanelOpen ? 'hidden md:block' : 'block'}`}>
          <Toolbar />
        </div>

        {/* Canvas Area */}
        <div className={`flex-1 flex flex-col min-w-0 ${isPanelOpen ? 'hidden md:flex' : 'flex'}`}>
          <Canvas />
        </div>

        {/* Right Panel - AI Assistant with mobile-first design */}
        {isPanelOpen && (
          <div className="w-full md:w-80 lg:w-96 xl:w-[420px] bg-white border-l border-gray-200 flex flex-col overflow-hidden flex-shrink-0 transition-all duration-300 ease-in-out h-full md:h-auto">
            <div className="flex-1 flex flex-col min-h-0 h-full">
              <AIPanel onOpenSettings={() => setIsSettingsOpen(true)} />
            </div>
          </div>
        )}
      </div>
      
      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
      />

      {/* Favorites Panel */}
      <FavoritesPanel
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />

      {/* Share Panel */}
      <SharePanel
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* Service Guide Panel */}
      {isServiceGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">{t.serviceGuide.title}</h2>
              <button
                onClick={() => setIsServiceGuideOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ServiceGuidePanel
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenAIPanel={handleOpenAIPanel}
                onClose={() => setIsServiceGuideOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App