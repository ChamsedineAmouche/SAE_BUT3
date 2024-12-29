import React, { useState } from "react";

const Carousel = ({ items, title }) => {
  const itemsPerPage = 5; // Nombre de cartes visibles par page
  const totalPages = Math.ceil(items.length / itemsPerPage); // Calcul du nombre de pages
  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full mx-auto p-4 relative">
      {/* Titre */}
      <h2 className="text-2xl font-bold text-darkGreen mb-6 flex items-center whitespace-nowrap">
        {title}
        <span className="ml-4 w-full border-b-2 border-darkGreen"></span>
      </h2>

      {/* Container principal du carousel */}
      <div className="relative overflow-hidden">
        {/* Slider */}
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentPage * 100}%)`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-none w-full md:w-1/5 px-4"
              style={{ flexBasis: `${100 / itemsPerPage}%` }}
            >
              <div className="bg-gray-200 rounded-lg shadow-xs flex items-center justify-center w-80 h-48 md:h-80">
                {item}
              </div>
            </div>
          ))}
        </div>

        {/* Boutons gauche et droite */}
        <button
          className="absolute top-1/2 -translate-y-1/2 left-1 bg-yellowGreen1 bg-opacity-60 text-gray-800 rounded-full p-3 w-12 h-12 shadow-md flex items-center justify-center hover:scale-105 transition-transform"
          onClick={handlePrev}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#333333"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <button
          className="absolute top-1/2 -translate-y-1/2 right-1 bg-yellowGreen1 bg-opacity-60 text-gray-800 rounded-full p-3 w-12 h-12 shadow-md flex items-center justify-center hover:scale-105 transition-transform"
          onClick={handleNext}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#333333"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-2 h-2 rounded-full ${
              currentPage === index
                ? "bg-yellowGreen1"
                : "bg-gray-300 hover:bg-yellowGreen1"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
