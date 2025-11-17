import React, { useEffect, useState, useCallback, useRef } from "react";
import { MapPin, Star, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Place, type Category, useMapStore } from "../../../store/mapstore";
import axios from '../../../api/axios';
import toast from "react-hot-toast";

interface NearbyTabProps {
  place: Place | null;
  onPlaceClick?: (place: Place) => void;
}

interface NearbyPlace extends Place {
  distance: number;
  distanceKm: string;
  thumbnail_url?: string;
}

const NearbyTab: React.FC<NearbyTabProps> = ({ place, onPlaceClick }) => {
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const {
        setSelectedPlace,
      } = useMapStore();
  // Filter states
  const [radius, setRadius] = useState<number>(3000);
  const [categoryId, setCategoryId] = useState<number | "all">("all");

  // Ref for intersection observer
  const observerTarget = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 20;

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      const data: Category[] = res.data.data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        placeCount: Number(cat.placeCount || 0),
      }));
      setCategories(data);
    } catch (err: any) {
      toast.error("Lỗi khi tải danh mục");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch nearby places
  const fetchNearby = useCallback(
    async (pageNum: number, isLoadMore = false) => {
      if (!place || !place.location?.coordinates) return;

      const [lng, lat] = place.location.coordinates;
      
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setNearbyPlaces([]);
        setPage(1);
        setHasMore(true);
      }
      
      setError(null);

      try {
        const offset = (pageNum - 1) * ITEMS_PER_PAGE;
        const params = new URLSearchParams({
          latitude: String(lat),
          longitude: String(lng),
          radius: String(radius),
          limit: String(ITEMS_PER_PAGE),
          offset: String(offset),
          ...(categoryId !== "all" ? { categories: String(categoryId) } : {}),
        });

        const res = await axios.get(`/places/nearby?${params.toString()}`);
        const data = res.data;

        if (!data.data) throw new Error("Không có dữ liệu");

        const places: NearbyPlace[] = data.data.map((item: any) => ({
          ...item,
          distance: Math.round(item.distance),
          distanceKm:item.distance >= 1000 ?  ((item.distance || 0) / 1000).toLocaleString() + " km" : (item.distance.toLocaleString()) + " m",
          thumbnail_url: item.thumbnail_url || item.imageThumbnail || item.image_thumbnail,
        }));

        if (isLoadMore) {
          setNearbyPlaces((prev) => [...prev, ...places]);
        } else {
          setNearbyPlaces(places);
        }

        // Check if there are more items
        setHasMore(places.length === ITEMS_PER_PAGE);
      } catch (err) {
        console.error("❌ Error fetching nearby:", err);
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
        if (!isLoadMore) {
          setNearbyPlaces([]);
        }
        toast.error("Không thể tải địa điểm gần đây");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [place, radius, categoryId]
  );

  // Load more function
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNearby(nextPage, true);
    }
  }, [page, loadingMore, hasMore, fetchNearby]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loading, loadMore]);

  // Debounce for filter changes
  const debounce = (fn: Function, delay = 500) => {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };
  
  const debouncedFetch = useCallback(
    debounce(() => fetchNearby(1, false), 500),
    [fetchNearby]
  );

  // Reset and fetch when filters change
  useEffect(() => {
    if (place) {
      debouncedFetch();
    }
  }, [radius, categoryId, place]);

  // Initial fetch
  useEffect(() => {
    if (place) {
      fetchNearby(1, false);
    }
  }, [place]);

  if (!place) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Navigation size={48} className="text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">Chọn một địa điểm để xem các điểm gần đó</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gray-50/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Navigation size={18} className="text-blue-600" />
            <h3 className="font-semibold text-gray-800">Địa điểm gần đây</h3>
          </div>
          <span className="text-xs text-gray-500 bg-white px-2.5 py-1 rounded-full border">
            {nearbyPlaces.length} kết quả
          </span>
        </div>

        {/* Simple Filters */}
        <div className="flex items-center gap-3">
          {/* Radius Select */}
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
            disabled={loading}
          >
            <option value={1000}>Trong 1 km</option>
            <option value={2000}>Trong 2 km</option>
            <option value={3000}>Trong 3 km</option>
            <option value={5000}>Trong 5 km</option>
            <option value={10000}>Trong 10 km</option>
          </select>

          {/* Category Select */}
          <select
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
            disabled={loading}
          >
            <option value="all">Tất cả loại</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {loading && nearbyPlaces.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-sm text-gray-500">Đang tải địa điểm...</p>
          </div>
        )}

        {error && nearbyPlaces.length === 0 && (
          <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && nearbyPlaces.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <MapPin size={48} className="text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 mb-1">Không tìm thấy địa điểm nào</p>
            <p className="text-xs text-gray-400">Thử mở rộng bán kính hoặc thay đổi loại địa điểm</p>
          </div>
        )}

        {nearbyPlaces.length > 0 && (
          <>
            <div className="p-4 space-y-3">
              {nearbyPlaces.map((p, index) => (
                <div
                  key={`${p.id}-${index}`}
                  onClick={() => {
                     setSelectedPlace(p)
                    onPlaceClick?.(p)
                  }}
                  className="group flex items-start gap-3 border rounded-xl p-3 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer bg-white"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                    {p.thumbnail_url ? (
                      <img referrerPolicy="no-referrer"
                        src={p.thumbnail_url}
                        alt={p.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-blue-600 transition">
                      {p.name}
                    </h4>

                    {/* Distance & Rating */}
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Navigation size={12} className="text-blue-500" />
                        <span className="font-medium">{p.distanceKm}</span>
                      </div>
                      {p.rating && (
                        <div className="flex items-center gap-1 text-xs">
                          <Star size={12} className="text-yellow-500 fill-yellow-500" />
                          <span className="font-medium text-gray-900">{p.rating.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    {p.address && (
                      <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                        {p.address}
                      </p>
                    )}

                    {/* Categories */}
                    {p.categories && p.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.categories.slice(0, 2).map((cat) => (
                          <span
                            key={cat.id}
                            className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="animate-spin text-blue-600 mr-2" size={20} />
                <span className="text-sm text-gray-500">Đang tải thêm...</span>
              </div>
            )}

            {/* Observer Target */}
            <div ref={observerTarget} className="h-4" />

            {/* End of Results */}
            {!hasMore && nearbyPlaces.length > 0 && (
              <div className="flex items-center justify-center py-6">
                <span className="text-xs text-gray-400">Đã hiển thị tất cả kết quả</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NearbyTab;