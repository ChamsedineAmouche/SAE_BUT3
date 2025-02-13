import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

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
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!acceptPolicy) {
      setErrorMessage("Vous devez accepter la politique de confidentialité pour vous inscrire.");
      return;
    }


    console.log("Sending form data:", formData);  
  
    try {
      const response = await fetch("/inscription", {
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

  const handleHelpSiren = () => {
    Swal.fire({
      title: "Où trouver le numéro de SIRET de mon entreprise ?",
      html: `
        <p>Le numéro SIRET est un identifiant unique de 14 chiffres attribué à chaque entreprise en France. Vous pouvez le trouver sur les documents officiels de l'entreprise, 
        tels que les factures, les fiches de paie, ou les documents d'enregistrement de l'entreprise.</p>
        <br>
        <p>Vous pouvez aussi le trouver sur le site <a href="https://www.infogreffe.fr/" class target="_blank" class="text-oliveGreen">Infogreffe</a> en cherchant le nom de votre entreprise.</p>
        <img src="/siret.png" alt="Où trouver le numéro de SIRET de mon entreprise ?" class="w-full mx-auto mt-4" />
      `,
      icon: "info",
      confirmButtonText: "OK",
      width: "50rem",
      customClass: {
        confirmButton: "bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200",
      },
    });
  }

  return (
    <div className="register-page">
      {/* Section Formulaire */}
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-darkGreen text-center mb-8">
            Inscription
          </h2>

          {/* Formulaire d'inscription */}
          <form onSubmit={handleSubmit} className="space-y-4">
              {/* SIRET */}
              <div className="form-group">
              <label htmlFor="siren" className="block text-lg text-darkGreen">
                SIRET 
                <span className="text-red" title="Champs obligatoire">*</span>
                <FontAwesomeIcon 
                  icon={faCircleInfo} 
                  className="text-darkGreen px-2 cursor-pointer"
                  onClick={() => handleHelpSiren()}
                />
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

              <div className="flex space-x-6">
                <div className="w-full space-y-4">
                  {/* Nom */}
                  <div className="form-group">
                    <label htmlFor="nom" className="block text-lg text-darkGreen">
                      Nom <span className="text-red" title="Champs obligatoire">*</span>
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
                      Email <span className="text-red" title="Champs obligatoire">*</span>
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
                      Mot de passe <span className="text-red" title="Champs obligatoire">*</span>
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
                      Confirmez le mot de passe <span className="text-red" title="Champs obligatoire">*</span>
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

                  <div className="form-group flex items-center">
              <input
                type="checkbox"
                id="acceptPolicy"
                name="acceptPolicy"
                checked={acceptPolicy}
                onChange={(e) => setAcceptPolicy(e.target.checked)}
                className="mr-2"
                required
              />
              <label htmlFor="acceptPolicy" className="text-lg text-darkGreen">
                J'accepte la <a href="/politique_confidentialite" className="text-blue-500 underline">politique de confidentialité</a>
              </label>
            </div>
                </div>
                
                <div className="w-full space-y-4">
                  {/* Adresse */}
                <div className="form-group">
                  <label htmlFor="adress" className="block text-lg text-darkGreen">
                    Adresse <span className="text-red" title="Champs obligatoire">*</span>
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
                    Code Postal <span className="text-red" title="Champs obligatoire">*</span>
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
                    Ville <span className="text-red" title="Champs obligatoire">*</span>
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
                    Téléphone <span className="text-red" title="Champs obligatoire">*</span>
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


                </div>
              </div>
              
              
            

            {/* Affichage des erreurs */}
            {errorMessage && <div className="text-red text-center mt-2">{errorMessage}</div>}

            {/* Bouton de soumission */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200"
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
