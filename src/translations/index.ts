import { Language } from '@store/languageStore'
import { apiKeysTranslations } from './apiKeysTranslations'

export interface Translations {
  // Language switcher
  language: {
    en: string
    zhTW: string
    es: string
    ja: string
    fr: string
  }
  
  // AI Panel
  aiPanel: {
    title: string
    tabs: {
      storyMaker: string
      generate: string
    }
    generate: {
      tabs: {
        generate: string
        enhance: string
        video: string
      }
      validation: {
        generateMessage: string
        styleMessage: string
        mergeMessage: string
      }
      processing: {
        analyzing: string
        composing: string
        rendering: string
        finalizing: string
      }
      templates: {
        title: string
        withSelection: string
        categories: {
          all: string
          creative: string
          professional: string
          fun: string
        }
        items: {
          // Creative
          figurine: {
            title: string
            description: string
          }
          handDrawn: {
            title: string
            description: string
          }
          crossSection: {
            title: string
            description: string
          }
          restoration: {
            title: string
            description: string
          }
          // Professional
          idPhoto: {
            title: string
            description: string
          }
          product: {
            title: string
            description: string
          }
          interior: {
            title: string
            description: string
          }
          marketing: {
            title: string
            description: string
          }
          // Fun
          tryOn: {
            title: string
            description: string
          }
          timeTravel: {
            title: string
            description: string
          }
          petAdventure: {
            title: string
            description: string
          }
          ingredients: {
            title: string
            description: string
          }
        }
        applied: string
      }
      placeholder: string
      generateButton: string
      generating: string
      imageToImageMode: string
      imageToImageDescription: string
      quickEnhancements: string
      enhancementItems: string[]
      selectedImages: string
      invalidForTab: string
    }
    enhance: {
      selectImages: string
      selectImagesDescription: string
      enhancementReady: string
      willBeProcessed: string
      enhancementOptions: string
      aiUpscale: string
      upscaleDescription: string
      backgroundRemoval: string
      backgroundRemovalDescription: string
      qualityEnhancement: string
      qualityEnhancementDescription: string
      enhancementSummary: string
      upscaleTo: string
      removeBackground: string
      enhancedQuality: string
      processing: string
      enhanceButton: string
      enhancing: string
      resolutions: {
        '2x': string
        '4x': string
        '8x': string
      }
    }
    selected: string
    selectedFromCanvas: string
    invalidFor: string
    selectedImagesNote: string
    generateBasedOn: string
    selectedImage: string
    generateWithGemini: string
    imageToImageMode: string
    active: string
    selectedImagesCombined: string
    useTemplate: string
    close: string
    image: string
    images: string
    storyMaker: {
      title: string
      description: string
      styleLabel: string
      characterLabel: string
      productLabel: string
      storyPromptLabel: string
      generateButton: string
      useFromCanvas: string
      uploadImage: string
      generating: string
      placeholder: string
      styles: {
        comic: string
        manga: string
        watercolor: string
        oil: string
        sketch: string
      }
      characterSection: {
        title: string
        description: string
        required: string
        optional: string
      }
      productSection: {
        title: string
        description: string
        optional: string
      }
      storySection: {
        title: string
        description: string
        examples: string[]
      }
      generatingPanels: string
      panelComplete: string
      storyComplete: string
      errors: {
        noStory: string
        characterRequired: string
        generationFailed: string
      }
    }
  }
  
  // Settings Panel
  settings: {
    title: string
    apiConfiguration: string
    importantNotice: {
      title: string
      description: string
    }
    apiKeys: {
      title: string
      services: {
        openai: { name: string; description: string; placeholder: string }
        anthropic: { name: string; description: string; placeholder: string }
        falai: { name: string; description: string; placeholder: string }
        replicate: { name: string; description: string; placeholder: string }
        stabilityai: { name: string; description: string; placeholder: string }
      }
      required: string
      optional: string
      valid: string
      invalid: string
      current: string
      save: string
      openSettings: string
      rateLimitExceeded: string
    }
    gettingStarted: {
      title: string
      steps: string[]
    }
    security: {
      title: string
      benefits: string[]
    }
  }

  // Loading Indicator
  loadingIndicator: {
    stages: {
      analyzing: {
        text: string
        description: string
      }
      composing: {
        text: string
        description: string
      }
      rendering: {
        text: string
        description: string
      }
      finalizing: {
        text: string
        description: string
      }
    }
  }

  // Nano Banana Prompt Input
  nanoBananaPrompt: {
    title: string
    selectedObjects: string
    stabilityTip: {
      title: string
      description: string
    }
    inputModes: {
      text: string
      voice: string
    }
    voiceNotSupported: string
    voiceStatus: {
      listening: string
      clickToStart: string
    }
    promptLabel: string
    promptPlaceholder: string
    quickExamples: string
    examples: string[]
    submit: string
    cancel: string
  }

  // Context Menu
  contextMenu: {
    header: string
    playVideo: string
    aiSmartCompose: string
    creativeBlend: string
    generateSimilar: string
    nanoBananaPrompt: string
    saveSelected: string
    duplicate: string
    duplicateMultiple: string
    delete: string
    deleteMultiple: string
  }

  // Common
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    confirm: string
    save: string
    delete: string
    edit: string
    close: string
    settings: string
  }

  // Alert Messages
  alerts: {
    imageGenerationFailed: string
    mergeSelectMinImages: string
    mergeEnterInstructions: string
    mergeFailed: string
    styleSelectImage: string
    styleEnterDescription: string
    styleTransferComplete: string
    styleTransferFailed: string
    comicGenerationFailed: string
    enterEditInstructions: string
    generateComicFirst: string
    panelEditingFailed: string
    storyGenerationFailed: string
    selectImagesFirst: string
    magicEraserSelectImage: string
    magicEraserComplete: string
    magicEraserFailed: string
    backgroundRemovalSelectImage: string
    backgroundRemovalComplete: string
    backgroundRemovalFailed: string
    avatarSelectPhoto: string
    avatarGenerationFailed: string
    mergedImagesSuccess: string
  }
}

