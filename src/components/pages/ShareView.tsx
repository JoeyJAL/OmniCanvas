import React, { useEffect, useState } from 'react'
import { useShareStore } from '@/store/shareStore'
import { useCanvasStore } from '@/store/canvasStore'
import { Loader, Download, Copy, X, Eye } from 'lucide-react'
import { Canvas } from '@/components/canvas/Canvas'
import { analyticsService } from '@services/analyticsService'

interface ShareViewProps {
  shareId: string
  onClose: () => void
}

export const ShareView: React.FC<ShareViewProps> = ({ shareId, onClose }) => {
  const { getShare } = useShareStore()
  const { canvas } = useCanvasStore()
  const [share, setShare] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    const loadShare = async () => {
      if (!shareId) {
        setError('Share ID not found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await getShare(shareId)

        if (!data) {
          setError('Share not found or has expired')
          setLoading(false)
          return
        }

        setShare(data)

        // 追踪分享浏览
        analyticsService.trackFeatureUsage('share_viewed', {
          share_id: shareId,
          creator_name: data.creatorName,
          view_count: data.viewCount
        })

        // 加载画布
        if (canvas) {
          const canvasData = JSON.parse(data.canvasData)
          canvas.loadFromJSON(canvasData, () => {
            canvas.renderAll()
          })
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load share'
        setError(message)
        console.error('Failed to load share:', err)
      } finally {
        setLoading(false)
      }
    }

    loadShare()
  }, [shareId, getShare, canvas])

  const handleDownload = () => {
    if (!canvas) return

    try {
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1
      })

      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${share.creatorName || 'canvas'}-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      analyticsService.trackFeatureUsage('shared_canvas_downloaded', {
        share_id: shareId
      })
    } catch (error) {
      console.error('Failed to download:', error)
    }
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)

      analyticsService.trackFeatureUsage('shared_canvas_link_copied', {
        share_id: shareId
      })
    })
  }

  const handleCopyToMyCanvas = async () => {
    if (!share || !canvas) return

    try {
      const canvasData = JSON.parse(share.canvasData)
      canvas.loadFromJSON(canvasData, () => {
        canvas.renderAll()

        analyticsService.trackFeatureUsage('shared_canvas_copied', {
          share_id: shareId,
          creator_name: share.creatorName
        })

        // 关闭分享视图
        onClose()
      })
    } catch (error) {
      console.error('Failed to copy canvas:', error)
    }
  }

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading shared canvas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">Shared Canvas</h1>
            <p className="text-xs text-gray-500">by {share?.creatorName || 'Anonymous'}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right">
            <div className="flex items-center gap-1 text-gray-600">
              <Eye className="w-4 h-4" />
              <span>{share?.viewCount || 0} views</span>
            </div>
            <p className="text-xs text-gray-500">
              {share?.createdAt && new Date(share.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </header>

      {/* Canvas Area */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          <Canvas />
        </div>

        {/* Share Info Panel */}
        <div className="w-80 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Creator Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Creator</h3>
              <p className="text-sm text-gray-600">{share?.creatorName || 'Anonymous'}</p>
            </div>

            {/* Share Link */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Share Link</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="flex-1 px-3 py-2 text-xs bg-gray-100 border border-gray-300 rounded font-mono overflow-x-auto"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-2 rounded transition flex items-center gap-1 text-sm font-semibold ${
                    copiedLink
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <button
                onClick={handleCopyToMyCanvas}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy to My Canvas
              </button>
              <button
                onClick={handleDownload}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
            </div>

            {/* Info */}
            <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 space-y-2">
              <p>
                <strong>Created:</strong> {new Date(share?.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Views:</strong> {share?.viewCount || 0}
              </p>
              <p>
                <strong>Expires:</strong> {new Date(share?.expiresAt).toLocaleDateString()}
              </p>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
              <p className="font-semibold mb-1">💡 Tip</p>
              <p>
                You can copy this canvas to your own account and edit it to create your own
                version. All changes will be saved to your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareView
