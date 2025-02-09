import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import DataTable from "../components/DataTable/DataTable";

const Annuaire = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch des données de l'annuaire
  useEffect(() => {
    const fetchAnnuaire = async () => {
      try {
        const response = await fetch("/annuaire");
        const data = await response.json();

        if (data.result?.success && data.result.annuaire) {
          // Convertir l'objet annuaire en tableau d'objets
          const formattedData = Object.values(data.result.annuaire).map((company) => ({
            entreprise: company.name,
            email: company.mail,
            dateAdhesion: company.adhésion,
            objetsDonnés: company.numberGiven,
            objetsRecupérés: company.numberTaken,
          }));

          setCompanies(formattedData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'annuaire :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnuaire();
  }, []);

  // Colonnes du tableau
  const columns = ["entreprise", "email", "dateAdhesion", "objetsDonnés", "objetsRecupérés"];
  const columnNames = ["Entreprise", "Mail de contact", "Date d'adhésion", "Objets donnés", "Objets récupérés"];

  // Filtrage des entreprises en fonction du champ de recherche
  const filteredData = companies.filter((item) =>
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
          {loading ? (
            <p className="text-center text-gray-500">Chargement des entreprises...</p>
          ) : (
            <DataTable columns={columns} columnNames={columnNames} data={filteredData} rowsPerPage={5} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Annuaire;