// English translations
const en: Translations = {
  language: {
    en: 'English',
    zhTW: '繁體中文',
    es: 'Español',
    ja: '日本語',
    fr: 'Français'
  },
  aiPanel: {
    title: 'AI Assistant',
    tabs: {
      storyMaker: 'Story Maker',
      generate: 'Generate',
    },
    generate: {
      tabs: {
        generate: 'Generate',
        enhance: 'Enhance',
        video: 'Video'
      },
      validation: {
        generateMessage: 'Generate supports any number of reference images or none for fresh creation',
        styleMessage: 'Style transfer requires exactly 1 image',
        mergeMessage: 'Merge requires 2+ images'
      },
      processing: {
        analyzing: 'Analyzing your request...',
        composing: 'Creating beautiful compositions...',
        rendering: 'Rendering high-quality images...',
        finalizing: 'Adding final touches...'
      },
      templates: {
        title: 'Popular Nano Banana Templates (Click to use)',
        withSelection: '+ Selected Images',
        categories: {
          all: 'All',
          creative: '🎨 Creative',
          professional: '💼 Professional',
          fun: '🎮 Fun'
        },
        items: {
          figurine: {
            title: '3D Figurine',
            description: 'Desktop model'
          },
          handDrawn: {
            title: 'Hand-drawn Process',
            description: 'Sketch to final'
          },
          crossSection: {
            title: '3D Cross-section',
            description: 'Internal structure'
          },
          restoration: {
            title: 'Photo Restoration',
            description: 'Colorize & repair'
          },
          idPhoto: {
            title: 'Professional ID',
            description: 'Business portrait'
          },
          product: {
            title: 'Product Shot',
            description: 'E-commerce photo'
          },
          interior: {
            title: 'Interior Design',
            description: 'Space makeover'
          },
          marketing: {
            title: 'Marketing Material',
            description: 'Social media'
          },
          tryOn: {
            title: 'Virtual Try-on',
            description: 'Outfit swap'
          },
          timeTravel: {
            title: 'Time Travel',
            description: 'Different eras'
          },
          petAdventure: {
            title: 'Pet Adventures',
            description: 'Fun scenarios'
          },
          ingredients: {
            title: 'Food Breakdown',
            description: 'Recipe guide'
          }
        },
        applied: '✨ Template applied! You can generate directly or modify the prompt above'
      },
      placeholder: 'Describe what you want to generate...',
      generateButton: 'Generate with Nano Banana',
      generating: 'Generating with Nano Banana...',
      imageToImageMode: '🎨 Image-to-Image Mode',
      imageToImageDescription: 'Your selected images will be combined with your prompt/template to generate new images.',
      quickEnhancements: '✨ Quick Enhancements (Click to toggle)',
      enhancementItems: ['viral meme style', '4K ultra HD', 'cinematic lighting', 'trending on artstation', 'octane render'],
      selectedImages: 'images selected from canvas',
      invalidForTab: 'Invalid for'
    },
    enhance: {
      selectImages: 'Select Images to Enhance',
      selectImagesDescription: 'Please select one or more images from the canvas to enhance',
      enhancementReady: 'Enhancement Ready',
      willBeProcessed: 'Your selected images will be processed and enhanced with AI technology.',
      enhancementOptions: 'Enhancement Options',
      aiUpscale: 'AI Upscale',
      upscaleDescription: 'Increase image resolution using AI upscaling technology',
      backgroundRemoval: 'Background Removal',
      backgroundRemovalDescription: 'Automatically remove background and create transparent PNG',
      qualityEnhancement: 'Quality Enhancement',
      qualityEnhancementDescription: 'Improve overall image quality, reduce noise and artifacts',
      enhancementSummary: 'Enhancement Summary',
      upscaleTo: 'Upscale to',
      removeBackground: 'Remove background (transparent PNG)',
      enhancedQuality: 'Enhanced quality and noise reduction',
      processing: 'Processing',
      enhanceButton: 'Enhance Images',
      enhancing: 'Enhancing...',
      resolutions: {
        '2x': '2x Resolution',
        '4x': '4x Resolution',
        '8x': '8x Resolution'
      }
    },
    selected: 'selected',
    selectedFromCanvas: 'selected from canvas',
    invalidFor: 'Invalid for',
    selectedImagesNote: 'Selected images will be automatically included in the AI request',
    generateBasedOn: 'Generate new images based on your',
    selectedImage: 'selected image',
    generateWithGemini: 'Generate images with Gemini 2.5 Flash (Nano Banana)',
    imageToImageMode: 'Image-to-Image Mode',
    active: 'ACTIVE',
    selectedImagesCombined: 'Your selected images will be combined with your prompt/template to generate new images.',
    useTemplate: 'Use Template',
    close: 'Close',
    image: 'image',
    images: 'images',
    storyMaker: {
      title: 'Story Maker',
      description: 'Create 4-panel comic stories with consistent characters',
      styleLabel: 'Art Style',
      characterLabel: 'Main Character',
      productLabel: 'Featured Product',
      storyPromptLabel: 'Story Concept',
      generateButton: 'Generate 4-Panel Comic',
      useFromCanvas: 'Use from Canvas',
      uploadImage: 'Upload Image',
      generating: 'Generating panel',
      placeholder: 'Describe your story in one sentence...\n\nExamples:\n• A coffee shop encounter on a snowy Christmas night\n• Finding the perfect gift during holiday shopping\n• A friendship that blooms in a cozy bookstore',
      styles: {
        comic: 'Comic Book',
        manga: 'Manga Style',
        watercolor: 'Watercolor',
        oil: 'Oil Painting',
        sketch: 'Pencil Sketch'
      },
      characterSection: {
        title: 'Main Character',
        description: 'Upload or select the main character for your story',
        required: 'Required',
        optional: 'Optional'
      },
      productSection: {
        title: 'Featured Product',
        description: 'Add a product to feature in your story (optional)',
        optional: 'Optional'
      },
      storySection: {
        title: 'Story Concept',
        description: 'Describe your story idea in one sentence',
        examples: [
          'A coffee shop encounter on a snowy Christmas night',
          'Finding the perfect gift during holiday shopping',
          'A friendship that blooms in a cozy bookstore'
        ]
      },
      generatingPanels: 'Generating comic panels...',
      panelComplete: 'Panel completed',
      storyComplete: 'Comic story completed!',
      errors: {
        noStory: 'Please enter a story prompt first!',
        characterRequired: 'Please upload or select a character image!',
        generationFailed: 'Comic generation failed. Please try again.'
      }
    },
  },
  loadingIndicator: {
    stages: {
      analyzing: {
        text: 'Analyzing...',
        description: 'Understanding your creative needs'
      },
      composing: {
        text: 'Composing...',
        description: 'Designing creative concepts'
      },
      rendering: {
        text: 'Rendering...',
        description: 'Drawing beautiful images'
      },
      finalizing: {
        text: 'Finalizing...',
        description: 'Final touches'
      }
    }
  },
  nanoBananaPrompt: {
    title: '🎤 Nano Banana Prompt Input',
    selectedObjects: 'objects selected',
    stabilityTip: {
      title: 'Object Stability Tip',
      description: 'We recommend including phrases like "keep main objects unchanged" or "maintain original features" in your prompt to ensure all important elements like people, furniture, and products remain stable and consistent.'
    },
    inputModes: {
      text: '📝 Text Input',
      voice: '🎤 Voice Input'
    },
    voiceNotSupported: '⚠️ Your browser does not support voice recognition',
    voiceStatus: {
      listening: '🎤 Listening, please speak...',
      clickToStart: 'Click the microphone to start voice input'
    },
    promptLabel: 'Prompt Content',
    promptPlaceholder: 'For example: Change the background to a beach, keep main objects unchanged; Move the sofa to the living room, maintain sofa features...',
    quickExamples: 'Quick Examples',
    examples: [
      'Change the background to a beach, keep main objects unchanged',
      'Move the sofa to the living room, maintain sofa features',
      'Add stars to the sky, keep all objects consistent',
      'Change to snowy background, furniture features unchanged',
      'Make the room brighter, keep items as they are',
      'Change to wooden floor, object appearance stable'
    ],
    submit: 'Execute Command',
    cancel: 'Cancel'
  },
  contextMenu: {
    header: '✨ AI Actions',
    playVideo: '🎬 Play Video',
    aiSmartCompose: '🧠 AI Smart Compose',
    creativeBlend: '✨ Creative Blend',
    generateSimilar: '🌟 Generate Similar',
    nanoBananaPrompt: '🎤 Nano Banana Prompt Input',
    saveSelected: 'Save Selected',
    duplicate: 'Duplicate',
    duplicateMultiple: 'Duplicate',
    delete: 'Delete',
    deleteMultiple: 'Delete'
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    settings: 'Settings'
  },
  alerts: {
    imageGenerationFailed: 'Image generation failed: ',
    mergeSelectMinImages: 'Please select at least 2 images to merge',
    mergeEnterInstructions: 'Please enter merge instructions, e.g., "Blend these images into an artistic collage"',
    mergeFailed: 'Image merging failed: ',
    styleSelectImage: 'Please select an image to apply style',
    styleEnterDescription: 'Please enter style description, e.g., "Van Gogh Starry Night style"',
    styleTransferComplete: 'Style transfer complete!',
    styleTransferFailed: 'Style transfer failed: ',
    comicGenerationFailed: 'Comic generation failed. Please try again!',
    enterEditInstructions: 'Please enter edit instructions!',
    generateComicFirst: 'Generate a comic first!',
    panelEditingFailed: 'Panel editing failed. Please try again!',
    storyGenerationFailed: 'Story idea generation failed. Please try again!',
    selectImagesFirst: 'Please select images on the canvas or generate a comic first!',
    magicEraserSelectImage: 'Please select an image to use Magic Eraser',
    magicEraserComplete: '🪄 Magic Eraser complete! Unwanted objects removed.',
    magicEraserFailed: 'Magic eraser failed: ',
    backgroundRemovalSelectImage: 'Please select an image to remove background',
    backgroundRemovalComplete: '✂️ Background removed successfully!',
    backgroundRemovalFailed: 'Background removal failed: ',
    avatarSelectPhoto: 'Please select a photo to generate avatar',
    avatarGenerationFailed: 'Avatar generation failed: ',
    mergedImagesSuccess: 'Successfully merged {count} images!'
  },
  ...apiKeysTranslations.en
}

