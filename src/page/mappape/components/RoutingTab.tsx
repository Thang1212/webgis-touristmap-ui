import { useMapStore } from '@/store/mapstore'
import { useRoutingStore } from '@/store/routingstore'
import React, { useEffect, useState } from 'react'
import { MapPin, RefreshCw, Navigation, Clock, Route as RouteIcon, X, MousePointerClick, MapPinned, Satellite } from 'lucide-react'

const RoutingTab = () => {
  const { selectedPlace } = useMapStore()
  const { 
    origin, 
    destination, 
    direction,
    loading,
    error,
    pickMode,
    useGPS, // ⭐ NEW
    setOrigin, 
    setDestination,
    fetchDirections,
    clearRoute,
    setPickMode,
    setUseGPS // ⭐ NEW
  } = useRoutingStore()
  
  const [profile, setProfile] = useState<'driving-traffic' | 'driving' | 'walking' | 'cycling'>('driving-traffic')

  useEffect(() => {
    if (selectedPlace?.location?.coordinates) {
      setDestination(selectedPlace.location.coordinates as [number, number])
    }
  }, [selectedPlace, setDestination])

  const handleOriginChange = (value: string) => {
    const coords = value.split(',').map(c => parseFloat(c.trim()))
    if (coords.length === 2 && !coords.some(isNaN)) {
      setOrigin([coords[0], coords[1]])
    }
  }

  const togglePickOrigin = () => {
    setPickMode(pickMode === 'origin' ? 'none' : 'origin')
  }

  const togglePickDestination = () => {
    setPickMode(pickMode === 'destination' ? 'none' : 'destination')
  }

  // ⭐ NEW: Toggle GPS
  const toggleGPS = () => {
    const newUseGPS = !useGPS;
    setUseGPS(newUseGPS);
    
    // Khi bật GPS và chưa có origin, reset để LocationMarker tự động lấy
    if (newUseGPS && (origin.coordinates[0] === 0 && origin.coordinates[1] === 0)) {
      // LocationMarker sẽ tự động set origin
    }
    
    // Khi tắt GPS, giữ nguyên origin hiện tại
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours} giờ ${minutes} phút`
    }
    return `${minutes} phút`
  }

  const formatDistance = (meters: number) => {
    return `${(meters / 1000).toFixed(1)} km`
  }

  const canFindRoute = origin.coordinates[0] !== 0 && 
                       origin.coordinates[1] !== 0 && 
                       destination.coordinates[0] !== 0 && 
                       destination.coordinates[1] !== 0

  const hasOrigin = origin.coordinates[0] !== 0 && origin.coordinates[1] !== 0

  return (
    <div className="space-y-4 p-4">
      {/* GPS Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          {useGPS ? (
            <Satellite className="h-4 w-4 text-blue-600" />
          ) : (
            <Satellite className="h-4 w-4 text-gray-400" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-700">
              Sử dụng GPS tự động
            </p>
            <p className="text-xs text-gray-500">
              {useGPS ? 'Tự động lấy vị trí hiện tại' : 'Nhập thủ công hoặc chọn trên bản đồ'}
            </p>
          </div>
        </div>
        <button
          onClick={toggleGPS}
          disabled={pickMode !== 'none'}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
            useGPS ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              useGPS ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Active Pick Mode Banner */}
      {pickMode !== 'none' && (
        <div className={`p-4 rounded-lg border-2 ${
          pickMode === 'origin' 
            ? 'bg-green-50 border-green-300' 
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-center gap-3">
            <MousePointerClick className={`h-5 w-5 ${
              pickMode === 'origin' ? 'text-green-600' : 'text-red-600'
            } animate-bounce`} />
            <div className="flex-1">
              <p className={`font-semibold text-sm ${
                pickMode === 'origin' ? 'text-green-900' : 'text-red-900'
              }`}>
                {pickMode === 'origin' ? '📍 Chọn điểm xuất phát' : '🎯 Chọn điểm đến'}
              </p>
              <p className={`text-xs mt-0.5 ${
                pickMode === 'origin' ? 'text-green-700' : 'text-red-700'
              }`}>
                Click vào bản đồ để chọn vị trí 
              </p>
            </div>
            <button
              onClick={() => setPickMode('none')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                pickMode === 'origin'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Điểm xuất phát */}
      <div className="space-y-2">
        <label 
          htmlFor="start-location"
          className="text-sm font-medium text-gray-700 flex items-center gap-2"
        >
          Điểm xuất phát
          {hasOrigin && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              ✓ Đã xác định
            </span>
          )}
          {useGPS && !hasOrigin && (
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <RefreshCw className="h-3 w-3 animate-spin" />
              GPS
            </span>
          )}
        </label>
        <div className="flex gap-2">
          <input 
            id="start-location"
            type="text"
            value={origin.coordinates.join(', ')}
            onChange={(e) => handleOriginChange(e.target.value)}
            placeholder={useGPS ? "Tự động lấy vị trí GPS..." : "Nhập tọa độ hoặc chọn trên bản đồ"}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            disabled={pickMode !== 'none'}
          />
          <button
            type="button"
            onClick={togglePickOrigin}
            disabled={pickMode === 'destination'}
            title="Chọn trên bản đồ"
            className={`inline-flex items-center justify-center px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
              pickMode === 'origin'
                ? 'bg-green-600 text-white hover:bg-green-700 scale-110'
                : 'border border-gray-300 bg-white hover:bg-gray-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <MousePointerClick className="h-4 w-4" />
          </button>
        </div>
        
        {/* Info về GPS */}
        {useGPS && !hasOrigin && pickMode === 'none' && (
          <p className="text-xs text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
            <Satellite className="h-3 w-3" />
            Đang lấy vị trí GPS tự động...
          </p>
        )}
        
        {!useGPS && !hasOrigin && pickMode === 'none' && (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            GPS đã tắt. Vui lòng nhập tọa độ hoặc chọn trên bản đồ
          </p>
        )}
      </div>

      {/* Điểm đến */}
      <div className="space-y-2">
        <label 
          htmlFor="end-location"
          className="text-sm font-medium text-gray-700"
        >
          Điểm đến
        </label>
        <div className="flex gap-2">
          <input 
            id="end-location"
            type="text"
            value={destination.coordinates.join(', ')}
            disabled
            placeholder="Chọn địa điểm hoặc click trên bản đồ"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
          />
          <button
            type="button"
            onClick={togglePickDestination}
            disabled={pickMode === 'origin'}
            title="Chọn trên bản đồ"
            className={`inline-flex items-center justify-center px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
              pickMode === 'destination'
                ? 'bg-red-600 text-white hover:bg-red-700 scale-110'
                : 'border border-gray-300 bg-white hover:bg-gray-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <MapPinned className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Helper Text */}
      {pickMode === 'none' && (
        <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-md border border-gray-200">
          <div className="text-gray-600 text-xs mt-0.5">ℹ️</div>
          <p className="text-xs text-gray-600">
            {useGPS 
              ? 'GPS tự động đang bật. Nhấn ' 
              : 'Nhấn '}
            <MousePointerClick className="inline h-3 w-3" /> để chọn vị trí trên bản đồ
          </p>
        </div>
      )}

      {/* Phương thức di chuyển */}
      <div className="space-y-2">
        <label 
          htmlFor="profile"
          className="text-sm font-medium text-gray-700"
        >
          Phương thức
        </label>
        <select 
          id="profile"
          value={profile} 
          onChange={(e) => setProfile(e.target.value as any)}
          disabled={pickMode !== 'none'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="driving-traffic">🚗 Lái xe (có giao thông)</option>
          <option value="driving">🚙 Lái xe</option>
          <option value="walking">🚶 Đi bộ</option>
          <option value="cycling">🚴 Đạp xe</option>
        </select>
      </div>

      {/* Nút tìm đường */}
      <div className="flex gap-2">
        <button 
          onClick={() => fetchDirections(profile)}
          disabled={loading || !canFindRoute || pickMode !== 'none'}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Đang tìm đường...
            </>
          ) : (
            <>
              <Navigation className="mr-2 h-4 w-4" />
              Tìm đường
            </>
          )}
        </button>
        
        {direction && (
          <button 
            onClick={() => clearRoute(true)}
            disabled={pickMode !== 'none'}
            title="Xóa tuyến đường"
            className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Thông báo */}
      {!canFindRoute && !error && pickMode === 'none' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-600">
            💡 {!hasOrigin 
              ? (useGPS ? 'Đang lấy vị trí GPS...' : 'Vui lòng chọn điểm xuất phát') 
              : 'Vui lòng chọn điểm đến để tìm đường'}
          </p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Thông tin route */}
      {direction && (
        <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="font-semibold flex items-center gap-2 text-gray-900">
            <RouteIcon className="h-4 w-4" />
            Thông tin lộ trình
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">
                Thời gian: <strong className="text-gray-900">{formatDuration(direction.duration)}</strong>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <RouteIcon className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">
                Khoảng cách: <strong className="text-gray-900">{formatDistance(direction.distance)}</strong>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


export default RoutingTab
