import React from "react";
import forumImage from "../assets/images/circular_economy.png"; // Remplacez par votre image
import DataTable from "../components/DataTable/DataTable"; // Import du composant DataTable
import { useNavigate } from "react-router-dom";

const Forum = () => {
  const navigate = useNavigate();
  // Exemples de données pour le tableau
  const columns = ["name", "date", "lastMessage"];
  const columnNames = ["Nom", "Date", "Dernier message"];
  const data = [
    { name: "Discussion sur l'écologie", date: "2025-01-15", lastMessage: "Jean Dupont : Nous devons agir maintenant !" },
    { name: "Nouvelles régulations", date: "2025-01-12", lastMessage: "Sophie Martin : Avez-vous lu la dernière loi ?" },
    { name: "Partenariats durables", date: "2025-01-10", lastMessage: "Paul Durand : Qui est intéressé par un échange ?" },
  ];

  return (
    <div className="relative min-h-screen bg-gray-100 p-6">
      {/* Label et Image */}
      <div className="relative veille">
        {/* Image en haut à droite */}
        <img
          src={forumImage}
          alt="Forum"
          className="absolute top-1 right-1 w-1/5 h-auto"
        />
        
        {/* Label de bienvenue */}
        <h1 className="text-4xl font-poppins max-w-[51%] pt-[150px] pl-[60px]">
          Bienvenue dans l’espace communauté, partagez des moments entre entreprises partenaires !
        </h1>
      </div>

      {/* Boutons */}
      <div className="flex justify-center mt-10 space-x-6">
        <button className="bg-[#587208] text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition"
        onClick={() => navigate("/annuaire")}>
          Les entreprises
        </button>
        <button className="bg-gray-300 text-gray-800 px-6 py-3 rounded-full shadow-md hover:bg-gray-400 transition"
        onClick={() => navigate("/salons")}>
          Forum de discussion
        </button>
      </div>

      {/* Label "Les dernières discussions" */}
      <h2 className="mt-10 text-xl font-semibold text-gray-700 text-center">Les dernières discussions</h2>

      {/* Barre horizontale plus courte */}
      <div className="flex justify-center">
        <hr className="mt-2 w-1/4 border-gray-300" />
      </div>

      {/* Tableau des discussions */}
      <DataTable columns={columns} columnNames={columnNames} data={data} rowsPerPage={5} />
    </div>
  );
};

export default Forum;
