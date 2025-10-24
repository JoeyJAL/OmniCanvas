import React, { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, Eye, RefreshCw, Info } from 'lucide-react'
import { getSecurityReport, SecurityManager } from '@utils/securityUtils'
import { useTranslation } from '@hooks/useTranslation'

interface SecurityStatusPanelProps {
  className?: string
}

export const SecurityStatusPanel: React.FC<SecurityStatusPanelProps> = ({ className }) => {
  const t = useTranslation()
  const [securityReport, setSecurityReport] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const loadSecurityReport = async () => {
    setIsLoading(true)
    try {
      // 執行安全檢查
      const securityManager = SecurityManager.getInstance()
      await securityManager.performSecurityCheck()

      // 取得報告
      const report = getSecurityReport()
      setSecurityReport(report)
      setLastChecked(new Date())
    } catch (error) {
      console.error('Failed to load security report:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSecurityReport()
  }, [])

  const getSecurityLevel = () => {
    if (!securityReport) return 'unknown'

    if (securityReport.hasPotentialThreats) return 'danger'
    if (securityReport.detectedExtensions.length > 5) return 'warning'
    return 'safe'
  }

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'safe': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'danger': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSecurityIcon = (level: string) => {
    switch (level) {
      case 'safe': return CheckCircle
      case 'warning': return AlertTriangle
      case 'danger': return AlertTriangle
      default: return Shield
    }
  }

  const securityLevel = getSecurityLevel()
  const SecurityIcon = getSecurityIcon(securityLevel)

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* 標題 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">安全狀態</h3>
        </div>
        <button
          onClick={loadSecurityReport}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          title="重新檢查"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 安全等級 */}
      <div className={`flex items-center space-x-3 p-3 rounded-lg mb-4 ${getSecurityLevelColor(securityLevel)}`}>
        <SecurityIcon className="w-5 h-5" />
        <div>
          <div className="font-medium">
            {securityLevel === 'safe' && '安全'}
            {securityLevel === 'warning' && '警告'}
            {securityLevel === 'danger' && '危險'}
            {securityLevel === 'unknown' && '檢查中...'}
          </div>
          <div className="text-xs opacity-75">
            {securityLevel === 'safe' && '系統狀態良好'}
            {securityLevel === 'warning' && '發現一些需要注意的項目'}
            {securityLevel === 'danger' && '檢測到潛在安全威脅'}
            {securityLevel === 'unknown' && '正在分析安全狀態...'}
          </div>
        </div>
      </div>

      {/* 詳細資訊 */}
      {securityReport && (
        <div className="space-y-3">
          {/* 基本配置 */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              安全配置
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">CSP 保護:</span>
                <span className={securityReport.config.enableCSP ? 'text-green-600' : 'text-red-600'}>
                  {securityReport.config.enableCSP ? '已啟用' : '已停用'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">XSS 防護:</span>
                <span className={securityReport.config.enableXSSProtection ? 'text-green-600' : 'text-red-600'}>
                  {securityReport.config.enableXSSProtection ? '已啟用' : '已停用'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">擴展檢測:</span>
                <span className={securityReport.config.enableExtensionDetection ? 'text-green-600' : 'text-red-600'}>
                  {securityReport.config.enableExtensionDetection ? '已啟用' : '已停用'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">嚴格模式:</span>
                <span className={securityReport.config.strictMode ? 'text-green-600' : 'text-yellow-600'}>
                  {securityReport.config.strictMode ? '已啟用' : '已停用'}
                </span>
              </div>
            </div>
          </div>

          {/* 檢測到的擴展 */}
          {securityReport.detectedExtensions.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                檢測到的瀏覽器擴展 ({securityReport.detectedExtensions.length})
              </h4>
              <div className="space-y-1 text-xs">
                {securityReport.detectedExtensions.map((extension: string, index: number) => (
                  <div
                    key={index}
                    className={`p-2 rounded ${
                      extension.includes('Suspicious') || extension.includes('Malicious')
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {extension}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 威脅警告 */}
          {securityReport.hasPotentialThreats && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h4 className="font-medium text-red-800 mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                安全警告
              </h4>
              <p className="text-red-700 text-sm">
                檢測到潛在的安全威脅。建議檢查瀏覽器擴展並確保只安裝可信任的軟件。
              </p>
            </div>
          )}

          {/* 建議 */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-medium text-blue-800 mb-2">安全建議</h4>
            <ul className="text-blue-700 text-xs space-y-1">
              <li>• 定期檢查並移除不必要的瀏覽器擴展</li>
              <li>• 確保 API Key 只在安全環境中使用</li>
              <li>• 避免在公共網路中進行敏感操作</li>
              <li>• 定期更新瀏覽器到最新版本</li>
            </ul>
          </div>

          {/* 最後檢查時間 */}
          {lastChecked && (
            <div className="text-xs text-gray-500 text-center">
              最後檢查: {lastChecked.toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* 載入中狀態 */}
      {isLoading && !securityReport && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">正在檢查安全狀態...</span>
        </div>
      )}
    </div>
  )
}

export default SecurityStatusPanel