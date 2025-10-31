// import React, { useState } from "react";
// import { ChevronDown, ChevronUp, Layers, Settings } from "lucide-react";

// export interface LayerConfig {
//   id: string;
//   name: string;
//   visible: boolean;
//   opacity?: number;
//   color?: string;
//   icon?: string;
//   description?: string;
// }

// interface LayerControlProps {
//   layers: LayerConfig[];
//   onLayerToggle: (layerId: string) => void;
//   onOpacityChange?: (layerId: string, opacity: number) => void;
// }

// const LayerControl: React.FC<LayerControlProps> = ({
//   layers,
//   onLayerToggle,
//   onOpacityChange,
// }) => {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());

//   const toggleLayerExpanded = (layerId: string) => {
//     setExpandedLayers((prev) => {
//       const next = new Set(prev);
//       if (next.has(layerId)) {
//         next.delete(layerId);
//       } else {
//         next.add(layerId);
//       }
//       return next;
//     });
//   };

//   const visibleCount = layers.filter((l) => l.visible).length;

//   return (
//     <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg overflow-hidden min-w-[280px] max-w-[320px]">
//       {/* Header */}
//       <button
//         onClick={() => setIsExpanded(!isExpanded)}
//         className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all"
//       >
//         <div className="flex items-center gap-2">
//           <Layers size={18} />
//           <span className="font-semibold text-sm">Quản lý lớp bản đồ</span>
//         </div>
//         {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//       </button>

//       {/* Layer List */}
//       {isExpanded && (
//         <div className="max-h-[500px] overflow-y-auto">
//           <div className="p-3 space-y-2">
//             {layers.map((layer) => {
//               const isLayerExpanded = expandedLayers.has(layer.id);
              
//               return (
//                 <div
//                   key={layer.id}
//                   className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:border-gray-300"
//                 >
//                   {/* Layer Header */}
//                   <div className="flex items-center gap-3 p-3 bg-gray-50">
//                     {/* Checkbox */}
//                     <label className="relative cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={layer.visible}
//                         onChange={() => onLayerToggle(layer.id)}
//                         className="sr-only"
//                       />
//                       <div
//                         className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
//                           layer.visible
//                             ? "bg-blue-600 border-blue-600"
//                             : "bg-white border-gray-300"
//                         }`}
//                       >
//                         {layer.visible && (
//                           <svg
//                             className="w-3 h-3 text-white"
//                             fill="none"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="3"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path d="M5 13l4 4L19 7" />
//                           </svg>
//                         )}
//                       </div>
//                     </label>

//                     {/* Layer Info */}
//                     <div className="flex items-center gap-2 flex-1 min-w-0">
//                       {layer.icon && <span className="text-lg flex-shrink-0">{layer.icon}</span>}
//                       {layer.color && (
//                         <div
//                           className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
//                           style={{ backgroundColor: layer.color }}
//                         />
//                       )}
//                       <span className="text-sm font-medium text-gray-700 truncate">
//                         {layer.name}
//                       </span>
//                     </div>

//                     {/* Expand Button */}
//                     {onOpacityChange && (
//                       <button
//                         onClick={() => toggleLayerExpanded(layer.id)}
//                         className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
//                         title="Cài đặt nâng cao"
//                       >
//                         <Settings size={16} className="text-gray-600" />
//                       </button>
//                     )}

//                     {/* Status Badge */}
//                     <div
//                       className={`text-xs px-2 py-0.5 rounded-full transition-all flex-shrink-0 ${
//                         layer.visible
//                           ? "bg-green-100 text-green-700"
//                           : "bg-gray-100 text-gray-500"
//                       }`}
//                     >
//                       {layer.visible ? "Bật" : "Tắt"}
//                     </div>
//                   </div>

//                   {/* Expanded Settings */}
//                   {isLayerExpanded && onOpacityChange && (
//                     <div className="p-3 bg-white border-t border-gray-200 space-y-3">
//                       {/* Description */}
//                       {layer.description && (
//                         <p className="text-xs text-gray-600 leading-relaxed">
//                           {layer.description}
//                         </p>
//                       )}

