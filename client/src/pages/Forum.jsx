import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import forumImage from "../assets/images/circular_economy.png";
import DataTable from "../components/DataTable/DataTable";
import { getAuthHeaders } from '../utils/jwtAuth';

const Forum = () => {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // État de la recherche
  const MySwal = withReactContent(Swal);

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).replace(",", ""); // Supprime la virgule entre la date et l'heure
  };
  

  // Fonction pour récupérer les discussions
  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/forum");
      const data = await response.json();

      if (data.allDiscussions) {
        const sortedDiscussions = data.allDiscussions.sort(
          (a, b) => new Date(b.date_creation) - new Date(a.date_creation)
        );
        setDiscussions(sortedDiscussions);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des discussions :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  // Colonnes du tableau
  const columns = ["title", "date_creation", "company_name", "access"];
  const columnNames = ["Nom", "Date", "Créé par", "Accès"];

  // Filtrer les discussions en fonction de la recherche
  const filteredDiscussions = discussions.filter((discussion) =>
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ajouter un bouton pour accéder aux détails de chaque discussion
  const enhancedDiscussions = filteredDiscussions.map((discussion) => ({
    ...discussion,
    date_creation: formatDate(discussion.date_creation),
    access: (
      <button
        onClick={() => navigate(`/details_forum/id:${discussion.id}`)}
        className="px-4 py-2 bg-[#587208] text-white rounded-lg hover:bg-[#465a06] transition"
      >
        Voir
      </button>
    ),
  }));

  // Fonction pour afficher le formulaire et créer une discussion
  const handleCreateDiscussion = async () => {
    const { value: formValues } = await MySwal.fire({
      title: "Créer une discussion",
      html: `
        <input id="swal-input-title" class="swal2-input" placeholder="Sujet de la discussion">
        <textarea id="swal-input-message" class="swal2-textarea" placeholder="Message"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Créer",
      cancelButtonText: "Annuler",
      preConfirm: () => {
        const title = document.getElementById("swal-input-title").value;
        const message = document.getElementById("swal-input-message").value;

        if (!title || !message) {
          Swal.showValidationMessage("Veuillez remplir tous les champs");
          return false;
        }

        return { title, message };
      },
    });

    if (formValues) {
      const newSubmission = {
        title: formValues.title,
        message: formValues.message,
      };

      try {
        const response = await fetch("/insertDiscussion", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(newSubmission),
        });

        if (!response.ok) throw new Error("Erreur lors de la création");

        Swal.fire("Succès", "Discussion créée avec succès", "success");
        fetchDiscussions(); 
      } catch (error) {
        Swal.fire("Erreur", "Impossible de créer la discussion", "error");
        console.error("Erreur lors de la création :", error);
      }
    }
  };

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

      {/* Label "Les discussions" */}
      <h2 className="mt-10 text-xl font-semibold text-gray-700 text-center">
        Les discussions
      </h2>

      {/* Barre horizontale plus courte */}
      <div className="flex justify-center">
        <hr className="mt-2 w-1/4 border-gray-300" />
      </div>

      {/* Barre de recherche */}
      <div className="flex justify-center items-center mt-8">
        <div className="flex items-center bg-white rounded-full shadow-md w-1/2 p-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une discussion par sujet"
            className="bg-white text-black px-4 py-2 rounded-full focus:outline-none w-full"
          />
          <FontAwesomeIcon icon={faSearch} className="h-6 w-6 text-gray-500 mr-3" />
        </div>
      </div>

      {/* Tableau des discussions */}
      <div className="mt-6">
        {loading ? (
          <p className="text-center text-gray-500">Chargement des discussions...</p>
        ) : (
          <DataTable columns={columns} columnNames={columnNames} data={enhancedDiscussions} rowsPerPage={10} />
        )}
      </div>

      {/* Bouton pour créer une discussion */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleCreateDiscussion}
          className="px-6 py-3 bg-[#587208] text-white rounded-lg hover:bg-[#465a06] transition"
        >
          Créer une discussion
        </button>
      </div>
    </div>
  );
};

export default Forum;
