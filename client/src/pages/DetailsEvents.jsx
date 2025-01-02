import React, { useEffect } from "react";
import eventImage from "../assets/images/circular_economy.png"; // Exemple d'image

const DetailsEvent = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const participantCount = 11111; // Exemple de nombre de participants

  return (
    <div className="details-event pt-24 px-6 md:px-12 lg:px-24">
      {/* Texte en haut à gauche */}
      <div className="text-left">
        <p className="text-lg font-medium text-gray-700">
          Évenements/à venir/ Seminaire
        </p>
      </div>

      {/* Titre centré */}
      <div className="text-center mt-12">
        <h1 className="text-4xl font-bold text-darkGreen">
          Bienvenue à notre événement exceptionnel
        </h1>
      </div>

      {/* Image centrée */}
      <div className="flex justify-center mt-12">
        <img
          src={eventImage}
          alt="Événement"
          className="w-3/4 md:w-1/2 lg:w-1/3 rounded-lg shadow-lg"
        />
      </div>

      {/* Pavé de texte centré */}
      <div className="text-center mt-12 max-w-3xl mx-auto">
        <p className="text-lg text-gray-600 leading-relaxed">
          Rejoignez-nous pour un moment inoubliable où nous célébrons la passion,
          l'innovation, et la collaboration. Cet événement rassemble les esprits
          créatifs du monde entier pour échanger, apprendre et créer ensemble.
          Nous avons hâte de vous accueillir et de partager cette expérience unique
          avec vous.
        </p>
      </div>

      {/* Rectangle vert avec cercle et texte */}
      <div className="flex justify-center mt-12 mb-12">
        <div
          className="flex items-center justify-center bg-[#587208] text-white rounded-lg w-3/4 md:w-1/2 lg:w-1/3 p-4 shadow-lg"
        >
          {/* Cercle avec le nombre */}
          <div className="flex items-center justify-center bg-white text-[#587208] font-bold rounded-full w-16 h-16 mr-4">
            <span className="text-sm md:text-base lg:text-lg">{participantCount}</span>
          </div>
          {/* Texte "participants" */}
          <div className="text-lg font-semibold">participants</div>
        </div>
      </div>
    </div>
  );
};

export default DetailsEvent;
