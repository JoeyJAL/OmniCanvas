import React, { useState } from 'react'
import { aiService } from '@services/aiService'
import { Play, CheckCircle, AlertCircle, Loader } from 'lucide-react'

export const APITestPanel: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error'
    message: string
    details?: any
  }>({ status: 'idle', message: '' })

  const testPrompts = [
    'a cute cartoon cat',
    'a beautiful sunset over mountains',
    'futuristic tech-style city',
    'abstract colorful geometric shapes'
  ]

  const [currentPrompt, setCurrentPrompt] = useState(testPrompts[0])

  const runGeminiTest = async () => {
    setTestResults({ status: 'testing', message: 'Testing Gemini API connection...' })

    try {
      const result = await aiService.generateImage({
        prompt: currentPrompt,
        width: 512,
        height: 512
      })

      if (result.metadata.model === 'error') {
        setTestResults({
          status: 'error',
          message: '❌ Gemini API Test Failed',
          details: result.metadata.error
        })
      } else {
        setTestResults({
          status: 'success',
          message: '✅ Gemini API Test Success!',
          details: {
            model: result.metadata.model,
            prompt: result.prompt,
            enhancedDescription: result.metadata.enhancedDescription?.substring(0, 200) + '...'
          }
        })
      }
    } catch (error) {
      setTestResults({
        status: 'error',
        message: '❌ Error occurred during testing',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  return (
    <div className="p-2 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">🧪 Gemini 2.5 Flash Image Test</h3>
      
      {/* Test Prompt Selection */}
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Select test prompt:
        </label>
        <select 
          value={currentPrompt}
          onChange={(e) => setCurrentPrompt(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {testPrompts.map((prompt, index) => (
            <option key={index} value={prompt}>{prompt}</option>
          ))}
        </select>
      </div>

      {/* Custom Prompt Input */}
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Or enter custom prompt:
        </label>
        <input
          type="text"
          value={currentPrompt}
          onChange={(e) => setCurrentPrompt(e.target.value)}
          placeholder="Enter your test prompt..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Test Button */}
      <button
        onClick={runGeminiTest}
        disabled={testResults.status === 'testing' || !currentPrompt.trim()}
        className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
      >
        {testResults.status === 'testing' ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Testing...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Test Gemini API</span>
          </>
        )}
      </button>

      {/* Test Results */}
      {testResults.status !== 'idle' && (
        <div className="mt-4">
          <div className={`
            p-4 rounded-lg border-l-4 
            ${testResults.status === 'success' 
              ? 'bg-green-50 border-green-400' 
              : testResults.status === 'error'
              ? 'bg-red-50 border-red-400'
              : 'bg-blue-50 border-blue-400'
            }
          `}>
            <div className="flex items-center mb-2">
              {testResults.status === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              ) : testResults.status === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              ) : (
                <Loader className="w-5 h-5 text-blue-600 mr-2 animate-spin" />
              )}
              <h4 className={`
                font-medium 
                ${testResults.status === 'success' 
                  ? 'text-green-800' 
                  : testResults.status === 'error'
                  ? 'text-red-800'
                  : 'text-blue-800'
                }
              `}>
                {testResults.message}
              </h4>
            </div>
            
            {testResults.details && (
              <div className="mt-2 text-sm">
                {testResults.status === 'success' ? (
                  <div className="text-green-700">
                    <p><strong>Model:</strong> {testResults.details.model}</p>
                    <p><strong>Prompt:</strong> {testResults.details.prompt}</p>
                    {testResults.details.enhancedDescription && (
                      <p><strong>AI Enhanced Description:</strong> {testResults.details.enhancedDescription}</p>
                    )}
                  </div>
                ) : (
                  <div className="text-red-700">
                    <p><strong>Error Details:</strong> {testResults.details}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
        <h4 className="font-medium text-blue-900 mb-1 text-xs">📝 Test Instructions:</h4>
        <ul className="text-xs text-blue-800 space-y-0.5">
          <li>• Test if Gemini API Key is valid</li>
          <li>• Success enables real image generation</li>
          <li>• Uses latest nano-banana model</li>
          <li>• Check permissions if test fails</li>
        </ul>
      </div>

      {/* Next Steps */}
      {testResults.status === 'success' && (
        <div className="mt-2 p-2 bg-green-50 rounded text-xs">
          <h4 className="font-medium text-green-900 mb-1 text-xs">🎉 Test Success! Next Steps:</h4>
          <ul className="text-xs text-green-800 space-y-0.5">
            <li>• Real AI image generation now active</li>
            <li>• Use "Generate" tab to create images</li>
            <li>• Right-click AI features enabled</li>
            <li>• Image merge and style transfer ready</li>
            <li>• Cost: ~$0.039 per image (1290 tokens)</li>
          </ul>
        </div>
      )}
    </div>
  )
}