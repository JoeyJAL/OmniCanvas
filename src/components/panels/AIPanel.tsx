import React, { useState } from 'react'
import { useImageStore } from '@store/imageStore'
import { useCanvasStore } from '@store/canvasStore'
import { aiService } from '@services/aiService'
import { 
  Sparkles, 
  Wand2, 
  Merge, 
  Palette, 
  Volume2,
  Settings,
  Play,
  TestTube
} from 'lucide-react'

export const AIPanel: React.FC = () => {
  const { getSelectedImages } = useImageStore()
  const { importImage } = useCanvasStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [activeTab, setActiveTab] = useState<'generate' | 'merge' | 'style' | 'voice'>('generate')
  const [_lastResult, setLastResult] = useState<string | null>(null)

  const selectedImages = getSelectedImages()
  const canMerge = selectedImages.length >= 2

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return

    setIsProcessing(true)
    try {
      const result = await aiService.generateImage({
        prompt: prompt,
        width: 512,
        height: 512
      })
      
      // Add generated image to canvas
      await importImage(result.url)
      setLastResult(result.url)
      setPrompt('')
      
      console.log('Generated image added to canvas:', result)
    } catch (error) {
      console.error('Image generation failed:', error)
      alert('Image generation failed: ' + error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMergeImages = async () => {
    if (selectedImages.length < 2) {
      alert('Please select at least 2 images to merge')
      return
    }
    
    if (!prompt.trim()) {
      alert('Please enter merge instructions, e.g., "Blend these images into an artistic collage"')
      return
    }

    setIsProcessing(true)
    try {
      const imageUrls = selectedImages.map(img => img.url)
      const result = await aiService.mergeImages(imageUrls, prompt)
      
      // Add merged image to canvas
      await importImage(result)
      setLastResult(result)
      setPrompt('')
      
      console.log('Merged images added to canvas')
      alert(`Successfully merged ${selectedImages.length} images!`)
    } catch (error) {
      console.error('Image merging failed:', error)
      alert('Image merging failed: ' + error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStyleTransfer = async () => {
    if (selectedImages.length === 0) {
      alert('Please select an image to apply style')
      return
    }
    
    if (!prompt.trim()) {
      alert('Please enter style description, e.g., "Van Gogh Starry Night style"')
      return
    }

    setIsProcessing(true)
    try {
      const result = await aiService.transferStyle({
        imageUrl: selectedImages[0].url,
        style: prompt
      })
      
      // Add styled image to canvas
      await importImage(result)
      setLastResult(result)
      setPrompt('')
      
      console.log('Style transfer result added to canvas')
      alert('Style transfer complete!')
    } catch (error) {
      console.error('Style transfer failed:', error)
      alert('Style transfer failed: ' + error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGenerateVoice = async () => {
    if (!prompt.trim()) return

    setIsProcessing(true)
    try {
      const audioUrl = await aiService.generateVoice(prompt)
      console.log('Generated voice:', audioUrl)
      // TODO: Add audio player to canvas or play directly
    } catch (error) {
      console.error('Voice generation failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const tabs = [
    { id: 'generate' as const, label: 'Generate', icon: Sparkles },
    { id: 'merge' as const, label: 'Merge', icon: Merge },
    { id: 'style' as const, label: 'Style', icon: Palette },
    { id: 'voice' as const, label: 'Voice', icon: Volume2 }
  ]

  return (
    <div className="flex-1 border-b border-gray-200 bg-white">
      {/* Header */}
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Wand2 className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm font-semibold text-gray-900">AI Assistant</h3>
        </div>

        {/* Tab Navigation */}
        <div className="flex mt-3 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 rounded-md text-xs font-medium transition-colors
                  ${activeTab === tab.id
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                  }
                `}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-2 flex-1 overflow-y-auto">
        {/* Text Input for all tabs */}
        <div className="mb-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getPlaceholderText()}
            className="w-full h-20 p-2 text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            disabled={isProcessing}
          />
        </div>

        {/* Tab-specific Content */}
        {activeTab === 'generate' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              Generate new images from text descriptions using AI.
            </p>
            <button
              onClick={handleGenerateImage}
              disabled={isProcessing || !prompt.trim()}
              className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white text-sm rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Image</span>
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === 'merge' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600 font-medium">
                🎨 AI Smart Composition
              </p>
              <span className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-2 py-1 rounded-full">
                {selectedImages.length} selected
              </span>
            </div>
            
            {!canMerge && (
              <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
                ⚠️ Select at least 2 images to enable AI composition
              </p>
            )}

            {canMerge && (
              <div className="space-y-2">
                <p className="text-xs text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                  💡 <strong>Smart AI Composition:</strong> Describe your creative vision or choose quick actions below
                </p>
                
                {/* Quick Composition Actions */}
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => setPrompt('Intelligent auto-compose')}
                    className="py-2 px-3 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 rounded-lg transition-all font-medium"
                  >
                    🧠 Auto Smart
                  </button>
                  <button
                    onClick={() => setPrompt('Make the person wear or use the accessories/items naturally')}
                    className="py-2 px-3 bg-gradient-to-r from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300 text-indigo-700 rounded-lg transition-all font-medium"
                  >
                    🥽 Wear Items
                  </button>
                  <button
                    onClick={() => setPrompt('Create a realistic scene by placing subjects into backgrounds naturally')}
                    className="py-2 px-3 bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 text-emerald-700 rounded-lg transition-all font-medium"
                  >
                    🏞️ Scene Mix
                  </button>
                  <button
                    onClick={() => setPrompt('Create an artistic, creative blend that combines the best elements')}
                    className="py-2 px-3 bg-gradient-to-r from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300 text-pink-700 rounded-lg transition-all font-medium"
                  >
                    ✨ Creative
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleMergeImages}
              disabled={isProcessing || !canMerge}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-300 text-white text-sm rounded-lg transition-all flex items-center justify-center space-x-2 font-medium shadow-lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>🎨 AI Composing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>🎨 AI Compose ({selectedImages.length})</span>
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              Apply artistic styles to selected images.
            </p>

            {selectedImages.length === 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                Select an image to apply style transfer.
              </p>
            )}

            {/* Quick Style Buttons */}
            <div className="grid grid-cols-2 gap-1 text-xs">
              {['Van Gogh', 'Picasso', 'Anime', 'Cartoon', 'Oil Painting', 'Watercolor'].map(style => (
                <button
                  key={style}
                  onClick={() => setPrompt(style)}
                  className="py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  {style}
                </button>
              ))}
            </div>

            <button
              onClick={handleStyleTransfer}
              disabled={isProcessing || selectedImages.length === 0 || !prompt.trim()}
              className="w-full py-2 px-3 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 text-white text-sm rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  <span>Styling...</span>
                </>
              ) : (
                <>
                  <Palette className="w-4 h-4" />
                  <span>Apply Style</span>
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              Convert text to natural speech with AI voices.
            </p>

            {/* Voice Selection */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Voice</label>
              <select className="w-full text-xs border border-gray-300 rounded p-1 focus:ring-2 focus:ring-purple-500">
                <option>Default</option>
                <option>Female - Calm</option>
                <option>Male - Professional</option>
                <option>Child - Playful</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleGenerateVoice}
                disabled={isProcessing || !prompt.trim()}
                className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white text-sm rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Generate</span>
                  </>
                )}
              </button>
              
              <button
                disabled
                className="py-2 px-3 bg-gray-300 text-gray-500 text-sm rounded-lg flex items-center justify-center"
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-2 py-1 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {isProcessing ? 'Processing with AI...' : 'AI services ready'}
        </p>
      </div>
    </div>
  )

  function getPlaceholderText(): string {
    switch (activeTab) {
      case 'generate':
        return 'Describe the image you want to create...\nExample: "A sunset over mountains with birds flying"'
      case 'merge':
        return 'Describe how to merge the selected images...\nExample: "Blend these photos into a collage with vintage style"'
      case 'style':
        return 'Describe the artistic style to apply...\nExample: "Van Gogh starry night style" or choose from buttons below'
      case 'voice':
        return 'Enter text to convert to speech...\nExample: "Hello, this is a test of AI voice generation"'
      default:
        return 'Enter your prompt...'
    }
  }
}