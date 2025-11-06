import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setShowLightbox(true);
    setIsLoading(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="mt-3">
        {images.length === 1 && (
          <img
            src={images[0]}
            alt="Review"
            onClick={() => openLightbox(0)}
            loading="lazy"
            className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
          />
        )}

        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Review ${i + 1}`}
                onClick={() => openLightbox(i)}
                loading="lazy"
                className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
              />
            ))}
          </div>
        )}

        {images.length === 3 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Review ${i + 1}`}
                onClick={() => openLightbox(i)}
                loading="lazy"
                className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
              />
            ))}
          </div>
        )}

        {images.length >= 4 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(0, 4).map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img}
                  alt={`Review ${i + 1}`}
                  onClick={() => openLightbox(i)}
                  loading="lazy"
                  className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                />
                {i === 3 && images.length > 4 && (
                  <div
                    onClick={() => openLightbox(3)}
                    className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition"
                  >
                    <span className="text-white font-bold text-lg">
                      +{images.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition z-10"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full transition z-10"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full transition z-10"
                aria-label="Ảnh sau"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          {/* Current Image */}
          <img
            src={images[currentIndex]}
            alt={`Review ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
            onLoad={() => setIsLoading(false)}
            style={{ display: isLoading ? "none" : "block" }}
          />

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm pointer-events-none">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ImageGallery;