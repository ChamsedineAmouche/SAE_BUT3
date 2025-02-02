import React, { useState, useEffect, useRef } from "react";
import circularEconomyImg from "../assets/images/circular_economy.png";
import SquareGrid from "../components/SquareGrid/SquareGrid";
import Carousel from "../components/Carousel/Carousel";
import DepositThumbnail from "../components/DepositThumbnail/DepositThumbnail";
import StaticGrid from "../components/StaticGrid/StaticGrid";
import { getAuthHeaders } from "../utils/jwtAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Deposit = () => {
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [objectsByCategory, setObjectsByCategory] = useState({});
  const [filteredObjectsByCategory, setFilteredObjectsByCategory] = useState({});
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [selectedLocation, setSelectedLocation] = useState(""); 
  const [selectedState, setSelectedState] = useState("");
  const [selectedSort, setSelectedSort] = useState(""); 
  const [userPreferences, setUserPreferences] = useState({});
  const [locations, setLocations] = useState([]); 
  const [states, setStates] = useState([]);

  const carouselRefs = useRef([]);

  useEffect(() => {
    const fetchCatalogueData = async () => {
      try {
        const response = await fetch("/catalog");
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

        // Extraire les localisations uniques
        const uniqueLocations = [
          ...new Set(data.objects.map((obj) => obj.location)),
        ];
        
        // Extraire les états uniques (si le champ "state" existe dans chaque objet)
        const uniqueStates = [
          ...new Set(data.objects.map((obj) => obj.state)),
        ];

        setCategories(categories);
        setObjectsByCategory(groupedObjects);
        setFilteredObjectsByCategory(groupedObjects);

        setLocations(uniqueLocations);
        setStates(uniqueStates);  // <--- Stocker les états
      } catch (error) {
        console.error("Erreur lors du fetch des données :", error);
      }
    };

    const fetchUserPreferences = async () => {
      try {
        const resp = await fetch("/profileParameters");
        const data = await resp.json();
        if (data.preferencesData && data.preferencesData.length > 0) {
          const prefs = data.preferencesData[0].preference;
          setUserPreferences(prefs);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des préférences :", err);
      }
    };

    fetchUserPreferences();
    fetchCatalogueData();
  }, []);

  function normalizeString(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }
  

  const filterObjects = (searchText) => {
    const normalizedSearch = normalizeString(searchText);
  
    const filtered = {};
  
    Object.keys(objectsByCategory).forEach((category) => {
      const normalizedCategory = normalizeString(category);
  
      filtered[category] = objectsByCategory[category].filter((obj) => {
        const normalizedTitle = normalizeString(obj.title);
  
        return (
          normalizedTitle.includes(normalizedSearch) ||
          normalizedCategory.includes(normalizedSearch)
        );
      });
    });
  
    setFilteredObjectsByCategory(filtered);
  };
  

  const handleChange = (event) => {
    const text = event.target.value;
    setSearchText(text);
    if (text.trim() === "") {
      setIsSearchActive(false);
    } else {
      setIsSearchActive(true);
      filterObjects(text);
    }
  };

  const handleCategoryClick = (index) => {
    const categoryLabel = categories[index].label;
    setSearchText(categoryLabel);
    setIsSearchActive(true);
    filterObjects(categoryLabel);
  };

  const resetDisplay = () => {
    setSearchText("");
    setIsSearchActive(false);
    setSelectedCategory("");
    setSelectedLocation("");
    setSelectedState("");
    setSelectedSort("");
    setFilteredObjectsByCategory(objectsByCategory);
  };

  const applyFilters = () => {
    let filteredObjects = Object.values(filteredObjectsByCategory).flat();

    if (selectedCategory) {
      filteredObjects = filteredObjects.filter(
        (obj) => obj.category === selectedCategory
      );
    }

    if (selectedLocation) {
      filteredObjects = filteredObjects.filter(
        (obj) => obj.location === selectedLocation
      );
    }

    if (selectedState) {
      filteredObjects = filteredObjects.filter(
        (obj) => obj.state === selectedState
      );
    }

    if (selectedSort === "title_asc") {
      filteredObjects.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === "title_desc") {
      filteredObjects.sort((a, b) => b.title.localeCompare(a.title));
    }
    else if (selectedSort === "date_asc") {
      filteredObjects.sort(
        (a, b) => new Date(a.date_posted) - new Date(b.date_posted)
      );
    } else if (selectedSort === "date_desc") {
      filteredObjects.sort(
        (a, b) => new Date(b.date_posted) - new Date(a.date_posted)
      );
    }

    return filteredObjects;
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
          <FontAwesomeIcon icon={faSearch} className="h-6 w-6 text- mr-3" />
        </div>
      </div>

      {/* Filtres supplémentaires, affichés en mode recherche */}
      {isSearchActive && (
        <div className="flex justify-center">
          <div className="flex gap-4 mt-16 w-4/5">
            {/* Filtre par catégorie */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-2 block w-1/2 px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.id_object_type} value={category.label}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Filtre par état */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="mt-2 block w-1/2 px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen"
            >
              <option value="">Tous les états</option>
              {states.map((etat, index) => (
                <option key={index} value={etat}>
                  {etat}
                </option>
              ))}
            </select>

            {/* Filtre de tri */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="mt-2 block w-1/2 px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen"
            >
              <option value="pertinence">Pertinence</option>
              <option value="">Trier par</option>
              <option value="title_asc">Nom (A-Z)</option>
              <option value="title_desc">Nom (Z-A)</option>
              <option value="date_asc">Date (plus ancien au plus récent)</option>
              <option value="date_desc">Date (plus récent au plus ancien)</option>
            </select>
          </div>
        </div>

        
      )}

      {/* Affichage par défaut : grilles de catégories si pas de recherche */}
      {!isSearchActive && (
        <SquareGrid
          items={categories.map((category, index) => ({
            label: category.label,
            onClick: () => handleCategoryClick(index),
          }))}
        />
      )}

      {/* Affichage en mode recherche */}
      {isSearchActive ? (
        <div className="p-8">
          <button
            onClick={resetDisplay}
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            Retour aux catégories
          </button>
          <StaticGrid
            items={applyFilters().map((obj) => (
              <DepositThumbnail key={`thumbnail-${obj.id_item}`} object={obj} />
            ))}
          />
        </div>
      ) : (
        // Mode par défaut : carrousels par catégorie
        categories.map((category, index) => (
          <div
            className="p-8"
            key={category.id_object_type}
            ref={(el) => (carouselRefs.current[index] = el)}
          >
            <Carousel
              items={filteredObjectsByCategory[category.label]?.map((obj) => (
                <DepositThumbnail key={`thumbnail-${obj.id_item}`} object={obj} />
              ))}
              title={`Objets dans la catégorie : ${category.label}`}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Deposit;
