import React from 'react'
import { Clock, GitBranch, Sparkles, Palette, Zap, Shield } from 'lucide-react'

interface VersionRelease {
  version: string
  date: string
  type: 'major' | 'minor' | 'patch'
  features: string[]
  improvements?: string[]
  fixes?: string[]
}

const versionHistory: VersionRelease[] = [
  {
    version: 'v1.0.0',
    date: '2024-10-25',
    type: 'major',
    features: [
      '🎨 無界創意畫布 - AI 驅動的線上創意平台',
      '🤖 整合 Google Gemini AI 圖片生成',
      '🖌️ 多功能繪圖工具 (筆刷、橡皮擦、選取)',
      '📋 圖片複製貼上功能 (Ctrl+V)',
      '🔧 完整的畫布操作 (縮放、拖移、重設)',
      '🎯 智能物件選取與多選功能',
      '📱 右鍵選單與快捷操作',
      '🌍 多語言支援 (繁中、簡中、英文、日文)',
      '🔐 用戶自有 API 密鑰系統',
      '🛡️ 完整的安全防護機制'
    ],
    improvements: [
      '響應式設計適配各種螢幕尺寸',
      '高效能畫布渲染與記憶體管理',
      '直觀的用戶介面與操作體驗'
    ]
  }
]

export const VersionHistoryPanel: React.FC = () => {
  const getTypeIcon = (type: VersionRelease['type']) => {
    switch (type) {
      case 'major':
        return <Sparkles className="w-4 h-4 text-purple-500" />
      case 'minor':
        return <Zap className="w-4 h-4 text-blue-500" />
      case 'patch':
        return <Shield className="w-4 h-4 text-green-500" />
    }
  }

  const getTypeColor = (type: VersionRelease['type']) => {
    switch (type) {
      case 'major':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'minor':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'patch':
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getTypeLabel = (type: VersionRelease['type']) => {
    switch (type) {
      case 'major':
        return '重大版本'
      case 'minor':
        return '功能更新'
      case 'patch':
        return '修復更新'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <GitBranch className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">版本歷史</h3>
        <span className="text-sm text-gray-500">OmniCanvas 更新記錄</span>
      </div>

      {/* Version Timeline */}
      <div className="space-y-6">
        {versionHistory.map((release, index) => (
          <div key={release.version} className="relative">
            {/* Timeline Line */}
            {index < versionHistory.length - 1 && (
              <div className="absolute left-6 top-12 w-px h-full bg-gray-200"></div>
            )}

            {/* Version Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Version Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-bold relative z-10">
                    {getTypeIcon(release.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-xl font-bold text-gray-900">{release.version}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(release.type)}`}>
                        {getTypeLabel(release.type)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{release.date}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      新功能
                    </h5>
                    <ul className="space-y-1">
                      {release.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-500 font-bold mt-0.5">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  {release.improvements && release.improvements.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-500" />
                        改進優化
                      </h5>
                      <ul className="space-y-1">
                        {release.improvements.map((improvement, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-blue-500 font-bold mt-0.5">•</span>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Bug Fixes */}
                  {release.fixes && release.fixes.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        錯誤修復
                      </h5>
                      <ul className="space-y-1">
                        {release.fixes.map((fix, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-green-500 font-bold mt-0.5">•</span>
                            <span>{fix}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          OmniCanvas 持續開發中，更多功能即將推出 🚀
        </p>
      </div>
    </div>
  )
}

export default VersionHistoryPanel