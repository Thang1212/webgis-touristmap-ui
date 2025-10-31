import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ResizablePanel } from "@/components/ui/resizable";

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

const DestinationSlider: React.FC<DestinationSliderProps> = ({ destinations, onSelect }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 4,
    centerMode: false,
    variableWidth: false,
  
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 3, infinite: true, dots: true },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2, slidesToScroll: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };
// bg-black/30 backdrop-blur-sm  sm:bg-black/20 sm:backdrop-blur-sx
  return (
    <ResizablePanel className="sm:w-[60%] w-full px-8 flex items-center   min-md:bg-black/20 min-md:backdrop-blur-xs pt-32">
      <Slider {...settings} className="w-full">
        {destinations.map((d, index) => (
          <div key={`${d.name}-${index}`} className="px-2">
            <div
              className="bg-white/10  rounded-2xl overflow-hidden shadow-lg backdrop-blur-md cursor-pointer hover:bg-white/20 transition-all duration-300"
              onClick={() => onSelect(d.img)}
            >
              <img src={d.img} alt={d.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <p className="text-sm text-gray-300">{d.place}</p>
                <p className="text-sm text-gray-300 font-bold line-clamp-2 min-h-[2.5rem] leading-snug">
                  {d.name}
                </p>
                  <p>{"⭐".repeat(d.rating)}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </ResizablePanel>
  );
};

export default DestinationSlider;
