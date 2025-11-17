
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Destination = {
  name: string;
  place: string;
  rating: number;
  img: string;
};

type DestinationSliderProps = {
  destinations: Destination[];
  onSelect: (img: string) => void;
};

const DestinationSlider: React.FC<DestinationSliderProps> = ({ 
  destinations, 
  onSelect 
}) => {
  // Detect mobile TRƯỚC KHI render slider
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 5,  // ✅ Set ngay từ đầu
    slidesToScroll: isMobile ? 1 : 3,
    initialSlide: 0,
    centerMode: false,
    variableWidth: false,
    arrows: !isMobile,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: { 
          slidesToShow: 4, 
          slidesToScroll: 1,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: { 
          slidesToShow: 3, 
          slidesToScroll: 1,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: { 
          slidesToShow: 2, 
          slidesToScroll: 1,
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: { 
          slidesToShow: 1, 
          slidesToScroll: 1,
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="w-full h-full px-4 sm:px-8 flex items-center lg:bg-black/20 pt-6 lg:backdrop-blur-sm pb-12 lg:pt-32 lg:pb-0 sm:h-[100vh]">
      <Slider {...settings} className="w-full">
        {destinations.map((destination, index) => (
          <div key={`${destination.name}-${index}`} className="px-2">
            <div
              className="bg-white/10 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              onClick={() => onSelect(destination.img)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelect(destination.img);
                }
              }}
              aria-label={`View ${destination.name} in ${destination.place}`}
            >
              <img 
                src={destination.img} 
                alt={destination.name} 
                className="w-full h-40 sm:h-48 object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <p className="text-xs sm:text-sm text-blue-300 font-medium mb-1">
                  {destination.place}
                </p>
                <p className="text-sm sm:text-base text-white font-bold line-clamp-2 min-h-[2.5rem] leading-snug mb-2">
                  {destination.name}
                </p>
                <div className="flex items-center gap-1" aria-label={`Rating: ${destination.rating} out of 5 stars`}>
                  {Array.from({ length: destination.rating }, (_, i) => (
                    <span 
                      key={i} 
                      className={i < destination.rating ? 'text-yellow-400' : 'text-gray-500'}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default DestinationSlider;