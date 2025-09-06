import React, { useState, useEffect } from 'react'
import { Settings, Server, Check, X, Wifi, Shield, Key } from 'lucide-react'
import { aiService } from '@services/aiService'

interface SettingsPanelProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, setIsOpen }) => {
  const [backendUrl, setBackendUrl] = useState<string>('')
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle')

  // Load saved backend URL
  useEffect(() => {
    const saved = localStorage.getItem('omnicanvas-backend-url')
    if (saved) {
      setBackendUrl(saved)
      aiService.configure(saved)
      testConnection(saved)
    } else {
      // Set default URL
      const defaultUrl = 'http://localhost:3011/api'
      setBackendUrl(defaultUrl)
      testConnection(defaultUrl)
    }
  }, [])

  // Test backend connection
  const testConnection = async (url?: string) => {
    const testUrl = url || backendUrl
    if (!testUrl) return

    setConnectionStatus('testing')
    
    try {
      // Update aiService with new URL
      aiService.configure(testUrl)
      
      // Test connection
      const isConnected = await aiService.testConnection()
      
      if (isConnected) {
        setConnectionStatus('connected')
        // Save working URL
        localStorage.setItem('omnicanvas-backend-url', testUrl)
      } else {
        setConnectionStatus('error')
      }
    } catch (error) {
      console.error('Connection test failed:', error)
      setConnectionStatus('error')
    }
  }

  const handleUrlChange = (value: string) => {
    setBackendUrl(value)
    setConnectionStatus('idle')
  }

  const handleTestConnection = () => {
    if (backendUrl) {
      testConnection()
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      case 'connected':
        return <Check className="w-4 h-4 text-green-600" />
      case 'error':
        return <X className="w-4 h-4 text-red-600" />
      default:
        return <Wifi className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'testing':
        return 'Testing connection...'
      case 'connected':
        return 'Connected to backend'
      case 'error':
        return 'Connection failed'
      default:
        return 'Ready to test'
    }
  }

  return (
    <>
      {/* Settings Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Backend API Settings</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* API Status Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  AI Service Configuration
                </h3>
                <p className="text-xs text-blue-800">
                  API keys are securely managed by your backend service. Configure your backend URL below to connect to your AI services.
                </p>
              </div>

              {/* Backend URL Configuration */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Backend API URL</label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={backendUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="http://localhost:3001/api"
                    className="flex-1 text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleTestConnection}
                    disabled={!backendUrl || connectionStatus === 'testing'}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded transition-colors flex items-center space-x-2"
                  >
                    {getStatusIcon()}
                    <span>Test</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  {getStatusIcon()}
                  <span className={`text-xs ${
                    connectionStatus === 'connected' ? 'text-green-600' :
                    connectionStatus === 'error' ? 'text-red-600' : 
                    connectionStatus === 'testing' ? 'text-blue-600' :
                    'text-gray-500'
                  }`}>
                    {getStatusText()}
                  </span>
                </div>
              </div>

              {/* Backend Service Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Backend Services Required:</h3>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• <strong>Gemini API:</strong> Image generation and AI composition</li>
                  <li>• <strong>Fal.ai API:</strong> Advanced image processing</li>
                  <li>• <strong>ElevenLabs API:</strong> Voice generation</li>
                  <li>• <strong>Health Check:</strong> /health endpoint for status</li>
                </ul>
              </div>

              {/* Security Info */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-sm font-medium text-green-900 mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Security Benefits
                </h3>
                <ul className="text-xs text-green-800 space-y-1">
                  <li>• API keys never leave your backend server</li>
                  <li>• No sensitive data stored in browser</li>
                  <li>• Centralized API key management</li>
                  <li>• Rate limiting and usage control</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}