import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import RadioButton from "../RadioButton/RadioButton";

const Parameters = () => {
  const [notifications, setNotifications] = useState({
    meuble: null,
    elearning: false,
    article: false,
    event: false,
    message: false,
    response: false,
  });
  const [userData, setUserData] = useState({
    email: false,
    address: false,
    postalCode: false,
    phoneNumber: false,
    profilePic: false,
  });
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/profileParameters")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setIsLoading(false);
        setNotifications({
          meuble: data.preferencesData[0].notif.meuble,
          elearning: data.preferencesData[0].notif.elearning,
          article: data.preferencesData[0].notif.article,
          event: data.preferencesData[0].notif.event,
          message: data.preferencesData[0].notif.message,
          response: data.preferencesData[0].notif.forum,
        });
        setUserData({
          email: data.preferencesData[0].info.info_email,
          address: data.preferencesData[0].info.info_adress,
          postalCode: data.preferencesData[0].info.info_zipcode,
          phoneNumber: data.preferencesData[0].info.info_phone,
          profilePic: data.preferencesData[0].info.info_pp,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Chargement en cours...</p>;
  }

  if (!data) {
    return <p>Erreur lors du chargement des données.</p>;
  }

  const sendUpdatedData = async (type, field, value) => {
    try {
      const url = `/update${type}?${field}=${value}`;
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour.");
      }

      toast.success("Données mises à jour avec succès.");
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  const handleNotificationChange = (name) => {
    const updatedValue = !notifications[name];
    setNotifications((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    sendUpdatedData("ProfileNotif", name, updatedValue);
  };

  const handleUserDataChange = (name) => {
    const updatedValue = !userData[name];
    setUserData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    sendUpdatedData("ProfileInfo", name, updatedValue);
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">
        Paramètres
      </h2>

      <div className="grid grid-cols-2 gap-5 w-full h-[30vh]">
        {/* Gestion des notifications */}
        <div className="flex flex-col justify-between bg-white shadow-md rounded-lg p-4 w-full border border-yellowGreen1 border-opacity-40">
          <div>
            <h3 className="font-semibold text-lg text-green-600">
              Gestion des notifications
            </h3>
            <p className="text-sm text-gray-500">
              Sélectionnez les notifications que vous souhaitez recevoir.
            </p>
          </div>
          <div className="flex flex-col space-y-4 w-full">
            {[
              { key: "meuble", label: "Nouveau dépôts" },
              { key: "elearning", label: "Nouvel e-learning" },
              { key: "article", label: "Nouvel article" },
              { key: "event", label: "Nouvel évènement" },
              { key: "message", label: "Nouveau message" },
              { key: "response", label: "Nouvelle réponse sur le forum" },
            ].map((notification) => (
              <RadioButton
                key={notification.key}
                id={notification.key}
                label={notification.label}
                checked={notifications[notification.key]}
                onChange={() => handleNotificationChange(notification.key)}
              />
            ))}
          </div>
        </div>

        {/* Données à afficher aux autres utilisateurs */}
        <div className="flex flex-col justify-between bg-white shadow-md rounded-lg p-4 w-full border border-yellowGreen1 border-opacity-40">
          <div>
            <h3 className="font-semibold text-lg text-green-600">
              Données à afficher aux autres utilisateurs
            </h3>
            <p className="text-sm text-gray-500">
              Sélectionnez les données que les autres utilisateurs pourront voir.
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            {[
              { key: "info_email", label: "Email" },
              { key: "info_adress", label: "Adresse" },
              { key: "info_zipcode", label: "Code Postal" },
              { key: "info_phone", label: "Numéro de Téléphone" },
              { key: "info_pp", label: "Photo de Profil" },
            ].map((data) => (
              <RadioButton
                key={data.key}
                id={data.key}
                label={data.label}
                checked={userData[data.key]}
                onChange={() => handleUserDataChange(data.key)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mon compte */}
      <div className="flex flex-col bg-white shadow-md rounded-lg p-4 w-ful border border-yellowGreen1 border-opacity-40 mt-12">
        <h3 className="font-semibold text-lg text-green-600">Mon compte</h3>
        <div className="flex items-center justify-center space-x-4 h-full">
          <button className="bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200">
            Récupérer mes données personnelles
          </button>
          <button className="bg-red text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-60 transition duration-200">
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  );
};

export default Parameters;
