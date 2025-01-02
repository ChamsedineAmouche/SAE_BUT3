import React, { useEffect } from "react";
import veilleImage from "../assets/images/circular_economy.png";
import Carousel from "../components/Carousel/Carousel";

const DetailsVeille = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const username = "John Doe"; // Exemple d'utilisateur
  const date = "12 janvier 2025"; // Exemple de date
  const items2 = [
    "exemple 1",
    "exemple 2",
    "exemple 3",
    "exemple 4",
    "exemple 5",
    "exemple 6",
    "exemple 7",
    "exemple 8",
    "exemple 9"
  ];

  return (
    <div className="details-veille pt-24 px-6 md:px-12 lg:px-24">
      {/* Texte en haut à gauche */}
      <div className="text-left">
        <p className="text-lg font-medium text-gray-700">
          Veille/Ecophyse
        </p>
      </div>

      {/* Titre centré */}
      <div className="text-center mt-12">
        <h1 className="text-4xl font-bold text-darkGreen">
          Bienvenue dans notre veille informative
        </h1>
      </div>

      {/* Image en cercle à droite et texte avec nom d'utilisateur et date */}
      <div className="flex items-center justify-start mt-12">
        {/* Image circulaire */}
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
          <img
            src={veilleImage}
            alt="Veille"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Texte avec nom d'utilisateur et date */}
        <div>
          <p className="text-lg font-medium text-gray-700">{username}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>

      {/* Image centrée */}
      <div className="flex justify-center mt-12">
        <img
          src={veilleImage}
          alt="Veille"
          className="w-3/4 md:w-1/2 lg:w-1/3 rounded-lg shadow-lg"
        />
      </div>

      {/* Pavé de texte espacé du bas */}
      <div className="text-center mt-12 max-w-3xl mx-auto mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          Découvrez les dernières informations sur les tendances et innovations qui façonnent le futur. Notre veille vous permet de rester informé sur les sujets les plus pertinents du moment, en vous fournissant des analyses approfondies et des perspectives intéressantes pour vous aider à mieux comprendre les évolutions de notre environnement.
        </p>
      </div>
      <div>
        <Carousel items={items2} title={"Les dernières actualités"} />
      </div>
    </div>
  );
};

export default DetailsVeille;
