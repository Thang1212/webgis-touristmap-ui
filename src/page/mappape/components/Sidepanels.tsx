
// import React, { useEffect } from "react";
// import ResponsiveFilterPanel from "./ResponsiveFilterPanel";
// import ResponsiveDetailsPanel from "./ResponsiveDetailsPanel";
// import type { Place } from "@/type/Place";

// interface SidePanelsProps {
//   isFilterOpen: boolean;
//   isDetailOpen: boolean;
//   selectedPlace: Place | null;
//   onFilterClose: () => void;
//   onDetailClose: () => void;
// }

// export const SidePanels: React.FC<SidePanelsProps> = ({
//   isFilterOpen,
//   isDetailOpen,
//   selectedPlace,
//   onFilterClose,
//   onDetailClose,
// }) => {
//   // Handle escape key for closing panels
//   React.useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         if (isDetailOpen && selectedPlace) {
//           onDetailClose();
//         } else if (isFilterOpen) {
//           onFilterClose();
//         }
//       }
//     };

//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [isFilterOpen, isDetailOpen, selectedPlace, onFilterClose, onDetailClose]);

//   // Prevent body scroll when mobile panels are open
// useEffect(() => {
//     const handleResize = () => {
//       const isMobile = window.innerWidth < 1024;
//       if ((isFilterOpen || isDetailOpen) && isMobile) {
//         document.body.style.overflow = "hidden";
//       } else {
//         document.body.style.overflow = "";
//       }
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);

//     return () => {
//       document.body.style.overflow = "";
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [isFilterOpen, isDetailOpen]);

//   return (
//     <>
//       {/* Filter Panel */}
//       <div
//         className={`
//           fixed lg:relative
//           inset-y-0 left-0
//           w-[85vw] sm:w-60 lg:w-60 xl:w-80
//           bg-transparent
//           shadow-2xl lg:shadow-none
//           transform transition-transform duration-300 ease-in-out
//           ${isFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//           overflow-y-hidden overflow-x-hidden
//           pt-10
//           z-40 lg:z-auto
//         `}
//         role="complementary"
//         aria-label="Filter panel"
//       >
//         <ResponsiveFilterPanel isOpen={isFilterOpen} onClose={onFilterClose} />
//       </div>

//       {/* Details Panel */}
//       {selectedPlace && (
//         <div
//           className={`
//             fixed lg:relative
//             inset-y-0 right-0
//             w-full sm:w-96 lg:w-96 xl:w-[450px]
//             bg-white
//             shadow-2xl lg:shadow-none
//             transform transition-transform duration-300 ease-in-out
//             ${isDetailOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
//             overflow-y-auto
//             z-50 lg:z-auto
//           `}
//           role="complementary"
//           aria-label="Details panel"
//         >
//           <ResponsiveDetailsPanel
//             isOpen={isDetailOpen}
//             onClose={onDetailClose}
//           />
//         </div>
//       )}

//       {/* Filter Overlay */}
//       {isFilterOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden z-30"
//           onClick={onFilterClose}
//           role="presentation"
//           aria-hidden="true"
//         />
//       )}

//       {/* Details Overlay */}
//       {selectedPlace && isDetailOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 lg:hidden z-45"
//           onClick={onDetailClose}
//           role="presentation"
//           aria-hidden="true"
//         />
//       )}
//     </>
//   );
// };
// components/mappape/components/Sidepanels.tsx

import React, { useEffect } from "react";
import ResponsiveFilterPanel from "./ResponsiveFilterPanel";
import ResponsiveDetailsPanel from "./ResponsiveDetailsPanel";
import type { Place } from "@/type/Place";
import { useMapStore } from "@/store/mapstore";

interface SidePanelsProps {
  isFilterOpen: boolean;
  isDetailOpen: boolean;
  selectedPlace: Place | null;
  onFilterClose: () => void;
  onDetailClose: () => void;
}

export const SidePanels: React.FC<SidePanelsProps> = ({
  isFilterOpen,
  isDetailOpen,
  selectedPlace,
  onFilterClose,
  onDetailClose,
}) => {
  const { detailsPanelMode } = useMapStore();
  
  // Handle escape key for closing panels
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isDetailOpen && selectedPlace) {
          onDetailClose();
        } else if (isFilterOpen) {
          onFilterClose();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFilterOpen, isDetailOpen, selectedPlace, onFilterClose, onDetailClose]);

  // Prevent body scroll when mobile panels are open
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      if ((isFilterOpen || isDetailOpen) && isMobile) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", handleResize);
    };
  }, [isFilterOpen, isDetailOpen]);

  // In window mode, render directly without wrapper
  const isWindowMode = detailsPanelMode === 'window';

  return (
    <>
      {/* Filter Panel */}
      <div
  className={`
    fixed lg:relative
    inset-y-0 left-0
    w-[85vw] sm:w-80 lg:w-80 xl:w-80
    bg-transparent
    shadow-2xl lg:shadow-none
    transform transition-transform duration-300 ease-in-out
    ${isFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    overflow-y-hidden overflow-x-hidden
    pt-8 lg:pt-8
    pl-0 lg:pl-0
    z-40 lg:z-auto
  `}
  role="complementary"
  aria-label="Filter panel"
>
  <ResponsiveFilterPanel isOpen={isFilterOpen} onClose={onFilterClose} />
</div>

      {/* Details Panel - Panel Mode */}
      {selectedPlace && !isWindowMode && (
        <div
          className={`
            fixed lg:relative
            inset-y-0 right-0
            w-full sm:w-96 lg:w-96 xl:w-[450px]
            bg-white
            shadow-2xl lg:shadow-none
            transform transition-transform duration-300 ease-in-out
            ${isDetailOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
            overflow-y-auto
            z-50 lg:z-auto
          `}
          role="complementary"
          aria-label="Details panel"
        >
          <ResponsiveDetailsPanel
            isOpen={isDetailOpen}
            onClose={onDetailClose}
          />
        </div>
      )}

      {/* Details Panel - Window Mode (rendered separately, floating) */}
      {selectedPlace && isWindowMode && (
        <ResponsiveDetailsPanel
          isOpen={isDetailOpen}
          onClose={onDetailClose}
        />
      )}

      {/* Filter Overlay */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden z-30"
          onClick={onFilterClose}
          role="presentation"
          aria-hidden="true"
        />
      )}

      {/* Details Overlay - Only for mobile panel mode */}
      {selectedPlace && isDetailOpen && !isWindowMode && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40 "
          onClick={onDetailClose}
          role="presentation"
          aria-hidden="true"
        />
      )}
    </>
  );
};
