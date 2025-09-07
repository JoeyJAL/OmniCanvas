import { create } from 'zustand'
import { aiService } from '@services/aiService'

interface ComicPanel {
  id: string
  url: string
  prompt: string
  position: { x: number; y: number }
  editing?: boolean
}

interface StoryShopState {
  // Story elements
  characterImage: string | null
  productImage: string | null
  storyPrompt: string
  selectedStyle: string
  
  // Generated content
  comicPanels: ComicPanel[]
  currentVideo: string | null
  
  // UI state
  isGenerating: boolean
  isEditingPanel: string | null
  editPrompt: string
  
  // API quota management
  apiUsage: {
    imagesGenerated: number
    editsPerformed: number
    videosCreated: number
    dailyLimit: number
  }
  
  // Cache for API responses
  cache: Map<string, string>
}

interface StoryShopStore extends StoryShopState {
  // Character and product management
  setCharacterImage: (image: string | null) => void
  setProductImage: (image: string | null) => void
  
  // Story management
  setStoryPrompt: (prompt: string) => void
  setSelectedStyle: (style: string) => void
  
  // Comic generation
  generateComic: () => Promise<void>
  regeneratePanel: (panelId: string, customPrompt?: string) => Promise<void>
  
  // Panel editing
  startEditingPanel: (panelId: string, currentPrompt: string) => void
  cancelEditing: () => void
  applyEdit: () => Promise<void>
  setEditPrompt: (prompt: string) => void
  
  // Video generation
  generateVideo: (narrationText?: string) => Promise<void>
  
  // Utility functions
  resetStory: () => void
  canGenerateMore: () => boolean
  getCachedResult: (prompt: string) => string | null
  setCachedResult: (prompt: string, result: string) => void
  
  // Export functions
  exportComicAsPNG: () => Promise<string>
  exportStoryData: () => object
}

const generateStoryParts = (story: string): string[] => {
  return [
    `Setup: ${story} - the beginning scene, establishing the character and setting`,
    `Development: ${story} - the story develops, introducing conflict or progress`,
    `Climax: ${story} - the main moment, peak of the action or emotion`,
    `Resolution: ${story} - conclusion, showing the outcome or resolution`
  ]
}

