import React, { useState, useEffect, useRef } from "react";
import circularEconomyImg from "../assets/images/circular_economy.png";
import SquareGrid from "../components/SquareGrid/SquareGrid";
import Carousel from "../components/Carousel/Carousel";
import DepositThumbnail from "../components/DepositThumbnail/DepositThumbnail";
import { getAuthHeaders } from "../utils/jwtAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Deposit = () => {
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [objectsByCategory, setObjectsByCategory] = useState({});
  const [filteredObjectsByCategory, setFilteredObjectsByCategory] = useState({});
  const carouselRefs = useRef([]);

  useEffect(() => {
    // Fetch des données de l'API
    const fetchCatalogueData = async () => {
      try {
        const response = await fetch("/catalog"); // { headers: { 'Authorization': getAuthHeaders } } fait bugger !
        const data = await response.json();

        // Extraire les catégories
        const categories = data.objectTypes.map((type) => ({
          label: type.label,
          id_object_type: type.id_object_type,
        }));

        // Grouper les objets par catégorie
        const groupedObjects = categories.reduce((acc, category) => {
          acc[category.label] = data.objects.filter(
            (obj) => obj.category === category.label
          );
          return acc;
        }, {});

        setCategories(categories);
        setObjectsByCategory(groupedObjects);
        setFilteredObjectsByCategory(groupedObjects); // Initialiser les objets filtrés avec tous les objets
      } catch (error) {
        console.error("Erreur lors du fetch des données :", error);
      }
    };

    fetchCatalogueData();
  }, []);

  // Fonction pour filtrer les objets en fonction du texte de recherche
  const filterObjects = (searchText) => {
    const filtered = {};
    Object.keys(objectsByCategory).forEach((category) => {
      filtered[category] = objectsByCategory[category].filter(
        (obj) =>
          obj.title.toLowerCase().includes(searchText.toLowerCase()) || // Recherche par nom d'objet
          category.toLowerCase().includes(searchText.toLowerCase()) // Recherche par catégorie
      );
    });
    setFilteredObjectsByCategory(filtered);
  };

  // Gérer le changement de texte dans la barre de recherche
  const handleChange = (event) => {
    const text = event.target.value;
    setSearchText(text);
    filterObjects(text); // Filtrer les objets en temps réel
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
      <img
        src={circularEconomyImg}
        alt="Circular Economy"
        className="absolute top-1 right-1 w-1/5 h-auto"
      />
      <h1 className="text-4xl font-poppins max-w-[51%] pt-[150px] pl-[60px]">
        Bienvenue dans le catalogue, explorez nos catégories et articles disponibles !
      </h1>
      <div className="flex justify-center items-center mt-8">
        <div className="flex items-center bg-white rounded-full shadow-md w-1/2 p-2">
          <input
            type="text"
            value={searchText}
            onChange={handleChange}
            placeholder="Rechercher un objet"
            className="bg-white text-black px-4 py-2 rounded-full focus:outline-none w-full"
          />
          <FontAwesomeIcon icon={faSearch} className="h-6 w-6 text- mr-3"/>
        </div>
      </div>
      <SquareGrid
        items={categories.map((category, index) => ({
          label: category.label,
          onClick: () => handleCategoryClick(index),
        }))}
      />
      {categories.map((category, index) => (
        <div
          className="p-8"
          key={category.id_object_type}
          ref={(el) => (carouselRefs.current[index] = el)}
        >
          {filteredObjectsByCategory[category.label]?.length === 0 ? (
            <div className="text-center mt-8 text-gray-500">
              Aucun résultat trouvé pour "{searchText}" dans la catégorie {category.label}.
            </div>
          ) : (
            <Carousel
              items={filteredObjectsByCategory[category.label]?.map((obj) => (
                <DepositThumbnail key={`thumbnail-${obj.id_item}`} object={obj} />
              ))}
              title={`Objets dans la catégorie : ${category.label}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Deposit;