// Traditional Chinese translations
const zhTW: Translations = {
  language: {
    en: 'English',
    zhTW: '繁體中文',
    es: 'Español',
    ja: '日本語',
    fr: 'Français'
  },
  aiPanel: {
    title: 'AI 助手',
    tabs: {
      storyMaker: '故事創作',
      generate: '生成',
    },
    generate: {
      tabs: {
        generate: '生成',
        enhance: '增強',
        video: '視頻'
      },
      validation: {
        generateMessage: '生成功能支援任意數量的參考圖片，或無圖片全新創作',
        styleMessage: '風格轉換需要恰好 1 張圖片',
        mergeMessage: '合併功能需要 2 張以上圖片'
      },
      processing: {
        analyzing: '正在分析您的需求...',
        composing: '正在創作精美構圖...',
        rendering: '正在渲染高品質圖像...',
        finalizing: '正在添加最後潤飾...'
      },
      templates: {
        title: 'Nano Banana 熱門模板 (點擊使用)',
        withSelection: '+ 已選圖片',
        categories: {
          all: '全部',
          creative: '🎨 創意轉換',
          professional: '💼 專業商用',
          fun: '🎮 趣味玩法'
        },
        items: {
          figurine: {
            title: '3D 模型公仔',
            description: '桌面擺飾模型'
          },
          handDrawn: {
            title: '手繪過程',
            description: '草稿到完稿'
          },
          crossSection: {
            title: '3D 剖面圖',
            description: '內部結構解析'
          },
          restoration: {
            title: '老照片修復',
            description: '上色與修復'
          },
          idPhoto: {
            title: '專業證件照',
            description: '商務形象照'
          },
          product: {
            title: '產品攝影',
            description: '電商專業照'
          },
          interior: {
            title: '室內設計',
            description: '空間改造'
          },
          marketing: {
            title: '行銷素材',
            description: '社群媒體圖'
          },
          tryOn: {
            title: '虛擬試穿',
            description: '服裝換搭'
          },
          timeTravel: {
            title: '時空旅行',
            description: '不同年代造型'
          },
          petAdventure: {
            title: '寵物冒險',
            description: '趣味場景'
          },
          ingredients: {
            title: '食材分解',
            description: '料理教學'
          }
        },
        applied: '✨ 模板已套用！可以直接生成或在上方輸入框中修改提示詞'
      },
      placeholder: '描述您想要生成的內容...',
      generateButton: '使用 Nano Banana 生成',
      generating: '正在使用 Nano Banana 生成...',
      imageToImageMode: '🎨 圖生圖模式',
      imageToImageDescription: '您選擇的圖片將與提示詞/模板結合來生成新圖片。',
      quickEnhancements: '✨ 快速增強 (點擊切換)',
      enhancementItems: ['病毒迷因風格', '4K 超高清', '電影級打光', '藝術站熱門', 'Octane 渲染'],
      selectedImages: '張圖片已從畫布選取',
      invalidForTab: '不適用於'
    },
    enhance: {
      selectImages: '選擇要增強的圖片',
      selectImagesDescription: '請從畫布選擇一張或多張圖片進行增強',
      enhancementReady: '增強準備就緒',
      willBeProcessed: '您選擇的圖片將使用 AI 技術進行處理和增強。',
      enhancementOptions: '增強選項',
      aiUpscale: 'AI 放大',
      upscaleDescription: '使用 AI 放大技術提升圖片解析度',
      backgroundRemoval: '背景移除',
      backgroundRemovalDescription: '自動移除背景並創建透明 PNG',
      qualityEnhancement: '品質增強',
      qualityEnhancementDescription: '提升整體圖片品質，減少噪點和瑕疵',
      enhancementSummary: '增強摘要',
      upscaleTo: '放大至',
      removeBackground: '移除背景 (透明 PNG)',
      enhancedQuality: '增強品質和降噪',
      processing: '處理',
      enhanceButton: '增強圖片',
      enhancing: '增強中...',
      resolutions: {
        '2x': '2 倍解析度',
        '4x': '4 倍解析度',
        '8x': '8 倍解析度'
      }
    },
    selected: '已選擇',
    selectedFromCanvas: '從畫布選擇',
    invalidFor: '不適用於',
    selectedImagesNote: '選擇的圖片將自動包含在 AI 請求中',
    generateBasedOn: '基於您的',
    selectedImage: '選擇的圖片',
    generateWithGemini: '使用 Gemini 2.5 Flash 生成圖片 (Nano Banana)',
    imageToImageMode: '圖像到圖像模式',
    active: '啟用',
    selectedImagesCombined: '您選擇的圖片將與提示詞/模板結合來生成新圖片。',
    useTemplate: '使用模板',
    close: '關閉',
    image: '圖片',
    images: '圖片',
    storyMaker: {
      title: '故事創作',
      description: '創建具有一致角色的四格漫畫故事',
      styleLabel: '藝術風格',
      characterLabel: '主要角色',
      productLabel: '特色產品',
      storyPromptLabel: '故事概念',
      generateButton: '生成四格漫畫',
      useFromCanvas: '從畫布使用',
      uploadImage: '上傳圖片',
      generating: '正在生成分鏡',
      placeholder: '用一句話描述您的故事...\n\n範例：\n• 雪夜中的咖啡店邂逅\n• 假期購物中尋找完美禮物\n• 在溫馨書店中綻放的友誼',
      styles: {
        comic: '漫畫風格',
        manga: '日式漫畫',
        watercolor: '水彩畫',
        oil: '油畫',
        sketch: '鉛筆素描'
      },
      characterSection: {
        title: '主要角色',
        description: '上傳或選擇故事的主要角色',
        required: '必填',
        optional: '選填'
      },
      productSection: {
        title: '特色產品',
        description: '添加要在故事中展示的產品（選填）',
        optional: '選填'
      },
      storySection: {
        title: '故事概念',
        description: '用一句話描述您的故事想法',
        examples: [
          '雪夜中的咖啡店邂逅',
          '假期購物中尋找完美禮物',
          '在溫馨書店中綻放的友誼'
        ]
      },
      generatingPanels: '正在生成漫畫分鏡...',
      panelComplete: '分鏡完成',
      storyComplete: '漫畫故事完成！',
      errors: {
        noStory: '請先輸入故事提示！',
        characterRequired: '請上傳或選擇角色圖片！',
        generationFailed: '漫畫生成失敗，請重試。'
      }
    },
  },
  loadingIndicator: {
    stages: {
      analyzing: {
        text: '分析中...',
        description: '理解您的創意需求'
      },
      composing: {
        text: '構思中...',
        description: '設計創意概念'
      },
      rendering: {
        text: '生成中...',
        description: '繪製精美圖像'
      },
      finalizing: {
        text: '完成中...',
        description: '最後潤飾'
      }
    }
  },
  nanoBananaPrompt: {
    title: '🎤 Nano Banana 提示詞輸入',
    selectedObjects: '個物件已選擇',
    stabilityTip: {
      title: '物件穩定性提示',
      description: '建議在指令中加入「保持主要物件不變」、「維持原本特徵」等字句，確保人物、傢具、產品等所有重要元素的特徵穩定一致。'
    },
    inputModes: {
      text: '📝 文字輸入',
      voice: '🎤 語音輸入'
    },
    voiceNotSupported: '⚠️ 您的瀏覽器不支援語音識別功能',
    voiceStatus: {
      listening: '🎤 正在聆聽中，請說話...',
      clickToStart: '點擊麥克風開始語音輸入'
    },
    promptLabel: '指令內容',
    promptPlaceholder: '例如：把背景換成海灘，保持主要物件不變、讓沙發移到客廳，維持沙發特徵...',
    quickExamples: '快速範例',
    examples: [
      '把背景換成海灘，保持主要物件不變',
      '讓沙發移到客廳，維持沙發特徵',
      '加入星星到天空，所有物件保持一致',
      '換成雪景背景，傢具特徵不變',
      '讓房間更明亮，保持物品原貌',
      '改成木質地板，物件外觀穩定'
    ],
    submit: '執行指令',
    cancel: '取消'
  },
  contextMenu: {
    header: '✨ AI 動作',
    playVideo: '🎬 播放影片',
    aiSmartCompose: '🧠 AI 智能合成',
    creativeBlend: '✨ 創意混合',
    generateSimilar: '🌟 生成相似內容',
    nanoBananaPrompt: '🎤 Nano Banana 提示詞輸入',
    saveSelected: '儲存已選擇',
    duplicate: '複製',
    duplicateMultiple: '複製',
    delete: '刪除',
    deleteMultiple: '刪除'
  },
  common: {
    loading: '載入中...',
    error: '錯誤',
    success: '成功',
    cancel: '取消',
    confirm: '確認',
    save: '儲存',
    delete: '刪除',
    edit: '編輯',
    close: '關閉',
    settings: '設定'
  },
  alerts: {
    imageGenerationFailed: '圖片生成失敗：',
    mergeSelectMinImages: '請選擇至少 2 張圖片進行合併',
    mergeEnterInstructions: '請輸入合併指令，例如：「將這些圖片融合成藝術拼貼」',
    mergeFailed: '圖片合併失敗：',
    styleSelectImage: '請選擇一張圖片來套用風格',
    styleEnterDescription: '請輸入風格描述，例如：「梵谷星夜風格」',
    styleTransferComplete: '風格轉換完成！',
    styleTransferFailed: '風格轉換失敗：',
    comicGenerationFailed: '漫畫生成失敗，請重試！',
    enterEditInstructions: '請輸入編輯指令！',
    generateComicFirst: '請先生成漫畫！',
    panelEditingFailed: '分鏡編輯失敗，請重試！',
    storyGenerationFailed: '故事構思生成失敗，請重試！',
    selectImagesFirst: '請先在畫布上選擇圖片或生成漫畫！',
    magicEraserSelectImage: '請選擇一張圖片來使用魔術橡皮擦',
    magicEraserComplete: '🪄 魔術橡皮擦完成！已移除不需要的物件。',
    magicEraserFailed: '魔術橡皮擦失敗：',
    backgroundRemovalSelectImage: '請選擇一張圖片來移除背景',
    backgroundRemovalComplete: '✂️ 背景移除成功！',
    backgroundRemovalFailed: '背景移除失敗：',
    avatarSelectPhoto: '請選擇一張照片來生成頭像',
    avatarGenerationFailed: '頭像生成失敗：',
    mergedImagesSuccess: '成功合併 {count} 張圖片！'
  },
  ...apiKeysTranslations['zh-TW']
}

