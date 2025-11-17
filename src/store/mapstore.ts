import { create } from 'zustand';
export interface Category {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export interface Place {
  id: number;
 // place_id: string;
  name: string;
  categories: Category[];
  description?: string;
  address?: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  rating?: number;
  userRatingsTotal?: number;
  phone?: string;
  website?: string;
  imageThumbnail?: string;
  open_hour?: string;
  close_hour?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Filters {
  categories: string;
  district: string;
  rating: string;
  searchText: string;
}

interface MapStore {
  places: Place[];
  filters: Filters;
  filteredPlaces: Place[];
  selectedPlace: Place | null;
  loading: boolean;
  error: string | null;

  detailsPanelMode: 'panel' | 'window';
  isDetailsPanelMinimized: boolean;
  setDetailsPanelMode: (mode: 'panel' | 'window') => void;
  setIsDetailsPanelMinimized: (minimized: boolean) => void;

  setPlaces: (places: Place[]) => void;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  setSelectedPlace: (place: Place | null) => void;
  filterPlaces: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchFilteredPlaces: () => Promise<void>;
}

// 🧠 Store
export const useMapStore = create<MapStore>((set, get) => {
  // ⚡ debounce wrapper cho API fetch
  const debouncedFetch = debounce(async () => {
    await get().fetchFilteredPlaces();
  }, 500);

  return {
    places: [],
    filters: {
      categories: '',
      district: '',
      rating: '',
      searchText: '',
    },
    filteredPlaces: [],
    selectedPlace: null,
    loading: false,  
    error: null,

    setPlaces: (places) => {
      set({ places });
      get().filterPlaces();
    },

    setFilters: (newFilters) => {
      set((state) => ({
        filters: { ...state.filters, ...newFilters }
      }));
      debouncedFetch(); //  Gọi API sau 500ms nếu không có thay đổi mới
    },

    resetFilters: () => {
      set({
        filters: {
          categories: undefined,
          district: '',
          rating: '',
          searchText: '',
        }
      });
      debouncedFetch(); // Gọi lại API sau 500ms
    },

    setSelectedPlace: (place) => set({ selectedPlace: place }),

    filterPlaces: () => {
  const { places, filters } = get();
  let filtered = places;

  if (filters.categories) {
    filtered = filtered.filter(place =>
      // ✅ Kiểm tra trong array of objects
      place.categories.some(cat => 
        cat.name.toLowerCase().includes(filters.categories.toLowerCase())
      )
    );
  }

  if (filters.district) {
    filtered = filtered.filter(place =>
      place.address?.toLowerCase().includes(filters.district.toLowerCase())
    );
  }

  if (filters.rating) {
    const minRating = parseFloat(filters.rating);
    filtered = filtered.filter(place =>
      place.rating && place.rating >= minRating
    );
  }

  if (filters.searchText) {
    const searchLower = filters.searchText.toLowerCase();
    filtered = filtered.filter(place =>
      place.name.toLowerCase().includes(searchLower) ||
      place.description?.toLowerCase().includes(searchLower) 
    );
  }

  set({ filteredPlaces: filtered });
},

    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),
fetchFilteredPlaces: async () => {
  const { filters } = get();
  set({ loading: true, error: null });

  try {
    const params = new URLSearchParams();

    if (filters.categories) params.append('categories', filters.categories);
    if (filters.district) params.append('district', filters.district);
    if (filters.rating) params.append('rating', filters.rating);
    if (filters.searchText) params.append('searchText', filters.searchText);

    // const url = `http://localhost:8000/api/places?${params.toString()}`;
    const url = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"}/places?${params.toString()}`;
    console.log("🔍 Fetching from API:", url);

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}\n${errorText}`);
    }

    const result = await response.json();

    if (result.data && result.data.length > 0) {
      const places: Place[] = result.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        categories: item.categories || [], // ✅ Giữ nguyên array
        description: item.description || undefined,
        address: item.address || undefined,
        location: item.location,
        rating: item.rating ? parseFloat(item.rating) : undefined,
        userRatingsTotal:
          item.userRatingsTotal || item.user_ratings_total
            ? parseInt(item.userRatingsTotal || item.user_ratings_total)
            : undefined,
        phone: item.phone || undefined,
        website: item.website || undefined,
        imageThumbnail: item.imageThumbnail || item.image_thumbnail || undefined,
        open_hour: item.open_hour || undefined,
        close_hour: item.close_hour || undefined,
        createdAt: item.createdAt || item.created_at || undefined,
        updatedAt: item.updatedAt || item.updated_at || undefined,
      }));

      console.log("✅ Fetched places from API:", places.length);
      console.log(places[0]);
      set({ filteredPlaces: places, loading: false });
    } else {
      console.log("❌ No places found");
      set({ filteredPlaces: [], loading: false });
    }
  } catch (error) {
    console.error("❌ Error fetching places:", error);
    set({
      error: error instanceof Error ? error.message : 'Unknown error',
      filteredPlaces: [],
      loading: false,
    });
  }
},
detailsPanelMode: 'panel',
  isDetailsPanelMinimized: false,
  
  setDetailsPanelMode: (mode) => set({ detailsPanelMode: mode }),
  setIsDetailsPanelMinimized: (minimized) => set({ isDetailsPanelMinimized: minimized })
  
  };
});
