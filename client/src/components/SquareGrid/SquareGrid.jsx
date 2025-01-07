import React from "react";

const SquareGrid = ({ items }) => {
  return (
    <div className="flex flex-wrap gap-5 justify-center mt-16">
      {items.map((item, index) => (
        <div
          key={index}
          onClick={item.onClick} // Appel de la fonction onClick pour scroller
          className="w-40 h-40 bg-gray-300 text-black flex justify-center items-center rounded-lg shadow-md hover:bg-gray-400 transition-colors cursor-pointer"
        >
          {item.label} {/* Affiche le nom de la catégorie */}
        </div>
      ))}
    </div>
  );
};

export default SquareGrid;
