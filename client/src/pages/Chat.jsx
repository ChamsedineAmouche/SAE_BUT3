import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 🛠️ Import de useNavigate


const Chat = () => {
  const [discussions, setDiscussions] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [profileData, setProfileData] = useState({});
  const [objectsData, setObjectsData] = useState({});
  const navigate = useNavigate(); // 🛠️ Hook pour la navigation


  // 🚀 1. Récupérer toutes les discussions de l'entreprise
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await fetch(`/discussionsCompany`, { credentials: "include" });
        if (!response.ok) throw new Error("Problème lors de la récupération des discussions.");
        const data = await response.json();
        setDiscussions(data.allDiscussionsOfCompany);
        if (data.allDiscussionsOfCompany.length > 0) {
          setSelectedChat(data.allDiscussionsOfCompany[0]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des discussions :", error);
      }
    };

    fetchDiscussions();
  }, []);

  

  // 🚀 2. Récupérer le profil du destinataire
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/profile`, { credentials: "include" });
        if (!response.ok) throw new Error("Problème lors de la récupération du profil.");
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
      }
    };

    fetchProfile();
  }, []);

  // 🚀 3. Récupérer le catalogue des objets
  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const response = await fetch(`/catalog`);
        if (!response.ok) throw new Error("Problème lors de la récupération du catalogue.");
        const data = await response.json();
        // Stocker les objets dans un dictionnaire { id_item: title }
        const objectsMap = {};
        data.objects.forEach((obj) => {
          objectsMap[obj.id_item] = obj.title;
        });
        setObjectsData(objectsMap);
      } catch (error) {
        console.error("Erreur lors de la récupération du catalogue :", error);
      }
    };

    fetchObjects();
  }, []);

  // 🚀 4. Charger les messages de la discussion sélectionnée avec un rafraîchissement automatique
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/chat?id=${selectedChat.id}`, { credentials: "include" });
        if (!response.ok) throw new Error("Problème lors de la récupération des messages.");
        const data = await response.json();
        
        setMessages(data.message);
      } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
      }
    };

    // 🔄 Rafraîchir les messages toutes les secondes (1000ms)
    fetchMessages(); // Exécuter immédiatement
    const interval = setInterval(fetchMessages, 1000);

    // Nettoyage de l'intervalle quand `selectedChat` change ou quand le composant est démonté
    return () => clearInterval(interval);
  }, [selectedChat]);


  // 🚀 5. Envoyer un message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      const response = await fetch(`/insertChat?discussionId=${selectedChat.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: newMessage }),
      });

      if (!response.ok) throw new Error("Problème lors de l'envoi du message.");

      // Mise à jour instantanée de l'affichage
      setMessages([...messages, { siren: profileData.siren, message: newMessage, dateMessage: new Date().toISOString() }]);
      setNewMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  return (
    <div className="flex pt-20 h-screen">
      {/* Sidebar */}
      <div className="w-1/3 text-white m-4 rounded-lg border border-darkGreen bg-white">
        <div className="border-b border-darkGreen">
          <h2 className="text-2xl font-semibold my-4 ml-4 text-darkGreen">Messages</h2>
        </div>
        <div className="overflow-y-auto h-[80vh]">
          {discussions.map((chat) => {
            const recipientName = profileData.siren === chat.firstSiren ? chat.secondSiren : chat.firstSiren;
            const objectTitle = objectsData[chat.idItem] || "Objet inconnu";
            return (
              <div
                key={chat.id}
                className={`p-3 cursor-pointer border-b border-darkGreen text-darkGreen ${
                  selectedChat && selectedChat.id === chat.id ? "bg-oliveGreen/50" : "hover:bg-oliveGreen/50"
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <p className="font-semibold">{profileData.siren === chat.firstSiren ? chat.secondCompanyName : chat.firstCompanyName}</p>
                <p className="text-sm">{objectTitle}</p>
                <p className="text-xs opacity-75">Créé le {chat.dateCreation}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Box */}
      <div className="w-2/3 m-4">
        {selectedChat ? (
          <>
            <div className="bg-oliveGreen p-4 rounded-t-md flex items-center justify-center">
              <div className="w-12 h-12 border border-white rounded-full mr-3">
                <img src="/default_user.png" alt="photo de profil par défaut" />
              </div>
              <h2 className="text-xl text-white font-semibold">
                {profileData.siren === selectedChat.firstSiren ? selectedChat.secondCompanyName : selectedChat.firstCompanyName} - 
                <span
                  className="underline cursor-pointer hover:text-darkGreen ml-2"
                  onClick={() => navigate(`/depot/${selectedChat.idItem}`)}
                >
                  {objectsData[selectedChat.idItem] || "Objet inconnu"}
                </span>
              </h2>

            </div>
            <div className="border border-mediumGreen rounded-b-md p-4 h-3/4 overflow-y-auto bg-white">
              {messages.map((msg, index) => {
                 const isFromMe = msg.siren !== profileData.siren; 
                 console.log(isFromMe);
                 return (
                  <div
                    key={index}
                    className={`p-3 my-2 max-w-xs rounded-md ${
                      isFromMe ? "bg-darkGreen/75 text-white mr-auto" : "bg-oliveGreen/60 text-white ml-auto"
                    }`}
                  >
                    {msg.message}
                  </div>
                 )
              })}
            </div>
            <div className="flex items-center pt-2">
              <input
                type="text"
                className="flex-grow p-2 border border-darkGreen rounded-md focus:outline-none h-12"
                placeholder="Envoyer un message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 h-12 w-12 p-2 bg-mediumGreen text-white rounded-md"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-darkGreen">
            <p>Sélectionnez une conversation pour commencer à discuter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
