import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const Register = () => {
  const [formData, setFormData] = useState({
    siren: "",
    nom: "",
    email: "",
    password: "",
    confirmPassword: "",
    adress: "",
    zipcode: "",
    city: "",
    phone: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Sending form data:", formData);  
  
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), 
      });
  
      const result = await response.json();
  
      if (result.success) {
        setErrorMessage(result.message);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="register-page">
      {/* Section Formulaire */}
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-darkGreen text-center mb-8">
            Inscription
          </h2>

          {/* Formulaire d'inscription */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* SIREN */}
            <div className="form-group">
              <label htmlFor="siren" className="block text-lg text-darkGreen">
                SIREN
              </label>
              <input
                type="text"
                id="siren"
                name="siren"
                value={formData.siren}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Nom */}
            <div className="form-group">
              <label htmlFor="nom" className="block text-lg text-darkGreen">
                Nom
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="block text-lg text-darkGreen">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Mot de passe */}
            <div className="form-group">
              <label htmlFor="password" className="block text-lg text-darkGreen">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

              {/* Confirmer Mot de passe */}
              <div className="form-group">
              <label htmlFor="confirmPassword" className="block text-lg text-darkGreen">
                Mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Adresse */}
            <div className="form-group">
              <label htmlFor="adress" className="block text-lg text-darkGreen">
                Adresse
              </label>
              <input
                type="text"
                id="adress"
                name="adress"
                value={formData.adress}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Code Postal */}
            <div className="form-group">
              <label htmlFor="zipcode" className="block text-lg text-darkGreen">
                Code Postal
              </label>
              <input
                type="text"
                id="zipcode"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Ville */}
            <div className="form-group">
              <label htmlFor="city" className="block text-lg text-darkGreen">
                Ville
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Téléphone */}
            <div className="form-group">
              <label htmlFor="phone" className="block text-lg text-darkGreen">
                Téléphone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Affichage des erreurs */}
            {errorMessage && <div className="text-red-500 text-center mt-2">{errorMessage}</div>}

            {/* Bouton de soumission */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-darkGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-80 transition duration-200"
              >
                S'inscrire
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
