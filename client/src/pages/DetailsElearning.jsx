import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importer useNavigate
import Carousel from "../components/Carousel/Carousel";

const DetailsElearning = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialiser useNavigate
  const [elearningData, setElearningData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchElearningData = async () => {
      try {
        const response = await fetch(`/elearningInfo?courseId=${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données.");
        }
        const data = await response.json();
        console.log(data)
        if (data.success === "True" && data.eLearning.length > 0) {
          setElearningData(data.eLearning[0]);
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
  }, [id]);

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

  const { title, description, price } = elearningData;

  const items = ["Formation 1", "Formation 2", "Formation 3", "Formation 4"]; // Exemple de carrousel

  const handleBuyClick = () => {
    // Naviguer vers la page de paiement en passant l'ID de l'eLearning
    navigate(`/payement?id=${id}`);
  };

  return (
    <div className="details-elearning pt-24 px-6 md:px-12 lg:px-24">
      {/* Titre centré */}
      <div className="text-center mt-12">
        <h1 className="text-4xl font-bold text-darkGreen">{title}</h1>
      </div>

      {/* Pavé de texte centré */}
      <div className="text-center mt-12 max-w-3xl mx-auto">
        <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
      </div>

      {/* Bouton avec prix */}
      <div className="flex justify-center mt-12">
        <button
          onClick={handleBuyClick} // Ajouter l'événement de clic
          className="flex items-center justify-center bg-[#587208] text-white rounded-lg px-8 py-3"
        >
          <span className="text-lg font-semibold mr-4">Acheter</span>
          <div className="bg-white text-[#587208] rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
            <span className="text-sm md:text-base font-bold">{price} €</span>
          </div>
        </button>
      </div>

      {/* Carrousel */}
      <div>
        <Carousel items={items} title={"Autres formations"} />
      </div>
    </div>
  );
};

export default DetailsElearning;
