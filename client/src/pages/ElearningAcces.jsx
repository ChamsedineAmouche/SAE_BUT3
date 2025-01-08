import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ElearningAccess = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAccess = () => {
    // Vérifiez le mot de passe si nécessaire, puis accordez l'accès
    sessionStorage.setItem("accessGranted", "true"); // Stocke une information d'accès
    navigate("/elearning_employe"); // Redirige vers la page protégée
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Accès au e-learning
      </h1>
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full max-w-md p-3 mb-4 border rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={handleAccess}
        className="bg-[#587208] text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Valider
      </button>
    </div>
  );
};

export default ElearningAccess;
