import React, { useEffect, useState } from "react";
import homeImage from "../assets/images/home_image.png";
import { useNavigate } from "react-router-dom";
import Carousel from "../components/Carousel/Carousel";

const Home = () => {
  
  const navigate = useNavigate()
  const items = ["exemple 1", "exemple 2", "exemple 3", "exemple 4", "exemple 5", "exemple 6", "exemple 7", "exemple 8", "exemple 9"];
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/homepage')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Chargement en cours...</p>;
  }

  if (!data) {
    return <p>Erreur lors du chargement des données.</p>;
  }

  return (
    <div className="home-page">
      <div
        className="home-image flex flex-col justify-center items-center text-center"
        style={{
          backgroundImage: `url(${homeImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100vw",
          height: "100vh",
        }}
      >
        {/* Titre */}
        <h1 className="text-9xl font-bold text-darkGreen mb-4 drop-shadow-md">
          Green Circle
        </h1>

        {/* Texte descriptif */}
        <p className="text-2xl text-white mb-8 max-w-2xl drop-shadow-md font-bold">
          Votre partenaire pour une entreprise écoresponsable.
        </p>

        {/* Boutons */}
        <div className="flex space-x-4">
          <button 
            className="bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200"
            onClick={ () => navigate("/depot") }
          >
            Voir les dépôts
          </button>
          <button className="bg-white text-darkGreen px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200">
            Voir les e-learning
          </button>
        </div>
      </div>

      {/* Section En ce moment */}
      <div className="bg-yellowGreen1 py-6 px-12 rounded-lg mx-12 my-8 max-w-full shadow-md bg-opacity-20">
        <h2 className="text-3xl font-semibold text-darkGreen mb-6">
          En ce moment...
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Bloc 1 */}
          <div className="bg-yellowGreen1 p-4 rounded-lg flex items-center justify-center bg-opacity-60 space-x-4">
            {/* Cercle avec le chiffre */}
            <div
              className="font-bold text-darkGreen border-4 border-darkGreen rounded-full w-20 h-20 flex items-center justify-center"
              style={{
                fontSize: "clamp(1rem, 4vw, 2.5rem)",
              }}
            >
              {data.numberOfCompany}
            </div>

            {/* Texte aligné verticalement */}
            <p className="text-darkGreen font-medium text-4xl flex items-center">
              Entreprises membres
            </p>
          </div>


          {/* Bloc 2 */}
          <div className="bg-yellowGreen1 p-4 rounded-lg flex items-center justify-center bg-opacity-60 space-x-4">
          <div 
            className="font-bold text-darkGreen border-4 border-darkGreen rounded-full w-20 h-20 flex items-center justify-center"
            style={{
              fontSize: "clamp(1rem, 4vw, 2.5rem)",
            }}
          >
            999
          </div>

            <p className="text-darkGreen font-medium text-4xl flex items-center">
            Objets déposés
            </p>
          </div>

          {/* Bloc 3 */}
          <div className="bg-yellowGreen1 p-4 rounded-lg flex items-center justify-center bg-opacity-60 space-x-4">
            <div 
              className="font-bold text-darkGreen border-4 border-darkGreen rounded-full w-20 h-20 flex items-center justify-center"
              style={{
                fontSize: "clamp(1rem, 4vw, 2.5rem)",
              }}
            >
              7
            </div>
            <p className="text-darkGreen font-medium text-4xl flex items-center">
              Objets récupérés
            </p>
          </div>
        </div>
      </div>

      {/* Section derniers dépots */}
      <div className="p-8">
        <Carousel items={items} title={"Derniers dépôts"} />
      </div>

      {/* Section derniers e-learnings */}
      <div className="p-8">
        <Carousel items={items} title={"e-learnings"} />
      </div>

      {/* Section derniers articles */}
      <div className="p-8">
        <Carousel items={items} title={"Derniers articles"} />
      </div>

      {/* Section derniers événements */}
      <div className="p-8">
        <Carousel items={items} title={"Derniers événements"} />
      </div>
    </div>
  );
};

export default Home;
