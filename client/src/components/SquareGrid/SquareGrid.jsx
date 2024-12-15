import React from "react";

const SquareGrid = ({ items }) => {
  return (
    <div className="flex flex-wrap gap-5 justify-center mt-16">
      {items.map((item, index) => (
        <div 
          key={index} 
          className="w-40 h-40 bg-gray-300 text-black flex justify-center items-center rounded-lg shadow-md"
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default SquareGrid;
