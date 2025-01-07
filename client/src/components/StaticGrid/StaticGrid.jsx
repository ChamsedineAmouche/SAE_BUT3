import React from "react";

const StaticGrid = ({ items }) => {
  return (
    <div className="flex flex-wrap gap-5 justify-center mt-16">
      {items.map((item, index) => (
        <div
          key={index}
          onClick={item.onClick} // Appel de la fonction onClick passée en prop
          className="w-80 h-80 bg-gray-300 text-black flex justify-center items-center rounded-lg shadow-md hover:bg-gray-400 transition-colors"
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default StaticGrid;