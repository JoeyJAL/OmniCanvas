import React, { useState, useEffect } from 'react'
import { Settings, PanelRightClose, PanelRightOpen, BookOpen, Menu, X } from 'lucide-react'
import { Canvas } from '@components/canvas/Canvas'
import { Toolbar } from '@components/toolbar/Toolbar'
import { AIPanel } from '@components/panels/AIPanel'
import { SettingsPanel } from '@components/panels/SettingsPanel'
import { ServiceGuidePanel } from '@components/panels/ServiceGuidePanel'
import { LanguageSwitcher } from '@components/LanguageSwitcher'
import { useTranslation } from '@hooks/useTranslation'

function App() {
  const t = useTranslation()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isServiceGuideOpen, setIsServiceGuideOpen] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Trigger window resize event when panel visibility changes
  // This ensures Canvas component recalculates its dimensions
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 300) // Wait for CSS transition to complete
    
    return () => clearTimeout(timer)
  }, [isPanelOpen])

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
          <LanguageSwitcher />
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>{t.common.settings}</span>
          </button>
          <button
            onClick={() => setIsServiceGuideOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.serviceGuide.title}</span>
          </button>
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
          <LanguageSwitcher />
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
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg md:hidden">
            <div className="p-4 space-y-3">
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
              <ServiceGuidePanel />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App