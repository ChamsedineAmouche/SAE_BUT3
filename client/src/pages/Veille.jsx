import React, { useState, useEffect } from "react";
import circularEconomyImg from "../assets/images/circular_economy.png";
import Carousel from "../components/Carousel/Carousel";
import OtherThumbnail from "../components/OtherThumbnail/OtherThumbnail";
import { getAuthHeaders } from "../utils/jwtAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Veille = () => {
  const [searchText, setSearchText] = useState("");
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gérer le changement de texte dans la barre de recherche
  const handleChange = (event) => {
    const text = event.target.value;
    setSearchText(text);
    filterArticles(text); // Filtrer les articles en temps réel
  };

  // Fonction pour filtrer les articles en fonction du texte de recherche
  const filterArticles = (searchText) => {
    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredArticles(filtered);
  };

  useEffect(() => {
    // Fetch des articles depuis l'API
    const fetchArticles = async () => {
      try {
        const response = await fetch("/articleList"); // { headers: { 'Authorization': getAuthHeaders() } } fait bugger !
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des articles.");
        }
        const data = await response.json();
        setArticles(data.articles || []);
        setFilteredArticles(data.articles || []); // Initialiser les articles filtrés avec tous les articles
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div className="text-center mt-24">Chargement des articles...</div>;
  }

  if (error) {
    return <div className="text-center mt-24 text-red-500">{error}</div>;
  }

  return (
    <div className="veille">
      {/* Image en haut à droite */}
      <img
        src={circularEconomyImg}
        alt="Circular Economy"
        className="absolute top-1 right-1 w-1/5 h-auto"
      />

      <h1 className="text-4xl font-poppins max-w-[51%] pt-[150px] pl-[60px]">
        Bienvenue sur la page de veille, explorez les articles et bonne lecture !
      </h1>

      {/* Barre de recherche */}
      <div className="flex justify-center items-center mt-8">
        <div className="flex items-center bg-white rounded-full shadow-md w-1/2 p-2">
          <input
            type="text"
            value={searchText}
            onChange={handleChange}
            placeholder="Rechercher un article"
            className="bg-white text-black px-4 py-2 rounded-full focus:outline-none w-full"
          />
          <FontAwesomeIcon icon={faSearch} className="h-6 w-6 text- mr-3" />
        </div>
      </div>

      {/* Carrousel des articles */}
      <div className="p-8">
      {filteredArticles.length === 0 ? (
        <div className="text-center mt-8 text-gray-500 h-[20vh]">
          Aucun article trouvé pour "{searchText}".
        </div>
      ) : (
        <Carousel
          items={filteredArticles.map((article) => (
            <OtherThumbnail
              key={article.id_veille}
              other={{
                id_veille: article.id_veille,
                title: article.title,
              }}
              type="veille"
            />
          ))}
          title={"Les dernières actualités"}
        />
      )}
      </div>
    </div>
  );
};

export default Veille;