// Spanish translations
const es: Translations = {
  language: {
    en: 'English',
    zhTW: '繁體中文',
    es: 'Español',
    ja: '日本語',
    fr: 'Français'
  },
  aiPanel: {
    title: 'Asistente IA',
    tabs: {
      storyMaker: 'Creador de Historias',
      generate: 'Generar',
    },
    generate: {
      tabs: {
        generate: 'Generar',
        enhance: 'Mejorar',
        video: 'Video'
      },
      validation: {
        generateMessage: 'Generar soporta cualquier número de imágenes de referencia o ninguna para creación nueva',
        styleMessage: 'Transferencia de estilo requiere exactamente 1 imagen',
        mergeMessage: 'Fusionar requiere 2+ imágenes'
      },
      processing: {
        analyzing: 'Analizando tu solicitud...',
        composing: 'Creando composiciones hermosas...',
        rendering: 'Renderizando imágenes de alta calidad...',
        finalizing: 'Añadiendo toques finales...'
      },
      templates: {
        title: 'Plantillas Populares de Nano Banana (Clic para usar)',
        withSelection: '+ Imágenes Seleccionadas',
        categories: {
          all: 'Todas',
          creative: '🎨 Creativo',
          professional: '💼 Profesional',
          fun: '🎮 Diversión'
        },
        items: {
          figurine: {
            title: 'Figura 3D',
            description: 'Modelo de escritorio'
          },
          handDrawn: {
            title: 'Proceso Dibujado',
            description: 'Boceto a final'
          },
          crossSection: {
            title: 'Sección 3D',
            description: 'Estructura interna'
          },
          restoration: {
            title: 'Restaurar Foto',
            description: 'Colorear y reparar'
          },
          idPhoto: {
            title: 'ID Profesional',
            description: 'Retrato empresarial'
          },
          product: {
            title: 'Foto de Producto',
            description: 'Foto e-commerce'
          },
          interior: {
            title: 'Diseño Interior',
            description: 'Renovación espacial'
          },
          marketing: {
            title: 'Material Marketing',
            description: 'Redes sociales'
          },
          tryOn: {
            title: 'Prueba Virtual',
            description: 'Cambio de ropa'
          },
          timeTravel: {
            title: 'Viaje en el Tiempo',
            description: 'Diferentes épocas'
          },
          petAdventure: {
            title: 'Aventuras Mascota',
            description: 'Escenas divertidas'
          },
          ingredients: {
            title: 'Desglose Comida',
            description: 'Guía de receta'
          }
        },
        applied: '✨ ¡Plantilla aplicada! Puedes generar directamente o modificar el prompt arriba'
      },
      placeholder: 'Describe lo que quieres generar...',
      generateButton: 'Generar con Nano Banana',
      generating: 'Generando con Nano Banana...',
      imageToImageMode: '🎨 Modo Imagen a Imagen',
      imageToImageDescription: 'Tus imágenes seleccionadas se combinarán con tu prompt/plantilla para generar nuevas imágenes.',
      quickEnhancements: '✨ Mejoras Rápidas (Clic para alternar)',
      enhancementItems: ['estilo meme viral', '4K ultra HD', 'iluminación cinematográfica', 'tendencia en artstation', 'render octane'],
      selectedImages: 'imágenes seleccionadas del lienzo',
      invalidForTab: 'No válido para'
    },
    enhance: {
      selectImages: 'Seleccionar Imágenes para Mejorar',
      selectImagesDescription: 'Por favor selecciona una o más imágenes del lienzo para mejorar',
      enhancementReady: 'Mejora Lista',
      willBeProcessed: 'Tus imágenes seleccionadas serán procesadas y mejoradas con tecnología IA.',
      enhancementOptions: 'Opciones de Mejora',
      aiUpscale: 'Escalado IA',
      upscaleDescription: 'Aumentar resolución de imagen usando tecnología de escalado IA',
      backgroundRemoval: 'Eliminación de Fondo',
      backgroundRemovalDescription: 'Remover automáticamente el fondo y crear PNG transparente',
      qualityEnhancement: 'Mejora de Calidad',
      qualityEnhancementDescription: 'Mejorar la calidad general de imagen, reducir ruido y artefactos',
      enhancementSummary: 'Resumen de Mejora',
      upscaleTo: 'Escalar a',
      removeBackground: 'Remover fondo (PNG transparente)',
      enhancedQuality: 'Calidad mejorada y reducción de ruido',
      processing: 'Procesando',
      enhanceButton: 'Mejorar Imágenes',
      enhancing: 'Mejorando...',
      resolutions: {
        '2x': 'Resolución 2x',
        '4x': 'Resolución 4x',
        '8x': 'Resolución 8x'
      }
    },
    selected: 'seleccionado',
    selectedFromCanvas: 'seleccionado del lienzo',
    invalidFor: 'No válido para',
    selectedImagesNote: 'Las imágenes seleccionadas se incluirán automáticamente en la solicitud de IA',
    generateBasedOn: 'Generar nuevas imágenes basadas en tu',
    selectedImage: 'imagen seleccionada',
    generateWithGemini: 'Generar imágenes con Gemini 2.5 Flash (Nano Banana)',
    imageToImageMode: 'Modo Imagen a Imagen',
    active: 'ACTIVO',
    selectedImagesCombined: 'Tus imágenes seleccionadas se combinarán con tu prompt/plantilla para generar nuevas imágenes.',
    useTemplate: 'Usar Plantilla',
    close: 'Cerrar',
    image: 'imagen',
    images: 'imágenes',
    storyMaker: {
      title: 'Creador de Historias',
      description: 'Crea historias de cómic de 4 paneles con personajes consistentes',
      styleLabel: 'Estilo Artístico',
      characterLabel: 'Personaje Principal',
      productLabel: 'Producto Destacado',
      storyPromptLabel: 'Concepto de Historia',
      generateButton: 'Generar Cómic de 4 Paneles',
      useFromCanvas: 'Usar del Lienzo',
      uploadImage: 'Subir Imagen',
      generating: 'Generando panel',
      placeholder: 'Describe tu historia en una oración...\n\nEjemplos:\n• Un encuentro en una cafetería en una noche navideña nevada\n• Encontrar el regalo perfecto durante las compras navideñas\n• Una amistad que florece en una acogedora librería',
      styles: {
        comic: 'Cómic',
        manga: 'Estilo Manga',
        watercolor: 'Acuarela',
        oil: 'Pintura al Óleo',
        sketch: 'Boceto a Lápiz'
      },
      characterSection: {
        title: 'Personaje Principal',
        description: 'Sube o selecciona el personaje principal de tu historia',
        required: 'Requerido',
        optional: 'Opcional'
      },
      productSection: {
        title: 'Producto Destacado',
        description: 'Agrega un producto para destacar en tu historia (opcional)',
        optional: 'Opcional'
      },
      storySection: {
        title: 'Concepto de Historia',
        description: 'Describe tu idea de historia en una oración',
        examples: [
          'Un encuentro en una cafetería en una noche navideña nevada',
          'Encontrar el regalo perfecto durante las compras navideñas',
          'Una amistad que florece en una acogedora librería'
        ]
      },
      generatingPanels: 'Generando paneles de cómic...',
      panelComplete: 'Panel completado',
      storyComplete: '¡Historia de cómic completada!',
      errors: {
        noStory: '¡Por favor ingresa una propuesta de historia primero!',
        characterRequired: '¡Por favor sube o selecciona una imagen de personaje!',
        generationFailed: 'La generación del cómic falló. Por favor intenta de nuevo.'
      }
    },
  },
  loadingIndicator: {
    stages: {
      analyzing: {
        text: 'Analizando...',
        description: 'Entendiendo tus necesidades creativas'
      },
      composing: {
        text: 'Componiendo...',
        description: 'Diseñando conceptos creativos'
      },
      rendering: {
        text: 'Renderizando...',
        description: 'Dibujando imágenes hermosas'
      },
      finalizing: {
        text: 'Finalizando...',
        description: 'Toques finales'
      }
    }
  },
  nanoBananaPrompt: {
    title: '🎤 Entrada de Comando Nano Banana',
    selectedObjects: 'objetos seleccionados',
    stabilityTip: {
      title: 'Consejo de Estabilidad de Objetos',
      description: 'Recomendamos incluir frases como "mantener objetos principales sin cambios" o "conservar características originales" en tu comando para asegurar que todos los elementos importantes como personas, muebles y productos permanezcan estables y consistentes.'
    },
    inputModes: {
      text: '📝 Entrada de Texto',
      voice: '🎤 Entrada de Voz'
    },
    voiceNotSupported: '⚠️ Tu navegador no soporta reconocimiento de voz',
    voiceStatus: {
      listening: '🎤 Escuchando, por favor habla...',
      clickToStart: 'Haz clic en el micrófono para iniciar entrada de voz'
    },
    promptLabel: 'Contenido del Comando',
    promptPlaceholder: 'Por ejemplo: Cambiar el fondo a una playa, mantener objetos principales sin cambios; Mover el sofá a la sala, conservar características del sofá...',
    quickExamples: 'Ejemplos Rápidos',
    examples: [
      'Cambiar el fondo a una playa, mantener objetos principales sin cambios',
      'Mover el sofá a la sala, conservar características del sofá',
      'Agregar estrellas al cielo, mantener todos los objetos consistentes',
      'Cambiar a fondo nevado, características de muebles sin cambios',
      'Hacer la habitación más brillante, mantener elementos como están',
      'Cambiar a piso de madera, apariencia de objetos estable'
    ],
    submit: 'Ejecutar Comando',
    cancel: 'Cancelar'
  },
  contextMenu: {
    header: '✨ Acciones IA',
    playVideo: '🎬 Reproducir Video',
    aiSmartCompose: '🧠 Composición Inteligente IA',
    creativeBlend: '✨ Mezcla Creativa',
    generateSimilar: '🌟 Generar Similar',
    nanoBananaPrompt: '🎤 Entrada de Comando Nano Banana',
    saveSelected: 'Guardar Seleccionados',
    duplicate: 'Duplicar',
    duplicateMultiple: 'Duplicar',
    delete: 'Eliminar',
    deleteMultiple: 'Eliminar'
  },
  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    settings: 'Configuración'
  },
  alerts: {
    imageGenerationFailed: 'La generación de imágenes falló: ',
    mergeSelectMinImages: 'Por favor selecciona al menos 2 imágenes para fusionar',
    mergeEnterInstructions: 'Por favor ingresa instrucciones de fusión, ej: "Mezcla estas imágenes en un collage artístico"',
    mergeFailed: 'La fusión de imágenes falló: ',
    styleSelectImage: 'Por favor selecciona una imagen para aplicar estilo',
    styleEnterDescription: 'Por favor ingresa descripción de estilo, ej: "Estilo Noche Estrellada de Van Gogh"',
    styleTransferComplete: '¡Transferencia de estilo completa!',
    styleTransferFailed: 'La transferencia de estilo falló: ',
    comicGenerationFailed: '¡La generación del cómic falló. Por favor inténtalo de nuevo!',
    enterEditInstructions: '¡Por favor ingresa instrucciones de edición!',
    generateComicFirst: '¡Genera un cómic primero!',
    panelEditingFailed: '¡La edición del panel falló. Por favor inténtalo de nuevo!',
    storyGenerationFailed: '¡La generación de historia falló. Por favor inténtalo de nuevo!',
    selectImagesFirst: '¡Por favor selecciona imágenes en el lienzo o genera un cómic primero!',
    magicEraserSelectImage: 'Por favor selecciona una imagen para usar la Goma Mágica',
    magicEraserComplete: '🪄 ¡Goma Mágica completa! Objetos no deseados eliminados.',
    magicEraserFailed: 'La goma mágica falló: ',
    backgroundRemovalSelectImage: 'Por favor selecciona una imagen para quitar el fondo',
    backgroundRemovalComplete: '✂️ ¡Fondo eliminado exitosamente!',
    backgroundRemovalFailed: 'La eliminación del fondo falló: ',
    avatarSelectPhoto: 'Por favor selecciona una foto para generar avatar',
    avatarGenerationFailed: 'La generación del avatar falló: ',
    mergedImagesSuccess: '¡Fusionadas exitosamente {count} imágenes!'
  },
  ...apiKeysTranslations.es
}

