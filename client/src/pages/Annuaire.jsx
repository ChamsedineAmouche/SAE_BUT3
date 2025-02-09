import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import DataTable from "../components/DataTable/DataTable"; // Import du composant DataTable

const Annuaire = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Colonnes du tableau
  const columns = ["entreprise", "email", "dateAdhesion", "objetsDonnés", "objetsRecupérés", "eLearnings"];
  const columnNames = ["Entreprise", "Mail de contact", "Date d'adhésion", "Objets donnés", "Objets récupérés", "E-learnings acquis"];

  // Données fictives pour exemple
  const data = [
    { entreprise: "GreenTech", email: "contact@greentech.com", dateAdhesion: "2023-05-10", objetsDonnés: 120, objetsRecupérés: 90, eLearnings: 5 },
    { entreprise: "EcoSolutions", email: "info@ecosolutions.com", dateAdhesion: "2024-01-15", objetsDonnés: 200, objetsRecupérés: 150, eLearnings: 7 },
    { entreprise: "SustainableCo", email: "support@sustainableco.com", dateAdhesion: "2022-11-23", objetsDonnés: 80, objetsRecupérés: 65, eLearnings: 3 },
  ];

  // Filtrage des données selon la barre de recherche
  const filteredData = data.filter((item) =>
    item.entreprise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex flex-col justify-end">
      <div className="mt-auto">
        {/* Titre principal */}
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Annuaire des entreprises partenaires
        </h1>

        {/* Sous-titre */}
        <p className="text-center text-gray-600 mt-2 text-lg">
          Découvrez les entreprises partenaires sur l’application, leur contact et leur palmarès sur le site !
        </p>

        {/* Barre de recherche */}
        <div className="flex justify-center items-center mt-8">
          <div className="flex items-center bg-white rounded-full shadow-md w-1/2 p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une entreprise"
              className="bg-white text-black px-4 py-2 rounded-full focus:outline-none w-full"
            />
            <FontAwesomeIcon icon={faSearch} className="h-6 w-6 text-gray-500 mr-3" />
          </div>
        </div>

        {/* Tableau des entreprises partenaires */}
        <div className="mt-10">
          <DataTable columns={columns} columnNames={columnNames} data={filteredData} rowsPerPage={5} />
        </div>
      </div>
    </div>
  );
};

export default Annuaire;
