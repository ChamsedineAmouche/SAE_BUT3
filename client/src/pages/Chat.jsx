import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

// Générer 20 conversations dynamiquement
const generateMessages = (id) => [
  { id: 1, text: `Message initial de la conversation ${id}`, fromMe: false },
  { id: 2, text: `Réponse utilisateur à la conversation ${id}`, fromMe: true },
  { id: 3, text: `Dernier message de la conversation ${id}`, fromMe: false },
];

const messagesData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  sender: `Utilisateur ${i + 1}`,
  object: `Objet ${i + 1}`,
  time: `il y a ${Math.floor(Math.random() * 7) + 1} jours`,
  messages: generateMessages(i + 1),
}));

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(messagesData[0]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const updatedChat = {
      ...selectedChat,
      messages: [
        ...selectedChat.messages,
        { id: selectedChat.messages.length + 1, text: newMessage, fromMe: true },
      ],
    };

    setSelectedChat(updatedChat);
    setNewMessage("");
  };

  return (
    <div className="flex pt-20 h-screen">
      {/* Sidebar */}
      <div className="w-1/3 text-white m-4 rounded-lg border border-darkGreen bg-white">
        <div className="border-b border-darkGreen">
          <h2 className="text-2xl font-semibold my-4 ml-4 text-darkGreen">Messages</h2>
        </div>
        <div className="overflow-y-auto h-[80vh]">
          {messagesData.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 cursor-pointer border-b border-darkGreen text-darkGreen ${
                selectedChat.id === msg.id ? "bg-oliveGreen/50" : "hover:bg-oliveGreen/50"
              }`}
              onClick={() => setSelectedChat(msg)}
            >
              <p className="font-semibold">{msg.sender}</p>
              <p className="text-sm">{msg.object}</p>
              <p className="text-xs opacity-75">{msg.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Box */}
      <div className="w-2/3 m-4">
        <div className="bg-oliveGreen p-4 rounded-t-md flex items-center justify-center">
          <div className="w-12 h-12 border border-white rounded-full mr-3">
            <img src="/default_user.png" alt="photo de profil par défaut" />
          </div>
          <h2 className="text-xl text-white font-semibold">{selectedChat.sender}</h2>
        </div>
        <div className="border border-mediumGreen rounded-b-md p-4 h-3/4 overflow-y-auto bg-white">
          {selectedChat.messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 my-2 max-w-xs rounded-md ${
                msg.fromMe ? "bg-oliveGreen/60 text-white ml-auto" : "bg-darkGreen/75 text-white mr-auto"
              }`}
            >
              {msg.text}
            </div>
          ))}
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
      </div>
    </div>
  );
};

export default Chat;
