import React, { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"; // Icône de signalement
import circularEconomyImg from "../../assets/images/circular_economy.png";

const ForumMessages = ({ creationDate, messagesPerPage, messages }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(messages.length / messagesPerPage);
  const currentMessages = messages.slice(
    (currentPage - 1) * messagesPerPage,
    currentPage * messagesPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleReportMessage = async (message) => {
    const { value: reason } = await Swal.fire({
      title: "Signalement",
      text: `Signaler le message de ${message.companyName}`,
      input: "text",
      inputLabel: "Raison du signalement",
      inputPlaceholder: "Décrivez la raison...",
      showCancelButton: true,
      confirmButtonText: "Envoyer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#d33",
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage("Vous devez entrer une raison !");
        }
        return reason;
      },
    });

    if (reason) {
      try {
        console.log(message);
        const encodedReason = encodeURIComponent(reason);

        const response = await fetch(`/reportMessage?messageId=${message.id}&reason=${encodedReason}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Erreur lors de l'envoi du signalement");

        Swal.fire("Signalement envoyé", "Votre signalement a bien été pris en compte.", "success");
      } catch (error) {
        Swal.fire("Erreur", "Impossible d'envoyer le signalement.", "error");
        console.error("Erreur lors du signalement :", error);
      }
    }
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Affichage de la date de création */}
      <div className="text-lg text-gray-800 font-semibold mb-6">
        Créé le {creationDate}
      </div>

      {/* Affichage des messages */}
      {currentMessages.map((message, index) => (
        <div key={index} className="bg-green-100 p-4 mb-6 rounded-lg shadow-md relative">
          <div className="flex items-center justify-between mb-4">
            {/* Photo de profil + Infos message */}
            <div className="flex items-center">
              <img
                src={circularEconomyImg}
                alt={`${message.companyName} logo`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-4">
                <div className="font-semibold text-gray-800">{message.companyName}</div>
                <div className="text-sm text-gray-600">{message.date}</div>
              </div>
            </div>

            <button
              onClick={() => handleReportMessage(message)}
              className="text-red bg-red-500 hover:bg-red-600 p-2 rounded-full flex items-center justify-center"
              title="Signaler ce message"
            >
              <FontAwesomeIcon icon={faTriangleExclamation} className="w-5 h-5" />
            </button>
          </div>

          {/* Ligne séparatrice */}
          <hr className="border-gray-300 mb-4" />

          {/* Texte du message */}
          <p className="text-gray-700">{message.text}</p>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <nav aria-label="Page navigation">
          <ul className="flex list-style-none">
            {/* Previous Page */}
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className={`px-4 py-2 border text-darkGreen border-gray-300 rounded-l-lg ${currentPage === 1 ? "bg-gray-200" : "hover:bg-gray-300"
                  }`}
                disabled={currentPage === 1}
              >
                Précédent
              </button>
            </li>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1}>
                <button
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 border text-darkGreen border-gray-300 ${i + 1 === currentPage ? "bg-gray-400 text-white" : "hover:bg-gray-300"
                    }`}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            {/* Next Page */}
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className={`px-4 py-2 border text-darkGreen border-gray-300 rounded-r-lg ${currentPage === totalPages ? "bg-gray-200" : "hover:bg-gray-300"
                  }`}
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ForumMessages;
