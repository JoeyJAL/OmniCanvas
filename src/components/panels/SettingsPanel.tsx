import React, { useState, useEffect } from 'react'
import { Settings, Check, X, Shield, Key, Eye, EyeOff, AlertCircle, Save, ExternalLink } from 'lucide-react'
import { useAPIKeyStore, APIKeys } from '@store/apiKeyStore'
import { useLanguageStore } from '@store/languageStore'
import { getTranslation } from '@translations/index'

interface SettingsPanelProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, setIsOpen }) => {
  const { currentLanguage } = useLanguageStore()
  const t = getTranslation(currentLanguage)
  const { apiKeys, setAPIKey, removeAPIKey, validateAPIKey, getObfuscatedKey, isConfigured } = useAPIKeyStore()
  const [localKeys, setLocalKeys] = useState<APIKeys>({})
  const [showKeys, setShowKeys] = useState<Record<keyof APIKeys, boolean>>({})
  const [validationStatus, setValidationStatus] = useState<Record<keyof APIKeys, 'valid' | 'invalid' | 'unchecked'>>({})
  const [activeTab, setActiveTab] = useState<'apikeys' | 'backend'>('apikeys')

  // Load saved API keys
  useEffect(() => {
    setLocalKeys(apiKeys)
    // Initialize validation status
    const status: Record<string, 'unchecked'> = {}
    Object.keys(apiKeys).forEach(key => {
      status[key as keyof APIKeys] = 'unchecked'
    })
    setValidationStatus(status as any)
  }, [apiKeys])

  const handleKeyChange = (service: keyof APIKeys, value: string) => {
    setLocalKeys(prev => ({ ...prev, [service]: value }))
    setValidationStatus(prev => ({ ...prev, [service]: 'unchecked' }))
  }

  const handleSaveKey = async (service: keyof APIKeys) => {
    const key = localKeys[service]
    if (!key) {
      removeAPIKey(service)
      setValidationStatus(prev => ({ ...prev, [service]: 'unchecked' }))
      return
    }

    const isValid = await validateAPIKey(service, key)
    if (isValid) {
      setAPIKey(service, key)
      setValidationStatus(prev => ({ ...prev, [service]: 'valid' }))
    } else {
      setValidationStatus(prev => ({ ...prev, [service]: 'invalid' }))
    }
  }

  const handleToggleShow = (service: keyof APIKeys) => {
    setShowKeys(prev => ({ ...prev, [service]: !prev[service] }))
  }

  const apiKeyServices = [
    { 
      key: 'gemini' as keyof APIKeys,
      name: t.settings.apiKeys.services.gemini.name,
      placeholder: t.settings.apiKeys.services.gemini.placeholder,
      description: t.settings.apiKeys.services.gemini.description,
      required: true
    }
  ]

  return (
    <>
      {/* Settings Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">{t.settings.title}</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Important Notice */}
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-amber-900 mb-1">{t.settings.importantNotice.title}</h3>
                    <p className="text-xs text-amber-800">
                      {t.settings.importantNotice.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* API Keys Configuration */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  {t.settings.apiKeys.title}
                </h3>
                
                {apiKeyServices.map((service) => (
                  <div key={service.key} className="space-y-2 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        {service.name}
                        {service.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {validationStatus[service.key] === 'valid' && (
                        <span className="text-xs text-green-600 flex items-center">
                          <Check className="w-3 h-3 mr-1" /> {t.settings.apiKeys.valid}
                        </span>
                      )}
                      {validationStatus[service.key] === 'invalid' && (
                        <span className="text-xs text-red-600 flex items-center">
                          <X className="w-3 h-3 mr-1" /> {t.settings.apiKeys.invalid}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{service.description}</p>
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type={showKeys[service.key] ? 'text' : 'password'}
                          value={localKeys[service.key] || ''}
                          onChange={(e) => handleKeyChange(service.key, e.target.value)}
                          onKeyDown={(e) => {
                            if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
                              e.preventDefault()
                              navigator.clipboard.readText().then(text => {
                                handleKeyChange(service.key, text)
                              }).catch(() => {
                                // Fallback: let browser handle paste normally
                                e.preventDefault = () => {}
                              })
                            }
                          }}
                          placeholder={service.placeholder}
                          className="w-full text-sm border border-gray-300 rounded px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          autoComplete="off"
                        />
                        <button
                          type="button"
                          onClick={() => handleToggleShow(service.key)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showKeys[service.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <button
                        onClick={() => handleSaveKey(service.key)}
                        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                    {apiKeys[service.key] && (
                      <p className="text-xs text-gray-500 mt-1">
                        {t.settings.apiKeys.current}: {getObfuscatedKey(service.key)}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Getting Started Guide */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-blue-900">{t.settings.gettingStarted.title}</h3>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    {t.settings.gettingStarted.getApiKeyButton}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                <ol className="text-xs text-blue-800 space-y-1">
                  {t.settings.gettingStarted.steps.map((step, index) => (
                    <li key={index}>{index + 1}. {step}</li>
                  ))}
                </ol>
              </div>

              {/* Security Info */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-sm font-medium text-green-900 mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  {t.settings.security.title}
                </h3>
                <ul className="text-xs text-green-800 space-y-1">
                  {t.settings.security.benefits.map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                >
                  {t.common.close}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}