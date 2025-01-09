import React, { useState, useEffect, useRef } from "react";
import circularEconomyImg from "../assets/images/circular_economy.png";
import SquareGrid from "../components/SquareGrid/SquareGrid";
import Carousel from "../components/Carousel/Carousel";
import ElearningThumbnail from "../components/ElearningThumbnail/ElearningThumbnail";
import {getAuthHeaders}  from "../utils/jwtAuth";

const Elearning = () => {
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [elearningsByCategory, setElearningsByCategory] = useState({});
  const carouselRefs = useRef([]);

  useEffect(() => {
    // Fetch des données de l'API
    const fetchElearningData = async () => {
      try {
        const response = await fetch("/elearningList");//{ headers: { 'Authorization': getAuthHeaders } } fait bugger !
        const data = await response.json();
        console.log(data);

        // Extraire les catégories
        const categories = data.categories.map((category) => ({
          label: category.Libelle,
          id_category: category.id,
        }));

        // Grouper les e-learnings par catégorie
        const groupedElearnings = categories.reduce((acc, category) => {
          acc[category.label] = data.eLearnings
            .filter((elearning) => elearning.id_category === category.id_category)
            .flatMap((elearning) => elearning.elearning_info);
          return acc;
        }, {});

        setCategories(categories);
        setElearningsByCategory(groupedElearnings);
      } catch (error) {
        console.error("Erreur lors du fetch des données :", error);
      }
    };

    fetchElearningData();
  }, []);

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleCategoryClick = (index) => {
    carouselRefs.current[index].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="catalogue relative">
      {/* Image décorative */}
      <img
        src={circularEconomyImg}
        alt="Circular Economy"
        className="absolute top-1 right-1 w-1/5 h-auto"
      />

      {/* Titre principal */}
      <h1 className="text-4xl font-poppins max-w-[51%] pt-[150px] pl-[60px]">
        Bienvenue sur la page e-learning, explorez nos formations et développez vos compétences !
      </h1>

      {/* Barre de recherche */}
      <div className="flex justify-center items-center mt-8">
        <div className="flex items-center bg-white rounded-full shadow-md w-1/2 p-2">
          <input
            type="text"
            value={searchText}
            onChange={handleChange}
            placeholder="Rechercher une formation"
            className="bg-white text-black px-4 py-2 rounded-full focus:outline-none w-full"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M8 11a4 4 0 118 0 4 4 0 01-8 0z"
            />
          </svg>
        </div>
      </div>

      {/* SquareGrid avec les catégories */}
      <SquareGrid
        items={categories.map((category, index) => ({
          label: category.label,
          onClick: () => handleCategoryClick(index),
        }))}
      />

      {/* Carrousels pour chaque catégorie */}
      {categories.map((category, index) => (
        <div
          className="p-8"
          key={category.id_category}
          ref={(el) => (carouselRefs.current[index] = el)}
        >
          <Carousel
            items={
              elearningsByCategory[category.label]?.map((elearning) => (
                <ElearningThumbnail
                  key={`thumbnail-${elearning.course_id}`}
                  elearning={elearning}
                />
              )) || []
            }
            title={`Formations dans la catégorie : ${category.label}`}
          />
        </div>
      ))}
    </div>
  );
};

export default Elearning;
