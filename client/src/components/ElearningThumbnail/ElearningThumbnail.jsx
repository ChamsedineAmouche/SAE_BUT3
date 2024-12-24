import React, { useEffect } from "react";

const ElearningThumbnail = ({ elearning }) => {


  useEffect(() => {
    if (!elearning || !elearning.id_item) return;
  }, [elearning]);

  if (!elearning) {
    return <div>Pas d'e-learning disponible</div>;
  }
  

  const { title, price } = elearning;

  return (
    <div className="rounded-lg shadow-lg overflow-hidden relative w-full h-full bg-white">
      {/* Image */}
      <div className="relative bg-yellowGreen1 bg-opacity-50 h-1/2">
          <img src="/elearning_default.jpg" alt={title} className="w-full h-full object-cover rounded-b-lg" />
      </div>

      {/* Contenu */}
      <div className="p-3 h-full bg-yellowGreen1 bg-opacity-50">
        {/* Titre */}
        <h3 className="text-2xl font-bold text-darkGreen mb-2 line-clamp-2">{title}</h3>
        <div className="flex">
          {/* Catégorie */}
          <p className="text-m font-semibold text-darkGreen w-full">Catégorie</p>
          {/* Catégorie */}
          <p className="text-5xl font-bold text-darkGreen pr-2">{price}€</p>
          
        </div>
        
      </div>
    </div>
  );
};

export default ElearningThumbnail;
