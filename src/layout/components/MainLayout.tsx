// import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar/Navbar";
// import Footer from "./Footer/Footer";

/**
 * Main application layout wrapper
 * Provides consistent layout structure with navbar and page content
 */
const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {/* Navigation bar - fixed at top */}
      <Navbar />

      {/* Main content area - takes remaining height */}
      <main className="flex-1 w-full overflow-hidden">
        <Outlet />
      </main>

      {/* Footer - uncomment when needed */}
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;