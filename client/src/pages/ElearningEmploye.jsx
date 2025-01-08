import React from "react";
import productImage from "../assets/images/circular_economy.png";

const ElearningEmploye = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 px-4 py-8">
      {/* Titre */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-12">E-Learning Employé</h1>

      {/* Image */}
      <img
        src={productImage}
        alt="E-learning"
        className="w-1/2 max-w-sm rounded-lg shadow-md mb-6 mt-6"
      />

      {/* Pavé de texte */}
      <div className="max-w-3xl text-gray-700 text-justify leading-relaxed">
        <p>
          Bienvenue sur la plateforme de formation e-learning dédiée à nos employés. Ici, vous
          pourrez accéder à une variété de contenus éducatifs, adaptés à vos besoins et à vos
          ambitions professionnelles. Que vous souhaitiez développer de nouvelles compétences ou
          approfondir vos connaissances, notre bibliothèque de ressources est à votre disposition.
        </p>
        <p className="mt-4">
          Chaque module est conçu pour vous offrir une expérience d'apprentissage interactive et
          engageante. Profitez des vidéos, quiz, et exercices pratiques pour maîtriser les sujets
          qui vous intéressent. Nous sommes ravis de vous accompagner dans votre parcours de
          développement.
        </p>
      </div>
    </div>
  );
};

export default ElearningEmploye;
