import React, { useEffect, useState } from "react";
import Switch from "../Switch/Switch";
import StaticGrid from "../StaticGrid/StaticGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingColumns, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import ElearningThumbnail from "../ElearningThumbnail/ElearningThumbnail";
import toast from "react-hot-toast";

const MyPurchase = () => {
  const [selectedOption, setSelectedOption] = useState("E-learning acheté");
  const [cards, setCards] = useState([]);
  const [formData, setFormData] = useState({
    cardName: "",
    lastName: "",
    firstName: "",
    cardNumber: "",
    month: "",
    year: "",
    cvc: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCards = async () => {
    try {
      const response = await fetch("/getCards");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const cardsData = await response.json();
      const formattedCards = cardsData.cards.map((card) => {
        const [month, year] = card.expiryDate.split("/");
        return {
          id: card.id,
          cardName: card.cardName,
          holderName: `${card.firstName} ${card.lastName}`,
          cardNumber: card.cardNumber,
          month,
          year,
        };
      });

      setCards(formattedCards);
    } catch (error) {
      console.error("Erreur lors de la récupération des cartes :", error);
    }
  };

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch("/profilePurchases");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const purchasesData = await response.json();
        setData(purchasesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des achats :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
    fetchCards();
  }, []);

  useEffect(() => {
    const isValid =
      formData.cardName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.firstName.trim() !== "" &&
      formData.cardNumber.trim().length === 16 &&
      /^\d+$/.test(formData.cardNumber) &&
      formData.month.trim() !== "" &&
      formData.year.trim() !== "" &&
      formData.cvc.trim().length === 3 &&
      /^\d+$/.test(formData.cvc);
    setIsFormValid(isValid);
  }, [formData]);

  const handleAddCard = async () => {
    const queryParams = new URLSearchParams({
      cardName: formData.cardName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      cardNumber: formData.cardNumber,
      expirationDate: `${formData.month}/${formData.year.slice(-2)}`,
      isDefault: 0,
    });
  
    try {
      const response = await fetch(`/insertCard?${queryParams.toString()}`, {
        method: "GET",
      });
  
      if (response.ok) {
        toast.success("Carte insérée avec succès.");
        await fetchCards();
  
        setFormData({
          cardName: "",
          lastName: "",
          firstName: "",
          cardNumber: "",
          month: "",
          year: "",
          cvc: "",
        });
      } else {
        console.error("Erreur lors de l'insertion de la carte");
        toast.error("Erreur lors de l'insertion de la carte.");
      }
    } catch (error) {
      console.error("Erreur lors de l'insertion de la carte :", error);
      toast.error("Erreur lors de l'insertion de la carte.");
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      const response = await fetch(`/deleteCard?cardId=${cardId}`, {
        method: "GET",
      });
      

      if (response.ok) {
        toast.success("Carte supprimée avec succès.");
        await fetchCards();
      } else {
        console.error("Erreur lors de la suppression de la carte");
        toast.error("Erreur lors de l'insertion de la carte.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la carte :", error);
      toast.error("Erreur lors de l'insertion de la carte.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  if (isLoading) {
    return <p>Chargement en cours...</p>;
  }

  if (!data) {
    return <p>Erreur lors du chargement des données.</p>;
  }

  const elearningThumbnail = data.purchases.map((elearning) => (
    <ElearningThumbnail key={`thumbnail-${elearning.id_item}`} elearning={elearning} fromAccount={true} />
  ));

  return (
    <div className="bg-white w-full">
      <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Mes achats</h2>

      <Switch
        option1Title={"E-learning acheté"}
        option2Title={"Moyen de paiement"}
        selectedDefault={"E-learning acheté"}
        onSwitchChange={(option) => setSelectedOption(option)}
      />

      {selectedOption === "E-learning acheté" && (
        <div id="E-learning acheté" className="overflow-y-auto h-[70vh]">
          <StaticGrid items={elearningThumbnail} />
        </div>
      )}

      {selectedOption === "Moyen de paiement" && (
        <div id="Moyen de paiement" className="py-4">
          <h2 className="text-xl font-semibold text-darkGreen mb-8 text-center">Mes cartes bancaires</h2>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/2 p-6 bg-yellowGreen1 bg-opacity-10 rounded-lg overflow-y-auto h-[55vh]">
              <h2 className="text-2xl font-semibold text-gray-800 mb-8">Ajouter une carte bancaire</h2>
              <form>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  placeholder="Nom de la carte"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Nom du titulaire"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Prénom du titulaire"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md"
                />
                {formData.cardNumber.length !== 16 && (
                  <p className="text-red">Le numéro de carte doit comporter 16 caractères.</p>
                )}
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="Numéro de carte (16 chiffres)"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md"
                />
                <div className="flex space-x-4 mb-4">
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    className="w-1/3 p-3 border border-gray-300 bg-white rounded-md"
                  >
                    <option value="">Mois</option>
                    {[...Array(12).keys()].map((i) => (
                      <option key={i} value={String(i + 1).padStart(2, "0")}>
                        {new Date(0, i).toLocaleString("fr-FR", { month: "long" })}
                      </option>
                    ))}
                  </select>

                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-1/3 p-3 border border-gray-300 bg-white rounded-md"
                  >
                    <option value="">Année</option>
                    {Array.from({ length: 15 }, (_, i) => 2024 + i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleInputChange}
                    placeholder="CVC (3 chiffres)"
                    className="w-1/3 p-3 border border-gray-300 rounded-md"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddCard}
                  disabled={!isFormValid}
                  className={`w-full px-6 py-3 text-lg font-semibold rounded-md transition duration-200 ${
                    isFormValid
                      ? "bg-oliveGreen text-white hover:bg-opacity-90"
                      : "bg-oliveGreen bg-opacity-80 text-white cursor-not-allowed"
                  }`}
                >
                  Sauvegarder
                </button>
              </form>
            </div>
            <div className="w-full lg:w-1/2 p-6 bg-yellowGreen1 bg-opacity-10 rounded-lg overflow-y-auto h-[55vh]">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Cartes enregistrées</h3>
              <div className="space-y-4">
                {cards.length > 0 ? (
                  cards.map((card) => (
                    <div
                      key={card.id}
                      className="flex justify-between items-center bg-darkGreen bg-opacity-30 p-4 rounded-lg"
                    >
                      <span className="text-darkGreen font-semibold text-xl">{card.cardName}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="text-white bg-red p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-red-400"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Aucune carte enregistrée</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  ); 
};
export default MyPurchase;
