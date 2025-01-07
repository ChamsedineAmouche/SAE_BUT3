import React, { useEffect } from "react";
import { useLocation } from "react-router-dom"; // Importer useLocation
import Carousel from "../components/Carousel/Carousel"; // Assurez-vous d'importer le Carousel correctement
import productImage from "../assets/images/circular_economy.png"; // Exemple d'image

const DetailsElearning = () => {
  const location = useLocation(); // Hook pour accéder à l'URL
  const queryParams = new URLSearchParams(location.search); // Crée un objet pour lire les paramètres de l'URL
  const id = queryParams.get("id"); // Récupère la valeur de "id"

  useEffect(() => {
    window.scrollTo(0, 0);
    // Optionnel : vous pouvez utiliser `id` ici pour effectuer une requête API
    console.log("ID récupéré :", id);
  }, [id]);

  const price = "999,99 €"; // Exemple de prix, vous pouvez mettre n'importe quel prix jusqu'à 1000 €
  const items = [
    "Formation 1",
    "Formation 2",
    "Formation 3",
    "Formation 4",
    "Formation 5",
  ]; // Exemple d'éléments pour le carrousel

  return (
    <div className="details-elearning pt-24 px-6 md:px-12 lg:px-24">
      {/* Texte en haut à gauche */}
      <div className="text-left">
        <p className="text-lg font-medium text-gray-700">
          E-learning/RSE (ID: {id}) {/* Affichage de l'ID pour vérification */}
        </p>
      </div>

      {/* Titre centré */}
      <div className="text-center mt-12">
        <h1 className="text-4xl font-bold text-darkGreen">
          Rejoignez-nous pour une expérience d'apprentissage unique
        </h1>
      </div>

      {/* Pavé de texte centré */}
      <div className="text-center mt-12 max-w-3xl mx-auto">
        <p className="text-lg text-gray-600 leading-relaxed">
          Cette formation vous permettra de développer des compétences
          essentielles pour votre avenir. Nos experts vous guideront à travers
          un programme complet qui vous prépare aux défis du monde
          professionnel. Ne manquez pas cette opportunité d'apprendre auprès
          des meilleurs !
        </p>
      </div>

      {/* Image centrée */}
      <div className="flex justify-center mt-12">
        <img
          src={productImage}
          alt="Formation"
          className="w-3/4 md:w-1/2 lg:w-1/3 rounded-lg shadow-lg"
        />
      </div>

      {/* Bouton avec texte "Acheter" et prix dans un cercle */}
      <div className="flex justify-center mt-12">
        <button className="flex items-center justify-center bg-[#587208] text-white rounded-lg px-8 py-3">
          <span className="text-lg font-semibold mr-4">Acheter</span>
          {/* Cercle avec prix */}
          <div className="bg-white text-[#587208] rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
            <span className="text-sm md:text-base font-bold">{price}</span>
          </div>
        </button>
      </div>

      <div>
        <Carousel items={items} title={"Autres formations"} />
      </div>
    </div>
  );
};

export default DetailsElearning;
