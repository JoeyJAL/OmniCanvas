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
  const { getSelectedImages: getImageStoreImages } = useImageStore()
  const { importImage, getSelectedImages: getCanvasSelectedImages, calculateSmartLayout } = useCanvasStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [activeTab, setActiveTab] = useState<'storyshop' | 'generate'>('storyshop')
  const [_lastResult, setLastResult] = useState<string | null>(null)
  
  // StoryShop state
  const [characterImage, setCharacterImage] = useState<string | null>(null)
  const [productImage, setProductImage] = useState<string | null>(null)
  const [storyPrompt, setStoryPrompt] = useState('')
  const [comicPanels, setComicPanels] = useState<string[]>([])
  const [selectedStyle, setSelectedStyle] = useState('comic')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [templateCategory, setTemplateCategory] = useState<'all' | 'creative' | 'professional' | 'fun'>('all')
  const [activeEnhancements, setActiveEnhancements] = useState<string[]>([])
  const [editPrompt, setEditPrompt] = useState('')
  const [latestVideoUrl, setLatestVideoUrl] = useState<string | null>(null)

  // Get selected images from canvas (higher priority) or image store
  const canvasSelectedImages = getCanvasSelectedImages()
  const imageStoreImages = getImageStoreImages()
  const selectedImages = canvasSelectedImages.length > 0 ? 
    canvasSelectedImages.map(url => ({ url })) : 
    imageStoreImages
  
  const canMerge = selectedImages.length >= 2
  const hasSelection = selectedImages.length > 0
  const isMultiSelection = selectedImages.length > 1
  
  // Tab-specific validation
  const tabValidation = {
    generate: { 
      maxImages: 10, 
      message: 'Generate supports any number of reference images or none for fresh creation', 
      canUse: true  // Generate tab always available
    },
    style: { 
      maxImages: 1, 
      message: 'Style transfer requires exactly 1 image', 
      canUse: selectedImages.length === 1 
    },
    merge: { 
      maxImages: 10, 
      message: 'Merge requires 2+ images', 
      canUse: selectedImages.length >= 2 
    },
    storyshop: { 
      maxImages: 2, 
      message: 'Story can use up to 2 images (character + product)', 
      canUse: selectedImages.length <= 2 
    }
  }
  

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return

    console.log('🚀 Starting generation process...')
    console.log('📊 State check:', {
      activeTab,
      hasSelection,
      selectedImagesCount: selectedImages.length,
      canvasSelectedImages: getCanvasSelectedImages(),
      imageStoreImages: getImageStoreImages(),
      selectedImages: selectedImages.map(img => ({ url: img.url.substring(0, 50) + '...' }))
    })

    setIsProcessing(true)
    try {
      let result
      
      if (activeTab === 'generate') {
        // Generate Tab: Smart image generation mode
        if (hasSelection && selectedImages.length > 0) {
          console.log('🎯 Using Image-to-Image mode!')
          // Image-to-Image mode: Use selected images as reference with Nano Banana
          const imageUrls = selectedImages.map(img => img.url)
          
          if (selectedImages.length === 1) {
            console.log('📸 Single image generation with:', imageUrls[0].substring(0, 50) + '...')
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
            result = await aiService.mergeImages(imageUrls, prompt)
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
      await importImage(typeof result === 'string' ? result : result.url)
      setLastResult(typeof result === 'string' ? result : result.url)
      
      setPrompt('')
      
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
      
      // Add merged image to canvas (single image - center it)
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
      
      // Add styled image to canvas (single image - center it)
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

  // Handler for using selected images from canvas
  const handleUseFromCanvas = (type: 'character' | 'product') => {
    const selectedImages = getCanvasSelectedImages()
    console.log(`🖼️ Using ${type} from canvas, selected:`, selectedImages.length, 'images')
    
    if (selectedImages.length === 0) {
      alert(`Please select an image on the canvas first for the ${type}!`)
      return
    }
    
    // Use the first selected image
    const imageUrl = selectedImages[0]
    if (type === 'character') {
      setCharacterImage(imageUrl)
      console.log('✅ Character image set from canvas')
    } else {
      setProductImage(imageUrl)
      console.log('✅ Product image set from canvas')
    }
  }

  const handleGenerateComic = async () => {
    if (!storyPrompt.trim()) {
      alert('Please enter a story prompt first!')
      return
    }

    setIsProcessing(true)
    try {
      console.log('🎬 Starting Story Maker comic generation...')
      console.log('📝 Story:', storyPrompt)
      console.log('🎨 Style:', selectedStyle)
      console.log('👤 Character:', characterImage ? 'Selected' : 'None')
      console.log('🛍️ Product:', productImage ? 'Selected' : 'None')

      const panels = []
      
      // Create story breakdown for 4 panels
      const panelStages = [
        'Setup - Introduction and beginning of the story',
        'Development - Story unfolds and builds tension', 
        'Climax - The key moment or turning point',
        'Resolution - Conclusion and ending'
      ]
      
      for (let i = 0; i < 4; i++) {
        console.log(`🎨 Generating panel ${i + 1}/4: ${panelStages[i]}`)
        
        // Build comprehensive prompt for character and product consistency
        let panelPrompt = `Create a ${selectedStyle} style comic panel for panel ${i + 1}/4.

STORY CONTEXT: ${storyPrompt}
PANEL STAGE: ${panelStages[i]}

VISUAL REQUIREMENTS:
- High-quality ${selectedStyle} art style
- Consistent character appearance throughout the story
- CONSISTENT SCENE/LOCATION: All panels should take place in the same general setting/environment (can use different camera angles/perspectives but must be recognizably the same location)
- Clear comic panel composition with good visual flow
- Professional comic book quality artwork
- Maintain environmental coherence across all panels`

        // Add character consistency if character image is provided
        if (characterImage) {
          panelPrompt += `
- IMPORTANT: Use the provided character image as reference to maintain character consistency
- Keep the same person's appearance, facial features, and clothing style throughout`
        }

        // Add product integration if product image is provided  
        if (productImage) {
          panelPrompt += `
- IMPORTANT: Naturally integrate the provided product into the scene
- Product should appear contextually appropriate within the story
- Maintain product's visual characteristics and branding`
        }

        panelPrompt += `

Generate panel ${i + 1}: ${panelStages[i]} of the story "${storyPrompt}"`

        // Determine generation mode based on available images
        let result
        
        if (characterImage && productImage) {
          // Both character and product: Merge them first, then use for generation
          console.log('🎭 Merging character and product for comprehensive reference')
          const mergedImage = await aiService.mergeImages(
            [characterImage, productImage],
            `Composite reference image combining the main character and the featured product. Keep both elements clearly visible.`
          )
          
          console.log('🖼️ Using merged reference for image-to-image generation')
          result = await aiService.imageToImage({
            prompt: panelPrompt,
            imageUrl: mergedImage,
            width: 512,
            height: 512,
            strength: 0.5 // Lower strength to allow more creative interpretation while keeping references
          })
        } else if (characterImage) {
          // Only character: Use character for image-to-image
          console.log('🖼️ Using character reference for image-to-image generation')
          result = await aiService.imageToImage({
            prompt: panelPrompt,
            imageUrl: characterImage,
            width: 512,
            height: 512,
            strength: 0.6 // Maintain character features while allowing story elements
          })
        } else if (productImage) {
          // Only product: Use product for image-to-image
          console.log('📦 Using product reference for image-to-image generation')
          result = await aiService.imageToImage({
            prompt: panelPrompt,
            imageUrl: productImage,
            width: 512,
            height: 512,
            strength: 0.5 // Allow more creativity for product integration
          })
        } else {
          // No references: Use text-to-image
          console.log('📝 Using text-to-image generation')
          result = await aiService.generateImage({
            prompt: panelPrompt,
            width: 512,
            height: 512
          })
        }
        
        panels.push(result.url)
        console.log(`✅ Panel ${i + 1} generated successfully`)
      }
      
      setComicPanels(panels)
      
      // Add panels to canvas using smart layout (2x2 grid for 4 panels)
      console.log('📋 Adding panels to canvas with smart layout...')
      const imageSize = { width: 300, height: 300 } // Estimated scaled size
      const positions = calculateSmartLayout(panels.length, imageSize)
      
      for (let i = 0; i < panels.length; i++) {
        const position = positions[i] || { x: 100 + i * 150, y: 100 }
        await importImage(panels[i], position)
        console.log(`📍 Panel ${i + 1} positioned at:`, position)
      }
      
      console.log('🎉 4-panel comic generated successfully with character consistency!')
    } catch (error) {
      console.error('❌ Comic generation failed:', error)
      alert('Comic generation failed. Please try again!')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEditAllPanels = async () => {
    if (!editPrompt.trim()) {
      alert('Please enter edit instructions!')
      return
    }
    
    if (comicPanels.length === 0) {
      alert('Generate a comic first!')
      return
    }

    setIsProcessing(true)
    try {
      console.log('✨ Editing all panels with:', editPrompt)
      
      // Re-generate all panels with edit instructions
      const editedPanels = []
      const panelStages = [
        'Setup - Introduction and beginning of the story',
        'Development - Story unfolds and builds tension', 
        'Climax - The key moment or turning point',
        'Resolution - Conclusion and ending'
      ]
      
      for (let i = 0; i < comicPanels.length; i++) {
        console.log(`✨ Editing panel ${i + 1}/4`)
        
        let editedPrompt = `Edit this ${selectedStyle} style comic panel for panel ${i + 1}/4.

ORIGINAL STORY: ${storyPrompt}
PANEL STAGE: ${panelStages[i]}
EDIT INSTRUCTIONS: ${editPrompt}

Apply the edit instructions while maintaining:
- The same ${selectedStyle} art style
- Character consistency throughout the story
- The panel's role in the story sequence`

        if (characterImage) {
          editedPrompt += `
- Character appearance from the reference image`
        }
        
        if (productImage) {
          editedPrompt += `
- Product integration naturally into the scene`
        }

        // Use same logic as in handleGenerateComic for consistency
        let result
        if (characterImage && productImage) {
          // Both character and product: Merge them first
          console.log('🎭 Merging character and product for edit reference')
          const mergedImage = await aiService.mergeImages(
            [characterImage, productImage],
            `Composite reference image combining the main character and the featured product. Keep both elements clearly visible.`
          )
          
          result = await aiService.imageToImage({
            prompt: editedPrompt,
            imageUrl: mergedImage,
            width: 512,
            height: 512,
            strength: 0.5
          })
        } else if (characterImage) {
          result = await aiService.imageToImage({
            prompt: editedPrompt,
            imageUrl: characterImage,
            width: 512,
            height: 512,
            strength: 0.7
          })
        } else if (productImage) {
          result = await aiService.imageToImage({
            prompt: editedPrompt,
            imageUrl: productImage,
            width: 512,
            height: 512,
            strength: 0.5
          })
        } else {
          result = await aiService.generateImage({
            prompt: editedPrompt,
            width: 512,
            height: 512
          })
        }
        
        editedPanels.push(result.url)
        // Use smart positioning for edited panels
        const positions = calculateSmartLayout(editedPanels.length + 1, { width: 300, height: 300 })
        const position = positions[i] || { x: 100 + i * 150, y: 100 }
        await importImage(result.url, position)
        console.log(`✅ Panel ${i + 1} edited successfully`)
      }
      
      setComicPanels(editedPanels)
      setEditPrompt('')
      console.log('🎉 All panels edited successfully!')
    } catch (error) {
      console.error('❌ Panel editing failed:', error)
      alert('Panel editing failed. Please try again!')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGenerateStoryIdea = async (category: string) => {
    setIsProcessing(true)
    try {
      console.log('💡 Generating story idea for category:', category)
      
      // Use pre-made story ideas that work reliably
      const storyIdeas = {
        coffee: "A shy customer accidentally orders in a different language, leading to an unexpected friendship with the barista",
        shopping: "Someone finds the perfect vintage jacket, only to discover it belongs to their childhood friend working at the shop",  
        friendship: "Two strangers get stuck in an elevator and end up planning their dream vacation together",
        adventure: "A person follows a mysterious cat through the city and discovers a hidden rooftop garden",
        surprise: "Someone orders takeout and finds a handwritten note that changes their entire day"
      }
      
      setStoryPrompt(storyIdeas[category] || storyIdeas.coffee)
      console.log('✅ Story idea generated:', storyIdeas[category])
    } catch (error) {
      console.error('❌ Story idea generation failed:', error)
      alert('Story idea generation failed. Please try again!')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGenerateVideo = async () => {
    // First try to get selected images from canvas
    const selectedImages = getCanvasSelectedImages()
    console.log('🎯 Canvas selected images:', { count: selectedImages.length })
    
    // Determine which images to use for video generation
    let panelUrls: string[] = []
    
    if (selectedImages.length > 0) {
      panelUrls = selectedImages
      console.log('🎬 Using', selectedImages.length, 'selected images from canvas for video')
    } else if (comicPanels.length > 0) {
      panelUrls = comicPanels
      console.log('🎬 Using', comicPanels.length, 'generated comic panels for video')
    } else {
      alert('Please select images on the canvas or generate a comic first!')
      return
    }

    setIsProcessing(true)
    try {
      console.log('🎬 Generating video from', panelUrls.length, 'panels')
      console.log('📹 Using Fal.ai to create animated story video...')
      
      const videoUrl = await aiService.generateVideoFromPanels({
        panelUrls: panelUrls,
        narrationText: storyPrompt,
        voiceId: 'default',
        duration: 8
      })
      
      console.log('✅ Video generated successfully!')
      console.log('🎥 Video URL:', videoUrl)
      
      // Store the video URL for the button
      setLatestVideoUrl(videoUrl)
      
      // Show simple success message
      alert(`🎬 Video generated successfully!
      
✨ Your 8-second video is ready!
• Use the "Watch Video" button below to view
• Generated: ${new Date().toLocaleString()}`)
      
    } catch (error) {
      console.error('❌ Video generation failed:', error)
      alert(`Video generation failed: ${error}\n\nNote: Make sure your Fal.ai API key is configured and has credits.`)
    } finally {
      setIsProcessing(false)
    }
  }

  const tabs = [
    { id: 'storyshop' as const, label: 'Story Maker', icon: BookOpen },
    { id: 'generate' as const, label: 'Generate', icon: Sparkles },
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
            {hasSelection && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                tabValidation[activeTab]?.canUse 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                🖼️ {selectedImages.length} selected
              </span>
            )}
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
        {/* Selection Status and Validation */}
        {hasSelection && (
          <div className={`mb-3 p-2 rounded-lg border ${
            tabValidation[activeTab]?.canUse
              ? 'bg-blue-50 border-blue-200'
              : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">
                🖼️ {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected from canvas
              </span>
              {!tabValidation[activeTab]?.canUse && (
                <span className="text-xs text-orange-600 font-medium">
                  ⚠️ Invalid for {activeTab}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {tabValidation[activeTab]?.message}
            </p>
          </div>
        )}

        {/* Text Input for all tabs except Story Maker */}
        {activeTab !== 'storyshop' && (
          <div className="mb-3">
            <textarea
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setSelectedTemplate(null); // Clear template selection when user types
                setActiveEnhancements([]); // Clear active enhancements when user types
              }}
              placeholder={getPlaceholderText()}
              className="w-full h-20 p-2 text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={isProcessing}
            />
            {hasSelection && (
              <p className="text-xs text-purple-600 mt-1">
                💡 Selected images will be automatically included in the AI request
              </p>
            )}
          </div>
        )}

        {/* Tab-specific Content */}
        {activeTab === 'generate' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              {hasSelection 
                ? `Generate new images based on your ${selectedImages.length} selected image${selectedImages.length !== 1 ? 's' : ''}`
                : 'Generate images with Gemini 2.5 Flash (Nano Banana)'
              }
            </p>
            
            {/* Mode Indicator */}
            {hasSelection && (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-bold text-blue-700">🎨 Image-to-Image Mode</span>
                  <span className="text-xs px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full">ACTIVE</span>
                </div>
                <p className="text-xs text-blue-700">
                  Your selected image{selectedImages.length !== 1 ? 's' : ''} will be combined with your prompt/template to generate new images.
                </p>
              </div>
            )}
            
            {/* Popular Templates - With Categories */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-purple-700 flex items-center">
                  🔥 Nano Banana 熱門模板 (點擊使用)
                </p>
                {hasSelection && (
                  <span className="text-xs text-blue-600 font-medium">+ 已選圖片</span>
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
                  全部
                </button>
                <button
                  onClick={() => setTemplateCategory('creative')}
                  className={`px-2 py-1 text-xs rounded-full transition-all ${
                    templateCategory === 'creative' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  🎨 創意轉換
                </button>
                <button
                  onClick={() => setTemplateCategory('professional')}
                  className={`px-2 py-1 text-xs rounded-full transition-all ${
                    templateCategory === 'professional' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  💼 專業商用
                </button>
                <button
                  onClick={() => setTemplateCategory('fun')}
                  className={`px-2 py-1 text-xs rounded-full transition-all ${
                    templateCategory === 'fun' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  🎮 趣味玩法
                </button>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                {/* Creative Templates */}
                {(templateCategory === 'all' || templateCategory === 'creative') && (
                  <>
                    {/* 3D Figurine Template */}
                    <button
                      onClick={() => {
                        const templatePrompt = hasSelection
                          ? '將參考圖片中的人物轉換成超寫實的1/7比例模型，放置在iMac電腦桌上，旁邊有白色Apple鍵盤。模型完美捕捉人物的外觀、服裝和個性。模型站在透明壓克力底座上。iMac螢幕顯示ZBrush建模過程。旁邊放置包裝盒，盒子設計配合人物風格主題。'
                          : '創建一個精緻的動漫角色1/7比例模型，放置在工作桌上，專業攝影棚燈光，展現模型細節。';
                        setPrompt(templatePrompt);
                        setSelectedTemplate('figurine');
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedTemplate === 'figurine'
                          ? 'bg-gradient-to-r from-orange-100 to-yellow-100 border-orange-400 ring-1 ring-orange-300'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-1">🎎</div>
                      <div className="text-xs font-bold text-gray-800">3D 模型公仔</div>
                      <div className="text-xs text-gray-600 mt-0.5">桌面擺飾模型</div>
                    </button>

                    {/* Hand-drawn Process */}
                    <button
                      onClick={() => {
                        const templatePrompt = hasSelection
                          ? '將圖片轉換成4階段手繪插畫過程：1.鉛筆草稿輪廓 2.加入基本線條 3.添加細節和陰影 4.完成的彩色插畫。展示從草圖到完成品的繪畫步驟。'
                          : '創建一個角色的4階段手繪過程，從簡單草稿到完整彩色插畫';
                        setPrompt(templatePrompt);
                        setSelectedTemplate('hand-drawn');
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedTemplate === 'hand-drawn'
                          ? 'bg-gradient-to-r from-pink-100 to-purple-100 border-pink-400 ring-1 ring-pink-300'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-1">✏️</div>
                      <div className="text-xs font-bold text-gray-800">手繪過程</div>
                      <div className="text-xs text-gray-600 mt-0.5">草稿到完稿</div>
                    </button>

                    {/* 3D Cross-section */}
                    <button
                      onClick={() => {
                        const templatePrompt = hasSelection
                          ? '創建物體的3D剖面圖，展示內部結構和組件，技術圖解風格，標註各部分名稱，工程圖紙風格'
                          : '生成建築物的3D剖面圖，展示內部樓層結構';
                        setPrompt(templatePrompt);
                        setSelectedTemplate('cross-section');
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedTemplate === 'cross-section'
                          ? 'bg-gradient-to-r from-cyan-100 to-blue-100 border-cyan-400 ring-1 ring-cyan-300'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-1">🔧</div>
                      <div className="text-xs font-bold text-gray-800">3D 剖面圖</div>
                      <div className="text-xs text-gray-600 mt-0.5">內部結構解析</div>
                    </button>

                    {/* Old Photo Restoration */}
                    <button
                      onClick={() => {
                        const templatePrompt = hasSelection
                          ? '修復並上色這張老照片，去除刮痕、污漬和褪色，增強細節，添加自然色彩，保持原始構圖和人物特徵'
                          : '修復一張1950年代的黑白家庭照片，添加色彩';
                        setPrompt(templatePrompt);
                        setSelectedTemplate('restore');
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedTemplate === 'restore'
                          ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-400 ring-1 ring-amber-300'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-1">📸</div>
                      <div className="text-xs font-bold text-gray-800">老照片修復</div>
                      <div className="text-xs text-gray-600 mt-0.5">上色與修復</div>
                    </button>
                  </>
                )}

                {/* Professional Templates */}
                {(templateCategory === 'all' || templateCategory === 'professional') && (
                  <>
                    {/* Professional ID Photo */}
                    <button
                      onClick={() => {
                        const templatePrompt = hasSelection
                          ? '將人物轉換成專業證件照：白色背景、正裝、自信表情、證件照規格、專業攝影棚燈光、保持人物臉部特徵'
                          : '生成專業商務證件照，白色背景，正裝';
                        setPrompt(templatePrompt);
                        setSelectedTemplate('id-photo');
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedTemplate === 'id-photo'
                          ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-400 ring-1 ring-blue-300'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-1">📷</div>
                      <div className="text-xs font-bold text-gray-800">專業證件照</div>
                      <div className="text-xs text-gray-600 mt-0.5">商務形象照</div>
                    </button>

                    {/* Product Photography */}
                    <button
                      onClick={() => {
                        const templatePrompt = hasSelection
                          ? '將產品轉換成專業電商攝影：純白背景、多角度展示、專業打光、展現產品細節和質感'
                          : '創建專業產品攝影，適合電商平台使用';
                        setPrompt(templatePrompt);
                        setSelectedTemplate('product');
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedTemplate === 'product'
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-400 ring-1 ring-green-300'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-1">📦</div>
                      <div className="text-xs font-bold text-gray-800">產品攝影</div>
                      <div className="text-xs text-gray-600 mt-0.5">電商專業照</div>
                    </button>

                    {/* Interior Design */}
                    <button
                      onClick={() => {
                        const templatePrompt = hasSelection
                          ? '將空間重新設計：添加現代家具、改變牆面顏色、加入裝飾品、專業室內設計風格'
                          : '設計現代簡約風格客廳，包含沙發、茶几和裝飾';
                        setPrompt(templatePrompt);
                        setSelectedTemplate('interior');
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedTemplate === 'interior'
                          ? 'bg-gradient-to-r from-teal-100 to-cyan-100 border-teal-400 ring-1 ring-teal-300'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-1">🏠</div>
                      <div className="text-xs font-bold text-gray-800">室內設計</div>
                      <div className="text-xs text-gray-600 mt-0.5">空間改造</div>
                    </button>

                    {/* Marketing Material */}
                    <button
                      onClick={() => {
                        const templatePrompt = hasSelection
                          ? '創建社群媒體行銷素材：加入吸引人的背景、文字空間、品牌色彩、適合Instagram發布'
                          : '設計引人注目的社群媒體廣告圖片';
                        setPrompt(templatePrompt);
                        setSelectedTemplate('marketing');
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedTemplate === 'marketing'
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-400 ring-1 ring-purple-300'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-1">📱</div>
                      <div className="text-xs font-bold text-gray-800">行銷素材</div>
                      <div className="text-xs text-gray-600 mt-0.5">社群媒體圖</div>
                    </button>
                  </>
                )}

                {/* Fun Templates */}
                {(templateCategory === 'all' || templateCategory === 'fun') && (
                  <>
                    {/* Clothing Try-on */}
                    <button
                      onClick={() => {
                        const templatePrompt = hasSelection
                          ? '將第一張圖片的人物穿上第二張圖片的服裝，保持人物姿勢和背景不變，服裝要自然貼合'
                          : '展示模特兒試穿不同風格服裝';
                        setPrompt(templatePrompt);
                        setSelectedTemplate('try-on');
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedTemplate === 'try-on'
                          ? 'bg-gradient-to-r from-rose-100 to-pink-100 border-rose-400 ring-1 ring-rose-300'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-1">👗</div>
                      <div className="text-xs font-bold text-gray-800">虛擬試穿</div>
                      <div className="text-xs text-gray-600 mt-0.5">服裝換搭</div>
                    </button>

                    {/* Character in Different Eras */}
                    <button
                      onClick={() => {
                        const templatePrompt = hasSelection
                          ? '將人物放到不同年代：1920年代復古風、1960年代嬉皮風、1980年代迪斯可、2000年代Y2K風格，保持人物特徵'
                          : '展示同一角色在不同歷史時期的造型';
                        setPrompt(templatePrompt);
                        setSelectedTemplate('time-travel');
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedTemplate === 'time-travel'
                          ? 'bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-400 ring-1 ring-indigo-300'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-1">⏰</div>
                      <div className="text-xs font-bold text-gray-800">時空旅行</div>
                      <div className="text-xs text-gray-600 mt-0.5">不同年代造型</div>
                    </button>

                    {/* Pet Adventures */}
                    <button
                      onClick={() => {
                        const templatePrompt = hasSelection
                          ? '將寵物放入冒險場景：太空人裝扮在月球、海盜船長在船上、超級英雄飛行、騎士盔甲在城堡'
                          : '創造寵物的奇幻冒險場景';
                        setPrompt(templatePrompt);
                        setSelectedTemplate('pet-adventure');
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedTemplate === 'pet-adventure'
                          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-400 ring-1 ring-yellow-300'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-1">🐾</div>
                      <div className="text-xs font-bold text-gray-800">寵物冒險</div>
                      <div className="text-xs text-gray-600 mt-0.5">趣味場景</div>
                    </button>

                    {/* Food Ingredients */}
                    <button
                      onClick={() => {
                        const templatePrompt = hasSelection
                          ? '將食物分解成食材：每個食材放在單獨的碗中，標註名稱和份量，烹飪教學風格排列'
                          : '展示料理的所有食材和調味料';
                        setPrompt(templatePrompt);
                        setSelectedTemplate('ingredients');
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedTemplate === 'ingredients'
                          ? 'bg-gradient-to-r from-lime-100 to-green-100 border-lime-400 ring-1 ring-lime-300'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-1">🍳</div>
                      <div className="text-xs font-bold text-gray-800">食材分解</div>
                      <div className="text-xs text-gray-600 mt-0.5">料理教學</div>
                    </button>
                  </>
                )}
              </div>

              {/* Template Description */}
              {selectedTemplate && (
                <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-700">
                    ✨ 模板已套用！可以直接生成或在上方輸入框中修改提示詞
                  </p>
                </div>
              )}
            </div>
              
            {/* Quick Style Modifiers */}
            <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                <p className="text-xs font-medium text-purple-700 mb-1">✨ Quick Enhancements (Click to toggle)</p>
                <div className="flex flex-wrap gap-1">
                  {['viral meme style', '4K ultra HD', 'cinematic lighting', 'trending on artstation', 'octane render'].map(modifier => {
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
                            !['viral meme style', '4K ultra HD', 'cinematic lighting', 'trending on artstation', 'octane render']
                              .includes(part.trim())
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
            
            <button
              onClick={handleGenerateImage}
              disabled={isProcessing || !prompt.trim() || !tabValidation[activeTab]?.canUse}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white text-sm rounded-xl transition-all flex items-center justify-center space-x-2 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>
                    {hasSelection 
                      ? `Generating with selected image${selectedImages.length !== 1 ? 's' : ''}...`
                      : 'Generating with Nano Banana...'
                    }
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {hasSelection 
                      ? `Generate with ${selectedImages.length} Selected Image${selectedImages.length !== 1 ? 's' : ''}`
                      : 'Generate with Nano Banana'
                    }
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {false && (
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
              disabled={isProcessing || !tabValidation[activeTab]?.canUse}
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

        {false && (
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
              disabled={isProcessing || !tabValidation[activeTab]?.canUse || !prompt.trim()}
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
            <div className="text-center p-5 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl text-white shadow-xl">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-black tracking-tight">Story Maker</h4>
              </div>
              <p className="text-sm font-semibold mb-3 leading-tight">
                🪄 One Story + One Photo = 4-Panel Comic + 8s Video
              </p>
              <p className="text-xs opacity-90 mb-4">
                Perfect for <strong>social media</strong>, <strong>marketing</strong>, and <strong>content creation</strong>
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                  <div className="text-lg mb-1">📱</div>
                  <div className="text-xs font-medium">Instagram</div>
                  <div className="text-xs opacity-75">Ready</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                  <div className="text-lg mb-1">🛍️</div>
                  <div className="text-xs font-medium">E-commerce</div>
                  <div className="text-xs opacity-75">Stories</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                  <div className="text-lg mb-1">🎯</div>
                  <div className="text-xs font-medium">Marketing</div>
                  <div className="text-xs opacity-75">Ads</div>
                </div>
              </div>
            </div>

            {/* Character Upload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                  <div className="p-1 bg-purple-100 rounded-lg">
                    <Camera className="w-4 h-4 text-purple-600" />
                  </div>
                  <span>Main Character</span>
                </label>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                  Step 1
                </span>
              </div>
              <div className="border-2 border-dashed border-purple-300 rounded-xl p-5 bg-gradient-to-br from-purple-50/50 to-pink-50/50 hover:from-purple-100/50 hover:to-pink-100/50 transition-all duration-300">
                {characterImage ? (
                  <div className="relative group">
                    <img src={characterImage} alt="Character" className="w-full h-20 object-cover rounded-lg shadow-md" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-all duration-200">
                      <button
                        onClick={() => setCharacterImage(null)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white text-sm rounded-full flex items-center justify-center shadow-lg transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-xs text-green-600 font-medium">✅ Character ready for story!</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mb-3">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-2">
                        <Upload className="w-8 h-8 text-purple-500" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Add Your Main Character</p>
                      <p className="text-xs text-gray-500 mb-3">Drag from canvas or upload a photo</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <button 
                        onClick={() => handleUseFromCanvas('character')}
                        className="py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
                      >
                        📸 Use Selected from Canvas
                      </button>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload('character', e.target.files[0])}
                        />
                        <div className="py-2 px-4 bg-white hover:bg-gray-50 text-gray-700 text-xs rounded-lg border border-gray-300 font-medium transition-all">
                          📁 Upload New Photo
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Upload (Optional) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                  <div className="p-1 bg-orange-100 rounded-lg">
                    <FileImage className="w-4 h-4 text-orange-600" />
                  </div>
                  <span>Product Integration</span>
                </label>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                  Optional
                </span>
              </div>
              <div className="border-2 border-dashed border-orange-200 rounded-xl p-4 bg-gradient-to-br from-orange-50/50 to-yellow-50/50 hover:from-orange-100/50 hover:to-yellow-100/50 transition-all duration-300">
                {productImage ? (
                  <div className="relative group">
                    <img src={productImage} alt="Product" className="w-full h-16 object-cover rounded-lg shadow-md" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-all duration-200">
                      <button
                        onClick={() => setProductImage(null)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white text-sm rounded-full flex items-center justify-center shadow-lg transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-xs text-green-600 font-medium">🛍️ Product will appear in story!</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center mb-2">
                      <FileImage className="w-6 h-6 text-orange-500" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Add Product for E-commerce</p>
                    <p className="text-xs text-gray-500 mb-2">Perfect for product marketing & ads</p>
                    
                    <div className="grid grid-cols-1 gap-1">
                      <button 
                        onClick={() => handleUseFromCanvas('product')}
                        className="py-1.5 px-3 bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white text-xs rounded-lg font-medium transition-all"
                      >
                        🛍️ Use from Canvas
                      </button>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload('product', e.target.files[0])}
                        />
                        <div className="py-1.5 px-3 bg-white hover:bg-gray-50 text-gray-600 text-xs rounded-lg border border-gray-200 font-medium transition-all">
                          📁 Upload Product
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Story Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                  <div className="p-1 bg-green-100 rounded-lg">
                    <TestTube className="w-4 h-4 text-green-600" />
                  </div>
                  <span>Your Story Idea</span>
                </label>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  Step 2
                </span>
              </div>
              <div className="relative">
                <textarea
                  value={storyPrompt}
                  onChange={(e) => setStoryPrompt(e.target.value)}
                  placeholder="✨ Write your story in one sentence...

Examples:
• A coffee shop encounter on a snowy Christmas night
• Finding the perfect gift during holiday shopping
• A friendship that blooms in a cozy bookstore"
                  className="w-full h-24 p-4 text-sm border-2 border-green-200 rounded-xl resize-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gradient-to-br from-green-50/30 to-emerald-50/30 placeholder-gray-500"
                  disabled={isProcessing}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {storyPrompt.length}/200
                </div>
              </div>
              {storyPrompt.trim() && (
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-700 font-medium flex items-center space-x-1">
                    <span>🎬</span>
                    <span>Perfect! This will create 4 compelling panels telling your story.</span>
                  </p>
                </div>
              )}
              
              {/* Quick Story Ideas */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">💡 Quick Story Ideas:</p>
                <div className="space-y-1">
                  {[
                    { text: 'A magical coffee shop encounter', category: 'coffee' },
                    { text: 'Lost pet finds way home', category: 'adventure' },
                    { text: 'Time traveler in modern world', category: 'surprise' },
                    { text: 'Robot learns about friendship', category: 'friendship' }
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleGenerateStoryIdea(example.category)}
                      className="w-full text-left text-xs p-2 bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-600 rounded border transition-colors"
                    >
                      {example.text}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Style Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                  <div className="p-1 bg-blue-100 rounded-lg">
                    <Palette className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Visual Style</span>
                </label>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  Step 3
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { style: 'comic', emoji: '💥', desc: 'Bold & Dynamic' },
                  { style: 'manga', emoji: '🎌', desc: 'Japanese Style' },
                  { style: 'disney', emoji: '🏰', desc: 'Magical & Cute' },
                  { style: 'realistic', emoji: '📷', desc: 'Photo-like' },
                  { style: 'anime', emoji: '✨', desc: 'Anime Style' },
                  { style: 'vintage', emoji: '🎨', desc: 'Classic Art' }
                ].map(({ style, emoji, desc }) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`p-3 rounded-xl transition-all duration-200 border-2 ${
                      selectedStyle === style
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-400 shadow-lg transform scale-105'
                        : 'bg-gradient-to-br from-gray-50 to-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md hover:transform hover:scale-102'
                    }`}
                  >
                    <div className="text-lg mb-1">{emoji}</div>
                    <div className="font-bold capitalize">{style}</div>
                    <div className={`text-xs opacity-75 ${selectedStyle === style ? 'text-white' : 'text-gray-500'}`}>
                      {desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Comic Button */}
            <div className="space-y-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-dashed border-purple-200">
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-sm font-bold text-gray-800 mb-2">
                  <span className="text-base">🪄</span>
                  <span>Ready to Create Your Story?</span>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  AI will generate 4 cinematic panels with consistent character & product placement
                </p>
              </div>
              
              <button
                onClick={handleGenerateComic}
                disabled={isProcessing || !storyPrompt.trim()}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-700 hover:via-pink-700 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 text-white text-base rounded-2xl transition-all flex items-center justify-center space-x-3 font-black shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 disabled:scale-100 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>🎬 Creating Your Story Magic...</span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-1">
                      <BookOpen className="w-5 h-5" />
                      <span className="font-bold">4 PANELS</span>
                    </div>
                    <span>✨ GENERATE COMIC</span>
                    <div className="flex items-center space-x-1 bg-white/20 rounded-lg px-2 py-1">
                      <Video className="w-4 h-4" />
                      <span className="text-xs font-medium">+ Video</span>
                    </div>
                  </>
                )}
              </button>
            </div>

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
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Change time to snowy Christmas night, add falling snow..."
                    className="w-full text-xs p-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70"
                    disabled={isProcessing}
                  />
                  <div className="grid grid-cols-1 gap-2 mt-3">
                    <button 
                      onClick={handleEditAllPanels}
                      disabled={isProcessing || !editPrompt.trim()}
                      className="text-xs py-2 px-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:bg-gray-300 text-white rounded-lg transition-all font-medium shadow hover:shadow-md transform hover:scale-105 disabled:scale-100"
                    >
                      {isProcessing ? '✨ Editing All Panels...' : '✨ Edit All Panels'}
                    </button>
                  </div>
                </div>
                
                {/* Video Generation Buttons */}
                <div className="mt-2 space-y-1">
                  {/* Generate Video Button */}
                  <button
                    onClick={handleGenerateVideo}
                    disabled={isProcessing}
                    className="w-full py-2 px-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:bg-gray-300 text-white text-xs rounded-lg transition-all flex items-center justify-center space-x-1"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        <span>Creating Video...</span>
                      </>
                    ) : (
                      <>
                        <Video className="w-3 h-3" />
                        <span>🎬 Make 8s Video</span>
                      </>
                    )}
                  </button>
                  
                  {/* Watch Video Button - Only show when video is available */}
                  {latestVideoUrl && (
                    <button
                      onClick={() => {
                        console.log('🎬 Opening latest video:', latestVideoUrl)
                        window.open(latestVideoUrl, '_blank')
                      }}
                      className="w-full py-2 px-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs rounded-lg transition-all flex items-center justify-center space-x-1"
                    >
                      <Play className="w-3 h-3" />
                      <span>🎥 Watch Video</span>
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  )

  function getPlaceholderText(): string {
    switch (activeTab) {
      case 'generate':
        if (hasSelection) {
          return selectedImages.length === 1 
            ? 'Write your prompt or use templates below. Your selected image will be used as reference...\nExample: "Make it anime style with dramatic lighting"'
            : `Write your prompt or use templates below. Your ${selectedImages.length} selected images will be combined...\nExample: "Blend these into an artistic collage"`
        }
        return 'Write your prompt or use templates below to generate new images...\nExample: "A sunset over mountains with birds flying"'
      case 'merge':
        return 'Describe how to merge the selected images...\nExample: "Blend these photos into a collage with vintage style"'
      case 'style':
        return 'Describe the artistic style to apply...\nExample: "Van Gogh starry night style" or choose from buttons below'
      case 'storyshop':
        return 'This prompt is for other tabs. Use StoryShop interface above.'
      default:
        return 'Enter your prompt...'
    }
  }
}