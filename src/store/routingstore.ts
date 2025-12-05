// //routing store lấy dữ liệu từ mapbox direction api
// import { create } from "zustand";

// export interface Routing {
//     origin: {
//         type: 'Point';
//         coordinates: [number, number];
//     };
//     destination: {
//         type: 'Point';
//         coordinates: [number, number];
//     };
//     direction: any | null;
//     loading: boolean;
//     error: string | null;
//     useGPS: Boolean
//     pickMode: 'none' | 'origin' | 'destination'; // ⭐ NEW
//     setOrigin: (origin: [number, number]) => void;
//     setDestination: (destination: [number, number]) => void;
//     setDirection: (direction: any) => void;
//     fetchDirections: (profile?: 'driving-traffic' | 'driving' | 'walking' | 'cycling') => Promise<void>;
//     clearRoute: () => void;
//     setPickMode: (mode: 'none' | 'origin' | 'destination') => void; 
// }

// const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// export const useRoutingStore = create<Routing>((set, get) => ({
//     origin: {
//         type: 'Point',
//         coordinates: [0, 0]
//     },
//     destination: {
//         type: 'Point',
//         coordinates: [0, 0]
//     },
//     useGPS: false,
//     direction: null,
//     loading: false,
//     error: null,
//     pickMode: 'none', // ⭐ NEW
    
//     setOrigin: (coordinates) => set({
//         origin: {
//             type: 'Point',
//             coordinates
//         }
//     }),
    
//     setDestination: (coordinates) => set({
//         destination: {
//             type: 'Point',
//             coordinates
//         }
//     }),
//     setUseGPS: (useGPS) => set({ useGPS }),

//     setDirection: (direction) => set({ direction }),
    
//     setPickMode: (mode) => set({ pickMode: mode }), // ⭐ NEW

    
//     fetchDirections: async (profile = 'driving-traffic') => {
//         const { origin, destination } = get();
        
//         if (origin.coordinates[0] === 0 && origin.coordinates[1] === 0) {
//             set({ error: 'Vui lòng chọn điểm xuất phát' });
//             return;
//         }
        
//         if (destination.coordinates[0] === 0 && destination.coordinates[1] === 0) {
//             set({ error: 'Vui lòng chọn điểm đến' });
//             return;
//         }
        
//         set({ loading: true, error: null });
        
//         try {
//             const coordinates = `${origin.coordinates[0]},${origin.coordinates[1]};${destination.coordinates[0]},${destination.coordinates[1]}`;
            
//             const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?geometries=geojson&overview=full&steps=true&access_token=${MAPBOX_ACCESS_TOKEN}`;
            
//             const response = await fetch(url);
            
//             if (!response.ok) {
//                 throw new Error('Không thể lấy thông tin chỉ đường');
//             }
            
//             const data = await response.json();
            
//             if (data.routes && data.routes.length > 0) {
//                 set({ 
//                     direction: data.routes[0],
//                     loading: false,
//                     error: null
//                 });
//             } else {
//                 set({ 
//                     error: 'Không tìm thấy đường đi',
//                     loading: false 
//                 });
//             }
//         } catch (error) {
//             set({ 
//                 error: error instanceof Error ? error.message : 'Có lỗi xảy ra',
//                 loading: false 
//             });
//         }
//     },
    
//     clearRoute: () => set({ 
//     direction: null, 
//     error: null,
//     origin: {
//       type: 'Point',
//       coordinates: [0, 0]
//     }
//   })
// }));
//routing store lấy dữ liệu từ mapbox direction api
import { create } from "zustand";

export interface Routing {
    origin: {
        type: 'Point';
        coordinates: [number, number];
    };
    destination: {
        type: 'Point';
        coordinates: [number, number];
    };
    direction: any | null;
    loading: boolean;
    error: string | null;
    useGPS: boolean;
    pickMode: 'none' | 'origin' | 'destination';
    setOrigin: (origin: [number, number]) => void;
    setDestination: (destination: [number, number]) => void;
    setDirection: (direction: any) => void;
    setUseGPS: (useGPS: boolean) => void;
    fetchDirections: (profile?: 'driving-traffic' | 'driving' | 'walking' | 'cycling') => Promise<void>;
    clearRoute: () => void;
    clearOrigin: () => void; // ⭐ NEW
    clearDestination: () => void; // ⭐ NEW
    setPickMode: (mode: 'none' | 'origin' | 'destination') => void; 
}

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export const useRoutingStore = create<Routing>((set, get) => ({
    origin: {
        type: 'Point',
        coordinates: [0, 0]
    },
    destination: {
        type: 'Point',
        coordinates: [0, 0]
    },
    useGPS: false,
    direction: null,
    loading: false,
    error: null,
    pickMode: 'none',
    
    setOrigin: (coordinates) => set({
        origin: {
            type: 'Point',
            coordinates
        }
    }),
    
    setDestination: (coordinates) => set({
        destination: {
            type: 'Point',
            coordinates
        }
    }),
    
    setUseGPS: (useGPS) => set({ useGPS }),

    setDirection: (direction) => set({ direction }),
    
    setPickMode: (mode) => set({ pickMode: mode }),

    clearOrigin: () => set({ // ⭐ NEW
        origin: {
            type: 'Point',
            coordinates: [0, 0]
        },
        direction: null, // Clear route when origin is removed
        error: null
    }),

    clearDestination: () => set({ // ⭐ NEW
        destination: {
            type: 'Point',
            coordinates: [0, 0]
        },
        direction: null, // Clear route when destination is removed
        error: null
    }),
    
    fetchDirections: async (profile = 'driving-traffic') => {
        const { origin, destination } = get();
        
        if (origin.coordinates[0] === 0 && origin.coordinates[1] === 0) {
            set({ error: 'Vui lòng chọn điểm xuất phát' });
            return;
        }
        
        if (destination.coordinates[0] === 0 && destination.coordinates[1] === 0) {
            set({ error: 'Vui lòng chọn điểm đến' });
            return;
        }
        
        set({ loading: true, error: null });
        
        try {
            const coordinates = `${origin.coordinates[0]},${origin.coordinates[1]};${destination.coordinates[0]},${destination.coordinates[1]}`;
            
            const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?geometries=geojson&overview=full&steps=true&access_token=${MAPBOX_ACCESS_TOKEN}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Không thể lấy thông tin chỉ đường');
            }
            
            const data = await response.json();
            
            if (data.routes && data.routes.length > 0) {
                set({ 
                    direction: data.routes[0],
                    loading: false,
                    error: null
                });
            } else {
                set({ 
                    error: 'Không tìm thấy đường đi',
                    loading: false 
                });
            }
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Có lỗi xảy ra',
                loading: false 
            });
        }
    },
    
    clearRoute: () => set({ 
        direction: null, 
        error: null,
        origin: {
            type: 'Point',
            coordinates: [0, 0]
        },
        destination: {
            type: 'Point',
            coordinates: [0, 0]
        }
    })

}));

