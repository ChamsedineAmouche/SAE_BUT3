import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import circularEconomyImg from "../assets/images/circular_economy.png";
import SquareGrid from "../components/SquareGrid/SquareGrid";
import Carousel from "../components/Carousel/Carousel";
import DepositThumbnail from "../components/DepositThumbnail/DepositThumbnail";
import StaticGrid from "../components/StaticGrid/StaticGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Deposit() {
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [objectsByCategory, setObjectsByCategory] = useState({});
  const [filteredObjectsByCategory, setFilteredObjectsByCategory] = useState({});
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  const [locations, setLocations] = useState([]);
  const [states, setStates] = useState([]);

  const carouselRefs = useRef([]);

  // ----- Lecture des paramètres depuis l'URL -----
  const [searchParams] = useSearchParams();
  const paramSearchText = searchParams.get("searchText") || "";
  const paramCategory = searchParams.get("category") || "";
  const paramState = searchParams.get("state") || "";
  const paramLocation = searchParams.get("location") || "";
  const paramSort = searchParams.get("sort") || "";

  useEffect(() => {
    const fetchCatalogueData = async () => {
      try {
        const response = await fetch("/catalog");
        const data = await response.json();

        const cat = data.objectTypes.map((type) => ({
          label: type.label,
          id_object_type: type.id_object_type,
        }));

        const grouped = cat.reduce((acc, c) => {
          acc[c.label] = data.objects.filter(
            (obj) => obj.category === c.label
          );
          return acc;
        }, {});

        const uniqueLocations = [...new Set(data.objects.map((obj) => obj.location))];
        const uniqueStates = [...new Set(data.objects.map((obj) => obj.state))];

        setCategories(cat);
        setObjectsByCategory(grouped);
        setFilteredObjectsByCategory(grouped);
        setLocations(uniqueLocations);
        setStates(uniqueStates);
      } catch (error) {
        console.error("Erreur fetch /catalog:", error);
      }
    };

    fetchCatalogueData();
  }, []);

  // ----- À chaque fois que les paramètres changent, on met à jour l'état -----
  useEffect(() => {
    // Si au moins un paramètre n'est pas vide, on active le mode recherche
    if (paramSearchText || paramCategory || paramState || paramLocation || paramSort) {
      setIsSearchActive(true);
      setSearchText(paramSearchText);
      setSelectedCategory(paramCategory);
      setSelectedState(paramState);
      setSelectedLocation(paramLocation);
      setSelectedSort(paramSort);
    }
  }, [paramSearchText, paramCategory, paramState, paramLocation, paramSort]);

  function normalizeString(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  // ----- Filtrage par mot-clé -----
  const filterObjects = (text) => {
    const normalizedSearch = normalizeString(text);
    const filtered = {};
    Object.keys(objectsByCategory).forEach((cat) => {
      const normalizedCat = normalizeString(cat);
      filtered[cat] = objectsByCategory[cat].filter((obj) => {
        const normalizedTitle = normalizeString(obj.title);
        return (
          normalizedTitle.includes(normalizedSearch) ||
          normalizedCat.includes(normalizedSearch)
        );
      });
    });
    setFilteredObjectsByCategory(filtered);
  };

  // ----- Gérer le champ de recherche local (input) -----
  const handleChange = (e) => {
    const val = e.target.value;
    setSearchText(val);
    if (!val.trim()) {
      setIsSearchActive(false);
      setFilteredObjectsByCategory(objectsByCategory);
    } else {
      setIsSearchActive(true);
      filterObjects(val);
    }
  };

  const handleCategoryClick = (index) => {
    const catLabel = categories[index].label;
    setSearchText(catLabel);
    setIsSearchActive(true);
    filterObjects(catLabel);
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

  // ----- Appliquer les filtres (catégorie, état, tri...) -----
  const applyFilters = () => {
    let items = Object.values(filteredObjectsByCategory).flat();

    if (selectedCategory) {
      items = items.filter((obj) => obj.category === selectedCategory);
    }
    if (selectedLocation) {
      items = items.filter((obj) => obj.location === selectedLocation);
    }
    if (selectedState) {
      items = items.filter((obj) => obj.state === selectedState);
    }

    if (selectedSort === "title_asc") {
      items.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === "title_desc") {
      items.sort((a, b) => b.title.localeCompare(a.title));
    } else if (selectedSort === "date_asc") {
      items.sort((a, b) => new Date(a.date_posted) - new Date(b.date_posted));
    } else if (selectedSort === "date_desc") {
      items.sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
    }
    // "pertinence" ou autre tri ?

    return items;
  };

  // ----- Chaque fois que paramSearchText / paramCategory... changent, 
  //       on veut éventuellement relancer le filterObjects si c'est nécessaire
  useEffect(() => {
    if (isSearchActive) {
      // Premier filtrage sur le searchText
      filterObjects(searchText);
    }
  }, [searchText, isSearchActive]);

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
          <FontAwesomeIcon icon={faSearch} className="h-6 w-6 mr-3" />
        </div>
      </div>

      {isSearchActive && (
        <div className="flex justify-center">
          <div className="flex gap-4 mt-16 w-4/5">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-2 block w-1/2 px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat.id_object_type} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="mt-2 block w-1/2 px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen"
            >
              <option value="">Tous les états</option>
              {states.map((etat, i) => (
                <option key={i} value={etat}>
                  {etat}
                </option>
              ))}
            </select>

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

      {!isSearchActive && (
        <SquareGrid
          items={categories.map((cat, index) => ({
            label: cat.label,
            onClick: () => handleCategoryClick(index),
          }))}
        />
      )}

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
        categories.map((cat, i) => (
          <div
            className="p-8"
            key={cat.id_object_type}
            ref={(el) => (carouselRefs.current[i] = el)}
          >
            <Carousel
              items={filteredObjectsByCategory[cat.label]?.map((obj) => (
                <DepositThumbnail key={`thumbnail-${obj.id_item}`} object={obj} />
              ))}
              title={`Objets dans la catégorie : ${cat.label}`}
            />
          </div>
        ))
      )}
    </div>
  );
}
