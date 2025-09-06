import React, { useState } from 'react'
import { Settings } from 'lucide-react'
import { Canvas } from '@components/canvas/Canvas'
import { Toolbar } from '@components/toolbar/Toolbar'
import { ImagePanel } from '@components/panels/ImagePanel'
import { AIPanel } from '@components/panels/AIPanel'
import { SettingsPanel } from '@components/panels/SettingsPanel'

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">OmniCanvas</h1>
          <span className="text-sm text-gray-500">AI Creative Canvas</span>
        </div>
        
        <div className="flex items-center space-x-2">
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
        
        {/* Right Panels */}
        <div className="w-64 lg:w-72 xl:w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="h-1/2 min-h-0 overflow-y-auto">
              <ImagePanel />
            </div>
            <div className="h-1/2 min-h-0 overflow-y-auto">
              <AIPanel />
            </div>
          </div>
        </div>
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