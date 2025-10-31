import React from "react";

interface ResultCounterProps {
  count: number;
}

const ResultCounter: React.FC<ResultCounterProps> = ({ count }) => {
  return (
    <div className="absolute top-4 right-4 z-[1] bg-white px-4 py-2 rounded-lg shadow-lg max-md:hidden">
      <span className="text-sm">
        Hiển thị:{" "}
        <span className="font-bold text-blue-600">{count}</span> địa điểm
        </span>
    </div>
  );
};

export default ResultCounter;