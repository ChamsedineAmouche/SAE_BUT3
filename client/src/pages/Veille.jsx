import React, { useState, useEffect } from "react";
import circularEconomyImg from "../assets/images/circular_economy.png";
import Carousel from "../components/Carousel/Carousel";
import OtherThumbnail from "../components/OtherThumbnail/OtherThumbnail";
import {getAuthHeaders}  from "../utils/jwtAuth";

const Veille = () => {
  const [searchText, setSearchText] = useState("");
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetch des articles depuis l'API
    const fetchArticles = async () => {
      try {
        const response = await fetch("/articleList");
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Erreur lors du fetch des articles :", error);
      }
    };

    fetchArticles();
  }, []);

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  // Filtrer les articles en fonction du texte de recherche
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchText.toLowerCase())
  );

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

      {/* Carrousel des articles */}
      <div className="p-8">
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
      </div>
    </div>
  );
};

export default Veille;
