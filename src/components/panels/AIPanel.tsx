import React, { useState } from 'react'
import { useImageStore } from '@store/imageStore'
import { useCanvasStore } from '@store/canvasStore'
import { useStoryShopStore } from '@store/storyShopStore'
import { aiService } from '@services/aiService'
import { 
  Sparkles, 
  Wand2, 
  Merge, 
  Palette, 
  Volume2,
  Settings,
  Play,
  TestTube,
  BookOpen,
  Upload,
  Camera,
  FileImage,
  Video
} from 'lucide-react'

export const AIPanel: React.FC = () => {
  const { getSelectedImages } = useImageStore()
  const { importImage } = useCanvasStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [activeTab, setActiveTab] = useState<'generate' | 'merge' | 'style' | 'voice' | 'storyshop'>('generate')
  const [_lastResult, setLastResult] = useState<string | null>(null)
  
  // StoryShop state
  const [characterImage, setCharacterImage] = useState<string | null>(null)
  const [productImage, setProductImage] = useState<string | null>(null)
  const [storyPrompt, setStoryPrompt] = useState('')
  const [comicPanels, setComicPanels] = useState<string[]>([])
  const [selectedStyle, setSelectedStyle] = useState('comic')

  const selectedImages = getSelectedImages()
  const canMerge = selectedImages.length >= 2
  
  // Temporary API usage tracking
  const [apiUsage, setApiUsage] = useState({ imagesGenerated: 0 })
  const canGenerateMore = () => apiUsage.imagesGenerated < 200

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

  // StoryShop handlers
  const handleImageUpload = (type: 'character' | 'product', file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      if (type === 'character') {
        setCharacterImage(imageUrl)
      } else {
        setProductImage(imageUrl)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleGenerateComic = async () => {
    if (!storyPrompt.trim()) {
      alert('Please enter a story prompt')
      return
    }

    setIsProcessing(true)
    try {
      // Generate 4-panel comic with consistent character
      const panels = []
      const basePrompt = `${selectedStyle} style comic panel, consistent character`
      
      for (let i = 0; i < 4; i++) {
        const panelPrompt = `${basePrompt}, panel ${i + 1}/4: ${storyPrompt}`
        const result = await aiService.generateImage({
          prompt: panelPrompt,
          width: 512,
          height: 512
        })
        panels.push(result.url)
      }
      
      setComicPanels(panels)
      setApiUsage(prev => ({ ...prev, imagesGenerated: prev.imagesGenerated + panels.length }))
      
      // Add panels to canvas in a 2x2 grid
      for (let i = 0; i < panels.length; i++) {
        await importImage(panels[i])
      }
      
      alert('4-panel comic generated successfully!')
    } catch (error) {
      console.error('Comic generation failed:', error)
      alert('Comic generation failed: ' + error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGenerateVideo = async () => {
    if (comicPanels.length === 0) {
      alert('Generate a comic first!')
      return
    }

    setIsProcessing(true)
    try {
      // TODO: Integrate with Fal.ai for video generation
      const videoUrl = await aiService.generateVoice(storyPrompt) // Placeholder
      console.log('Video generated:', videoUrl)
      alert('Video generation feature coming soon!')
    } catch (error) {
      console.error('Video generation failed:', error)
      alert('Video generation failed: ' + error)
    } finally {
      setIsProcessing(false)
    }
  }

  const tabs = [
    { id: 'generate' as const, label: 'Generate', icon: Sparkles },
    { id: 'storyshop' as const, label: 'Story', icon: BookOpen },
    { id: 'merge' as const, label: 'Merge', icon: Merge },
    { id: 'style' as const, label: 'Style', icon: Palette },
    { id: 'voice' as const, label: 'Voice', icon: Volume2 }
  ]

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-white to-purple-50">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white/90 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI Assistant</h3>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
              {canGenerateMore() ? `${200 - apiUsage.imagesGenerated} credits` : 'Limit reached'}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mt-3 bg-gradient-to-r from-purple-100/50 to-pink-100/50 rounded-xl p-1 shadow-inner">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-white text-purple-700 shadow-md scale-105 border border-purple-200'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-white/50'
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
      <div className="p-4 flex-1 overflow-y-auto">
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
              Generate images with Gemini 2.5 Flash (Nano Banana)
            </p>
            
            {/* Popular Templates */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-purple-700 flex items-center">
                🔥 Popular Templates (Click to use)
              </p>
              
              {/* Figurine Template - Most Viral */}
              <div className="p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-orange-200">
                <button
                  onClick={() => setPrompt('A cute miniature figurine of [your subject] as a tiny desktop collectible toy. The figurine is placed on a wooden desk with soft studio lighting. Detailed textures, photorealistic rendering, tilt-shift photography effect, shallow depth of field.')}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-700">🏆 Viral Figurine Style</span>
                    <span className="text-xs px-2 py-0.5 bg-orange-200 text-orange-800 rounded-full">TRENDING</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Turn anyone into a cute desktop figurine</p>
                </button>
              </div>
              
              {/* Template Grid */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPrompt('A photorealistic close-up portrait of an elderly Japanese ceramicist with deep, sun-etched wrinkles and a warm, knowing smile. He is carefully inspecting a freshly glazed tea bowl. The setting is his rustic, sun-drenched workshop. Soft golden hour light, 85mm portrait lens, bokeh background.')}
                  className="p-2 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-left"
                >
                  <span className="text-xs font-medium text-purple-700">📸 Portrait Pro</span>
                  <p className="text-xs text-gray-600 mt-0.5">Photorealistic portrait</p>
                </button>
                
                <button
                  onClick={() => setPrompt('A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat, munching on a green bamboo leaf. Bold clean outlines, simple cel-shading, vibrant colors. White background.')}
                  className="p-2 bg-pink-50 hover:bg-pink-100 rounded-lg border border-pink-200 transition-colors text-left"
                >
                  <span className="text-xs font-medium text-pink-700">🎨 Kawaii Sticker</span>
                  <p className="text-xs text-gray-600 mt-0.5">Cute sticker design</p>
                </button>
                
                <button
                  onClick={() => setPrompt('A high-resolution studio product photograph of a minimalist ceramic coffee mug in matte black on polished concrete. Three-point softbox lighting, 45-degree angle, ultra-realistic with steam rising from coffee.')}
                  className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-left"
                >
                  <span className="text-xs font-medium text-blue-700">📦 Product Shot</span>
                  <p className="text-xs text-gray-600 mt-0.5">E-commerce ready</p>
                </button>
                
                <button
                  onClick={() => setPrompt('Studio Ghibli style, pastel colors, dreamy anime portrait with soft lighting and whimsical atmosphere')}
                  className="p-2 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors text-left"
                >
                  <span className="text-xs font-medium text-green-700">🌸 Ghibli Style</span>
                  <p className="text-xs text-gray-600 mt-0.5">Anime aesthetic</p>
                </button>
                
                <button
                  onClick={() => setPrompt('LinkedIn headshot, professional attire, confident smile, blurred modern office background, soft natural lighting')}
                  className="p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors text-left"
                >
                  <span className="text-xs font-medium text-indigo-700">💼 LinkedIn Pro</span>
                  <p className="text-xs text-gray-600 mt-0.5">Professional headshot</p>
                </button>
                
                <button
                  onClick={() => setPrompt('A minimalist composition with a single delicate red maple leaf in bottom-right corner. Vast empty off-white canvas, significant negative space for text. Soft diffused lighting from top left.')}
                  className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors text-left"
                >
                  <span className="text-xs font-medium text-gray-700">⬜ Minimalist</span>
                  <p className="text-xs text-gray-600 mt-0.5">Clean & simple</p>
                </button>
              </div>
              
              {/* Quick Style Modifiers */}
              <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                <p className="text-xs font-medium text-purple-700 mb-1">✨ Quick Enhancements (Add to prompt)</p>
                <div className="flex flex-wrap gap-1">
                  {['viral meme style', '4K ultra HD', 'cinematic lighting', 'trending on artstation', 'octane render'].map(modifier => (
                    <button
                      key={modifier}
                      onClick={() => setPrompt(prev => prev + (prev ? ', ' : '') + modifier)}
                      className="text-xs px-2 py-1 bg-white hover:bg-purple-100 rounded border border-purple-300 transition-colors"
                    >
                      {modifier}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleGenerateImage}
              disabled={isProcessing || !prompt.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white text-sm rounded-xl transition-all flex items-center justify-center space-x-2 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating with Nano Banana...</span>
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

        {activeTab === 'storyshop' && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl border border-purple-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h4 className="text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Story Canvas</h4>
              </div>
              <p className="text-xs text-gray-700 font-medium">Transform photos into 4-panel comics & 15s videos</p>
              <div className="flex justify-center space-x-2 mt-2">
                <span className="text-xs px-2 py-1 bg-white/80 rounded-full border border-purple-300">🎨 Comics</span>
                <span className="text-xs px-2 py-1 bg-white/80 rounded-full border border-pink-300">🎬 Videos</span>
                <span className="text-xs px-2 py-1 bg-white/80 rounded-full border border-blue-300">✨ AI Magic</span>
              </div>
            </div>

            {/* Character Upload */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
                <Camera className="w-3 h-3" />
                <span>Main Character</span>
              </label>
              <div className="border-2 border-dashed border-purple-300 rounded-xl p-4 bg-white/50 hover:bg-purple-50 transition-colors">
                {characterImage ? (
                  <div className="relative">
                    <img src={characterImage} alt="Character" className="w-full h-16 object-cover rounded" />
                    <button
                      onClick={() => setCharacterImage(null)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload('character', e.target.files[0])}
                    />
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">Upload character photo</p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Product Upload (Optional) */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
                <FileImage className="w-3 h-3" />
                <span>Product (Optional)</span>
              </label>
              <div className="border-2 border-dashed border-pink-200 rounded-xl p-4 bg-white/50 hover:bg-pink-50 transition-colors">
                {productImage ? (
                  <div className="relative">
                    <img src={productImage} alt="Product" className="w-full h-16 object-cover rounded" />
                    <button
                      onClick={() => setProductImage(null)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload('product', e.target.files[0])}
                    />
                    <div className="text-center">
                      <Upload className="w-6 h-6 mx-auto text-gray-300 mb-1" />
                      <p className="text-xs text-gray-400">Add product to story</p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Story Input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Story (One Sentence)</label>
              <textarea
                value={storyPrompt}
                onChange={(e) => setStoryPrompt(e.target.value)}
                placeholder="A coffee shop encounter on a snowy Christmas night..."
                className="w-full h-16 p-2 text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={isProcessing}
              />
            </div>

            {/* Style Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Visual Style</label>
              <div className="grid grid-cols-3 gap-1 text-xs">
                {['comic', 'manga', 'disney', 'realistic', 'anime', 'vintage'].map(style => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`py-1.5 px-2 rounded transition-colors ${
                      selectedStyle === style
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Comic Button */}
            <button
              onClick={handleGenerateComic}
              disabled={isProcessing || !storyPrompt.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white text-sm rounded-xl transition-all flex items-center justify-center space-x-2 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Magic...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>🎨 Generate 4-Panel Comic</span>
                </>
              )}
            </button>

            {/* Show generated panels count */}
            {comicPanels.length > 0 && (
              <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-300 shadow-sm">
                <p className="text-xs text-green-700 font-medium">
                  ✅ Generated {comicPanels.length}/4 panels
                </p>
                <div className="mt-1 text-xs text-green-600">
                  📖 Story broken into: Setup → Development → Climax → Resolution
                </div>
                
                {/* Text-based editing */}
                <div className="mt-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-inner">
                  <p className="text-xs font-bold text-blue-700 mb-2 flex items-center">
                    <span className="mr-1">✨</span> Quick Edit with Words
                  </p>
                  <input 
                    type="text" 
                    placeholder="Change time to snowy Christmas night, add falling snow..."
                    className="w-full text-xs p-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70"
                  />
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button className="text-xs py-2 px-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all font-medium shadow hover:shadow-md transform hover:scale-105">
                      Edit All Panels
                    </button>
                    <button className="text-xs py-2 px-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all font-medium shadow hover:shadow-md transform hover:scale-105">
                      Edit Panel 1
                    </button>
                  </div>
                </div>
                
                {/* Generate Video Button */}
                <button
                  onClick={handleGenerateVideo}
                  disabled={isProcessing}
                  className="mt-2 w-full py-2 px-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:bg-gray-300 text-white text-xs rounded-lg transition-all flex items-center justify-center space-x-1"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      <span>Creating Video...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-3 h-3" />
                      <span>🎬 Make 15s Video</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Quick Examples */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">💡 Quick Story Ideas:</p>
              <div className="space-y-1">
                {[
                  'A magical coffee shop encounter',
                  'Lost pet finds way home',
                  'Time traveler in modern world',
                  'Robot learns about friendship'
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setStoryPrompt(example)}
                    className="w-full text-left text-xs p-2 bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-600 rounded border transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
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
      case 'storyshop':
        return 'This prompt is for other tabs. Use StoryShop interface above.'
      default:
        return 'Enter your prompt...'
    }
  }
}