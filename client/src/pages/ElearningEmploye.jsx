import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import productImage from "../assets/images/circular_economy.png";

const ElearningEmploye = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get("id"); // Récupère l'ID depuis les paramètres de requête

  const [elearningData, setElearningData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElearningData = async () => {
      try {
        const response = await fetch(`/elearningInfo?courseId=${courseId}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données.");
        }

        const data = await response.json();
        if (data.success === "True" && data.eLearning.length > 0) {
          setElearningData(data.eLearning[0]); // Utilise les données du premier cours
        } else {
          throw new Error("Aucune donnée trouvée pour cet ID.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchElearningData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!elearningData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Aucune donnée disponible.</p>
      </div>
    );
  }

  const { title, description} = elearningData;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 px-4 py-8">
      {/* Titre dynamique */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-12">{title}</h1>

      {/* Vidéo YouTube */}
      <div className="w-full max-w-2xl aspect-video mb-6 mt-6">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube-nocookie.com/embed/evjGT35-4LU"
          title="YouTube Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow-md"
        ></iframe>
      </div>

      {/* Pavé de texte dynamique */}
      <div className="max-w-3xl text-gray-700 text-justify leading-relaxed">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default ElearningEmploye;
