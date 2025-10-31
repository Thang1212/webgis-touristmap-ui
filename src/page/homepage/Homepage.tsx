import React, { useState } from 'react'
import Hero from './components/Hero';
import DestinationSlider from './components/DestinationSlider';
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
 
const Homepage = () => {
  const [bgImage, setBgImage] = useState("/src/assets/homepage4.jpg");
 
  const destinations = [
    { name: "Mount Bromo safdsgdthfyjgukhiloperdgthfygjuhkijlo", place: "East Java", rating: 5, img: "/src/assets/homepage.jpg" },
    { name: "Ejen Crater", place: "East Java", rating: 4, img: "/src/assets/homepage2.jpg" },
    { name: "Jomblang Cave", place: "East Java", rating: 4, img: "/src/assets/homepage3.jpg" },
    { name: "Mount Bromo", place: "East Java", rating: 5, img: "/src/assets/homepage4.jpg" },
    { name: "Mount Bromo", place: "East Java", rating: 5, img: "/src/assets/homepage.jpg" },
    { name: "Mount Bromo", place: "East Java", rating: 5, img: "/src/assets/homepage.jpg" },

  ];

  return (
    <div className="relative w-full h-screen overflow-hidden text-white ">
      {/* Background image */}
      <img
        src={bgImage}  // ✅ dùng state thay vì ảnh cố định
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 "
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      <ResizablePanelGroup direction='horizontal' className="relative z-10 flex w-full h-full  flex-col sm:flex-row">
        {/* Hero content bên trái */}
       
        <Hero />
        <ResizableHandle />
       
        <DestinationSlider
          destinations={destinations}
          onSelect={(img : string) => setBgImage(img)} 
        />
       
      </ResizablePanelGroup>
    </div>
  );
}

export default Homepage;
