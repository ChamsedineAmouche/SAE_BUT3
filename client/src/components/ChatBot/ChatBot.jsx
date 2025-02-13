import React, { useState } from "react";

const ChatBot = ({ isPopup = false }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // Loader pour l'attente de réponse

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "Vous", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true); // Active le loader

    try {
      const response = await fetch(
        `http://localhost:5001/chatbot?sentence=${encodeURIComponent(input)}`
      );
      const data = await response.json();

      const botMessage = { sender: "Greeny", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erreur:", error);
      const errorMessage = { sender: "Greeny", text: "Erreur de connexion au serveur." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col ${isPopup ? "h-80" : "h-[85vh]"} w-full bg-white rounded-2xl shadow-lg overflow-hidden`}>
      {/* En-tête du chatbot */}
      <div className="p-4 bg-yellowGreen1 text-white text-lg font-bold rounded-t-2xl">
        Greeny
      </div>

      {/* Zone des messages */}
      <div className="p-4 flex-1 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex items-center ${
              msg.sender === "Vous" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "Greeny" && (
              <img
                src="/greeny.png"
                alt="Greeny"
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <div
              className={`p-3 rounded-2xl max-w-xs ${
                msg.sender === "Vous" ? "bg-yellowGreen1 text-white ml-auto" : "bg-gray-200 text-gray-800"
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center text-gray-500 italic">
            <img src="/greeny.png" alt="Greeny" className="w-6 h-6 rounded-full mr-2" />
            Greeny écrit...
          </div>
        )}
      </div>

      {/* Zone de saisie */}
      <div className="flex items-center border-t p-3 bg-gray-100 rounded-b-2xl">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
          placeholder="Écrivez un message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-yellowGreen1 text-white rounded-full hover:bg-darkGreen transition-all"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
