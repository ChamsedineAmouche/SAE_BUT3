import React, { useState, useEffect } from "react";
import circularEconomyImg from "../assets/images/circular_economy.png";
import SquareGrid from "../components/SquareGrid/SquareGrid";
import Carousel from "../components/Carousel/Carousel";
import ElearningThumbnail from "../components/ElearningThumbnail/ElearningThumbnail";
import StaticGrid from "../components/StaticGrid/StaticGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

// Pour ignorer les accents
function normalize(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function Elearning() {
  // Champs de recherche et filtres
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  // Données des catégories et e-learnings
  const [categories, setCategories] = useState([]);
  const [elearningsByCategory, setElearningsByCategory] = useState({});
  const [allElearnings, setAllElearnings] = useState([]); // liste à plat de tous les e-learnings

  useEffect(() => {
    fetchElearningData();
  }, []);

  async function fetchElearningData() {
    try {
      const res = await fetch("/elearningList");
      const data = await res.json();
      // data.categories = [{ id, Libelle }, ...]
      // data.eLearnings = [{ id_category, label_category, elearning_info: [...] }, ...]

      const catList = data.categories.map((c) => ({
        label: c.Libelle,
        id_category: c.id,
      }));

      // On regroupe par catégorie + on crée un tableau à plat de tous les e-learnings
      const grouped = {};
      const flatList = [];
      catList.forEach((cat) => {
        const found = data.eLearnings.find(
          (elem) => elem.id_category === cat.id_category
        );
        grouped[cat.label] = found ? found.elearning_info : [];
        flatList.push(...grouped[cat.label]);
      });

      setCategories(catList);
      setElearningsByCategory(grouped);
      setAllElearnings(flatList);
    } catch (err) {
      console.error("Erreur lors du fetch e-learning:", err);
    }
  }

  // Tri et Filtre
  function applyFilters(list) {
    let result = [...list];

    if (selectedCategory) {
      // On compare au champ categoryName (ou adapt. selon votre structure)
      result = result.filter((el) => el.categoryName === selectedCategory);
    }

    if (selectedSort === "title_asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === "title_desc") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }
    else if (selectedSort === "price_asc") {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (selectedSort === "price_desc") {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    return result;
  }

  // Filtrer en fonction du champ de recherche
  function getSearchResults(txt) {
    const norm = normalize(txt);
    const filtered = allElearnings.filter((el) => {
      const t = normalize(el.title);
      const c = normalize(el.categoryName || "");
      return t.includes(norm) || c.includes(norm);
    });
    return applyFilters(filtered);
  }

  // Résultats de la recherche
  const searchResults = searchText ? getSearchResults(searchText) : [];

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
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Rechercher une formation"
            className="bg-white text-black px-4 py-2 rounded-full focus:outline-none w-full"
          />
          <FontAwesomeIcon icon={faSearch} className="h-6 w-6 mr-3" />
        </div>
      </div>

      {!searchText ? (
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
      ) : (
        <div className="p-8">
          <div className="flex justify-center">
          {/* Filtre par catégorie */}
            <div className="flex gap-4 mt-16 w-1/2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-2 block w-1/2 px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen"
                >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id_category} value={cat.label}>
                    {cat.label}
                  </option>
                ))}
              </select>

              {/* Tri */}
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="mt-2 block w-1/2 px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen"
                >
                <option value="">Trier par</option>
                <option value="title_asc">Nom (A-Z)</option>
                <option value="title_desc">Nom (Z-A)</option>
                <option value="price_asc">Prix (croissant)</option>
                <option value="price_desc">Prix (décroissant)</option>
              </select>
            </div>
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
      )}
    </div>
  );
}
