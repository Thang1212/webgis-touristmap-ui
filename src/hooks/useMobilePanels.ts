import { useState, useEffect } from "react";
import { BREAKPOINTS } from "../constants/map-constants";

export const useMobilePanels = (selectedPlace: any) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Auto-open detail panel on mobile when a place is selected
  useEffect(() => {
    if (selectedPlace && window.innerWidth < BREAKPOINTS.desktop) {
      setIsDetailOpen(true);
    }
  }, [selectedPlace]);

  // Close panels on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= BREAKPOINTS.desktop) {
        setIsFilterOpen(false);
        setIsDetailOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isFilterOpen,
    isDetailOpen,
    setIsFilterOpen,
    setIsDetailOpen,
  };
};