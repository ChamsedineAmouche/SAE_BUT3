import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importation de useNavigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";

const ElearningThumbnail = ({ elearning }) => {
  const navigate = useNavigate(); // Hook pour navigation
  const [favorite, setFavorite] = useState(false); // État local pour le favori

  useEffect(() => {
    if (!elearning || !elearning.course_id) return;

    // Vérifier si l'élément est favori
    fetch(`/profileFavorite`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const isFavorited = data.elearning.some((item) => item.course_id === elearning.course_id);
        setFavorite(isFavorited);
      })
      .catch((error) => {
        console.error("Erreur lors de la vérification des favoris :", error);
      });
  }, [elearning]);

  if (!elearning) {
    return <div>Pas d'e-learning disponible</div>;
  }

  const { course_id, title, price, categoryName } = elearning;

  const handleClick = () => {
    navigate(`/details_elearning?id=${course_id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();

    const endpoint = favorite
      ? `/deleteElearningFavorite?elearningid=${course_id}`
      : `/addElearningFavorite?elearningid=${course_id}`;

    setFavorite(!favorite);

    fetch(endpoint, { method: "GET" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour des favoris :", error);
        setFavorite((prev) => !prev);
      });
  };

  return (
    <div 
      onClick={handleClick}
      className="rounded-lg shadow-lg overflow-hidden relative w-full h-full bg-white cursor-pointer"
    >
      {/* Image */}
      <div className="relative bg-yellowGreen1 bg-opacity-50 h-1/2">
        <img 
          src="/elearning_default.jpg" 
          alt={title} 
          className="w-full h-full object-cover rounded-b-lg" 
        />
      </div>

      {/* Contenu */}
      <div className="p-3 h-full bg-yellowGreen1 bg-opacity-50">
        {/* Titre */}
        <h3 className="text-2xl font-bold text-darkGreen mb-2 line-clamp-2">{title}</h3>
        <div className="flex justify-between items-center">
          {/* Catégorie */}
          <p className="text-m font-semibold text-darkGreen w-full">{categoryName}</p>
          {/* Prix */}
          <p className="text-5xl font-bold text-darkGreen pr-2">{price}€</p>
        </div>

        {/* Cœur pour favori */}
        <div 
          className="absolute top-4 left-4 cursor-pointer"
          onClick={handleFavoriteClick}
        >
          <FontAwesomeIcon
            icon={favorite ? faHeartSolid : faHeartEmpty}
            className={`text-xl ${favorite ? 'text-red' : 'text-black'}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ElearningThumbnail;
