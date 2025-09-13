import { Language } from '@store/languageStore'

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
    storyMaker: {
      title: string
      styleLabel: string
      characterLabel: string
      productLabel: string
      storyPromptLabel: string
      generateButton: string
      useFromCanvas: string
      uploadImage: string
      generating: string
      placeholder: string
    }
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
      generate: 'Generate'
    },
    generate: {
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
    storyMaker: {
      title: 'Story Maker',
      styleLabel: 'Style',
      characterLabel: 'Character',
      productLabel: 'Product (Optional)',
      storyPromptLabel: 'Story Prompt',
      generateButton: 'Generate Comic Story',
      useFromCanvas: 'Use from Canvas',
      uploadImage: 'Upload Image',
      generating: 'Generating panel',
      placeholder: 'Enter your story idea...'
    }
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
    close: 'Close'
  }
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
      generate: '生成'
    },
    generate: {
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
    storyMaker: {
      title: '故事創作',
      styleLabel: '風格',
      characterLabel: '角色',
      productLabel: '產品（選填）',
      storyPromptLabel: '故事提示',
      generateButton: '生成漫畫故事',
      useFromCanvas: '從畫布使用',
      uploadImage: '上傳圖片',
      generating: '正在生成第',
      placeholder: '輸入您的故事想法...'
    }
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
    close: '關閉'
  }
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
      generate: 'Generar'
    },
    generate: {
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
    storyMaker: {
      title: 'Creador de Historias',
      styleLabel: 'Estilo',
      characterLabel: 'Personaje',
      productLabel: 'Producto (Opcional)',
      storyPromptLabel: 'Prompt de Historia',
      generateButton: 'Generar Historia Cómic',
      useFromCanvas: 'Usar del Lienzo',
      uploadImage: 'Subir Imagen',
      generating: 'Generando panel',
      placeholder: 'Ingresa tu idea de historia...'
    }
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
    close: 'Cerrar'
  }
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
      generate: '生成'
    },
    generate: {
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
    storyMaker: {
      title: 'ストーリーメーカー',
      styleLabel: 'スタイル',
      characterLabel: 'キャラクター',
      productLabel: '製品（オプション）',
      storyPromptLabel: 'ストーリープロンプト',
      generateButton: 'コミックストーリー生成',
      useFromCanvas: 'キャンバスから使用',
      uploadImage: '画像をアップロード',
      generating: 'パネル生成中',
      placeholder: 'ストーリーのアイデアを入力...'
    }
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
    close: '閉じる'
  }
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
      generate: 'Générer'
    },
    generate: {
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
    storyMaker: {
      title: 'Créateur d\'Histoires',
      styleLabel: 'Style',
      characterLabel: 'Personnage',
      productLabel: 'Produit (Optionnel)',
      storyPromptLabel: 'Prompt d\'Histoire',
      generateButton: 'Générer Histoire BD',
      useFromCanvas: 'Utiliser du Canevas',
      uploadImage: 'Télécharger Image',
      generating: 'Génération panneau',
      placeholder: 'Entrez votre idée d\'histoire...'
    }
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
    close: 'Fermer'
  }
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