import { faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id"); // Récupérer l'id de l'URL
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 14 }, (_, i) => currentYear + i);
  const months = [
    "01", "02", "03", "04", "05", "06", "07",
    "08", "09", "10", "11", "12"
  ];

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [price, setPrice] = useState(null);
  const [isCardSelected, setIsCardSelected] = useState(false);


  // Récupérer les cartes via l'API
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("/getCards");
        const data = await response.json();
        setCards(data.cards || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des cartes :", error);
      }
    };

    fetchCards();
  }, []);

  useEffect(() => {
    const fetchElearningDetails = async () => {
      try {
        const response = await fetch(`/elearningInfo?courseId=${id}`);
        const data = await response.json();
        if (data.success === "True" && data.eLearning.length > 0) {
          setPrice(data.eLearning[0].price); // Mettre à jour le prix
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'eLearning :", error);
      }
    };
  
    fetchElearningDetails();
  }, [id]);

  // Mise à jour des champs de formulaire avec les données de la carte sélectionnée
  const handleCardSelect = (card) => {
    setSelectedCard(card);
    const [month, year] = card.expiryDate.split("/");

    setFirstName(card.firstName);
    setLastName(card.lastName);
    setCardName(card.cardName);
    setCardNumber(card.cardNumber); // Masquer les numéros de carte sauf les 4 derniers
    setSelectedMonth(month);
    setSelectedYear(`20${year}`);
    setIsCardSelected(true);
  };

  const resetForm = () => {
    setSelectedCard(null);
    setFirstName("");
    setLastName("");
    setCardName("");
    setCardNumber("");
    setSelectedMonth("");
    setSelectedYear("");
    setCvc("");
    setIsCardSelected(false); // Désactiver le mode "carte sélectionnée"
  };

// Insérer la carte via l'API avec les paramètres dans l'URL
const insertCard = async () => {
  try {
    const queryParams = new URLSearchParams({
      cardName,
      firstName,
      lastName,
      cardNumber,
      expirationDate: `${selectedMonth}/${selectedYear.slice(-2)}`,
      isDefault: 0, 
    });

    const response = await fetch(`/insertCard?${queryParams.toString()}`, {
      method: "GET",
    });

    if (response.ok) {
      console.log("Carte insérée avec succès");
    } else {
      console.error("Erreur lors de l'insertion de la carte");
    }
  } catch (error) {
    console.error("Erreur lors de l'insertion de la carte :", error);
  }
};

  

  // Soumettre le paiement
  const handlePayment = async () => {
     // Vérifications des champs
  if (!firstName || !lastName || !cardName || !cardNumber || !selectedMonth || !selectedYear || !cvc) {
    Swal.fire({
      title: "Erreur",
      text: "Tous les champs doivent être remplis.",
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#d33",
    });
    return;
  }

  if (cvc.length !== 3 || !/^\d{3}$/.test(cvc)) {
    Swal.fire({
      title: "Erreur",
      text: "Le CVC doit contenir exactement 3 chiffres.",
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#d33",
    });
    return;
  }

  if (cardNumber.length !== 16) {
    Swal.fire({
      title: "Erreur",
      text: "Le numéro de carte doit contenir exactement 16 chiffres.",
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#d33",
    });
    return;
  }

    // Afficher la fenêtre de succès pour l'achat
    Swal.fire({
      title: "Achat effectué avec succès !",
      html: `
        <p>Vous avez acheté une nouvelle formation. Consultez votre profil pour voir les formations que vous possédez ainsi que leurs liens.</p>
        <p><strong>Voici le lien unique pour avoir accès à votre formation :</strong></p>
        <a href="#" id="elearning-link" style="color: #587208; font-weight: bold; text-decoration: underline;">
          https://GreenCircle/exemple.com
        </a>
      `,
      icon: "success",
      confirmButtonText: "Autres formations",
      confirmButtonColor: "#587208",
      allowOutsideClick: false,
      didOpen: () => {
        const elearningLink = document.getElementById("elearning-link");
        elearningLink.addEventListener("click", () => {
          window.location.href = `/acces_elearning?courseId=${id}`;
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/elearning";
      }
    });
    if (saveCard) {
      // Si la checkbox est cochée, appeler l'endpoint /insertCard
      await insertCard();
    }

    try {
      // Appeler l'endpoint pour enregistrer l'achat
      const response = await fetch(`/elearningInsert?courseId=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: "Une erreur s'est produite lors du processus de paiement. Veuillez réessayer.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
      return;
    }
    
  };

  return (
    <div className="p-4 h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-12 mt-20 w-full text-center">Paiement</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2 p-6 bg-yellowGreen1 bg-opacity-10 rounded-lg overflow-y-auto h-[62vh] flex flex-col gap-4">
          {/* Input pour le prénom */}
          <input
            type="text"
            placeholder="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md"
            disabled={isCardSelected} // Désactiver si une carte est sélectionnée
          />

          <input
            type="text"
            placeholder="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md"
            disabled={isCardSelected} // Désactiver si une carte est sélectionnée
          />

          <input
            type="text"
            placeholder="Nom de la carte"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md"
            disabled={isCardSelected} // Désactiver si une carte est sélectionnée
          />

          <input
            type="text"
            placeholder="Numéro de la carte"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md"
            disabled={isCardSelected} // Désactiver si une carte est sélectionnée
          />
          <div className="w-full flex items-center gap-2 mb-6">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-1/3 p-3 border border-gray-300 bg-white rounded-md"
              disabled={isCardSelected} // Désactiver si une carte est sélectionnée
            >
              <option value="">Mois</option>
                {[...Array(12).keys()].map(i => (
                  <option key={i} value={String(i + 1).padStart(2, "0")}>
                    {new Date(0, i).toLocaleString('fr-FR', { month: 'long' })}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-1/3 p-3 border border-gray-300 bg-white rounded-md"
                disabled={isCardSelected} // Désactiver si une carte est sélectionnée
              >
                <option value="" disabled>
                  Année
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="CVC"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-1/3 p-3 border border-gray-300 bg-white rounded-md"
                // Le champ CVC reste activé même si une carte est sélectionnée
              />
          </div>

          <div className="w-full flex items-center gap-2 mb-6">
            {isCardSelected ? (
              <button
                onClick={resetForm}
                className="w-full bg-orange-500 text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200"
              >
                Vider
              </button>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="text-gray-700">Enregistrer la carte</label>
              </>
            )}
          </div>

          <button
            onClick={handlePayment}
              className="w-full bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200"
            >
            Acheter {price ? `(${price} €)` : ""}
          </button>
        </div>

        <div className="w-full lg:w-1/2 p-6 bg-yellowGreen1 bg-opacity-10 rounded-lg overflow-y-auto h-[62vh]">
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
                      onClick={() => handleCardSelect(card)}
                      className="text-white bg-blue p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-red-400"
                    >
                      <FontAwesomeIcon icon={faReply} />
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
  );
};

export default PaymentPage;
