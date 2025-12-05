
import React, { useState, useEffect } from 'react';
import { Search, Trash2, ExternalLink, Eye, Loader2 } from 'lucide-react';
import type { Video } from '@/type/admin.types'
import axios from '../../../api/axios';

interface VideoManagementProps {
  onDeleteVideo?: (videoId: number) => void;
  onToggleStatus?: (videoId: number) => void;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const VideoManagement: React.FC<VideoManagementProps> = ({
  onDeleteVideo,
  onToggleStatus
}) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [platformFilter, setPlatformFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Fetch videos
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) params.append('search', searchTerm);
      if (platformFilter) params.append('platform', platformFilter);

      const response = await axios.get(`/admin/videos?${params.toString()}`);
      
      if (response.data.success) {
        setVideos(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      alert('Không thể tải danh sách video');
    } finally {
      setLoading(false);
    }
  };

  // Search videos by name
  const searchVideosByName = async (name: string) => {
    if (!name || name.trim() === '') {
      fetchVideos();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/admin/video/search?name=${encodeURIComponent(name)}`);
      
      if (response.data.success) {
        setVideos(response.data.data);
        // Reset pagination for search results
        setPagination({
          total: response.data.count,
          page: 1,
          limit: response.data.count,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        });
      }
    } catch (error) {
      console.error('Error searching videos:', error);
      alert('Không thể tìm kiếm video');
    } finally {
      setLoading(false);
    }
  };

  // Delete video
  const handleDeleteVideo = async (videoId: number) => {
    if (!confirm('Bạn có chắc muốn xóa video này?')) {
      return;
    }

    try {
      const response = await axios.delete(`/admin/video/${videoId}`);
      
      if (response.data.success) {
        alert('Xóa video thành công');
        fetchVideos(); // Reload list
        if (onDeleteVideo) onDeleteVideo(videoId);
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Không thể xóa video');
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchVideosByName(searchTerm);
      } else {
        fetchVideos();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch videos when filters or page changes
  useEffect(() => {
    if (!searchTerm) {
      fetchVideos();
    }
  }, [platformFilter, pagination.page]);

  // Initial load
  useEffect(() => {
    fetchVideos();
  }, []);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Youtube':
        return 'bg-red-100 text-red-600';
      case 'TikTok':
        return 'bg-black text-white';
      case 'Instagram':
        return 'bg-pink-100 text-pink-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Filter videos by status on frontend (if needed)
  const filteredVideos = statusFilter 
    ? videos.filter(video => video.status === statusFilter)
    : videos;

  return (
    <div>
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm video theo tên, channel, mô tả..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="px-4 py-2 border rounded-lg"
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
            >
              <option value="">Tất cả Platform</option>
              <option value="Youtube">Youtube</option>
              <option value="TikTok">TikTok</option>
              <option value="Instagram">Instagram</option>
            </select>
       
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        )}

        {/* Videos Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Video</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nền tảng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa điểm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Channel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVideos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Không tìm thấy video nào
                    </td>
                  </tr>
                ) : (
                  filteredVideos.map((video) => (
                    <tr key={video.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          {video.thumbnail && ( 
                                  <img
                                        referrerPolicy="no-referrer"
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-24 h-16 rounded object-cover"
                                        onError={(e) => {
                                          const target = e.currentTarget;
                                          if (!target.dataset.error) {
                                            target.dataset.error = "true";
                                            target.src =  `/tiktok.png`;
                                          }
                                        }}
                                      />
                          )}
                          <div className="max-w-xs">
                            <div className="font-medium text-gray-900 text-sm line-clamp-2">
                              {video.title}
                            </div>
                            <a 
                              href={video.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                            >
                              Xem video <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPlatformColor(video.platform)}`}>
                          {video.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {video.place?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{video.channel || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm">
                          <Eye className="w-3 h-3 text-gray-400" />
                          <span>{video.views.toLocaleString()}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={() => handleDeleteVideo(video.id)}
                          className="p-1 hover:bg-red-50 rounded text-red-600"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredVideos.length > 0 && (
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Hiển thị {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số {pagination.total} videos
            </p>
            <div className="flex gap-2">
              <button 
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={!pagination.hasPrev}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Trước
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded ${
                      pagination.page === pageNum
                        ? 'bg-orange-600 text-white'
                        : 'border hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!pagination.hasNext}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default VideoManagement;

