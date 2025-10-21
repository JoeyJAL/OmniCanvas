import React, { useState } from 'react'
import { useImageStore } from '@store/imageStore'
import { useCanvasStore } from '@store/canvasStore'
import { aiService } from '@services/aiService'
import { useAPIKeyStore } from '@store/apiKeyStore'
import { useTranslation } from '@hooks/useTranslation'
import { useLanguageStore } from '@store/languageStore'
import { templatePrompts, getTemplatePrompt } from '@data/templatePrompts'
import { CanvasLoadingIndicator } from '@components/ui/CanvasLoadingIndicator'
import {
  Sparkles,
  Wand2,
  Settings,
  Zap,
  Scissors,
  ZoomIn,
  Play
} from 'lucide-react'

interface AIPanelProps {
  onOpenSettings: () => void
}

export const AIPanel: React.FC<AIPanelProps> = ({ onOpenSettings }) => {
  const t = useTranslation()
  const { currentLanguage } = useLanguageStore()
  const { isConfigured } = useAPIKeyStore()
  const { getSelectedImages: getImageStoreImages } = useImageStore()
  const { importImage, getSelectedImages: getCanvasSelectedImages } = useCanvasStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [loadingStage, setLoadingStage] = useState<'analyzing' | 'composing' | 'rendering' | 'finalizing'>('composing')
  const [loadingMessage, setLoadingMessage] = useState('')
  const [prompt, setPrompt] = useState('')
  const [activeTab, setActiveTab] = useState<'generate' | 'enhance'>('generate')
  const [_lastResult, setLastResult] = useState<string | null>(null)
  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [templateCategory, setTemplateCategory] = useState<'all' | 'creative' | 'professional' | 'fun'>('all')
  const [activeEnhancements, setActiveEnhancements] = useState<string[]>([])
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)

  // Enhancement features state
  const [selectedEnhancement, setSelectedEnhancement] = useState<string | null>(null)
  const [enhanceSettings, setEnhanceSettings] = useState({
    upscaleLevel: '4x',
    removeBackground: true,
    enhanceQuality: true
  })



  // Get selected images from canvas (higher priority) or image store
  const canvasSelectedImages = getCanvasSelectedImages()
  const imageStoreImages = getImageStoreImages()

  const selectedImages = canvasSelectedImages.length > 0 ? 
    canvasSelectedImages.map(url => ({ url })) : 
    imageStoreImages
  
  const hasSelection = selectedImages.length > 0
  
  // Tab-specific validation
  const tabValidation = {
    generate: {
      maxImages: 10,
      message: t.aiPanel.generate.validation.generateMessage,
      canUse: true  // Generate tab always available
    },
    enhance: {
      maxImages: 10,
      message: t.aiPanel.enhance.selectImagesDescription,
      canUse: selectedImages.length > 0  // Enhance requires at least 1 image
    },
    style: {
      maxImages: 1,
      message: t.aiPanel.generate.validation.styleMessage,
      canUse: selectedImages.length === 1
    },
    merge: {
      maxImages: 10,
      message: t.aiPanel.generate.validation.mergeMessage,
      canUse: selectedImages.length >= 2
    }
  }
  

  const handleGenerateImage = async () => {
    if (!prompt.trim() && activeTab === 'generate') return

    console.log('🚀 Starting generation process...')
    console.log('📊 State check:', {
      activeTab,
      hasSelection,
      selectedImagesCount: selectedImages.length,
      canvasSelectedImages: getCanvasSelectedImages(),
      imageStoreImages: getImageStoreImages(),
      selectedImages: selectedImages.map(img => ({ url: typeof img.url === 'string' ? img.url.substring(0, 50) + '...' : img.url }))
    })

    setIsProcessing(true)
    setLoadingStage('analyzing')
    setLoadingMessage(t.aiPanel.generate.processing.analyzing)

    try {
      // Simulate different stages of processing
      setTimeout(() => {
        setLoadingStage('composing')
        setLoadingMessage(t.aiPanel.generate.processing.composing)
      }, 1000)

      setTimeout(() => {
        setLoadingStage('rendering')
        setLoadingMessage(t.aiPanel.generate.processing.rendering)
      }, 3000)

      setTimeout(() => {
        setLoadingStage('finalizing')
        setLoadingMessage(t.aiPanel.generate.processing.finalizing)
      }, 5000)

      let result

      if (activeTab === 'generate') {
        // Generate Tab: Smart image generation mode
        if (hasSelection && selectedImages.length > 0) {
          console.log('🎯 Using Image-to-Image mode!')
          // Image-to-Image mode: Use selected images as reference with Nano Banana
          const imageUrls = selectedImages.map(img => img.url)

          if (selectedImages.length === 1) {
            console.log('📸 Single image generation with:', typeof imageUrls[0] === 'string' ? imageUrls[0].substring(0, 50) + '...' : imageUrls[0])
            // Single image: Image-to-Image generation with Nano Banana
            result = await aiService.imageToImage({
              prompt: prompt,
              imageUrl: imageUrls[0],
              width: 512,
              height: 512,
              strength: 0.7  // Balance between following reference and creativity
            })
          } else {
            console.log('🔀 Multi-image merge with', selectedImages.length, 'images')
            // Multiple images: Merge with the prompt as instruction
            // Multiple images: Use first image as base for image-to-image
            result = await aiService.imageToImage({
              prompt: `Merge these ${selectedImages.length} images: ${prompt}`,
              imageUrl: imageUrls[0],
              width: 512,
              height: 512,
              strength: 0.5
            })
          }

          console.log(`✅ Generated ${selectedImages.length === 1 ? 'image-to-image' : 'merged'} result based on selection`)
        } else {
          console.log('📝 Using Text-to-Image mode (no images selected)')
          // Text-to-Image mode: Original functionality
          result = await aiService.generateImage({
            prompt: prompt,
            width: 512,
            height: 512
          })

          console.log('✅ Generated image from text prompt:', result)
        }
      } else if (activeTab === 'enhance') {
        // Enhancement Tab: Process selected images
        console.log('🔧 Enhancement mode with settings:', enhanceSettings)
        const imageUrls = selectedImages.map(img => img.url)

        // For now, simulate enhancement by upscaling the first image
        // In a real implementation, you would call specific enhancement APIs
        if (imageUrls.length > 0) {
          console.log('📈 Enhancing images with settings:', enhanceSettings)

          // Create enhancement prompt based on settings - more conservative
          let enhancementPrompt = ''

          if (enhanceSettings.enhanceQuality && !enhanceSettings.removeBackground) {
            // Quality enhancement only - very conservative
            enhancementPrompt = 'preserve original appearance, enhance clarity, reduce noise, maintain exact same composition and features'
          } else if (enhanceSettings.removeBackground && !enhanceSettings.enhanceQuality) {
            // Background removal only - use stronger removal prompt
            enhancementPrompt = 'REMOVE ALL BACKGROUND completely, make background fully transparent, isolate main subject only, cutout style, PNG with alpha channel, white background becomes transparent, solid subject with clean edges, preserve subject 100% unchanged'
          } else if (enhanceSettings.enhanceQuality && enhanceSettings.removeBackground) {
            // Both enhancements - prioritize background removal
            enhancementPrompt = 'REMOVE ALL BACKGROUND make fully transparent, isolate main subject, enhance subject clarity slightly while preserving original appearance exactly, cutout style PNG with alpha transparency'
          } else {
            // Upscale only - minimal change
            enhancementPrompt = 'upscale image, preserve original appearance completely, no changes to subject'
          }

          // Adjust strength based on enhancement type
          let strength = 0.15  // Default low strength for preservation
          if (enhanceSettings.removeBackground) {
            strength = 0.8  // High strength needed for background removal
          } else if (enhanceSettings.enhanceQuality) {
            strength = 0.3  // Medium strength for quality enhancement
          }

          result = await aiService.imageToImage({
            prompt: enhancementPrompt,
            imageUrl: imageUrls[0],
            width: parseInt(enhanceSettings.upscaleLevel) * 128, // Base 512px * multiplier
            height: parseInt(enhanceSettings.upscaleLevel) * 128,
            strength: strength
          })

          console.log('✅ Enhanced image:', result)
        }
      } else {
        // Other tabs: Use standard text-to-image generation
        result = await aiService.generateImage({
          prompt: prompt,
          width: 512,
          height: 512
        })

        console.log('Generated image from text prompt in', activeTab, 'tab:', result)
      }

      // Add generated image to canvas (single image - center it)
      const imageUrl = typeof result === 'string' ? result : result.url
      await importImage(imageUrl)
      setLastResult(imageUrl)

      if (activeTab === 'generate') {
        setPrompt('')
      }

    } catch (error) {
      console.error('Image processing failed:', error)
      alert(t.alerts.imageGenerationFailed + error)
    } finally {
      setIsProcessing(false)
    }
  }
















  return (
    <>
    <div className="flex h-full flex-col bg-gradient-to-br from-white to-purple-50 min-h-0">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white/90 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{t.aiPanel.title}</h3>
          </div>
          <div className="flex items-center space-x-1">
            {hasSelection && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                tabValidation[activeTab]?.canUse
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                🖼️ {selectedImages.length} {t.aiPanel.selected}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white/90 backdrop-blur-sm flex-shrink-0">
        <div className="flex space-x-1 p-2">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'generate'
                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.aiPanel.generate.tabs.generate}</span>
          </button>
          <button
            onClick={() => setActiveTab('enhance')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'enhance'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{t.aiPanel.generate.tabs.enhance}</span>
          </button>
        </div>
      </div>

      {/* Content - 可滾動區域 */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="p-3 md:p-4 flex-1 overflow-y-auto pb-safe">
        {/* API Key Warning */}
        {!isConfigured && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Settings className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 mb-1">{t.settings.apiKeys.required}</p>
                <p className="text-xs text-amber-800">
                  {t.settings.importantNotice.description}
                </p>
                <button
                  onClick={onOpenSettings}
                  className="mt-2 text-xs px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                >
                  {t.settings.apiKeys.openSettings}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Selection Status and Validation */}
        {hasSelection && (
          <div className={`mb-3 p-2 rounded-lg border ${
            tabValidation[activeTab]?.canUse
              ? 'bg-blue-50 border-blue-200'
              : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">
                🖼️ {selectedImages.length} {selectedImages.length !== 1 ? t.aiPanel.images : t.aiPanel.image} {t.aiPanel.selectedFromCanvas}
              </span>
              {!tabValidation[activeTab]?.canUse && (
                <span className="text-xs text-orange-600 font-medium">
                  ⚠️ {t.aiPanel.invalidFor} {activeTab}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {tabValidation[activeTab]?.message}
            </p>
          </div>
        )}

        {/* Text Input for generate tab */}
        {activeTab === 'generate' && (
          <div className="mb-3">
            <textarea
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setSelectedTemplate(null); // Clear template selection when user types
                setActiveEnhancements([]); // Clear active enhancements when user types
              }}
              placeholder={t.aiPanel.generate.placeholder}
              className="w-full h-20 p-2 text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={isProcessing}
            />
            {hasSelection && (
              <p className="text-xs text-purple-600 mt-1">
                💡 {t.aiPanel.selectedImagesNote}
              </p>
            )}
          </div>
        )}

        {/* Tab-specific Content */}
        {activeTab === 'generate' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              {hasSelection
                ? `${t.aiPanel.generateBasedOn} ${selectedImages.length} ${selectedImages.length !== 1 ? t.aiPanel.selectedImages : t.aiPanel.selectedImage}`
                : t.aiPanel.generateWithGemini
              }
            </p>
            
            {/* Mode Indicator */}
            {hasSelection && (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-bold text-blue-700">🎨 {t.aiPanel.imageToImageMode}</span>
                  <span className="text-xs px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full">{t.aiPanel.active}</span>
                </div>
                <p className="text-xs text-blue-700">
                  {t.aiPanel.selectedImagesCombined}
                </p>
              </div>
            )}
            

            {/* Popular Templates - With Categories */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-purple-700 flex items-center">
                  ✨ {t.aiPanel.generate.templates.title}
                </p>
                {hasSelection && (
                  <span className="text-xs text-blue-600 font-medium">{t.aiPanel.generate.templates.withSelection}</span>
                )}
              </div>

              {/* Template Categories */}
              <div className="flex gap-2 mb-2 flex-wrap">
                <button
                  onClick={() => setTemplateCategory('all')}
                  className={`px-2 py-1 text-xs rounded-full transition-all ${
                    templateCategory === 'all' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {t.aiPanel.generate.templates.categories.all}
                </button>
                <button
                  onClick={() => setTemplateCategory('creative')}
                  className={`px-2 py-1 text-xs rounded-full transition-all ${
                    templateCategory === 'creative' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {t.aiPanel.generate.templates.categories.creative}
                </button>
                <button
                  onClick={() => setTemplateCategory('professional')}
                  className={`px-2 py-1 text-xs rounded-full transition-all ${
                    templateCategory === 'professional' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {t.aiPanel.generate.templates.categories.professional}
                </button>
                <button
                  onClick={() => setTemplateCategory('fun')}
                  className={`px-2 py-1 text-xs rounded-full transition-all ${
                    templateCategory === 'fun' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {t.aiPanel.generate.templates.categories.fun}
                </button>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                {templatePrompts
                  .filter(template => templateCategory === 'all' || template.category === templateCategory)
                  .map(template => (
                    <button
                      key={template.id}
                      onClick={() => {
                        const templatePrompt = getTemplatePrompt(template.id, hasSelection, currentLanguage);
                        setPrompt(templatePrompt);
                        setSelectedTemplate(template.id);
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedTemplate === template.id
                          ? 'bg-gradient-to-r from-orange-100 to-yellow-100 border-orange-400 ring-1 ring-orange-300'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-1">{template.icon}</div>
                      <div className="text-xs font-bold text-gray-800">{t.aiPanel.generate.templates.items[template.id as keyof typeof t.aiPanel.generate.templates.items]?.title}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{t.aiPanel.generate.templates.items[template.id as keyof typeof t.aiPanel.generate.templates.items]?.description}</div>
                    </button>
                  ))
                }
              </div>

              {/* Template Description */}
              {selectedTemplate && (
                <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-700">
                    {t.aiPanel.generate.templates.applied}
                  </p>
                </div>
              )}
            </div>
              
            {/* Quick Style Modifiers */}
            <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                <p className="text-xs font-medium text-purple-700 mb-1">✨ {t.aiPanel.generate.quickEnhancements}</p>
                <div className="flex flex-wrap gap-1">
                  {t.aiPanel.generate.enhancementItems.map(modifier => {
                    const isActive = activeEnhancements.includes(modifier);
                    return (
                      <button
                        key={modifier}
                        onClick={() => {
                          const newEnhancements = isActive 
                            ? activeEnhancements.filter(e => e !== modifier)
                            : [...activeEnhancements, modifier];
                          
                          setActiveEnhancements(newEnhancements);
                          
                          // Update prompt with active enhancements
                          const basePrompt = prompt.split(',').filter(part => 
                            !t.aiPanel.generate.enhancementItems.includes(part.trim())
                          ).join(',').trim();
                          
                          const newPrompt = basePrompt + (newEnhancements.length > 0 
                            ? (basePrompt ? ', ' : '') + newEnhancements.join(', ')
                            : '');
                          
                          setPrompt(newPrompt);
                        }}
                        className={`text-xs px-2 py-1 rounded border transition-all ${
                          isActive 
                            ? 'bg-purple-200 border-purple-500 text-purple-800 ring-1 ring-purple-400' 
                            : 'bg-white hover:bg-purple-100 border-purple-300 text-gray-700'
                        }`}
                      >
                        {modifier}
                      </button>
                    );
                  })}
                </div>
              </div>
          </div>
        )}

        {/* Enhance Tab Content */}
        {activeTab === 'enhance' && (
          <div className="space-y-4">
            {/* Image Selection Required */}
            {!hasSelection ? (
              <div className="text-center py-8">
                <ZoomIn className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">{t.aiPanel.enhance.selectImages}</h3>
                <p className="text-xs text-gray-600">{t.aiPanel.enhance.selectImagesDescription}</p>
              </div>
            ) : (
              <>
                {/* Selected Images Info */}
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-bold text-green-700">🎨 {t.aiPanel.enhance.enhancementReady}</span>
                    <span className="text-xs px-2 py-0.5 bg-green-200 text-green-800 rounded-full">
                      {selectedImages.length} {selectedImages.length !== 1 ? t.aiPanel.images : t.aiPanel.image}
                    </span>
                  </div>
                  <p className="text-xs text-green-700">
                    {t.aiPanel.enhance.willBeProcessed}
                  </p>
                </div>

                {/* Enhancement Options */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-800">{t.aiPanel.enhance.enhancementOptions}</h4>

                  {/* Upscale Option */}
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <ZoomIn className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-800">{t.aiPanel.enhance.aiUpscale}</span>
                      </div>
                      <select
                        value={enhanceSettings.upscaleLevel}
                        onChange={(e) => setEnhanceSettings(prev => ({ ...prev, upscaleLevel: e.target.value }))}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="2x">{t.aiPanel.enhance.resolutions['2x']}</option>
                        <option value="4x">{t.aiPanel.enhance.resolutions['4x']}</option>
                        <option value="8x">{t.aiPanel.enhance.resolutions['8x']}</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-600">{t.aiPanel.enhance.upscaleDescription}</p>
                  </div>

                  {/* Background Removal */}
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Scissors className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-800">{t.aiPanel.enhance.backgroundRemoval}</span>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enhanceSettings.removeBackground}
                          onChange={(e) => setEnhanceSettings(prev => ({ ...prev, removeBackground: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          enhanceSettings.removeBackground
                            ? 'bg-purple-600 border-purple-600'
                            : 'border-gray-300'
                        }`}>
                          {enhanceSettings.removeBackground && (
                            <div className="w-2 h-2 bg-white rounded-sm"></div>
                          )}
                        </div>
                      </label>
                    </div>
                    <p className="text-xs text-gray-600">{t.aiPanel.enhance.backgroundRemovalDescription}</p>
                  </div>

                  {/* Quality Enhancement */}
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-gray-800">{t.aiPanel.enhance.qualityEnhancement}</span>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enhanceSettings.enhanceQuality}
                          onChange={(e) => setEnhanceSettings(prev => ({ ...prev, enhanceQuality: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          enhanceSettings.enhanceQuality
                            ? 'bg-amber-600 border-amber-600'
                            : 'border-gray-300'
                        }`}>
                          {enhanceSettings.enhanceQuality && (
                            <div className="w-2 h-2 bg-white rounded-sm"></div>
                          )}
                        </div>
                      </label>
                    </div>
                    <p className="text-xs text-gray-600">{t.aiPanel.enhance.qualityEnhancementDescription}</p>
                  </div>
                </div>

                {/* Enhancement Preview */}
                <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <h4 className="text-sm font-bold text-gray-800 mb-2">{t.aiPanel.enhance.enhancementSummary}</h4>
                  <div className="space-y-1 text-xs text-gray-700">
                    <div>• {t.aiPanel.enhance.upscaleTo} {enhanceSettings.upscaleLevel} {t.aiPanel.enhance.resolutions[enhanceSettings.upscaleLevel as keyof typeof t.aiPanel.enhance.resolutions]}</div>
                    {enhanceSettings.removeBackground && <div>• {t.aiPanel.enhance.removeBackground}</div>}
                    {enhanceSettings.enhanceQuality && <div>• {t.aiPanel.enhance.enhancedQuality}</div>}
                    <div className="text-green-700 font-medium mt-2">
                      {t.aiPanel.enhance.processing} {selectedImages.length} {selectedImages.length !== 1 ? t.aiPanel.images : t.aiPanel.image}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        </div>

        {/* 固定按鈕區域 - 手機優化 */}
        {(activeTab === 'generate' || (activeTab === 'enhance' && hasSelection)) && (
          <div className="sticky bottom-0 p-3 md:p-4 border-t border-gray-200 bg-white/98 backdrop-blur-sm flex-shrink-0 shadow-lg md:shadow-none">
            <button
              onClick={handleGenerateImage}
              disabled={isProcessing || (activeTab === 'generate' && (!prompt.trim() || !tabValidation[activeTab]?.canUse)) || (activeTab === 'enhance' && !hasSelection)}
              className={`w-full py-4 md:py-3 px-4 bg-gradient-to-r ${
                activeTab === 'enhance'
                  ? 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800'
                  : 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:from-purple-800 active:to-pink-800'
              } disabled:from-gray-300 disabled:to-gray-400 text-white text-sm md:text-base rounded-xl transition-all flex items-center justify-center space-x-2 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:scale-100 touch-manipulation`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                  <span>
                    {activeTab === 'enhance' ? t.aiPanel.enhance.enhancing : t.aiPanel.generate.generating}
                  </span>
                </>
              ) : (
                <>
                  {activeTab === 'enhance' ? <Zap className="w-4 h-4 md:w-5 md:h-5" /> : <Sparkles className="w-4 h-4 md:w-5 md:h-5" />}
                  <span>
                    {activeTab === 'enhance' ? t.aiPanel.enhance.enhanceButton : t.aiPanel.generate.generateButton}
                  </span>
                </>
              )}
            </button>

            {/* 手機版提示文字 */}
            <div className="md:hidden mt-2 text-center">
              <p className="text-xs text-gray-500">
                {activeTab === 'generate'
                  ? '🤖 由 Google Gemini 驅動的 AI 圖像生成'
                  : '✨ 智慧圖像增強與優化'
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setPreviewTemplate(null)}>
          <div className="bg-white rounded-xl p-4 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const template = templatePrompts.find(t => t.id === previewTemplate);
              if (!template) return null;
              
              return (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">{template.icon}</div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {t.aiPanel.generate.templates.items[template.id as keyof typeof t.aiPanel.generate.templates.items]?.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setPreviewTemplate(null)}
                      className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  
                  {template.previewImage && (
                    <div className="mb-3">
                      <img 
                        src={template.previewImage} 
                        alt={`${template.id} preview`}
                        className="w-full h-48 object-cover rounded-lg shadow-lg"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {t.aiPanel.generate.templates.items[template.id as keyof typeof t.aiPanel.generate.templates.items]?.description}
                  </p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const templatePrompt = getTemplatePrompt(template.id, hasSelection, currentLanguage);
                        setPrompt(templatePrompt);
                        setSelectedTemplate(template.id);
                        setPreviewTemplate(null);
                      }}
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm rounded-lg transition-all font-medium"
                    >
                      {t.aiPanel.useTemplate}
                    </button>
                    <button
                      onClick={() => setPreviewTemplate(null)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg transition-colors"
                    >
                      {t.aiPanel.close}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

    </div>

    {/* Canvas Loading Indicator */}
    <CanvasLoadingIndicator
      isVisible={isProcessing}
      stage={loadingStage}
    />
  </>
  )

}