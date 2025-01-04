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
    description: "Table en bois, idéale pour un bureau. sdohvjiodfjod hfvidvhdifovh dfhvdio hvidfohvdf vjdfiv dfiv fdiovdfi ov jfdio vjifd vdfiv fdiovjdf klvfd klvdfklvdf lkvjfidolkvjfiol",
    location: "Siège entreprise exemple, 52 rue Albert Camus, 7770, Serris",
    image: "/article_default.jpg", // Image par défaut
    isUrgent: true, // Indication si l'objet est urgent
    dimensions: "10m x 15m x 20 m"
  };

  return (
    <div className="h-screen mt-24 px-10">
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 px-12 pt-12 space-x-6">
        {/* Section Image */}
        <div className="w-full lg:w-1/2 flex rounded-lg space-y-2">
          <div className="flex flex-col space-y-2">
            <div className="w-32 h-32 rounded-lg border mx-2">img</div>
            <div className="w-32 h-32 rounded-lg border mx-2">img</div>
            <div className="w-32 h-32 rounded-lg border mx-2">img</div>
          </div>
          <div className="relative flex items-center justify-center">
            <img
              src={itemDetails.image}
              alt={itemDetails.title}
              className="w-full h-full object-cover rounded-lg"
            />
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
          
          <div className="flex flex-col">
            <div className="flex w-full space-x-4">
              {/* Première colonne (boutons) */}
              <div className="flex flex-col w-1/2 space-y-4">
                <p className="text-2xl font-semibold text-darkGreen">{itemDetails.category}</p>
                {/* Bouton "Réserver" */}
                <button className="bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200 h-14">
                  <FontAwesomeIcon icon={faTicket} className="mr-2 text-xl"/>
                  Réserver
                </button>
                <button className="bg-oliveGreen bg-opacity-60 text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-50 transition duration-200 h-14">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-xl"/>
                  Contacter le vendeur
                </button>
              </div>

              {/* Deuxième colonne (description) */}
              <div className="flex flex-col w-1/2 space-y-4">
                <p className="text-2xl text-darkGreen/75">{itemDetails.condition}</p>
                <div className="bg-oliveGreen bg-opacity-40 px-6 py-3 rounded-md h-32 overflow-y-auto">
                  {/* Description */}
                  <h3 className="font-bold text-lg text-darkGreen">Description de l'objet</h3>
                  <h2 className="text-sm font-semibold text-darkGreen">Dimensions : {itemDetails.dimensions}</h2>
                  <p className="text-sm text-darkGreen">{itemDetails.description}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mt-4 bg-darkGreen bg-opacity-20 rounded-lg h-72">
              {/* Localisation */}
              <div className="rounded-lg p-3">
                <h3 className="font-semibold text-lg text-darkGreen">Localisation</h3>
                <p className="text-sm text-gray-600">{itemDetails.location}</p>  
              </div>
              <div className="bg-white m-3 h-48 flex flex-col">
                <div className="flex-grow">Carte ici</div>
              </div>
            </div>
          </div> 
        </div>
      </div>
    </div>
  );
};

export default DetailsDeposit;
