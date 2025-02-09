import React, { useState } from "react";
import circularEconomyImg from "../../assets/images/circular_economy.png";

const ForumMessages = ({ creationDate, messagesPerPage, messages }) => {
  // Gestion de l'état de la page courante
  const [currentPage, setCurrentPage] = useState(1);

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(messages.length / messagesPerPage);

  // Filtrer les messages pour la page actuelle
  const currentMessages = messages.slice(
    (currentPage - 1) * messagesPerPage,
    currentPage * messagesPerPage
  );

  // Fonction pour changer la page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Affichage de la date de création */}
      <div className="text-lg text-gray-800 font-semibold mb-6">
        Crée le {creationDate}
      </div>

      {/* Affichage des messages */}
      {currentMessages.map((message, index) => (
        <div
          key={index}
          className="bg-green-100 p-4 mb-6 rounded-lg shadow-md"
        >
          <div className="flex items-center mb-4">
            {/* Photo de profil */}
            <img
              src={circularEconomyImg}
              alt={`${message.companyName} logo`}
              className="w-12 h-12 rounded-full object-cover"
            />
            {/* Détails du message */}
            <div className="ml-4">
              <div className="font-semibold text-gray-800">{message.companyName}</div>
              <div className="text-sm text-gray-600">{message.date}</div>
            </div>
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
                className={`px-4 py-2 border overflow-hidden text-darkGreen border-gray-300 rounded-l-lg ${
                  currentPage === 1
                    ? "bg-yellowGreen1 bg-opacity-20 text-darkGreen"
                    : "hover:bg-yellowGreen1 hover:text-white"
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
                  className={`px-4 py-2 border-y border-r text-darkGreen border-gray-300 ${
                    i + 1 === currentPage
                      ? "bg-yellowGreen1 text-white"
                      : "hover:bg-yellowGreen1 hover:text-white"
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
                className={`px-4 py-2 border-y border-r text-darkGreen border-gray-300 rounded-r-lg ${
                  currentPage === totalPages
                    ? "bg-yellowGreen1 bg-opacity-20 text-darkGreen"
                    : "hover:bg-yellowGreen1 hover:text-white"
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
