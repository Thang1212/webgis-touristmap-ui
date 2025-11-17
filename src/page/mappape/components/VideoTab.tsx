import React, { useState, useEffect } from 'react'
import { Play, Eye, Heart } from 'lucide-react'
import axios from '../../../api/axios'

interface Video {
  id: string
  title: string
  description?: string
  channel: string
  platform: string
  thumbnail: string
  url: string
  views: number | string
  likes: number
  published_date: string
}

interface VideoTabProps {
  place: { id: number }
}

const VideoTab: React.FC<VideoTabProps> = ({ place }) => {
  const [videos, setVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')

  useEffect(() => {
    fetchVideos()
  }, [place.id])

  const fetchVideos = async () => {
  try {
    setLoading(true)
    const res = await axios.get(`/api/video/${place.id}`)
    const data = res.data
    
    // Always update videos, even if empty
    if (data.success && Array.isArray(data.data)) {
      setVideos(data.data)
      setFilteredVideos(data.data)
    } else {
      // Clear videos if no valid data
      setVideos([])
      setFilteredVideos([])
    }
  } catch (err) {
    console.error('Error fetching videos:', err)
    // Clear videos on error
    setVideos([])
    setFilteredVideos([])
  } finally {
    setLoading(false)
  }
}
  const formatNumber = (num: number | string): string => {
    const number = parseInt(num.toString())
    if (number >= 1_000_000) return (number / 1_000_000).toFixed(1) + 'M'
    if (number >= 1_000) return (number / 1_000).toFixed(1) + 'K'
    return number.toString()
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays < 30) return `${diffDays}d ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
    return `${Math.floor(diffDays / 365)}y ago`
  }

  const getPlatformColor = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return 'bg-red-500'
      case 'tiktok':
        return 'bg-black'
      default:
        return 'bg-gray-500'
    }
  }

  const getPlatformIcon = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return '▶'
      case 'tiktok':
        return '♪'
      default:
        return '▶'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4">
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {['all', 'youtube', 'tiktok'].map((platform) => (
          <button
            key={platform}
            onClick={() => {
              setSelectedPlatform(platform)
              setFilteredVideos(
                platform === 'all'
                  ? videos
                  : videos.filter(
                      (v) => v.platform.toLowerCase() === platform.toLowerCase()
                    )
              )
            }}
            className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
              selectedPlatform === platform
                ? platform === 'youtube'
                  ? 'bg-red-500 text-white'
                  : platform === 'tiktok'
                  ? 'bg-black text-white'
                  : 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {platform === 'all'
              ? 'All'
              : platform.charAt(0).toUpperCase() + platform.slice(1)}
          </button>
        ))}
      </div>

      {/* List layout (vertical) */}
      {filteredVideos.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="flex gap-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Thumbnail */}
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex-shrink-0 w-40 sm:w-56 aspect-video group"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `https://via.placeholder.com/320x180?text=${video.platform}`
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-7 h-7 text-white" />
                </div>

                <div
                  className={`absolute top-2 left-2 px-2 py-0.5 rounded text-white text-xs font-bold ${getPlatformColor(
                    video.platform
                  )}`}
                >
                  {getPlatformIcon(video.platform)} {video.platform}
                </div>
              </a>

              {/* Content */}
              <div className="flex flex-col justify-between p-2 flex-1">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 mb-1">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">@{video.channel}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {video.description || 'No description available.'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {formatNumber(video.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" />
                      {formatNumber(video.likes)}
                    </span>
                  </div>
                  <span>{formatDate(video.published_date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 text-sm">
          <Play className="w-10 h-10 mx-auto mb-2 opacity-40" />
          No videos found
        </div>
      )}
    </div>
  )
}

export default VideoTab
