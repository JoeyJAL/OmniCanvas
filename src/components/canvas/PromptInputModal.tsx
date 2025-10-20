import React, { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Send, X, MessageCircle } from 'lucide-react'
import { useTranslation } from '@hooks/useTranslation'

interface PromptInputModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (prompt: string, isVoice: boolean) => void
  selectedCount: number
}

export const PromptInputModal: React.FC<PromptInputModalProps> = ({
  visible,
  onClose,
  onSubmit,
  selectedCount
}) => {
  const t = useTranslation()
  const [prompt, setPrompt] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text')
  const [speechSupported, setSpeechSupported] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // 檢查語音識別支援
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      setSpeechSupported(true)

      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'zh-TW'

      recognition.onstart = () => {
        console.log('🎤 語音識別開始')
        setIsListening(true)
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript
        console.log('🎤 語音識別結果:', transcript)
        setPrompt(transcript)
        setIsListening(false)
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('🎤 語音識別錯誤:', event.error)
        setIsListening(false)

        let errorMessage = 'Voice recognition failed'
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected, please try again'
            break
          case 'audio-capture':
            errorMessage = 'Cannot access microphone'
            break
          case 'not-allowed':
            errorMessage = 'Microphone permission denied'
            break
          case 'network':
            errorMessage = 'Network error, please check connection'
            break
        }
        alert(errorMessage)
      }

      recognition.onend = () => {
        console.log('🎤 語音識別結束')
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } else {
      setSpeechSupported(false)
      console.warn('瀏覽器不支援語音識別')
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  // 開始語音識別
  const startListening = () => {
    if (!recognitionRef.current || isListening) return

    try {
      recognitionRef.current.start()
    } catch (error) {
      console.error('啟動語音識別失敗:', error)
      alert('Unable to start voice recognition, please try again')
    }
  }

  // 停止語音識別
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  // 處理提交
  const handleSubmit = () => {
    if (!prompt.trim()) return

    onSubmit(prompt.trim(), inputMode === 'voice')
    setPrompt('')
    onClose()
  }

  // 處理關閉
  const handleClose = () => {
    if (isListening) {
      stopListening()
    }
    setPrompt('')
    onClose()
  }

  // 快速插入樣例
  const insertExample = (example: string) => {
    setPrompt(example)
    setInputMode('text')
  }

  if (!visible) return null

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* 模態框 */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
          {/* 標題欄 */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">{t.nanoBananaPrompt.title}</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 內容區域 */}
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {/* 選擇的物件數量 */}
            <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
              {selectedCount} {t.nanoBananaPrompt.selectedObjects}
            </div>

            {/* 物件穩定性提示 */}
            <div className="text-sm text-purple-700 bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="flex items-start space-x-2">
                <span className="text-purple-500">💡</span>
                <div>
                  <div className="font-medium mb-1">{t.nanoBananaPrompt.stabilityTip.title}</div>
                  <div className="text-xs">{t.nanoBananaPrompt.stabilityTip.description}</div>
                </div>
              </div>
            </div>

            {/* 輸入模式切換 */}
            <div className="flex space-x-2">
              <button
                onClick={() => setInputMode('text')}
                className={`flex-1 p-2 rounded-lg border transition-colors ${
                  inputMode === 'text'
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                {t.nanoBananaPrompt.inputModes.text}
              </button>
              <button
                onClick={() => setInputMode('voice')}
                disabled={!speechSupported}
                className={`flex-1 p-2 rounded-lg border transition-colors ${
                  inputMode === 'voice'
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : speechSupported
                      ? 'bg-gray-50 border-gray-200 text-gray-600'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {t.nanoBananaPrompt.inputModes.voice}
              </button>
            </div>

            {!speechSupported && (
              <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                {t.nanoBananaPrompt.voiceNotSupported}
              </div>
            )}

            {/* 語音輸入區域 */}
            {inputMode === 'voice' && speechSupported && (
              <div className="space-y-3">
                <div className="text-center">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`p-4 rounded-full transition-all ${
                      isListening
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                </div>

                <p className="text-center text-sm text-gray-600">
                  {isListening ? t.nanoBananaPrompt.voiceStatus.listening : t.nanoBananaPrompt.voiceStatus.clickToStart}
                </p>
              </div>
            )}

            {/* 提示輸入框 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t.nanoBananaPrompt.promptLabel}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.nanoBananaPrompt.promptPlaceholder}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            {/* 快速樣例 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t.nanoBananaPrompt.quickExamples}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {t.nanoBananaPrompt.examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => insertExample(example)}
                    className="p-2 text-xs bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors text-left"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* 提交按鈕 - 固定在底部 */}
          <div className="flex justify-end space-x-3 p-4 border-t bg-gray-50 flex-shrink-0">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t.nanoBananaPrompt.cancel}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                prompt.trim()
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{t.nanoBananaPrompt.submit}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// 保持舊名字的匯出以向後相容
export const VoicePromptModal = PromptInputModal