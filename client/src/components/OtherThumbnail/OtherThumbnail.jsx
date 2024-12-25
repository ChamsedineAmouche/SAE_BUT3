import React, { useEffect } from "react";

const OtherThumbnail = ({ other, type }) => {

  let image = null;

  useEffect(() => {
    if (!other || !other.id_item) return;
  }, [other]);

  if (!other) {
    return <div>Non disponible</div>;
  }

  if (type === "veille") {
    image = "/article_default.jpg";
  } else {
    image = "/event_default.jpg";
  }
  

  const { title } = other;

  return (
    <div className="rounded-lg shadow-lg overflow-hidden relative w-full h-full bg-white">
      {/* Image */}
      <div className="relative bg-yellowGreen1 bg-opacity-50 h-1/2">
          <img src={image} alt={title} className="w-full h-full object-cover rounded-b-lg" />
      </div>

      {/* Contenu */}
      <div className="p-3 h-full bg-yellowGreen1 bg-opacity-50">
        {/* Titre */}
        <h3 className="text-2xl font-bold text-darkGreen mb-2 line-clamp-2">{title}</h3>
        {/* Catégorie */}
        <p className="text-m font-semibold text-darkGreen w-full">Catégorie</p>

        
      </div>
    </div>
  );
};

export default OtherThumbnail;
