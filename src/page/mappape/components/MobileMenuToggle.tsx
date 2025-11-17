import React from "react";
import { Menu, X, Filter, Info } from "lucide-react";

interface MobileMenuToggleProps {
  isFilterOpen: boolean;
  isDetailOpen: boolean;
  onFilterToggle: () => void;
  onDetailToggle: () => void;
}

const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({
  isFilterOpen,
  isDetailOpen,
  onFilterToggle,
  onDetailToggle,
}) => {
  return (
    <div className="lg:hidden fixed bottom-4 left-4 z-[1000] flex flex-col gap-3">
      {/* Filter Toggle */}
      <button
        onClick={onFilterToggle}
        className={`
          p-3 rounded-full shadow-lg transition-all
          ${isFilterOpen 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-blue-600 hover:bg-blue-700'
          } text-white
        `}
        aria-label="Toggle Filter"
      >
        {isFilterOpen ? <X size={24} /> : <Filter size={24} />}
      </button>

      {/* Detail Toggle (only show when detail panel has content) */}
      {isDetailOpen && (
        <button
          onClick={onDetailToggle}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all"
          aria-label="Toggle Details"
        >
          <Info size={24} />
        </button>
      )}
    </div>
  );
};

export default MobileMenuToggle;