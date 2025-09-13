import React, { useState, useEffect } from 'react'
import { Settings, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { Canvas } from '@components/canvas/Canvas'
import { Toolbar } from '@components/toolbar/Toolbar'
import { AIPanel } from '@components/panels/AIPanel'
import { SettingsPanel } from '@components/panels/SettingsPanel'
import { LanguageSwitcher } from '@components/LanguageSwitcher'

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  
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
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">OmniCanvas</h1>
          <span className="text-sm text-gray-500">AI Creative Canvas</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* <LanguageSwitcher /> */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
            title={isPanelOpen ? "Hide AI Assistant" : "Show AI Assistant"}
          >
            {isPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            <span>{isPanelOpen ? "Hide Panel" : "Show Panel"}</span>
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <Toolbar />
        
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Canvas />
        </div>
        
        {/* Right Panel - AI Assistant with toggle functionality */}
        {isPanelOpen && (
          <div className="w-80 lg:w-96 xl:w-[420px] bg-white border-l border-gray-200 flex flex-col overflow-hidden flex-shrink-0 transition-all duration-300 ease-in-out">
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
              <AIPanel />
            </div>
          </div>
        )}
      </div>
      
      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
      />
    </div>
  )
}

export default App