import React from "react";
const SquareGrid = ({ items }) => {

  const categorieImages = items.map(item => {
    let formattedLabel = item.label.replace(/ /g, '_').replace(/é/g, 'e').replace(/'/g, '_').toLowerCase();
    if (formattedLabel.endsWith('_')) {
      formattedLabel = formattedLabel.slice(0, -1);
    }
    return formattedLabel;
  });

  console.log(categorieImages);
  return (
    <div className="flex flex-wrap gap-5 justify-center mt-16">
      {items.map((item, index) => (
        <div
          key={index}
          onClick={item.onClick}
          className="w-44 h-44 flex justify-center items-center rounded-lg shadow-md hover:bg-gray-400 transition-colors cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300"
          style={{ 
            backgroundImage: `url(/${categorieImages[index]}.jpg)`, 
            backgroundSize: "cover" ,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <span className="text-white text-2xl font-bold bg-yellowGreen1 w-full text-center bg-opacity-80">
            {item.label}
          </span>
          
        </div>
      ))}
    </div>
  );
};

export default SquareGrid;