//                       {/* Opacity Control */}
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <label className="text-xs font-medium text-gray-700">
//                             Độ trong suốt
//                           </label>
//                           <span className="text-xs font-semibold text-blue-600">
//                             {Math.round((layer.opacity || 1) * 100)}%
//                           </span>
//                         </div>
//                         <input
//                           type="range"
//                           min="0"
//                           max="100"
//                           value={(layer.opacity || 1) * 100}
//                           onChange={(e) =>
//                             onOpacityChange(layer.id, Number(e.target.value) / 100)
//                           }
//                           disabled={!layer.visible}
//                           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
//                             [&::-webkit-slider-thumb]:appearance-none
//                             [&::-webkit-slider-thumb]:w-4
//                             [&::-webkit-slider-thumb]:h-4
//                             [&::-webkit-slider-thumb]:rounded-full
//                             [&::-webkit-slider-thumb]:bg-blue-600
//                             [&::-webkit-slider-thumb]:cursor-pointer
//                             [&::-webkit-slider-thumb]:shadow-md
//                             [&::-webkit-slider-thumb]:hover:bg-blue-700
//                             [&::-webkit-slider-thumb]:transition-colors"
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       {isExpanded && (
//         <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
//           <div className="flex items-center justify-between text-xs">
//             <span className="text-gray-500">
//               Đang hiển thị:{" "}
//               <span className="font-semibold text-gray-700">
//                 {visibleCount}/{layers.length}
//               </span>{" "}
//               lớp
//             </span>
//             <button
//               onClick={() => {
//                 layers.forEach((layer) => {
//                   if (!layer.visible) onLayerToggle(layer.id);
//                 });
//               }}
//               className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
//             >
//               Bật tất cả
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LayerControl;

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Layers, Settings } from "lucide-react";

export interface LayerConfig {
  id: string;
  name: string;
  visible: boolean;
  opacity?: number;
  color?: string;
  icon?: string;
  description?: string;
}

interface LayerControlProps {
  layers: LayerConfig[];
  onLayerToggle: (layerId: string) => void;
  onOpacityChange?: (layerId: string, opacity: number) => void;
}

const LayerControl: React.FC<LayerControlProps> = ({
  layers,
  onLayerToggle,
  onOpacityChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());

  /** Toggle individual layer settings */
  const toggleLayerExpanded = (layerId: string) => {
    setExpandedLayers((prev) => {
      const next = new Set(prev);
      next.has(layerId) ? next.delete(layerId) : next.add(layerId);
      return next;
    });
  };

  /** Count visible layers */
  const visibleCount = layers.filter((l) => l.visible).length;

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg overflow-hidden min-w-[280px] max-w-[320px] translate-8">
      {/* === Header === */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all"
      >
        <div className="flex items-center gap-2">
          <Layers size={18} />
          <span className="font-semibold text-sm">Quản lý lớp bản đồ</span>
        </div>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* === Layer List === */}
      {isExpanded && (
        <div className="max-h-[500px] overflow-y-auto p-3 space-y-2">
          {layers.map((layer) => {
            const isExpandedLayer = expandedLayers.has(layer.id);

            return (
              <div
                key={layer.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all"
              >
                {/* --- Layer Row --- */}
                <div className="flex items-center gap-3 p-3 bg-gray-50">
                  {/* Checkbox */}
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={layer.visible}
                      onChange={() => onLayerToggle(layer.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                        layer.visible
                          ? "bg-blue-600 border-blue-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {layer.visible && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </label>

                  {/* Info */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {layer.icon && (
                      <span className="text-lg flex-shrink-0">{layer.icon}</span>
                    )}
                    {layer.color && (
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: layer.color }}
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {layer.name}
                    </span>
                  </div>

                  {/* Expand Settings */}
                  {onOpacityChange && (
                    <button
                      onClick={() => toggleLayerExpanded(layer.id)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Cài đặt nâng cao"
                    >
                      <Settings size={16} className="text-gray-600" />
                    </button>
                  )}

                  {/* Status */}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                      layer.visible
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {layer.visible ? "Bật" : "Tắt"}
                  </span>
                </div>

                {/* --- Expanded Settings --- */}
                {isExpandedLayer && onOpacityChange && (
                  <div className="p-3 bg-white border-t border-gray-200 space-y-3">
                    {layer.description && (
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {layer.description}
                      </p>
                    )}

                    {/* Opacity Slider */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                          Độ trong suốt
                        </label>
                        <span className="text-xs font-semibold text-blue-600">
                          {Math.round((layer.opacity || 1) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(layer.opacity || 1) * 100}
                        onChange={(e) =>
                          onOpacityChange(
                            layer.id,
                            Number(e.target.value) / 100
                          )
                        }
                        disabled={!layer.visible}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-4
                          [&::-webkit-slider-thumb]:h-4
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-blue-600
                          [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:shadow-md
                          [&::-webkit-slider-thumb]:hover:bg-blue-700
                          [&::-webkit-slider-thumb]:transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* === Footer === */}
      {isExpanded && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs flex justify-between items-center">
          <span className="text-gray-500">
            Hiển thị:{" "}
            <span className="font-semibold text-gray-700">
              {visibleCount}/{layers.length}
            </span>{" "}
            lớp
          </span>

          <button
            onClick={() =>
              layers.forEach((l) => !l.visible && onLayerToggle(l.id))
            }
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Bật tất cả
          </button>
        </div>
      )}
    </div>
  );
};

export default LayerControl;
