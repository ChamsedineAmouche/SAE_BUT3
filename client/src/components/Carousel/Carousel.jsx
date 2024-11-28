import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Composant Carousel
const Carousel = ({ items, title }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4
  };

  return (
    <div className="w-full mx-auto p-4 relative">
      {/* Titre */}
      <h2 className="text-2xl font-bold text-darkGreen mb-6 flex items-center whitespace-nowrap">
        {title}
        <span className="ml-4 w-full border-b-2 border-darkGreen"></span>
      </h2>

      {/* Carousel avec React Slick */}
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={index} className="slick-slide-content">
            <p className="text-black font-semibold">{item}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
