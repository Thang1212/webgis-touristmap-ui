import { ResizablePanel } from "@/components/ui/resizable";
import React from "react";
import { Link } from "react-router-dom";


// bg-black/30 backdrop-blur-sm pt-32
const Hero = () => {
  return (
    <ResizablePanel className="flex flex-col justify-center px-12 w-full sm:w-1/2  min-md:bg-black/30 min-md:backdrop-blur-sm pt-32 ">
      <p className="text-lg uppercase tracking-wider">Khám phá</p>
      <h1 className="text-6xl font-bold mb-4">Phan Thiết</h1>
      <p className="mb-6 text-lg max-w-lg">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi alias quaerat saepe tempora dolore soluta excepturi ducimus nulla commodi reiciendis consequuntur dolor, facilis magnam repellendus optio recusandae odit eius maiores.
      </p>
      <button className="bg-blue-500/40 backdrop-blur-sm hover:bg-blue-700 px-6 py-3 rounded-full flex items-center gap-2 w-fit grad mb-5 ">
        <Link to="/map">Explore →</Link>
      </button>
    </ResizablePanel>
  );
};

export default Hero;
