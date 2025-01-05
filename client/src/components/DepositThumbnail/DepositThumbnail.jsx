import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";

const DepositThumbnail = ({ object, isFavorite, onToggleFavorite }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!object || !object.id_item) return;
    fetch(`/image?id=${object.id_item}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          const imageData = data[0];
          const blob = new Blob([new Uint8Array(imageData.data)], { type: imageData.mimeType });
          const imageUrl = URL.createObjectURL(blob);
          setImage(imageUrl);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des images :", error);
      });
  }, [object]);

  if (!object) {
    return <div>Pas d'objet disponible</div>;
  }

  const { title, category, state, id_item } = object;

  return (
    <div className="rounded-lg shadow-lg overflow-hidden relative w-full h-full bg-white">
      <div className="relative bg-yellowGreen1 bg-opacity-50 h-1/2">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover rounded-b-lg" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p>Chargement de l'image...</p>
          </div>
        )}
      </div>

      <div className="p-3 h-full bg-yellowGreen1 bg-opacity-50">
        <h3 className="text-2xl font-bold text-darkGreen mb-2 line-clamp-2">{title}</h3>
        <p className="text-m font-semibold text-darkGreen">{category}</p>
        <p className="text-sm text-darkGreen">{state}</p>

        <div className="absolute top-4 left-4">
          <FontAwesomeIcon
            icon={isFavorite ? faHeartSolid : faHeartEmpty}
            className={`text-xl ${isFavorite ? 'text-red' : 'text-black'} cursor-pointer`}
            onClick={() => onToggleFavorite(id_item, isFavorite)}
          />
        </div>
      </div>
    </div>
  );
};


export default DepositThumbnail;
