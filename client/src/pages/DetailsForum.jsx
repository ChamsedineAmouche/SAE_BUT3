import React, { useState } from "react";
import ForumMessages from "../components/ForumMessages/ForumMessages"; // Assurez-vous que le composant ForumMessages existe et est bien importé.

const DetailsForum = () => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([
    {
      companyName: "GreenTech",
      date: "2024-02-03",
      text: "Nous avons mis en place des solutions durables pour réduire les déchets.",
    },
    {
      companyName: "EcoSolutions",
      date: "2024-02-02",
      text: "La transition énergétique est en marche chez nous, rejoignez-nous !",
    },
  ]);

  // Fonction pour envoyer un message
  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        companyName: "Votre Entreprise", // Remplacer par le nom de l'entreprise de l'utilisateur
        date: new Date().toISOString().split("T")[0], // Date actuelle au format YYYY-MM-DD
        text: messageText,
      };
      setMessages([newMessage, ...messages]); // Ajoute le message en haut de la liste
      setMessageText(""); // Réinitialiser le champ de texte après l'envoi
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex flex-col mt-10"> {/* Marge ajoutée ici */}
      {/* Titre du forum */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Nom du sujet
      </h1>

      {/* ForumMessages */}
      <ForumMessages
        creationDate="2024-02-03" // Exemple de date de création
        messages={messages}
        messagesPerPage={3} // Limité à 3 messages par page
      />

      {/* Formulaire pour envoyer un message */}
      <div className="mt-8 flex flex-col items-center">
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Écrivez votre message..."
          className="w-3/4 h-32 p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="mt-4 flex justify-center w-full">
          <button
            onClick={handleSendMessage}
            className="px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsForum;