export const useStoryShopStore = create<StoryShopStore>((set, get) => ({
  // Initial state
  characterImage: null,
  productImage: null,
  storyPrompt: '',
  selectedStyle: 'comic',
  
  comicPanels: [],
  currentVideo: null,
  
  isGenerating: false,
  isEditingPanel: null,
  editPrompt: '',
  
  apiUsage: {
    imagesGenerated: 0,
    editsPerformed: 0,
    videosCreated: 0,
    dailyLimit: 200
  },
  
  cache: new Map(),

  // Setters
  setCharacterImage: (image) => set({ characterImage: image }),
  setProductImage: (image) => set({ productImage: image }),
  setStoryPrompt: (prompt) => set({ storyPrompt: prompt }),
  setSelectedStyle: (style) => set({ selectedStyle: style }),
  setEditPrompt: (prompt) => set({ editPrompt: prompt }),

  // Comic generation
  generateComic: async () => {
    const { storyPrompt, characterImage, productImage, selectedStyle, canGenerateMore, setCachedResult, getCachedResult } = get()
    
    if (!storyPrompt.trim()) {
      throw new Error('Please enter a story prompt')
    }
    
    if (!canGenerateMore()) {
      throw new Error('Daily API limit reached. Try again tomorrow.')
    }

    set({ isGenerating: true, comicPanels: [] })

    try {
      // Check cache first
      const cacheKey = `comic_${storyPrompt}_${selectedStyle}_${characterImage}_${productImage}`
      const cachedResult = getCachedResult(cacheKey)
      
      if (cachedResult) {
        const cachedPanels = JSON.parse(cachedResult)
        set({ comicPanels: cachedPanels, isGenerating: false })
        return
      }

      // Generate story parts
      const storyParts = generateStoryParts(storyPrompt)
      const panels: ComicPanel[] = []
      
      // Character and product context
      const characterDesc = characterImage ? 'same character as reference image' : 'consistent main character'
      const productDesc = productImage ? ', featuring the product from reference image naturally integrated' : ''
      
      // Generate panels
      for (let i = 0; i < 4; i++) {
        const panelPrompt = `${selectedStyle} style comic panel, ${characterDesc}${productDesc}, panel ${i + 1} of 4: ${storyParts[i]}, cinematic graphic novel style, soft rim lighting, medium shot, consistent visual style and lighting`
        
        console.log(`🎨 Generating panel ${i + 1}:`, panelPrompt)
        
        const result = await aiService.generateImage({
          prompt: panelPrompt,
          width: 512,
          height: 512
        })
        
        panels.push({
          id: `panel_${i + 1}`,
          url: result.url,
          prompt: panelPrompt,
          position: {
            x: 100 + (i % 2) * 220,
            y: 100 + Math.floor(i / 2) * 220
          }
        })
      }
      
      // Cache the result
      setCachedResult(cacheKey, JSON.stringify(panels))
      
      // Update state
      set(state => ({
        comicPanels: panels,
        isGenerating: false,
        apiUsage: {
          ...state.apiUsage,
          imagesGenerated: state.apiUsage.imagesGenerated + 4
        }
      }))
      
    } catch (error) {
      set({ isGenerating: false })
      throw error
    }
  },

  // Panel regeneration
  regeneratePanel: async (panelId, customPrompt) => {
    const { comicPanels, canGenerateMore } = get()
    
    if (!canGenerateMore()) {
      throw new Error('Daily API limit reached')
    }
    
    const panelIndex = comicPanels.findIndex(p => p.id === panelId)
    if (panelIndex === -1) return
    
    set({ isGenerating: true })
    
    try {
      const originalPanel = comicPanels[panelIndex]
      const promptToUse = customPrompt || originalPanel.prompt
      
      const result = await aiService.generateImage({
        prompt: promptToUse,
        width: 512,
        height: 512
      })
      
      const updatedPanels = [...comicPanels]
      updatedPanels[panelIndex] = {
        ...originalPanel,
        url: result.url,
        prompt: promptToUse
      }
      
      set(state => ({
        comicPanels: updatedPanels,
        isGenerating: false,
        apiUsage: {
          ...state.apiUsage,
          imagesGenerated: state.apiUsage.imagesGenerated + 1
        }
      }))
      
    } catch (error) {
      set({ isGenerating: false })
      throw error
    }
  },

  // Panel editing
  startEditingPanel: (panelId, currentPrompt) => {
    set({ isEditingPanel: panelId, editPrompt: currentPrompt })
  },

  cancelEditing: () => {
    set({ isEditingPanel: null, editPrompt: '' })
  },

  applyEdit: async () => {
    const { isEditingPanel, editPrompt, comicPanels, canGenerateMore } = get()
    
    if (!isEditingPanel || !editPrompt.trim()) return
    if (!canGenerateMore()) {
      throw new Error('Daily API limit reached')
    }
    
    const panel = comicPanels.find(p => p.id === isEditingPanel)
    if (!panel) return
    
    set({ isGenerating: true })
    
    try {
      const result = await aiService.editWithWords({
        imageUrl: panel.url,
        editPrompt: editPrompt
      })
      
      const updatedPanels = comicPanels.map(p => 
        p.id === isEditingPanel 
          ? { ...p, url: result, prompt: editPrompt }
          : p
      )
      
      set(state => ({
        comicPanels: updatedPanels,
        isGenerating: false,
        isEditingPanel: null,
        editPrompt: '',
        apiUsage: {
          ...state.apiUsage,
          editsPerformed: state.apiUsage.editsPerformed + 1
        }
      }))
      
    } catch (error) {
      set({ isGenerating: false })
      throw error
    }
  },

  // Video generation
  generateVideo: async (narrationText) => {
    const { comicPanels, storyPrompt, canGenerateMore } = get()
    
    if (comicPanels.length === 0) {
      throw new Error('Generate a comic first!')
    }
    
    if (!canGenerateMore()) {
      throw new Error('Daily API limit reached')
    }
    
    set({ isGenerating: true })
    
    try {
      const panelUrls = comicPanels.map(p => p.url)
      const textToNarrate = narrationText || storyPrompt
      
      const videoUrl = await aiService.generateVideoFromPanels({
        panelUrls,
        narrationText: textToNarrate,
        duration: 15
      })
      
      set(state => ({
        currentVideo: videoUrl,
        isGenerating: false,
        apiUsage: {
          ...state.apiUsage,
          videosCreated: state.apiUsage.videosCreated + 1
        }
      }))
      
    } catch (error) {
      set({ isGenerating: false })
      throw error
    }
  },

  // Utility functions
  resetStory: () => {
    set({
      characterImage: null,
      productImage: null,
      storyPrompt: '',
      comicPanels: [],
      currentVideo: null,
      isEditingPanel: null,
      editPrompt: ''
    })
  },

  canGenerateMore: () => {
    const { apiUsage } = get()
    const totalUsed = apiUsage.imagesGenerated + apiUsage.editsPerformed + (apiUsage.videosCreated * 5)
    return totalUsed < apiUsage.dailyLimit
  },

  getCachedResult: (prompt) => {
    const { cache } = get()
    return cache.get(prompt) || null
  },

  setCachedResult: (prompt, result) => {
    set(state => {
      const newCache = new Map(state.cache)
      newCache.set(prompt, result)
      return { cache: newCache }
    })
  },

  // Export functions
  exportComicAsPNG: async () => {
    // TODO: Implement comic export as single PNG
    return 'comic_export.png'
  },

  exportStoryData: () => {
    const { characterImage, productImage, storyPrompt, selectedStyle, comicPanels, currentVideo } = get()
    return {
      characterImage,
      productImage,
      storyPrompt,
      selectedStyle,
      comicPanels,
      currentVideo,
      timestamp: Date.now()
    }
  }
}))