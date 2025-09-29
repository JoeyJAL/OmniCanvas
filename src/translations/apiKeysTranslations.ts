// API Keys translations addon
export const apiKeysTranslations = {
  en: {
    settings: {
      title: 'API Configuration',
      apiConfiguration: 'AI Service Configuration',
      importantNotice: {
        title: 'Important: Use Your Own Gemini API Key',
        description: 'OmniCanvas uses Google Gemini for AI image generation. Your API key is stored securely and processed through our backend for better security.'
      },
      apiKeys: {
        title: 'Gemini API Key Configuration',
        services: {
          gemini: {
            name: 'Google Gemini',
            description: 'For AI image generation and creative tools',
            placeholder: 'AIza...'
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
          'Visit Google AI Studio to get your free API key',
          'Copy your Gemini API key from the dashboard',
          'Paste it below and save your configuration',
          'Start creating amazing AI-powered content!'
        ],
        getApiKeyButton: 'Get Free Gemini API Key'
      },
      security: {
        title: 'Security & Privacy',
        benefits: [
          'Your API key is encrypted and stored locally',
          'All AI requests are processed securely through our backend',
          'You maintain full control over your API usage and costs',
          'No API keys are stored on our servers',
          'Enhanced security compared to direct frontend API calls'
        ]
      }
    }
  },
  'zh-TW': {
    settings: {
      title: 'API 設定',
      apiConfiguration: 'AI 服務設定',
      importantNotice: {
        title: '重要：使用您自己的 Gemini API 金鑰',
        description: 'OmniCanvas 使用 Google Gemini 進行 AI 圖片生成。您的 API 金鑰安全儲存並透過我們的後端處理，提供更佳的安全性。'
      },
      apiKeys: {
        title: 'Gemini API 金鑰設定',
        services: {
          gemini: {
            name: 'Google Gemini',
            description: '用於 AI 圖片生成和創意工具',
            placeholder: 'AIza...'
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
          '造訪 Google AI Studio 取得免費 API 金鑰',
          '從控制台複製您的 Gemini API 金鑰',
          '貼上並儲存您的設定',
          '開始創作令人驚艷的 AI 內容！'
        ],
        getApiKeyButton: '取得免費 Gemini API 金鑰'
      },
      security: {
        title: '安全與隱私',
        benefits: [
          '您的 API 金鑰加密儲存在本地',
          '所有 AI 請求透過我們的後端安全處理',
          '您完全控制 API 使用和費用',
          '我們的伺服器不儲存任何 API 金鑰',
          '相較於直接前端 API 呼叫提供更強化的安全性'
        ]
      }
    }
  },
  es: {
    settings: {
      title: 'Configuración de API',
      apiConfiguration: 'Configuración de Servicios de IA',
      importantNotice: {
        title: 'Importante: Use Su Propia Clave API de Gemini',
        description: 'OmniCanvas utiliza Google Gemini para la generación de imágenes con IA. Su clave API se almacena de forma segura y se procesa a través de nuestro backend para mayor seguridad.'
      },
      apiKeys: {
        title: 'Configuración de Clave API de Gemini',
        services: {
          gemini: {
            name: 'Google Gemini',
            description: 'Para generación de imágenes con IA y herramientas creativas',
            placeholder: 'AIza...'
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
          'Visite Google AI Studio para obtener su clave API gratuita',
          'Copie su clave API de Gemini desde el panel de control',
          'Péguela abajo y guarde su configuración',
          '¡Comience a crear contenido increible con IA!'
        ],
        getApiKeyButton: 'Obtener Clave API de Gemini Gratis'
      },
      security: {
        title: 'Seguridad y Privacidad',
        benefits: [
          'Su clave API se cifra y almacena localmente',
          'Todas las solicitudes de IA se procesan de forma segura a través de nuestro backend',
          'Mantiene control total sobre el uso y los costos de su API',
          'No se almacenan claves API en nuestros servidores',
          'Seguridad mejorada comparada con llamadas directas de API desde el frontend'
        ]
      }
    }
  },
  ja: {
    settings: {
      title: 'API設定',
      apiConfiguration: 'AIサービス設定',
      importantNotice: {
        title: '重要：独自のGemini APIキーを使用してください',
        description: 'OmniCanvasはGoogle Geminiを使用してAI画像生成を行います。您のAPIキーは安全に保存され、より高いセキュリティのために当社のバックエンドで処理されます。'
      },
      apiKeys: {
        title: 'Gemini APIキー設定',
        services: {
          gemini: {
            name: 'Google Gemini',
            description: 'AI画像生成とクリエイティブツール用',
            placeholder: 'AIza...'
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
          'Google AI Studioで無料APIキーを取得',
          'ダッシュボードからGemini APIキーをコピー',
          '以下に貼り付けて設定を保存',
          '素晴らしいAIコンテンツの作成を開始！'
        ],
        getApiKeyButton: '無料Gemini APIキーを取得'
      },
      security: {
        title: 'セキュリティとプライバシー',
        benefits: [
          'APIキーは暗号化されてローカルに保存されます',
          'すべてのAIリクエストは当社のバックエンドで安全に処理されます',
          'APIの使用とコストを完全に制御できます',
          '当社のサーバーにAPIキーは保存されません',
          'フロントエンドからの直接API呼び出しと比較して強化されたセキュリティ'
        ]
      }
    }
  },
  fr: {
    settings: {
      title: 'Configuration API',
      apiConfiguration: 'Configuration des Services IA',
      importantNotice: {
        title: 'Important : Utilisez Votre Propre Clé API Gemini',
        description: 'OmniCanvas utilise Google Gemini pour la génération d\'images IA. Votre clé API est stockée en sécurité et traitée via notre backend pour une meilleure sécurité.'
      },
      apiKeys: {
        title: 'Configuration de la Clé API Gemini',
        services: {
          gemini: {
            name: 'Google Gemini',
            description: 'Pour la génération d\'images IA et les outils créatifs',
            placeholder: 'AIza...'
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
          'Visitez Google AI Studio pour obtenir votre clé API gratuite',
          'Copiez votre clé API Gemini depuis le tableau de bord',
          'Collez-la ci-dessous et sauvegardez votre configuration',
          'Commencez à créer du contenu IA incroyable !'
        ],
        getApiKeyButton: 'Obtenir une Clé API Gemini Gratuite'
      },
      security: {
        title: 'Sécurité et Confidentialité',
        benefits: [
          'Votre clé API est chiffrée et stockée localement',
          'Toutes les requêtes IA sont traitées en sécurité via notre backend',
          'Vous maintenez un contrôle total sur l\'utilisation et les coûts de votre API',
          'Aucune clé API n\'est stockée sur nos serveurs',
          'Sécurité améliorée comparée aux appels API directs depuis le frontend'
        ]
      }
    }
  }
}