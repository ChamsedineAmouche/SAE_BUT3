import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";  // Import de useNavigate
import Swal from "sweetalert2";  // Import de SweetAlert2
import DataTable from "../components/DataTable/DataTable"; // Import du composant DataTable

const Salons = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Initialisation du hook useNavigate

  // Colonnes du tableau
  const columns = ["sujet", "creePar", "dateCreation", "dernierMessage"];
  const columnNames = ["Sujet", "Créé par", "Date de création", "Dernier message"];

  // Données fictives pour exemple
  const data = [
    { sujet: "Transition écologique", creePar: "GreenTech", dateCreation: "2024-01-10", dernierMessage: "Comment les entreprises s'engagent dans la transition verte." },
    { sujet: "Technologies durables", creePar: "EcoSolutions", dateCreation: "2024-02-05", dernierMessage: "Les dernières innovations en matière de technologies écologiques." },
    { sujet: "Réduction des déchets", creePar: "SustainableCo", dateCreation: "2022-11-20", dernierMessage: "Le recyclage et les meilleures pratiques pour réduire les déchets." },
  ];

  // Filtrage des données selon la barre de recherche
  const filteredData = data.filter((item) =>
    item.sujet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour ouvrir SweetAlert avec un input et naviguer ensuite
  const handleCreateSalon = () => {
    Swal.fire({
      title: "Créer un nouveau salon",
      input: "text",
      inputLabel: "Quel est le sujet du salon ?",
      inputPlaceholder: "Entrez un sujet",
      showCancelButton: true,
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#446129", 
      cancelButtonColor: "#446129",   
      inputValidator: (value) => {
        if (!value) {
          return "Le sujet ne peut pas être vide !";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Si l'utilisateur a confirmé, on récupère le sujet et redirige
        const subject = result.value;
        // Rediriger vers la page du salon avec le sujet en paramètre (id: <subject>)
        navigate(`/details_forum/id:${subject}`);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex flex-col justify-end">
      <div className="mt-auto">
        {/* Titre principal */}
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Les salons de discussion
        </h1>

        {/* Sous-titre */}
        <p className="text-center text-gray-600 mt-2 text-lg">
          Communiquez avec les autres entreprises partenaires ! Rejoignez un salon et discutez !
        </p>

        {/* Barre de recherche */}
        <div className="flex justify-center items-center mt-8">
          <div className="flex items-center bg-white rounded-full shadow-md w-1/2 p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un salon"
              className="bg-white text-black px-4 py-2 rounded-full focus:outline-none w-full"
            />
            <FontAwesomeIcon icon={faSearch} className="h-6 w-6 text-gray-500 mr-3" />
          </div>
        </div>

        {/* Bouton pour créer un salon */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleCreateSalon}  // Appel de la fonction handleCreateSalon
            className="p-4 text-3xl hover:text-darkGreen"
          >
            <FontAwesomeIcon icon={faSquarePlus} />
          </button>
        </div>

        {/* Tableau des salons de discussion */}
        <div className="mt-10">
          <DataTable columns={columns} columnNames={columnNames} data={filteredData} rowsPerPage={5} />
        </div>
      </div>
    </div>
  );
};

export default Salons;
