import { faLock, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';

const MyFavorite = () => {
  // États pour les données du profil
  const [profileData, setProfileData] = useState({
    siren: "",
    nom: "",
    email: "",
    city: "",
    adress: "",
    zipcode: "",
    phone: "",
    password: "",
    pp: null,
  });

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    city: "",
    adress: "",
    zipcode: "",
    phone: "",
  });

  // Récupération des données depuis le serveur
  useEffect(() => {
    fetch("/profile")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProfileData({
          siren: data.siren,
          nom: data.nom,
          email: data.email,
          city: data.city,
          adress: data.adress,
          zipcode: data.zipcode,
          phone: data.phone,
          password: data.password,
          pp: data.pp,
        });
        setFormData({
          nom: data.nom,
          email: data.email,
          city: data.city,
          adress: data.adress,
          zipcode: data.zipcode,
          phone: data.phone,
        });
      })
      .catch((error) => console.error("Error fetching profile data:", error));
  }, []);

  // Handler pour la mise à jour des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    // Validation des champs
    const validateFields = () => {
      const { email, phone } = formData;
  
      // Vérifier si l'email est valide
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (email && !emailRegex.test(email)) {
        toast.error("L'email n'est pas valide.");
        return false;
      }
  
      // Vérifier si le téléphone est valide (exemple français)
      const phoneRegex = /^[0-9]{10}$/;
      if (phone && !phoneRegex.test(phone)) {
        toast.error("Le numéro de téléphone n'est pas valide.");
        return false;
      }
  
      // Ajoute d'autres validations ici si nécessaire
  
      return true;
    };

  // Soumission du formulaire pour mettre à jour le profil
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation des champs
    if (!validateFields()) {
      return;
    }

    // Créer un objet avec uniquement les champs modifiés
    const updatedData = {};
    for (let key in formData) {
      if (formData[key] !== profileData[key]) {
        updatedData[key] = formData[key];
      }
    }

    // Si aucun champ n'a été modifié, ne rien envoyer
    if (Object.keys(updatedData).length === 0) {
      toast.error("Aucun champ modifié.");
      return;
    }

    // Construire l'URL avec les champs modifiés en tant que paramètres GET
    const queryString = new URLSearchParams(updatedData).toString();

    // Envoi de la requête GET avec uniquement les champs modifiés
    fetch(`/updateProfile?${queryString}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          toast.success("Profil mis à jour avec succès.");
        } else {
          toast.error("Erreur lors de la mise à jour du profil.");
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("Une erreur s'est produite lors de la mise à jour du profil.");
      });
  };

  

  return (
    <div className="bg-white w-full">
      <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">
        Éditer mon profil
      </h2>

      {/* Avatar */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <img
            src={profileData.pp || "/default_user.png"} // Avatar par défaut si pas d'avatar
            alt="Avatar"
            className="w-32 h-32 rounded-full border-2 border-gray-300"
          />
          <button className="absolute bottom-0 right-0 bg-yellowGreen1 p-2 rounded-full shadow-lg hover:scale-105 transition w-10 h-10">
            <FontAwesomeIcon icon={faPen} className="text-white" />
          </button>
        </div>
      </div>

      {/* Formulaire */}
      <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* Nom de l'entreprise */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Nom de l’entreprise</label>
          <div className="relative">
            <input
              type="text"
              name="nom"
              placeholder="Entreprise"
              value={formData.nom}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
            />
            <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
              <FontAwesomeIcon icon={faLock} className="text-black" />
            </span>
          </div>
        </div>

        {/* Numéro de SIREN */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Numéro de SIREN</label>
          <div className="relative">
            <input
              type="text"
              placeholder="XXXXXXXXX"
              value={profileData.siren}
              className="w-full border rounded-lg p-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
              disabled
            />
            <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
              <FontAwesomeIcon icon={faLock} className="text-black" />
            </span>
          </div>
        </div>
        
                {/* Mot de passe */}
                <div>
          <label className="block text-gray-700 font-medium mb-2">Mot de passe</label>
          <div className="relative flex items-center justify-center">
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border rounded-lg p-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
              disabled
            />
            <button className="absolute right-0 bg-yellowGreen1 p-2 rounded-full shadow-lg hover:scale-105 transition w-8 h-8 mr-2 flex justify-center items-center">
              <FontAwesomeIcon icon={faPen} className="text-white text-xs" />
            </button>
          </div>
        </div>

        {/* Adresse */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Adresse</label>
          <input
            type="text"
            name="adress"
            placeholder="1 AVENUE JOHANNES GUTENBERG"
            value={formData.adress}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
          />
        </div>

        

        {/* Ville */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Ville</label>
          <input
            type="text"
            name="city"
            placeholder="Serris"
            value={formData.city}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
          />
        </div>

        {/* Code postal */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Code postal</label>
          <input
            type="text"
            name="zipcode"
            placeholder="77700"
            value={formData.zipcode}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
          />
        </div>

        {/* Mail */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Mail</label>
          <input
            type="email"
            name="email"
            placeholder="exemple@mail.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
          />
        </div>

        {/* Numéro de téléphone */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Numéro de téléphone</label>
          <input
            type="text"
            name="phone"
            placeholder="01XXXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellowGreen1"
          />
        </div>


        {/* Bouton Sauvegarder */}
        <div className="flex justify-center w-[200%] mt-8">
          <button
            type="submit"
            className="bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200"
          >
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyFavorite;
