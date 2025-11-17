
import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import DestinationSlider from './components/DestinationSlider';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const Homepage = () => {
  const [bgImage, setBgImage] = useState("/public/homepage.jpg");
  const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal");

  const destinations = [
    { name: "Bãi Đá Ông Địa", place: "Phan Thiết", rating: 4.5, img: "/public/homepage1.jpg" },
    { name: "Đồi Cát Bay", place: "Mũi Né", rating: 4.3, img: "/public/homepage2.jpg" },
    { name: "Suối Tiên", place: "Mũi Né", rating: 4.4, img: "/public/homepage3.jpg" },
    { name: "Hòn Rơm", place: "Mũi Né", rating: 4, img: "/public/homepage4.jpg" },
    { name: "Tháp Chàm Poshanu", place: "Phan Thiết", rating: 4.4, img: "/public/homepage5.jpg" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setDirection(window.innerWidth < 640 ? "vertical" : "horizontal");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden text-white">
      <img
        src={bgImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
<ResizablePanelGroup 
  direction={direction}
  className="relative z-10 w-full h-full"
>
  <ResizablePanel 
    defaultSize={direction === "horizontal" ? 30 : 65} 
    minSize={direction === "horizontal" ? 30 : 50} 
    maxSize={direction === "horizontal" ? 60 : 75}
  >
    <Hero />
  </ResizablePanel>

  <ResizableHandle />

  <ResizablePanel 
    defaultSize={direction === "horizontal" ? 70 : 35} 
    minSize={direction === "horizontal" ? 40 : 25} 
    maxSize={direction === "horizontal" ? 70 : 50}
    className='z-0'
  >
    <DestinationSlider
      destinations={destinations}
      onSelect={(img: string) => setBgImage(img)} 
    />
  </ResizablePanel>
</ResizablePanelGroup>
    </div>
  );
};

export default Homepage;