import React from "react";

const StaticGrid = ({ items }) => {
  console.log(items)

  if (!items || items.length <= 0) {
    return <div className="w-full h-full justify-center items-center flex text-xl text-darkGreen font-semibold">Aucun réultat</div>
  }

  return (
    <div className="flex flex-wrap gap-5 justify-center mt-16">
      {items.map((item, index) => (
        <div
          key={index}
          onClick={item.onClick}
          className="w-80 h-80 bg-gray-300 text-black flex justify-center items-center rounded-lg shadow-md hover:bg-gray-400 transition-colors"
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default StaticGrid;