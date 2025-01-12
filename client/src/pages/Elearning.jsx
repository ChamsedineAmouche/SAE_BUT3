import React, { useState, useEffect, useRef } from "react";
import circularEconomyImg from "../assets/images/circular_economy.png";
import SquareGrid from "../components/SquareGrid/SquareGrid";
import Carousel from "../components/Carousel/Carousel";
import ElearningThumbnail from "../components/ElearningThumbnail/ElearningThumbnail";
import { getAuthHeaders } from "../utils/jwtAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Elearning = () => {
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [elearningsByCategory, setElearningsByCategory] = useState({});
  const [filteredElearningsByCategory, setFilteredElearningsByCategory] = useState({});
  const carouselRefs = useRef([]);

  useEffect(() => {
    // Fetch des données de l'API
    const fetchElearningData = async () => {
      try {
        const response = await fetch("/elearningList"); // { headers: { 'Authorization': getAuthHeaders } } fait bugger !
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
        setFilteredElearningsByCategory(groupedElearnings); // Initialiser les formations filtrées avec toutes les formations
      } catch (error) {
        console.error("Erreur lors du fetch des données :", error);
      }
    };

    fetchElearningData();
  }, []);

  // Fonction pour filtrer les formations en fonction du texte de recherche
  const filterElearnings = (searchText) => {
    const filtered = {};
    Object.keys(elearningsByCategory).forEach((category) => {
      filtered[category] = elearningsByCategory[category].filter(
        (elearning) =>
          elearning.title.toLowerCase().includes(searchText.toLowerCase()) || // Recherche par titre de formation
          category.toLowerCase().includes(searchText.toLowerCase()) // Recherche par catégorie
      );
    });
    setFilteredElearningsByCategory(filtered);
  };

  // Gérer le changement de texte dans la barre de recherche
  const handleChange = (event) => {
    const text = event.target.value;
    setSearchText(text);
    filterElearnings(text); // Filtrer les formations en temps réel
  };

  // Gérer le clic sur une catégorie
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
          <FontAwesomeIcon icon={faSearch} className="h-6 w-6 text- mr-3" />
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
          {filteredElearningsByCategory[category.label]?.length === 0 ? (
            <div className="text-center mt-8 text-gray-500">
              Aucun résultat trouvé pour "{searchText}" dans la catégorie {category.label}.
            </div>
          ) : (
            <Carousel
              items={filteredElearningsByCategory[category.label]?.map((elearning) => (
                <ElearningThumbnail
                  key={`thumbnail-${elearning.course_id}`}
                  elearning={elearning}
                />
              ))}
              title={`Formations dans la catégorie : ${category.label}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Elearning;