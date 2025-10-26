import React, { useEffect, useState } from 'react'
import { Heart, Trash2, Copy, Download, Plus, AlertCircle } from 'lucide-react'
import { useFavoritesStore, type Favorite } from '@/store/favoritesStore'
import { useCanvasStore } from '@/store/canvasStore'
import { analyticsService } from '@services/analyticsService'
import { fabric } from 'fabric'

interface FavoritesPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const FavoritesPanel: React.FC<FavoritesPanelProps> = ({ isOpen, onClose }) => {
  const { favorites, loadFavorites, removeFavorite, addFavorite } = useFavoritesStore()
  const { canvas } = useCanvasStore()
  const [selectedFav, setSelectedFav] = useState<Favorite | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  if (!isOpen) return null

  const handleSaveCurrentAsFavorite = () => {
    if (!canvas) {
      alert('Canvas is empty. Please create something first.')
      return
    }

    try {
      // 获取画布数据
      const canvasData = JSON.stringify(canvas.toJSON(['backgroundColor']))

      // 生成缩略图
      const thumbnail = canvas.toDataURL({
        format: 'png',
        multiplier: 0.15 // 生成小缩略图
      })

      // 生成收藏名称
      const timestamp = new Date().toLocaleString('zh-CN')
      const name = `Saved at ${timestamp}`

      // 保存收藏
      addFavorite(canvasData, thumbnail, name)

      // 追踪
      analyticsService.trackFeatureUsage('favorite_saved', {
        favorite_count: favorites.length + 1
      })
    } catch (error) {
      console.error('Failed to save favorite:', error)
      alert('Failed to save favorite')
    }
  }

  const handleLoadFavorite = async (fav: Favorite) => {
    if (!canvas) return

    try {
      // 加载收藏到新画布
      const canvasData = JSON.parse(fav.canvasData)
      canvas.loadFromJSON(canvasData, () => {
        canvas.renderAll()
        analyticsService.trackFeatureUsage('favorite_loaded', {
          favorite_id: fav.id,
          name: fav.name
        })
        onClose()
      })
    } catch (error) {
      console.error('Failed to load favorite:', error)
      alert('Failed to load favorite')
    }
  }

  const handleCopyFavorite = async (fav: Favorite) => {
    if (!canvas) return

    try {
      // 复制到现有画布（不覆盖）
      const canvasData = JSON.parse(fav.canvasData)

      canvas.loadFromJSON(canvasData, () => {
        // 稍微平移新对象以避免完全重叠
        canvas.getObjects().forEach((obj, index) => {
          if (index > 0) {
            obj.set({
              left: (obj.left || 0) + 20,
              top: (obj.top || 0) + 20
            })
          }
        })
        canvas.renderAll()

        setCopiedId(fav.id)
        analyticsService.trackFeatureUsage('favorite_copied', {
          favorite_id: fav.id,
          name: fav.name
        })

        setTimeout(() => setCopiedId(null), 2000)
      })
    } catch (error) {
      console.error('Failed to copy favorite:', error)
      alert('Failed to copy favorite')
    }
  }

  const handleDeleteFavorite = (id: string) => {
    if (confirm('Are you sure you want to delete this favorite?')) {
      removeFavorite(id)
      analyticsService.trackFeatureUsage('favorite_deleted', {
        favorite_id: id
      })
    }
  }

  const handleDownloadFavorite = (fav: Favorite) => {
    try {
      const element = document.createElement('a')
      element.href = fav.thumbnail
      element.download = `${fav.name.replace(/\s+/g, '-')}.png`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      analyticsService.trackFeatureUsage('favorite_downloaded', {
        favorite_id: fav.id,
        name: fav.name
      })
    } catch (error) {
      console.error('Failed to download favorite:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-white" fill="white" />
            <h2 className="text-white text-xl font-bold">My Favorites</h2>
            <span className="bg-white bg-opacity-30 text-white px-3 py-1 rounded-full text-sm">
              {favorites.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Heart className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg font-semibold mb-2">No favorites yet</p>
              <p className="text-sm">Save your current canvas to create your first favorite</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  {/* Thumbnail */}
                  <div className="relative bg-gray-100 aspect-video overflow-hidden">
                    <img
                      src={fav.thumbnail}
                      alt={fav.name}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition flex items-center justify-center gap-2">
                      {selectedFav?.id === fav.id && (
                        <button
                          onClick={() => handleLoadFavorite(fav)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition"
                        >
                          Load
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate mb-1">{fav.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Saved {new Date(fav.createdAt).toLocaleDateString()}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedFav(fav)}
                        className="flex-1 bg-blue-50 text-blue-600 px-2 py-2 rounded text-xs font-semibold hover:bg-blue-100 transition flex items-center justify-center gap-1"
                      >
                        {selectedFav?.id === fav.id ? '📂 Selected' : '📂 Select'}
                      </button>
                      <button
                        onClick={() => handleCopyFavorite(fav)}
                        className={`flex-1 px-2 py-2 rounded text-xs font-semibold transition flex items-center justify-center gap-1 ${
                          copiedId === fav.id
                            ? 'bg-green-100 text-green-600'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        <Copy className="w-3 h-3" />
                        {copiedId === fav.id ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={() => handleDownloadFavorite(fav)}
                        className="px-2 py-2 rounded bg-gray-50 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition flex items-center justify-center"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteFavorite(fav.id)}
                        className="px-2 py-2 rounded bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition flex items-center justify-center"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex gap-3">
          <button
            onClick={handleSaveCurrentAsFavorite}
            disabled={!canvas}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:bg-gray-300 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Save Current Canvas
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default FavoritesPanel