// Japanese translations
const ja: Translations = {
  language: {
    en: 'English',
    zhTW: '繁體中文',
    es: 'Español',
    ja: '日本語',
    fr: 'Français'
  },
  aiPanel: {
    title: 'AIアシスタント',
    tabs: {
      storyMaker: 'ストーリーメーカー',
      generate: '生成',
    },
    generate: {
      tabs: {
        generate: '生成',
        enhance: '強化',
        video: 'ビデオ'
      },
      validation: {
        generateMessage: '生成は任意の数の参照画像をサポート、または画像なしで新規作成',
        styleMessage: 'スタイル転送は正確に1枚の画像が必要',
        mergeMessage: 'マージには2枚以上の画像が必要'
      },
      processing: {
        analyzing: 'リクエストを分析中...',
        composing: '美しい構図を作成中...',
        rendering: '高品質画像をレンダリング中...',
        finalizing: '最終仕上げを追加中...'
      },
      templates: {
        title: 'Nano Banana 人気テンプレート（クリックで使用）',
        withSelection: '+ 選択画像',
        categories: {
          all: 'すべて',
          creative: '🎨 クリエイティブ',
          professional: '💼 プロフェッショナル',
          fun: '🎮 楽しい'
        },
        items: {
          figurine: {
            title: '3Dフィギュア',
            description: 'デスクトップモデル'
          },
          handDrawn: {
            title: '手描きプロセス',
            description: 'スケッチから完成'
          },
          crossSection: {
            title: '3D断面図',
            description: '内部構造'
          },
          restoration: {
            title: '写真修復',
            description: '着色と修復'
          },
          idPhoto: {
            title: 'プロフェッショナルID',
            description: 'ビジネスポートレート'
          },
          product: {
            title: '商品撮影',
            description: 'ECサイト写真'
          },
          interior: {
            title: 'インテリアデザイン',
            description: '空間リメイク'
          },
          marketing: {
            title: 'マーケティング素材',
            description: 'ソーシャルメディア'
          },
          tryOn: {
            title: 'バーチャル試着',
            description: '衣装チェンジ'
          },
          timeTravel: {
            title: 'タイムトラベル',
            description: '異なる時代'
          },
          petAdventure: {
            title: 'ペット冒険',
            description: '楽しいシーン'
          },
          ingredients: {
            title: '食材分解',
            description: 'レシピガイド'
          }
        },
        applied: '✨ テンプレート適用済み！直接生成するか、上のプロンプトを修正できます'
      },
      placeholder: '生成したい内容を説明してください...',
      generateButton: 'Nano Bananaで生成',
      generating: 'Nano Bananaで生成中...',
      imageToImageMode: '🎨 画像から画像モード',
      imageToImageDescription: '選択した画像がプロンプト/テンプレートと組み合わされて新しい画像を生成します。',
      quickEnhancements: '✨ クイック強化（クリックで切り替え）',
      enhancementItems: ['バイラルミームスタイル', '4K ウルトラHD', 'シネマティックライティング', 'artstation トレンド', 'octane レンダー'],
      selectedImages: '枚の画像をキャンバスから選択',
      invalidForTab: '無効：'
    },
    enhance: {
      selectImages: '強化する画像を選択',
      selectImagesDescription: 'キャンバスから強化する画像を1つ以上選択してください',
      enhancementReady: '強化準備完了',
      willBeProcessed: '選択した画像はAI技術で処理・強化されます。',
      enhancementOptions: '強化オプション',
      aiUpscale: 'AIアップスケール',
      upscaleDescription: 'AIアップスケール技術で画像解像度を向上',
      backgroundRemoval: '背景除去',
      backgroundRemovalDescription: '自動的に背景を除去し透明PNGを作成',
      qualityEnhancement: '品質強化',
      qualityEnhancementDescription: '全体的な画像品質を改善、ノイズとアーティファクトを削減',
      enhancementSummary: '強化概要',
      upscaleTo: 'アップスケール先',
      removeBackground: '背景除去（透明PNG）',
      enhancedQuality: '品質強化とノイズ削減',
      processing: '処理中',
      enhanceButton: '画像強化',
      enhancing: '強化中...',
      resolutions: {
        '2x': '2倍解像度',
        '4x': '4倍解像度',
        '8x': '8倍解像度'
      }
    },
    selected: '選択済み',
    selectedFromCanvas: 'キャンバスから選択',
    invalidFor: '無効：',
    selectedImagesNote: '選択した画像は自動的にAIリクエストに含まれます',
    generateBasedOn: 'あなたの',
    selectedImage: '選択した画像',
    generateWithGemini: 'Gemini 2.5 Flash で画像生成 (Nano Banana)',
    imageToImageMode: '画像から画像モード',
    active: 'アクティブ',
    selectedImagesCombined: '選択した画像がプロンプト/テンプレートと組み合わされて新しい画像を生成します。',
    useTemplate: 'テンプレート使用',
    close: '閉じる',
    image: '画像',
    images: '画像',
    storyMaker: {
      title: 'ストーリーメーカー',
      description: '一貫したキャラクターで4コマ漫画ストーリーを作成',
      styleLabel: 'アートスタイル',
      characterLabel: 'メインキャラクター',
      productLabel: 'フィーチャー商品',
      storyPromptLabel: 'ストーリーコンセプト',
      generateButton: '4コマ漫画生成',
      useFromCanvas: 'キャンバスから使用',
      uploadImage: '画像をアップロード',
      generating: 'パネル生成中',
      placeholder: 'ストーリーを一文で説明してください...\n\n例：\n• 雪のクリスマスの夜のコーヒーショップでの出会い\n• ホリデーショッピングで完璧なギフトを見つける\n• 居心地の良い本屋で咲く友情',
      styles: {
        comic: 'コミックブック',
        manga: 'マンガスタイル',
        watercolor: '水彩画',
        oil: '油絵',
        sketch: '鉛筆スケッチ'
      },
      characterSection: {
        title: 'メインキャラクター',
        description: 'ストーリーのメインキャラクターをアップロードまたは選択',
        required: '必須',
        optional: 'オプション'
      },
      productSection: {
        title: 'フィーチャー商品',
        description: 'ストーリーで紹介する商品を追加（オプション）',
        optional: 'オプション'
      },
      storySection: {
        title: 'ストーリーコンセプト',
        description: 'ストーリーのアイデアを一文で説明',
        examples: [
          '雪のクリスマスの夜のコーヒーショップでの出会い',
          'ホリデーショッピングで完璧なギフトを見つける',
          '居心地の良い本屋で咲く友情'
        ]
      },
      generatingPanels: 'コミックパネル生成中...',
      panelComplete: 'パネル完了',
      storyComplete: 'コミックストーリー完了！',
      errors: {
        noStory: 'まずストーリープロンプトを入力してください！',
        characterRequired: 'キャラクター画像をアップロードまたは選択してください！',
        generationFailed: 'コミック生成に失敗しました。もう一度お試しください。'
      }
    },
  },
  loadingIndicator: {
    stages: {
      analyzing: {
        text: '分析中...',
        description: '您のクリエイティブニーズを理解中'
      },
      composing: {
        text: '構成中...',
        description: 'クリエイティブコンセプトをデザイン中'
      },
      rendering: {
        text: 'レンダリング中...',
        description: '美しい画像を描いています'
      },
      finalizing: {
        text: '仕上げ中...',
        description: '最終仕上げ'
      }
    }
  },
  nanoBananaPrompt: {
    title: '🎤 Nano Banana プロンプト入力',
    selectedObjects: 'つのオブジェクトが選択されています',
    stabilityTip: {
      title: 'オブジェクト安定性のヒント',
      description: 'プロンプトに「主要オブジェクトを変更しない」や「元の特徴を維持する」などのフレーズを含めることをお勧めします。これにより、人物、家具、製品などのすべての重要な要素が安定して一貫性を保てます。'
    },
    inputModes: {
      text: '📝 テキスト入力',
      voice: '🎤 音声入力'
    },
    voiceNotSupported: '⚠️ お使いのブラウザは音声認識をサポートしていません',
    voiceStatus: {
      listening: '🎤 聞いています、話してください...',
      clickToStart: 'マイクをクリックして音声入力を開始してください'
    },
    promptLabel: 'コマンド内容',
    promptPlaceholder: '例：背景をビーチに変更、主要オブジェクトは変更しない；ソファをリビングに移動、ソファの特徴を維持...',
    quickExamples: 'クイック例',
    examples: [
      '背景をビーチに変更、主要オブジェクトは変更しない',
      'ソファをリビングに移動、ソファの特徴を維持',
      '空に星を追加、すべてのオブジェクトの一貫性を保つ',
      '雪景色の背景に変更、家具の特徴は変更しない',
      '部屋をより明るくする、アイテムはそのままに',
      '木製の床に変更、オブジェクトの外観は安定'
    ],
    submit: 'コマンド実行',
    cancel: 'キャンセル'
  },
  contextMenu: {
    header: '✨ AIアクション',
    playVideo: '🎬 動画再生',
    aiSmartCompose: '🧠 AIスマート合成',
    creativeBlend: '✨ クリエイティブブレンド',
    generateSimilar: '🌟 類似生成',
    nanoBananaPrompt: '🎤 Nano Banana プロンプト入力',
    saveSelected: '選択項目を保存',
    duplicate: '複製',
    duplicateMultiple: '複製',
    delete: '削除',
    deleteMultiple: '削除'
  },
  common: {
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
    cancel: 'キャンセル',
    confirm: '確認',
    save: '保存',
    delete: '削除',
    edit: '編集',
    close: '閉じる',
    settings: '設定'
  },
  alerts: {
    imageGenerationFailed: '画像生成に失敗しました：',
    mergeSelectMinImages: '結合するには少なくとも2つの画像を選択してください',
    mergeEnterInstructions: '結合指示を入力してください、例：「これらの画像をアートコラージュに混合」',
    mergeFailed: '画像結合に失敗しました：',
    styleSelectImage: 'スタイルを適用する画像を選択してください',
    styleEnterDescription: 'スタイル説明を入力してください、例：「ゴッホの星月夜スタイル」',
    styleTransferComplete: 'スタイル転送完了！',
    styleTransferFailed: 'スタイル転送に失敗しました：',
    comicGenerationFailed: 'コミック生成に失敗しました。もう一度試してください！',
    enterEditInstructions: '編集指示を入力してください！',
    generateComicFirst: '最初にコミックを生成してください！',
    panelEditingFailed: 'パネル編集に失敗しました。もう一度試してください！',
    storyGenerationFailed: 'ストーリー生成に失敗しました。もう一度試してください！',
    selectImagesFirst: 'キャンバス上の画像を選択するか、最初にコミックを生成してください！',
    magicEraserSelectImage: 'マジック消しゴムを使用する画像を選択してください',
    magicEraserComplete: '🪄 マジック消しゴム完了！不要なオブジェクトが削除されました。',
    magicEraserFailed: 'マジック消しゴムに失敗しました：',
    backgroundRemovalSelectImage: '背景を削除する画像を選択してください',
    backgroundRemovalComplete: '✂️ 背景削除が成功しました！',
    backgroundRemovalFailed: '背景削除に失敗しました：',
    avatarSelectPhoto: 'アバターを生成する写真を選択してください',
    avatarGenerationFailed: 'アバター生成に失敗しました：',
    mergedImagesSuccess: '{count}枚の画像を正常に結合しました！'
  },
  ...apiKeysTranslations.ja
}

// French translations
const fr: Translations = {
  language: {
    en: 'English',
    zhTW: '繁體中文',
    es: 'Español',
    ja: '日本語',
    fr: 'Français'
  },
  aiPanel: {
    title: 'Assistant IA',
    tabs: {
      storyMaker: 'Créateur d\'Histoires',
      generate: 'Générer',
    },
    generate: {
      tabs: {
        generate: 'Générer',
        enhance: 'Améliorer',
        video: 'Vidéo'
      },
      validation: {
        generateMessage: 'Générer supporte n\'importe quel nombre d\'images de référence ou aucune pour une création fraîche',
        styleMessage: 'Le transfert de style nécessite exactement 1 image',
        mergeMessage: 'Fusionner nécessite 2+ images'
      },
      processing: {
        analyzing: 'Analyse de votre demande...',
        composing: 'Création de belles compositions...',
        rendering: 'Rendu d\'images haute qualité...',
        finalizing: 'Ajout des touches finales...'
      },
      templates: {
        title: 'Modèles Populaires Nano Banana (Cliquer pour utiliser)',
        withSelection: '+ Images Sélectionnées',
        categories: {
          all: 'Tous',
          creative: '🎨 Créatif',
          professional: '💼 Professionnel',
          fun: '🎮 Amusant'
        },
        items: {
          figurine: {
            title: 'Figurine 3D',
            description: 'Modèle de bureau'
          },
          handDrawn: {
            title: 'Processus Dessiné',
            description: 'Croquis au final'
          },
          crossSection: {
            title: 'Coupe 3D',
            description: 'Structure interne'
          },
          restoration: {
            title: 'Restauration Photo',
            description: 'Coloriser et réparer'
          },
          idPhoto: {
            title: 'ID Professionnel',
            description: 'Portrait d\'affaires'
          },
          product: {
            title: 'Photo Produit',
            description: 'Photo e-commerce'
          },
          interior: {
            title: 'Design Intérieur',
            description: 'Relooking espace'
          },
          marketing: {
            title: 'Matériel Marketing',
            description: 'Médias sociaux'
          },
          tryOn: {
            title: 'Essai Virtuel',
            description: 'Changement tenue'
          },
          timeTravel: {
            title: 'Voyage Temporel',
            description: 'Époques différentes'
          },
          petAdventure: {
            title: 'Aventures Animaux',
            description: 'Scènes amusantes'
          },
          ingredients: {
            title: 'Décomposition Plat',
            description: 'Guide recette'
          }
        },
        applied: '✨ Modèle appliqué! Vous pouvez générer directement ou modifier le prompt ci-dessus'
      },
      placeholder: 'Décrivez ce que vous voulez générer...',
      generateButton: 'Générer avec Nano Banana',
      generating: 'Génération avec Nano Banana...',
      imageToImageMode: '🎨 Mode Image à Image',
      imageToImageDescription: 'Vos images sélectionnées seront combinées avec votre prompt/modèle pour générer de nouvelles images.',
      quickEnhancements: '✨ Améliorations Rapides (Cliquer pour basculer)',
      enhancementItems: ['style mème viral', '4K ultra HD', 'éclairage cinématographique', 'tendance sur artstation', 'rendu octane'],
      selectedImages: 'images sélectionnées du canevas',
      invalidForTab: 'Non valide pour'
    },
    enhance: {
      selectImages: 'Sélectionner Images à Améliorer',
      selectImagesDescription: 'Veuillez sélectionner une ou plusieurs images du canevas à améliorer',
      enhancementReady: 'Amélioration Prête',
      willBeProcessed: 'Vos images sélectionnées seront traitées et améliorées avec la technologie IA.',
      enhancementOptions: 'Options d\'Amélioration',
      aiUpscale: 'Mise à l\'Échelle IA',
      upscaleDescription: 'Augmenter la résolution d\'image en utilisant la technologie de mise à l\'échelle IA',
      backgroundRemoval: 'Suppression d\'Arrière-plan',
      backgroundRemovalDescription: 'Supprimer automatiquement l\'arrière-plan et créer un PNG transparent',
      qualityEnhancement: 'Amélioration de Qualité',
      qualityEnhancementDescription: 'Améliorer la qualité générale de l\'image, réduire le bruit et les artefacts',
      enhancementSummary: 'Résumé d\'Amélioration',
      upscaleTo: 'Mise à l\'échelle vers',
      removeBackground: 'Supprimer l\'arrière-plan (PNG transparent)',
      enhancedQuality: 'Qualité améliorée et réduction du bruit',
      processing: 'Traitement',
      enhanceButton: 'Améliorer Images',
      enhancing: 'Amélioration...',
      resolutions: {
        '2x': 'Résolution 2x',
        '4x': 'Résolution 4x',
        '8x': 'Résolution 8x'
      }
    },
    selected: 'sélectionné',
    selectedFromCanvas: 'sélectionné du canevas',
    invalidFor: 'Non valide pour',
    selectedImagesNote: 'Les images sélectionnées seront automatiquement incluses dans la demande IA',
    generateBasedOn: 'Générer de nouvelles images basées sur votre',
    selectedImage: 'image sélectionnée',
    generateWithGemini: 'Générer des images avec Gemini 2.5 Flash (Nano Banana)',
    imageToImageMode: 'Mode Image vers Image',
    active: 'ACTIF',
    selectedImagesCombined: 'Vos images sélectionnées seront combinées avec votre prompt/modèle pour générer de nouvelles images.',
    useTemplate: 'Utiliser le Modèle',
    close: 'Fermer',
    image: 'image',
    images: 'images',
    storyMaker: {
      title: 'Créateur d\'Histoires',
      description: 'Créez des histoires de bande dessinée à 4 panneaux avec des personnages cohérents',
      styleLabel: 'Style Artistique',
      characterLabel: 'Personnage Principal',
      productLabel: 'Produit Vedette',
      storyPromptLabel: 'Concept d\'Histoire',
      generateButton: 'Générer BD 4 Panneaux',
      useFromCanvas: 'Utiliser du Canevas',
      uploadImage: 'Télécharger Image',
      generating: 'Génération panneau',
      placeholder: 'Décrivez votre histoire en une phrase...\n\nExemples :\n• Une rencontre dans un café par une nuit de Noël enneigée\n• Trouver le cadeau parfait pendant les achats des fêtes\n• Une amitié qui s\'épanouit dans une librairie douillette',
      styles: {
        comic: 'Bande Dessinée',
        manga: 'Style Manga',
        watercolor: 'Aquarelle',
        oil: 'Peinture à l\'Huile',
        sketch: 'Croquis au Crayon'
      },
      characterSection: {
        title: 'Personnage Principal',
        description: 'Téléchargez ou sélectionnez le personnage principal de votre histoire',
        required: 'Requis',
        optional: 'Optionnel'
      },
      productSection: {
        title: 'Produit Vedette',
        description: 'Ajoutez un produit à mettre en vedette dans votre histoire (optionnel)',
        optional: 'Optionnel'
      },
      storySection: {
        title: 'Concept d\'Histoire',
        description: 'Décrivez votre idée d\'histoire en une phrase',
        examples: [
          'Une rencontre dans un café par une nuit de Noël enneigée',
          'Trouver le cadeau parfait pendant les achats des fêtes',
          'Une amitié qui s\'épanouit dans une librairie douillette'
        ]
      },
      generatingPanels: 'Génération des panneaux de BD...',
      panelComplete: 'Panneau terminé',
      storyComplete: 'Histoire de BD terminée !',
      errors: {
        noStory: 'Veuillez d\'abord entrer une proposition d\'histoire !',
        characterRequired: 'Veuillez télécharger ou sélectionner une image de personnage !',
        generationFailed: 'La génération de la BD a échoué. Veuillez réessayer.'
      }
    },
  },
  loadingIndicator: {
    stages: {
      analyzing: {
        text: 'Analyse...',
        description: 'Compréhension de vos besoins créatifs'
      },
      composing: {
        text: 'Composition...',
        description: 'Conception de concepts créatifs'
      },
      rendering: {
        text: 'Rendu...',
        description: 'Dessin d\'images magnifiques'
      },
      finalizing: {
        text: 'Finalisation...',
        description: 'Touches finales'
      }
    }
  },
  nanoBananaPrompt: {
    title: '🎤 Saisie de Commande Nano Banana',
    selectedObjects: 'objets sélectionnés',
    stabilityTip: {
      title: 'Astuce de Stabilité d\'Objets',
      description: 'Nous recommandons d\'inclure des phrases comme "maintenir les objets principaux inchangés" ou "conserver les caractéristiques originales" dans votre commande pour assurer que tous les éléments importants comme les personnes, meubles et produits restent stables et cohérents.'
    },
    inputModes: {
      text: '📝 Saisie Texte',
      voice: '🎤 Saisie Vocale'
    },
    voiceNotSupported: '⚠️ Votre navigateur ne supporte pas la reconnaissance vocale',
    voiceStatus: {
      listening: '🎤 Écoute en cours, veuillez parler...',
      clickToStart: 'Cliquez sur le microphone pour commencer la saisie vocale'
    },
    promptLabel: 'Contenu de la Commande',
    promptPlaceholder: 'Par exemple : Changer l\'arrière-plan en plage, garder les objets principaux inchangés ; Déplacer le canapé au salon, maintenir les caractéristiques du canapé...',
    quickExamples: 'Exemples Rapides',
    examples: [
      'Changer l\'arrière-plan en plage, garder les objets principaux inchangés',
      'Déplacer le canapé au salon, maintenir les caractéristiques du canapé',
      'Ajouter des étoiles au ciel, garder tous les objets cohérents',
      'Changer en arrière-plan neigeux, caractéristiques des meubles inchangées',
      'Rendre la pièce plus lumineuse, garder les éléments comme ils sont',
      'Changer en sol en bois, apparence des objets stable'
    ],
    submit: 'Exécuter la Commande',
    cancel: 'Annuler'
  },
  contextMenu: {
    header: '✨ Actions IA',
    playVideo: '🎬 Lire Vidéo',
    aiSmartCompose: '🧠 Composition Intelligente IA',
    creativeBlend: '✨ Mélange Créatif',
    generateSimilar: '🌟 Générer Similaire',
    nanoBananaPrompt: '🎤 Saisie de Commande Nano Banana',
    saveSelected: 'Sauvegarder Sélectionnés',
    duplicate: 'Dupliquer',
    duplicateMultiple: 'Dupliquer',
    delete: 'Supprimer',
    deleteMultiple: 'Supprimer'
  },
  common: {
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    save: 'Sauvegarder',
    delete: 'Supprimer',
    edit: 'Modifier',
    close: 'Fermer',
    settings: 'Paramètres'
  },
  alerts: {
    imageGenerationFailed: 'La génération d\'image a échoué : ',
    mergeSelectMinImages: 'Veuillez sélectionner au moins 2 images à fusionner',
    mergeEnterInstructions: 'Veuillez entrer des instructions de fusion, ex : "Mélanger ces images en collage artistique"',
    mergeFailed: 'La fusion d\'images a échoué : ',
    styleSelectImage: 'Veuillez sélectionner une image pour appliquer un style',
    styleEnterDescription: 'Veuillez entrer une description de style, ex : "Style Nuit Étoilée de Van Gogh"',
    styleTransferComplete: 'Transfert de style terminé !',
    styleTransferFailed: 'Le transfert de style a échoué : ',
    comicGenerationFailed: 'La génération de BD a échoué. Veuillez réessayer !',
    enterEditInstructions: 'Veuillez entrer des instructions d\'édition !',
    generateComicFirst: 'Générez d\'abord une BD !',
    panelEditingFailed: 'L\'édition du panneau a échoué. Veuillez réessayer !',
    storyGenerationFailed: 'La génération d\'histoire a échoué. Veuillez réessayer !',
    selectImagesFirst: 'Veuillez sélectionner des images sur le canevas ou générer une BD d\'abord !',
    magicEraserSelectImage: 'Veuillez sélectionner une image pour utiliser la Gomme Magique',
    magicEraserComplete: '🪄 Gomme Magique terminée ! Objets indésirables supprimés.',
    magicEraserFailed: 'La gomme magique a échoué : ',
    backgroundRemovalSelectImage: 'Veuillez sélectionner une image pour supprimer l\'arrière-plan',
    backgroundRemovalComplete: '✂️ Arrière-plan supprimé avec succès !',
    backgroundRemovalFailed: 'La suppression de l\'arrière-plan a échoué : ',
    avatarSelectPhoto: 'Veuillez sélectionner une photo pour générer un avatar',
    avatarGenerationFailed: 'La génération d\'avatar a échoué : ',
    mergedImagesSuccess: '{count} images fusionnées avec succès !'
  },
  ...apiKeysTranslations.fr
}

// Translation map
export const translations: Record<Language, Translations> = {
  'en': en,
  'zh-TW': zhTW,
  'es': es,
  'ja': ja,
  'fr': fr
}

// Helper function to get translation
export function getTranslation(language: Language): Translations {
  return translations[language] || translations['en']
}