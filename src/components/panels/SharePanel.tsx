import React, { useState } from 'react'
import { Share2, Copy, Check, Link2, AlertCircle, Loader } from 'lucide-react'
import { useCanvasStore } from '@/store/canvasStore'
import { useShareStore } from '@/store/shareStore'
import { analyticsService } from '@services/analyticsService'

interface SharePanelProps {
  isOpen: boolean
  onClose: () => void
}

export const SharePanel: React.FC<SharePanelProps> = ({ isOpen, onClose }) => {
  const { canvas } = useCanvasStore()
  const { createShare, getShareUrl } = useShareStore()
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [creatorName, setCreatorName] = useState('')

  if (!isOpen) return null

  const handleGenerateShareLink = async () => {
    if (!canvas) {
      setError('Canvas is empty. Please create something first.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 获取画布数据
      const canvasData = JSON.stringify(canvas.toJSON(['backgroundColor']))

      // 生成缩略图
      const thumbnail = canvas.toDataURL({
        format: 'png',
        multiplier: 0.2
      })

      // 创建分享
      const shareId = await createShare(
        canvasData,
        thumbnail,
        creatorName || 'Anonymous'
      )

      const url = getShareUrl(shareId)
      setShareUrl(url)

      // 追踪
      analyticsService.trackFeatureUsage('share_created', {
        share_id: shareId,
        creator_name: creatorName || 'anonymous'
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create share link'
      setError(message)
      console.error('Failed to create share:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (!shareUrl) return

    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedToClipboard(true)
      analyticsService.trackFeatureUsage('share_link_copied', {
        share_url: shareUrl
      })

      setTimeout(() => setCopiedToClipboard(false), 2000)
    })
  }

  const handleOpenShare = () => {
    if (!shareUrl) return
    window.open(shareUrl, '_blank')
    analyticsService.trackFeatureUsage('share_link_opened', {
      share_url: shareUrl
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Share2 className="w-6 h-6 text-white" />
            <h2 className="text-white text-xl font-bold">Share Canvas</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Creator Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name (optional)
            </label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="e.g., John Doe"
              disabled={!!shareUrl}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Info Message */}
          {!shareUrl && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
              <Link2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Shareable Link</p>
                <p className="text-xs text-blue-700 mt-1">
                  Generate a public link to let others view and copy your canvas
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900">Error</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Share URL Display */}
          {shareUrl && (
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-600 mb-2">Your Share Link:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded font-mono text-xs overflow-x-auto"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-2 rounded font-semibold text-sm transition flex items-center gap-2 ${
                    copiedToClipboard
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {copiedToClipboard ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Creator Info */}
          {shareUrl && creatorName && (
            <div className="text-sm text-gray-600">
              <p className="font-semibold">Created by: {creatorName}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex gap-3">
          {!shareUrl ? (
            <button
              onClick={handleGenerateShareLink}
              disabled={isLoading}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Generate Link
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={handleOpenShare}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Open Link
              </button>
              <button
                onClick={() => {
                  setShareUrl(null)
                  setCreatorName('')
                  setError(null)
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Create Another
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default SharePanel
