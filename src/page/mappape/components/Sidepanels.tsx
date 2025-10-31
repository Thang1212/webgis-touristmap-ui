import React from "react";
import ResponsiveFilterPanel from "./ResponsiveFilterPanel";
import ResponsiveDetailsPanel from "./ResponsiveDetailsPanel";

interface SidePanelsProps {
  isFilterOpen: boolean;
  isDetailOpen: boolean;
  selectedPlace: any;
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
  return (
    <>
      {/* Filter Panel */}
      <div
        className={`
          fixed lg:relative
          inset-y-0 left-0
          w-[85vw] sm:w-60 lg:w-60 xl:w-80
          bg-transparent
          shadow-2xl lg:shadow-none
          transform transition-transform duration-300 ease-in-out
          ${isFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          overflow-y-hidden
          overflow-x-hidden
          pt-10
        `}
      >
        <ResponsiveFilterPanel isOpen={isFilterOpen} onClose={onFilterClose} />
      </div>

      {/* Filter Overlay */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm  lg:hidden"
          onClick={onFilterClose}
        />
      )}

      {/* Details Panel */}
      {selectedPlace && (
        <>
          <div
            className={`
              fixed lg:relative
              inset-y-0 right-0
              w-full sm:w-96 lg:w-96 xl:w-[450px]
             
              
              bg-white
              transform transition-transform duration-300 ease-in-out
              ${isDetailOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
              overflow-y-auto
            `}
          >
            <ResponsiveDetailsPanel
              isOpen={isDetailOpen}
              onClose={onDetailClose}
            />
          </div>

          {/* Details Overlay */}
          {isDetailOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 "
              onClick={onDetailClose}
            />
          )}
        </>
      )}
    </>
  );
};