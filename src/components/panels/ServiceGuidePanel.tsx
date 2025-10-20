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

export const ServiceGuidePanel: React.FC = () => {
  const t = useTranslation()
  const [expandedSection, setExpandedSection] = useState<string | null>('overview')

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
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
      icon: Sparkles,
      title: t.serviceGuide.quickActions.generate,
      description: t.serviceGuide.quickActions.generateDesc,
      action: () => console.log('Open AI Panel')
    },
    {
      icon: Zap,
      title: t.serviceGuide.quickActions.enhance,
      description: t.serviceGuide.quickActions.enhanceDesc,
      action: () => console.log('Open Enhancement')
    },
    {
      icon: Settings,
      title: t.serviceGuide.quickActions.settings,
      description: t.serviceGuide.quickActions.settingsDesc,
      action: () => console.log('Open Settings')
    }
  ]

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-blue-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {t.serviceGuide.title}
            </h2>
            <p className="text-sm text-gray-600">
              {t.serviceGuide.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
            <Play className="w-4 h-4 mr-2 text-green-600" />
            {t.serviceGuide.quickStart}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-start space-x-3">
                  <action.icon className="w-5 h-5 text-blue-600 mt-0.5 group-hover:text-blue-700" />
                  <div>
                    <div className="text-sm font-medium text-gray-800 group-hover:text-blue-800">
                      {action.title}
                    </div>
                    <div className="text-xs text-gray-600 group-hover:text-blue-600">
                      {action.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="p-4 space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <section.icon className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-800">{section.title}</span>
                  </div>
                  {expandedSection === section.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {expandedSection === section.id && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="mt-4">
                      <h4 className="font-medium text-gray-800 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>

                      {item.features && (
                        <ul className="space-y-2">
                          {item.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.steps && (
                        <ol className="space-y-2">
                          {item.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start space-x-3 text-sm text-gray-600">
                              <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium mt-0.5">
                                {stepIndex + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      )}

                      {item.controls && (
                        <div className="space-y-2">
                          {item.controls.map((control, controlIndex) => (
                            <div key={controlIndex} className="flex justify-between items-center py-1">
                              <span className="text-sm text-gray-600">{control.key}</span>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                {control.value}
                              </code>
                            </div>
                          ))}
                        </div>
                      )}

                      {item.options && (
                        <div className="grid grid-cols-1 gap-2 mt-3">
                          {item.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="p-2 bg-blue-50 rounded border border-blue-200">
                              <span className="text-sm text-blue-800">{option}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {item.languages && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.languages.map((lang, langIndex) => (
                            <span key={langIndex} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
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
            <HelpCircle className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-purple-800 mb-1">
                {t.serviceGuide.needHelp.title}
              </h3>
              <p className="text-xs text-purple-600 mb-3">
                {t.serviceGuide.needHelp.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => window.location.href = 'mailto:joeylaijal@gmail.com'}
                  className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full hover:bg-purple-700 transition-colors"
                >
                  {t.serviceGuide.needHelp.contact}
                </button>
                <button className="px-3 py-1 bg-white text-purple-600 text-xs rounded-full border border-purple-200 hover:bg-purple-50 transition-colors">
                  {t.serviceGuide.needHelp.community}
                </button>
              </div>
              <p className="text-xs text-purple-500 mt-2">
                Support: joeylaijal@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}