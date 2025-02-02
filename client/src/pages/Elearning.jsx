import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import circularEconomyImg from "../assets/images/circular_economy.png";
import SquareGrid from "../components/SquareGrid/SquareGrid";
import Carousel from "../components/Carousel/Carousel";
import ElearningThumbnail from "../components/ElearningThumbnail/ElearningThumbnail";
import StaticGrid from "../components/StaticGrid/StaticGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function normalize(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function Elearning() {
  // Recherche & filtres
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  // Catégories / E-learnings
  const [categories, setCategories] = useState([]);
  const [elearningsByCategory, setElearningsByCategory] = useState({});
  const [allElearnings, setAllElearnings] = useState([]);

  // Pour savoir si on est en "mode recherche" ou non
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Récupération des paramètres d'URL
  const [searchParams] = useSearchParams();
  const paramSearchText = searchParams.get("searchText") || "";
  const paramCategory = searchParams.get("category") || "";
  const paramSort = searchParams.get("sort") || "";

  useEffect(() => {
    fetchElearningData();
  }, []);

  async function fetchElearningData() {
    try {
      const res = await fetch("/elearningList");
      const data = await res.json();

      const catList = data.categories.map((c) => ({
        label: c.Libelle,
        id_category: c.id,
      }));

      const grouped = {};
      const flatList = [];
      catList.forEach((cat) => {
        const found = data.eLearnings.find(
          (elem) => elem.id_category === cat.id_category
        );
        grouped[cat.label] = found ? found.elearning_info : [];
        flatList.push(...(grouped[cat.label] || []));
      });

      setCategories(catList);
      setElearningsByCategory(grouped);
      setAllElearnings(flatList);
    } catch (err) {
      console.error("Erreur lors du fetch e-learning:", err);
    }
  }

  // Si on a des paramètres dans l'URL, on les applique aux states
  useEffect(() => {
    if (paramSearchText || paramCategory || paramSort) {
      setIsSearchActive(true);
      setSearchText(paramSearchText);
      setSelectedCategory(paramCategory);
      setSelectedSort(paramSort);
    }
  }, [paramSearchText, paramCategory, paramSort]);

  // Tri et filtres
  function applyFilters(list) {
    let result = [...list];

    if (selectedCategory) {
      // Adapte si nécessaire (parfois .categoryName, parfois .categoryLabel, etc.)
      result = result.filter((el) => el.categoryName === selectedCategory);
    }

    if (selectedSort === "title_asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === "title_desc") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (selectedSort === "price_asc") {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (selectedSort === "price_desc") {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    return result;
  }

  // Filtrage par recherche texte
  function getSearchResults(txt) {
    const norm = normalize(txt);
    const filtered = allElearnings.filter((el) => {
      const t = normalize(el.title);
      const c = normalize(el.categoryName || "");
      return t.includes(norm) || c.includes(norm);
    });
    return applyFilters(filtered);
  }

  const searchResults = isSearchActive ? getSearchResults(searchText) : [];

  // Gestion du champ local
  function handleSearchChange(e) {
    const val = e.target.value;
    setSearchText(val);
    if (!val.trim()) {
      setIsSearchActive(false);
    } else {
      setIsSearchActive(true);
    }
  }

  return (
    <div className="relative">
      <img
        src={circularEconomyImg}
        alt="Circular Economy"
        className="absolute top-1 right-1 w-1/5 h-auto"
      />
      <h1 className="text-4xl font-poppins max-w-[51%] pt-[150px] pl-[60px]">
        Bienvenue sur la page e-learning, explorez nos formations et développez vos compétences !
      </h1>

      {/* Barre de recherche */}
      <div className="flex justify-center items-center mt-8">
        <div className="flex items-center bg-white rounded-full shadow-md w-1/2 p-2">
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Rechercher une formation"
            className="bg-white text-black px-4 py-2 rounded-full focus:outline-none w-full"
          />
          <FontAwesomeIcon icon={faSearch} className="h-6 w-6 mr-3" />
        </div>
      </div>

      {/* Mode "recherche active" */}
      {isSearchActive ? (
        <div className="p-8">
          <div className="flex gap-4 mb-4 justify-center">
            <button
              onClick={() => {
                setSearchText("");
                setSelectedCategory("");
                setSelectedSort("");
                setIsSearchActive(false);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-full"
            >
              Retour
            </button>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white focus:outline-none"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat.id_category} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white focus:outline-none"
            >
              <option value="">Trier par</option>
              <option value="title_asc">Nom (A-Z)</option>
              <option value="title_desc">Nom (Z-A)</option>
              <option value="price_asc">Prix (croissant)</option>
              <option value="price_desc">Prix (décroissant)</option>
            </select>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">
              Aucun résultat pour « {searchText} »
            </div>
          ) : (
            <StaticGrid
              items={searchResults.map((el) => (
                <ElearningThumbnail key={el.course_id} elearning={el} />
              ))}
            />
          )}
        </div>
      ) : (
        // Mode normal (pas de recherche active)
        <div className="p-8">
          <SquareGrid
            items={categories.map((cat) => ({
              label: cat.label,
              onClick: () => {},
            }))}
          />
          {categories.map((cat) => (
            <div key={cat.id_category} className="mt-10">
              <h2 className="text-xl mb-4">{cat.label}</h2>
              <Carousel
                items={elearningsByCategory[cat.label]?.map((el) => (
                  <ElearningThumbnail key={el.course_id} elearning={el} />
                ))}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
