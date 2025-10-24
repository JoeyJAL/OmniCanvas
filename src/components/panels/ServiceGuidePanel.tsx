import React, { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import {
  BookOpen,
  Sparkles,
  Zap,
  Palette,
  Mouse,
  Settings,
  Globe,
  Shield,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Play,
  Image,
  Wand2,
  Layers,
  Download
} from 'lucide-react'

interface ServiceGuidePanelProps {
  onOpenSettings?: () => void
  onOpenAIPanel?: () => void
  onClose?: () => void
}

export const ServiceGuidePanel: React.FC<ServiceGuidePanelProps> = ({
  onOpenSettings,
  onOpenAIPanel,
  onClose
}) => {
  const t = useTranslation()
  const [expandedSection, setExpandedSection] = useState<string | null>('overview')

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'open_settings':
        onOpenSettings?.()
        onClose?.()
        break
      case 'open_ai_panel':
        onOpenAIPanel?.()
        onClose?.()
        break
      case 'open_enhancement':
        onOpenAIPanel?.() // 增強功能也是在 AI 面板中
        onClose?.()
        break
      default:
        console.log('Unknown action:', action)
    }
  }

  const sections = [
    {
      id: 'overview',
      icon: BookOpen,
      title: t.serviceGuide.overview.title,
      content: [
        {
          title: t.serviceGuide.overview.whatIs.title,
          description: t.serviceGuide.overview.whatIs.description,
          features: [
            t.serviceGuide.overview.whatIs.features.unlimited,
            t.serviceGuide.overview.whatIs.features.aiPowered,
            t.serviceGuide.overview.whatIs.features.multilingual,
            t.serviceGuide.overview.whatIs.features.privacy
          ]
        }
      ]
    },
    {
      id: 'aiGeneration',
      icon: Sparkles,
      title: t.serviceGuide.aiGeneration.title,
      content: [
        {
          title: t.serviceGuide.aiGeneration.textToImage.title,
          description: t.serviceGuide.aiGeneration.textToImage.description,
          steps: [
            t.serviceGuide.aiGeneration.textToImage.steps.openPanel,
            t.serviceGuide.aiGeneration.textToImage.steps.writePrompt,
            t.serviceGuide.aiGeneration.textToImage.steps.selectTemplate,
            t.serviceGuide.aiGeneration.textToImage.steps.generate
          ]
        },
        {
          title: t.serviceGuide.aiGeneration.imageToImage.title,
          description: t.serviceGuide.aiGeneration.imageToImage.description,
          steps: [
            t.serviceGuide.aiGeneration.imageToImage.steps.selectImages,
            t.serviceGuide.aiGeneration.imageToImage.steps.openPanel,
            t.serviceGuide.aiGeneration.imageToImage.steps.writePrompt,
            t.serviceGuide.aiGeneration.imageToImage.steps.generate
          ]
        }
      ]
    },
    {
      id: 'enhancement',
      icon: Zap,
      title: t.serviceGuide.enhancement.title,
      content: [
        {
          title: t.serviceGuide.enhancement.aiUpscale.title,
          description: t.serviceGuide.enhancement.aiUpscale.description,
          features: [
            t.serviceGuide.enhancement.aiUpscale.features.resolution,
            t.serviceGuide.enhancement.aiUpscale.features.quality,
            t.serviceGuide.enhancement.aiUpscale.features.details
          ]
        },
        {
          title: t.serviceGuide.enhancement.backgroundRemoval.title,
          description: t.serviceGuide.enhancement.backgroundRemoval.description,
          features: [
            t.serviceGuide.enhancement.backgroundRemoval.features.automatic,
            t.serviceGuide.enhancement.backgroundRemoval.features.transparent,
            t.serviceGuide.enhancement.backgroundRemoval.features.precise
          ]
        }
      ]
    },
    {
      id: 'canvas',
      icon: Palette,
      title: t.serviceGuide.canvas.title,
      content: [
        {
          title: t.serviceGuide.canvas.navigation.title,
          description: t.serviceGuide.canvas.navigation.description,
          controls: [
            { key: t.serviceGuide.canvas.navigation.controls.zoom, value: 'Ctrl/Cmd + 滾輪' },
            { key: t.serviceGuide.canvas.navigation.controls.pan, value: '觸控板 / Shift + 拖曳' },
            { key: t.serviceGuide.canvas.navigation.controls.select, value: '點擊選取' },
            { key: t.serviceGuide.canvas.navigation.controls.multiSelect, value: 'Ctrl/Cmd + 點擊' }
          ]
        },
        {
          title: t.serviceGuide.canvas.layers.title,
          description: t.serviceGuide.canvas.layers.description,
          features: [
            t.serviceGuide.canvas.layers.features.unlimited,
            t.serviceGuide.canvas.layers.features.visibility,
            t.serviceGuide.canvas.layers.features.reorder,
            t.serviceGuide.canvas.layers.features.lock
          ]
        }
      ]
    },
    {
      id: 'contextMenu',
      icon: Mouse,
      title: t.serviceGuide.contextMenu.title,
      content: [
        {
          title: t.serviceGuide.contextMenu.smartCompose.title,
          description: t.serviceGuide.contextMenu.smartCompose.description,
          options: [
            t.serviceGuide.contextMenu.smartCompose.options.intelligent,
            t.serviceGuide.contextMenu.smartCompose.options.accessory,
            t.serviceGuide.contextMenu.smartCompose.options.scene,
            t.serviceGuide.contextMenu.smartCompose.options.creative
          ]
        },
        {
          title: t.serviceGuide.contextMenu.voiceCommand.title,
          description: t.serviceGuide.contextMenu.voiceCommand.description,
          features: [
            t.serviceGuide.contextMenu.voiceCommand.features.multilingual,
            t.serviceGuide.contextMenu.voiceCommand.features.intelligent,
            t.serviceGuide.contextMenu.voiceCommand.features.realtime
          ]
        }
      ]
    },
    {
      id: 'settings',
      icon: Settings,
      title: t.serviceGuide.settings.title,
      content: [
        {
          title: t.serviceGuide.settings.apiKey.title,
          description: t.serviceGuide.settings.apiKey.description,
          steps: [
            t.serviceGuide.settings.apiKey.steps.getKey,
            t.serviceGuide.settings.apiKey.steps.openSettings,
            t.serviceGuide.settings.apiKey.steps.enterKey,
            t.serviceGuide.settings.apiKey.steps.save
          ]
        },
        {
          title: t.serviceGuide.settings.language.title,
          description: t.serviceGuide.settings.language.description,
          languages: [
            '繁體中文', 'English', '日本語', 'Español', 'Français'
          ]
        }
      ]
    }
  ]

  const quickActions = [
    {
      icon: Settings,
      title: t.serviceGuide.quickActions.settings,
      description: t.serviceGuide.quickActions.settingsDesc,
      action: 'open_settings'
    },
    {
      icon: Sparkles,
      title: t.serviceGuide.quickActions.generate,
      description: t.serviceGuide.quickActions.generateDesc,
      action: 'open_ai_panel'
    },
    {
      icon: Zap,
      title: t.serviceGuide.quickActions.enhance,
      description: t.serviceGuide.quickActions.enhanceDesc,
      action: 'open_enhancement'
    }
  ]

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-blue-50">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-gray-800">
              {t.serviceGuide.title}
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              {t.serviceGuide.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Quick Actions */}
        <div className="p-3 md:p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
            <Play className="w-4 h-4 mr-2 text-green-600" />
            {t.serviceGuide.quickStart}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left group active:bg-blue-100 touch-manipulation"
              >
                <div className="flex items-start space-x-3">
                  <action.icon className="w-5 h-5 text-blue-600 mt-0.5 group-hover:text-blue-700 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-800 group-hover:text-blue-800 leading-5">
                      {action.title}
                    </div>
                    <div className="text-xs text-gray-600 group-hover:text-blue-600 mt-1 leading-4">
                      {action.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="p-3 md:p-4 space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors active:bg-gray-100 touch-manipulation"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <section.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-gray-800 text-sm md:text-base truncate">{section.title}</span>
                  </div>
                  {expandedSection === section.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </button>

              {expandedSection === section.id && (
                <div className="px-3 md:px-4 pb-4 border-t border-gray-100">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="mt-4">
                      <h4 className="font-medium text-gray-800 mb-3 text-sm md:text-base">{item.title}</h4>
                      <p className="text-xs md:text-sm text-gray-600 mb-3 leading-relaxed">{item.description}</p>

                      {item.features && (
                        <ul className="space-y-3">
                          {item.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-3 text-xs md:text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.steps && (
                        <ol className="space-y-3">
                          {item.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start space-x-3 text-xs md:text-sm text-gray-600">
                              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium flex-shrink-0">
                                {stepIndex + 1}
                              </span>
                              <span className="leading-relaxed pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      )}

                      {item.controls && (
                        <div className="space-y-3">
                          {item.controls.map((control, controlIndex) => (
                            <div key={controlIndex} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 space-y-1 sm:space-y-0">
                              <span className="text-xs md:text-sm text-gray-600 font-medium">{control.key}</span>
                              <code className="text-xs bg-gray-100 px-3 py-2 rounded font-mono self-start sm:self-auto">
                                {control.value}
                              </code>
                            </div>
                          ))}
                        </div>
                      )}

                      {item.options && (
                        <div className="grid grid-cols-1 gap-3 mt-3">
                          {item.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <span className="text-xs md:text-sm text-blue-800 leading-relaxed">{option}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {item.languages && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.languages.map((lang, langIndex) => (
                            <span key={langIndex} className="px-3 py-2 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              {lang}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-200">
          <div className="flex items-start space-x-3">
            <HelpCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-purple-800 mb-2">
                {t.serviceGuide.needHelp.title}
              </h3>
              <p className="text-xs text-purple-600 mb-4 leading-relaxed">
                {t.serviceGuide.needHelp.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.location.href = 'mailto:joeylaijal@gmail.com'}
                  className="px-4 py-2 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors active:bg-purple-800 touch-manipulation"
                >
                  {t.serviceGuide.needHelp.contact}
                </button>
                <button className="px-4 py-2 bg-white text-purple-600 text-xs font-medium rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors active:bg-purple-100 touch-manipulation">
                  {t.serviceGuide.needHelp.community}
                </button>
              </div>
              <p className="text-xs text-purple-500 mt-3 break-all">
                Support: joeylaijal@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}