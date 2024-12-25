import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const params = new URLSearchParams(window.location.search); // Récupère les paramètres de l'URL
      const token = params.get("token");
      const siren = params.get("siren");

      try {
        const response = await fetch(`/verifyToken?token=${token}&siren=${siren}`);
        const result = await response.json();

        if (!result.success) {
          setErrorMessage(result.message);
          navigate("/"); // Redirection vers la page d'accueil
        }
      } catch (error) {
        console.error("Erreur :", error);
        setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
        navigate("/"); // Redirection en cas d'erreur
      }
    };

    verifyToken();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending data:", formData);

    try {
      const params = new URLSearchParams(window.location.search); // Récupère les paramètres de l'URL
      const siren = params.get("siren");
      const response = await fetch(`/resetPassword?siren=${siren}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setErrorMessage(result.message);

        setTimeout(() => {
          navigate("/login"); // Redirection vers la page de login après 3 secondes
        }, 3000); // Délai de 3000 millisecondes (3 secondes)
        
      }  else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error("Erreur :", error);
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="login-page">
      {/* Section Formulaire */}
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-darkGreen text-center mb-8">
            Réinitialisation du mot de passe
          </h2>

          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password */}
            <div className="form-group">
              <label htmlFor="email" className="block text-lg text-darkGreen">
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

            <div className="form-group">
              <label htmlFor="email" className="block text-lg text-darkGreen">
                Confirmez le mot de passe
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

            {/* Affichage des erreurs */}
            {errorMessage && <div className="text-red-500 text-center mt-2">{errorMessage}</div>}

            {/* Bouton de soumission */}
            <div className="flex flex-col items-center gap-4">
              <button
                type="submit"
                className="bg-darkGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-80 transition duration-200"
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
