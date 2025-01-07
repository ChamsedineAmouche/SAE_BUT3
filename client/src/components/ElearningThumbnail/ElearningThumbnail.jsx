import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importation de useNavigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";

const ElearningThumbnail = ({ elearning, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate(); // Hook pour navigation
  const [favorite, setFavorite] = useState(isFavorite); // État local pour le favori

  useEffect(() => {
    setFavorite(isFavorite); // Mettre à jour l'état local si isFavorite change
  }, [isFavorite]);

  if (!elearning) {
    return <div>Pas d'e-learning disponible</div>;
  }

  const { course_id, title, price, categoryName } = elearning; // Récupération des infos de l'e-learning

  // Fonction pour naviguer lorsque l'élément est cliqué
   const handleClick = () => {
     navigate(`/details_elearning?id=${course_id}`); // Redirection vers la page DetailsElearning avec l'ID
  };

  // Fonction pour gérer le changement de favori
  const handleFavoriteClick = () => {
    setFavorite(!favorite); // Changer l'état du favori localement
    onToggleFavorite(); // Appeler la fonction onToggleFavorite pour mettre à jour le serveur
  };

  return (
    <div 
      onClick={handleClick}
      className="rounded-lg shadow-lg overflow-hidden relative w-full h-full bg-white cursor-pointer transform hover:scale-105 transition-all duration-300"
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
          onClick={handleFavoriteClick} // Gestion du clic pour changer l'état du favori
        >
          <FontAwesomeIcon
            icon={favorite ? faHeartSolid : faHeartEmpty} // Afficher un cœur plein ou vide selon favorite
            className={`text-xl ${favorite ? 'text-red' : 'text-black'}`} // Si favori = vrai, rouge, sinon noir
          />
        </div>
      </div>
    </div>
  );
};

export default ElearningThumbnail;
