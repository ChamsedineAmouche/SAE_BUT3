import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ForumMessages from "../components/ForumMessages/ForumMessages";
import { getAuthHeaders } from '../utils/jwtAuth'; 

const DetailsForum = () => {
  const { id } = useParams(); 
  const discussionId = id.replace("id:", ""); 

  const [discussionTitle, setDiscussionTitle] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const fetchDiscussionDetails = async () => {
    try {
      const response = await fetch(`/discussion?id=${discussionId}`);
      const data = await response.json();

      if (data.discussionInfos.length > 0) {
        setDiscussionTitle(data.discussionInfos[0].discussion_title);
        setCreationDate(new Date(data.discussionInfos[0].discussion_date).toISOString().split("T")[0]);
      }

      if (data.message) {
        const formattedMessages = data.message.map((msg) => ({
          companyName: msg.company_name,
          date: new Date(msg.message_date).toISOString().split("T")[0],
          text: msg.message_content,
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la discussion :", error);
    }
  };

  useEffect(() => {
    fetchDiscussionDetails();
  }, [discussionId]);

  // Fonction pour envoyer un message
  const handleSendMessage = async () => {
    if (messageText.trim()) {
      const newSubmission = {
        message: messageText,
      };

      try {
        // Envoi du message
        const response = await fetch(`/insertMessage?discussionId=${discussionId}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            ...getAuthHeaders() 
          },
          body: JSON.stringify(newSubmission), // Envoi du message
        });

        if (!response.ok) throw new Error("Erreur lors de l'envoi du message");

        // Rafraîchissement des messages après envoi
        fetchDiscussionDetails(); // Récupère les messages mis à jour
        setMessageText(""); // Réinitialise le champ de texte après l'envoi

        // Message envoyé avec succès
        console.log("Message envoyé avec succès");
      } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex flex-col mt-10">
      {/* Titre du forum */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        {discussionTitle || "Chargement..."}
      </h1>

      {/* ForumMessages */}
      <ForumMessages
        creationDate={creationDate}
        messages={messages}
        messagesPerPage={20}
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
            className="px-6 py-3 bg-[#587208] text-white text-lg font-semibold rounded-lg hover:bg-[#465a06] focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsForum;
