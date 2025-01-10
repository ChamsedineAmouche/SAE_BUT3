import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ElearningAccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les paramètres de l'URL
  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get("courseId");
  const idElearning = searchParams.get("idElearning");
  const token = searchParams.get("token");
  const siren = searchParams.get("siren");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/getSession");
        if (!response.ok) {
        }

        const data = await response.json();
        if (data.session?.siren) {
          sessionStorage.setItem("accessGranted", "true");
          navigate(`/elearning_employe?id=${courseId}`);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [courseId, navigate]);

  const handleAccess = async () => {
    try {
      setLoading(true);
      setError(null);

      // Appeler l'endpoint avec les paramètres
      const response = await fetch(
        `/elearningPage?idElearning=${idElearning}&token=${token}&password=${password}&siren=${siren}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'accès au e-learning.");
      }

      const data = await response.json();

      if (data.success === "True") {
        sessionStorage.setItem("accessGranted", "true");
        navigate(`/elearning_employe?id=${courseId}`); // Redirige vers la page protégée
      } else {
        setError("Accès refusé. Vérifiez vos informations.");
      }
    } catch (err) {
      setError(err.message || "Erreur lors de l'accès.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Accès au e-learning
      </h1>
      {error && (
        <p className="text-red-500 mb-4">
          {error}
        </p>
      )}
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
