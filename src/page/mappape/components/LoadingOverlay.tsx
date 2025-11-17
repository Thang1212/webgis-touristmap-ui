import React from "react";

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-[1000] flex justify-center items-center">
      <div className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        <span>Đang tải dữ liệu...</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;