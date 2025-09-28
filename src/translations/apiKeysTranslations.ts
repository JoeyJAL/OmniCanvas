// API Keys translations addon
export const apiKeysTranslations = {
  en: {
    settings: {
      title: 'API Configuration',
      apiConfiguration: 'AI Service Configuration',
      importantNotice: {
        title: 'Important: Use Your Own API Keys',
        description: 'This application requires you to provide your own API keys. Your keys are stored locally in your browser and never sent to our servers. At minimum, you need a Fal.ai API key to use the core features.'
      },
      apiKeys: {
        title: 'API Keys Configuration',
        services: {
          openai: {
            name: 'OpenAI',
            description: 'For GPT models and DALL-E image generation',
            placeholder: 'sk-...'
          },
          anthropic: {
            name: 'Anthropic Claude',
            description: 'For Claude AI models',
            placeholder: 'sk-ant-...'
          },
          falai: {
            name: 'Fal.ai',
            description: 'For advanced image and video generation',
            placeholder: 'Your Fal.ai API key'
          },
          replicate: {
            name: 'Replicate',
            description: 'For open-source AI models',
            placeholder: 'Your Replicate API token'
          },
          stabilityai: {
            name: 'Stability AI',
            description: 'For Stable Diffusion models',
            placeholder: 'sk-...'
          }
        },
        required: 'Required',
        optional: 'Optional',
        valid: 'Valid',
        invalid: 'Invalid',
        current: 'Current',
        save: 'Save',
        openSettings: 'Open Settings',
        rateLimitExceeded: 'Rate limit exceeded. Please wait a moment before trying again.'
      },
      gettingStarted: {
        title: 'Getting Started:',
        steps: [
          'Get your API keys from the respective platforms',
          'Required: Sign up at fal.ai for image generation',
          'Optional: Add other API keys for enhanced features',
          'Save your keys and start creating!'
        ]
      },
      security: {
        title: 'Security & Privacy',
        benefits: [
          'Your API keys are stored locally in your browser',
          'Keys are never sent to our servers',
          'You have full control over your API usage and costs',
          'Keys are obfuscated in local storage',
          'Clear your browser data to remove stored keys'
        ]
      }
    }
  },
  'zh-TW': {
    settings: {
      title: 'API 設定',
      apiConfiguration: 'AI 服務設定',
      importantNotice: {
        title: '重要：使用您自己的 API 金鑰',
        description: '此應用程式需要您提供自己的 API 金鑰。您的金鑰僅儲存在瀏覽器本地，永不傳送到我們的伺服器。至少需要 Fal.ai API 金鑰才能使用核心功能。'
      },
      apiKeys: {
        title: 'API 金鑰設定',
        services: {
          openai: {
            name: 'OpenAI',
            description: '用於 GPT 模型和 DALL-E 圖片生成',
            placeholder: 'sk-...'
          },
          anthropic: {
            name: 'Anthropic Claude',
            description: '用於 Claude AI 模型',
            placeholder: 'sk-ant-...'
          },
          falai: {
            name: 'Fal.ai',
            description: '用於進階圖片和影片生成',
            placeholder: '您的 Fal.ai API 金鑰'
          },
          replicate: {
            name: 'Replicate',
            description: '用於開源 AI 模型',
            placeholder: '您的 Replicate API 令牌'
          },
          stabilityai: {
            name: 'Stability AI',
            description: '用於 Stable Diffusion 模型',
            placeholder: 'sk-...'
          }
        },
        required: '必填',
        optional: '選填',
        valid: '有效',
        invalid: '無效',
        current: '目前',
        save: '儲存',
        openSettings: '開啟設定',
        rateLimitExceeded: '請求頻率超過限制，請稍候再試。'
      },
      gettingStarted: {
        title: '開始使用：',
        steps: [
          '從相應平台取得您的 API 金鑰',
          '必要：在 fal.ai 註冊以進行圖片生成',
          '選填：新增其他 API 金鑰以增強功能',
          '儲存您的金鑰並開始創作！'
        ]
      },
      security: {
        title: '安全與隱私',
        benefits: [
          '您的 API 金鑰儲存在瀏覽器本地',
          '金鑰永不傳送到我們的伺服器',
          '您完全控制 API 使用和費用',
          '金鑰在本地儲存中混淆處理',
          '清除瀏覽器資料即可移除儲存的金鑰'
        ]
      }
    }
  },
  es: {
    settings: {
      title: 'Configuración de API',
      apiConfiguration: 'Configuración de Servicios de IA',
      importantNotice: {
        title: 'Importante: Use Sus Propias Claves de API',
        description: 'Esta aplicación requiere que proporcione sus propias claves de API. Sus claves se almacenan localmente en su navegador y nunca se envían a nuestros servidores. Como mínimo, necesita una clave de API de Fal.ai para usar las funciones principales.'
      },
      apiKeys: {
        title: 'Configuración de Claves de API',
        services: {
          openai: {
            name: 'OpenAI',
            description: 'Para modelos GPT y generación de imágenes DALL-E',
            placeholder: 'sk-...'
          },
          anthropic: {
            name: 'Anthropic Claude',
            description: 'Para modelos de IA Claude',
            placeholder: 'sk-ant-...'
          },
          falai: {
            name: 'Fal.ai',
            description: 'Para generación avanzada de imágenes y videos',
            placeholder: 'Su clave de API de Fal.ai'
          },
          replicate: {
            name: 'Replicate',
            description: 'Para modelos de IA de código abierto',
            placeholder: 'Su token de API de Replicate'
          },
          stabilityai: {
            name: 'Stability AI',
            description: 'Para modelos Stable Diffusion',
            placeholder: 'sk-...'
          }
        },
        required: 'Requerido',
        optional: 'Opcional',
        valid: 'Válido',
        invalid: 'Inválido',
        current: 'Actual',
        save: 'Guardar',
        openSettings: 'Abrir Configuración',
        rateLimitExceeded: 'Límite de velocidad excedido. Espere un momento antes de intentar nuevamente.'
      },
      gettingStarted: {
        title: 'Primeros pasos:',
        steps: [
          'Obtenga sus claves de API de las plataformas respectivas',
          'Requerido: Regístrese en fal.ai para generación de imágenes',
          'Opcional: Agregue otras claves de API para funciones mejoradas',
          '¡Guarde sus claves y comience a crear!'
        ]
      },
      security: {
        title: 'Seguridad y Privacidad',
        benefits: [
          'Sus claves de API se almacenan localmente en su navegador',
          'Las claves nunca se envían a nuestros servidores',
          'Tiene control total sobre el uso y los costos de la API',
          'Las claves están ofuscadas en el almacenamiento local',
          'Borre los datos del navegador para eliminar las claves almacenadas'
        ]
      }
    }
  },
  ja: {
    settings: {
      title: 'API設定',
      apiConfiguration: 'AIサービス設定',
      importantNotice: {
        title: '重要：独自のAPIキーを使用してください',
        description: 'このアプリケーションでは、独自のAPIキーを提供していただく必要があります。キーはブラウザにローカルに保存され、当社のサーバーに送信されることはありません。コア機能を使用するには、最低でもFal.ai APIキーが必要です。'
      },
      apiKeys: {
        title: 'APIキー設定',
        services: {
          openai: {
            name: 'OpenAI',
            description: 'GPTモデルとDALL-E画像生成用',
            placeholder: 'sk-...'
          },
          anthropic: {
            name: 'Anthropic Claude',
            description: 'Claude AIモデル用',
            placeholder: 'sk-ant-...'
          },
          falai: {
            name: 'Fal.ai',
            description: '高度な画像・動画生成用',
            placeholder: 'あなたのFal.ai APIキー'
          },
          replicate: {
            name: 'Replicate',
            description: 'オープンソースAIモデル用',
            placeholder: 'あなたのReplicate APIトークン'
          },
          stabilityai: {
            name: 'Stability AI',
            description: 'Stable Diffusionモデル用',
            placeholder: 'sk-...'
          }
        },
        required: '必須',
        optional: 'オプション',
        valid: '有効',
        invalid: '無効',
        current: '現在',
        save: '保存',
        openSettings: '設定を開く',
        rateLimitExceeded: 'レート制限を超えました。しばらく待ってから再試行してください。'
      },
      gettingStarted: {
        title: '始め方：',
        steps: [
          '各プラットフォームからAPIキーを取得',
          '必須：画像生成のためfal.aiに登録',
          'オプション：機能強化のため他のAPIキーを追加',
          'キーを保存して作成を開始！'
        ]
      },
      security: {
        title: 'セキュリティとプライバシー',
        benefits: [
          'APIキーはブラウザにローカルに保存されます',
          'キーは当社のサーバーに送信されません',
          'APIの使用とコストを完全に制御できます',
          'キーはローカルストレージで難読化されます',
          'ブラウザデータをクリアして保存されたキーを削除'
        ]
      }
    }
  },
  fr: {
    settings: {
      title: 'Configuration API',
      apiConfiguration: 'Configuration des Services IA',
      importantNotice: {
        title: 'Important : Utilisez Vos Propres Clés API',
        description: 'Cette application nécessite que vous fournissiez vos propres clés API. Vos clés sont stockées localement dans votre navigateur et ne sont jamais envoyées à nos serveurs. Au minimum, vous avez besoin d\'une clé API Fal.ai pour utiliser les fonctionnalités principales.'
      },
      apiKeys: {
        title: 'Configuration des Clés API',
        services: {
          openai: {
            name: 'OpenAI',
            description: 'Pour les modèles GPT et la génération d\'images DALL-E',
            placeholder: 'sk-...'
          },
          anthropic: {
            name: 'Anthropic Claude',
            description: 'Pour les modèles IA Claude',
            placeholder: 'sk-ant-...'
          },
          falai: {
            name: 'Fal.ai',
            description: 'Pour la génération avancée d\'images et de vidéos',
            placeholder: 'Votre clé API Fal.ai'
          },
          replicate: {
            name: 'Replicate',
            description: 'Pour les modèles IA open source',
            placeholder: 'Votre token API Replicate'
          },
          stabilityai: {
            name: 'Stability AI',
            description: 'Pour les modèles Stable Diffusion',
            placeholder: 'sk-...'
          }
        },
        required: 'Requis',
        optional: 'Optionnel',
        valid: 'Valide',
        invalid: 'Invalide',
        current: 'Actuel',
        save: 'Sauvegarder',
        openSettings: 'Ouvrir les Paramètres',
        rateLimitExceeded: 'Limite de débit dépassée. Veuillez attendre un moment avant de réessayer.'
      },
      gettingStarted: {
        title: 'Commencer :',
        steps: [
          'Obtenez vos clés API des plateformes respectives',
          'Requis : Inscrivez-vous sur fal.ai pour la génération d\'images',
          'Optionnel : Ajoutez d\'autres clés API pour des fonctionnalités améliorées',
          'Sauvegardez vos clés et commencez à créer !'
        ]
      },
      security: {
        title: 'Sécurité et Confidentialité',
        benefits: [
          'Vos clés API sont stockées localement dans votre navigateur',
          'Les clés ne sont jamais envoyées à nos serveurs',
          'Vous avez un contrôle total sur l\'utilisation et les coûts de l\'API',
          'Les clés sont obfusquées dans le stockage local',
          'Effacez les données du navigateur pour supprimer les clés stockées'
        ]
      }
    }
  }
}