import { faLock, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const MyFavorite = () => {
  return (
    <div className="bg-white w-full">
      <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Éditer mon profil</h2>
      
      {/* Avatar */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <img
            src="/default_user.png" // Remplacez par l'URL de votre avatar
            alt="Avatar"
            className="w-32 h-32 rounded-full border-2 border-gray-300"
          />
          <button className="absolute bottom-0 right-0 bg-yellowGreen1 p-2 rounded-full shadow-lg hover:scale-105 transition w-10 h-10">
            <FontAwesomeIcon icon={faPen} className="text-white" />
          </button>
        </div>
      </div>

      {/* Formulaire */}
      <form className="grid grid-cols-2 gap-6">
        {/* Nom de l'entreprise */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Nom de l’entreprise</label>
          <div className="relative">
            <input
              type="text"
              defaultValue="Entreprise"
              className="w-full border rounded-lg p-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
              disabled
            />
            <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                <FontAwesomeIcon icon={faLock} className="text-black" />
            </span>
          </div>
        </div>

        {/* Adresse */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Adresse</label>
          <input
            type="text"
            placeholder="52 rue Albert Camus"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
          />
        </div>

        {/* Numéro de SIREN */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Numéro de SIREN</label>
          <div className="relative">
            <input
              type="text"
              placeholder="XXXXXXXXX"
              className="w-full border rounded-lg p-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
              disabled
            />
            <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                <FontAwesomeIcon icon={faLock} className="text-black" />
            </span>
          </div>
        </div>

        {/* Ville */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Ville</label>
          <input
            type="text"
            placeholder="Serris"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Mot de passe</label>
          <div className="relative flex items-center justify-center">
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border rounded-lg p-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
            />
            <button className="absolute right-0 bg-yellowGreen1 p-2 rounded-full shadow-lg hover:scale-105 transition w-8 h-8 mr-2 flex justify-center items-center">
                <FontAwesomeIcon icon={faPen} className="text-white text-xs" />
            </button>
          </div>
        </div>

        {/* Code postal */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Code postal</label>
          <input
            type="text"
            placeholder="77700"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
          />
        </div>

        {/* Mail */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Mail</label>
          <input
            type="email"
            placeholder="exemple@mail.com"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
          />
        </div>

        {/* Numéro de téléphone */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Numéro de téléphone</label>
          <input
            type="text"
            placeholder="01XXXXXXXX"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
          />
        </div>
      </form>

      {/* Bouton Sauvegarder */}
      <div className="flex justify-center mt-8">
        <button className="bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200">
          Sauvegarder
        </button>
      </div>
    </div>
  );
};

export default MyFavorite;
