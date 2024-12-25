import React, { useState } from "react";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending data:", formData);

    try {
        const response = await fetch("/forgotPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
            setErrorMessage(result.message);
        } else {
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
            Mot de passe oublié
          </h2>

          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit} className="space-y-4">
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

export default ForgotPassword;
