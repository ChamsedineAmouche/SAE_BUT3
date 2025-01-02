import React, { useState, useEffect, useRef } from "react";
import circularEconomyImg from "../assets/images/circular_economy.png";
import SquareGrid from "../components/SquareGrid/SquareGrid";
import Carousel from "../components/Carousel/Carousel";
import DepositThumbnail from "../components/DepositThumbnail/DepositThumbnail"; // Importer le composant DepositThumbnail

const Deposit = () => {
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [objectsByCategory, setObjectsByCategory] = useState({});

  // Références des carousels pour le défilement
  const carouselRefs = useRef([]);

  useEffect(() => {
    // Fetch des données de l'API
    const fetchCatalogueData = async () => {
      try {
        const response = await fetch("/catalog");
        const data = await response.json();

        // Extraire les catégories et objets
        const categories = data.objectTypes;
        const objects = data.objects;

        // Grouper les objets par catégorie
        const groupedObjects = categories.reduce((acc, category) => {
          acc[category.label] = objects.filter(
            (obj) => obj.id_object_type === category.id_object_type
          );
          return acc;
        }, {});

        setCategories(categories);
        setObjectsByCategory(groupedObjects);
      } catch (error) {
        console.error("Erreur lors du fetch des données :", error);
      }
    };

    fetchCatalogueData();
  }, []);

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleCategoryClick = (index) => {
    // Défilement vers le carousel correspondant
    carouselRefs.current[index].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="catalogue relative">
      {/* Image en haut à droite */}
      <img
        src={circularEconomyImg}
        alt="Circular Economy"
        className="absolute top-1 right-1 w-1/5 h-auto"
      />

      <h1 className="text-4xl font-poppins max-w-[51%] pt-[150px] pl-[60px]">
        Bienvenue dans le catalogue, explorez nos catégories et articles disponibles !
      </h1>

      {/* Barre de recherche */}
      <div className="flex justify-center items-center mt-8">
        <div className="flex items-center bg-white rounded-full shadow-md w-1/2 p-2">
          <input
            type="text"
            value={searchText}
            onChange={handleChange}
            placeholder="Rechercher un objet"
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

      {/* Grille des catégories */}
      <SquareGrid
        items={categories.map((category, index) => ({
          label: category.label,
          onClick: () => handleCategoryClick(index),
        }))}
      />

      {/* Carousels par catégorie */}
      {categories.map((category, index) => (
        <div
          className="p-8"
          key={category.id_object_type}
          ref={(el) => (carouselRefs.current[index] = el)} // Ajout de la référence pour le scroll
        >
          <Carousel
            items={objectsByCategory[category.label].map((obj) => (
              <DepositThumbnail key={`thumbnail-${obj.id_item}`} object={obj} />
            ))}
            title={`Objets dans la catégorie : ${category.label}`}
          />
        </div>
      ))}
    </div>
  );
};

export default Deposit;
