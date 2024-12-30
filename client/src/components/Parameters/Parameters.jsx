import React, { useState } from 'react';
import RadioButton from '../RadioButton/RadioButton';

const Parameters = () => {
  // États pour gérer les RadioButtones
  const [notifications, setNotifications] = useState({
    meuble: false,
    elearning: false,
    article: false,
    event: false,
    message: false,
    response: false
  });

  const [userData, setUserData] = useState({
    email: true,
    address: true,
    postalCode: true,
    phoneNumber: true,
    profilePic: true
  });

  const handleNotificationChange = (name) => {
    setNotifications((prev) => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleUserDataChange = (name) => {
    setUserData((prev) => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Paramètres</h2>
      
      <div className='grid grid-cols-2 gap-5 w-full'>
        {/* Gestion des notifications */}
        <div className="flex flex-col justify-between bg-white shadow-md rounded-lg p-4 w-full border border-yellowGreen1 border-opacity-40">
          <div>
            <h3 className="font-semibold text-lg text-green-600">Gestion des notifications</h3>
            <p className="text-sm text-gray-500">Sélectionnez les notifications que vous souhaitez recevoir.</p>
          </div>
          <div className="flex flex-col space-y-4 w-full">
            {['dépôt', 'e-learning', 'article', 'évènement', 'message', 'response'].map((notification) => (
              <RadioButton
                key={notification}
                id={notification}
                label={`Mise en ligne d’un ${notification.replace(/([A-Z])/g, ' $1')}`}
                checked={notifications[notification]}
                onChange={() => handleNotificationChange(notification)}
              />
            ))}
          </div>
        </div>

        {/* Mon compte */}
        <div className="flex flex-col bg-white shadow-md rounded-lg p-4 w-ful border border-yellowGreen1 border-opacity-40">
          <h3 className="font-semibold text-lg text-green-600">Mon compte</h3>
          <div className="flex items-center justify-center space-x-4 h-full">
            <button className="bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200">
              Récupérer mes données personnelles
            </button>
            <button className="bg-red text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200">
              Supprimer mon compte
            </button>
          </div>
        </div>
        
        {/* Mon compte */}
        <div className="flex justify-between bg-white shadow-md rounded-lg p-4 w-full border border-yellowGreen1 border-opacity-40">
          <div>
            <h3 className="font-semibold text-lg text-green-600">Mon compte</h3>
          </div>
          <div className="flex space-x-4">
            <button className="bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200">
              Récupérer mes données personnelles
            </button>
          </div>
        </div>

        {/* Données à afficher aux autres utilisateurs */}
        <div className="flex flex-col justify-between bg-white shadow-md rounded-lg p-4 w-full border border-yellowGreen1 border-opacity-40">
          <div>
            <h3 className="font-semibold text-lg text-green-600">Données à afficher aux autres utilisateurs</h3>
          </div>
          <div className="flex flex-col space-y-4">
            {['Email', 'Adresse', 'Code postal', 'Numéro de télephone', 'Photo de profil'].map((data) => (
              <RadioButton
                key={data}
                id={data}
                label={data.replace(/([A-Z])/g, ' $1')}
                checked={userData[data]}
                onChange={() => handleUserDataChange(data)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>

    
  );
};

export default Parameters;
