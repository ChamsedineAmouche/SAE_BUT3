import { faEnvelope, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Importation de useParams

const DetailsDeposit = () => {
  const { id } = useParams(); // Récupération de l'id de l'objet à partir des paramètres de l'URL

  // Données fictives pour l'objet
  const itemDetails = {
    id_item: id, // Id récupéré depuis l'URL
    title: "Table en bois",
    category: "Meuble",
    condition: "Bon état",
    availability: "Disponible jusqu'au 08/10/2024",
    description: "Table en bois, idéale pour un bureau. Dimensions : 100x50x70 cm.",
    location: "Siège entreprise exemple, 52 rue Albert Camus, 7770, Serris",
    image: "/article_default.jpg", // Image par défaut
    isUrgent: true, // Indication si l'objet est urgent
  };

  return (
    <div className="h-screen mt-24 px-10">
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 px-12 pt-12">
        {/* Section Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="relative w-full p-6">
            <img
              src={itemDetails.image}
              alt={itemDetails.title}
              className="w-full h-[300px] object-cover rounded-lg"
            />
            <div className="absolute bottom-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded-md">
              {itemDetails.availability}
            </div>
          </div>
        </div>

        {/* Section Détails de l'objet */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="flex justify-between">
            <h2 className="text-4xl font-bold text-darkGreen">{itemDetails.title}</h2>  
            {/* Tag URGENT */}
            {itemDetails.isUrgent && (
              <div className="bg-red text-white text-xl font-bold px-2 py-1 rounded-md">
                URGENT
              </div>
            )}
          </div>
          
          <div className="flex w-full space-x-4">
            <div className="flex flex-col w-1/2 space-y-4">
              <p className="text-xl font-semibold text-darkGreen">{itemDetails.category}</p>
              {/* Bouton "Réserver" */}
              <button className="bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200">
                <FontAwesomeIcon icon={faTicket} className="mr-2 text-xl"/>
                Réserver
              </button>
              <button className="bg-oliveGreen bg-opacity-60 text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-50 transition duration-200">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-xl"/>
                Contacter le vendeur
              </button>
            </div>

            <div className="flex flex-col w-1/2 space-y-4 ">
              <p className="text-xl text-darkGreen/75">{itemDetails.condition}</p>
              <div className="bg-oliveGreen bg-opacity-40 px-6 py-3 h-full rounded-md">
                {/* Description */}
                <h3 className="font-semibold text-lg text-darkGreen">Description de l'objet</h3>
                <p className="text-sm text-darkGreen">{itemDetails.description}</p>
              </div>
            </div>
          </div>
          

          <div className="space-y-2 mt-4">
            {/* Localisation */}
            <h3 className="font-semibold text-lg text-darkGreen">Localisation</h3>
            <p className="text-sm text-gray-600">{itemDetails.location}</p>
            <div className="h-48 bg-gray-200 rounded-lg"></div> {/* Carte (à remplacer par un vrai composant de carte) */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsDeposit;
