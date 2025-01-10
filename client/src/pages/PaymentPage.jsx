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
        const response = await fetch(`/elearningPage?idElearning=${id}`);
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
          window.location.href = "/acces_elearning";
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
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-12">Paiement</h1>

      {/* Liste des cartes avec checkboxes (cercle) alignées horizontalement */}
      <div className="w-full max-w-md mb-6 flex gap-6 justify-center">
        {cards.map((card) => (
          <div key={card.id} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedCard?.id === card.id}
              onChange={() => handleCardSelect(card)}
              className="h-6 w-6 border-2 border-gray-300 rounded-full text-green-500 focus:ring-green-500"
            />
            <label className="ml-2 text-gray-700">{card.cardName}</label>
          </div>
        ))}
      </div>

      {/* Input pour le prénom */}
      <input
        type="text"
        placeholder="Prénom"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full max-w-md p-3 mb-4 border rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* Input pour le nom */}
      <input
        type="text"
        placeholder="Nom"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="w-full max-w-md p-3 mb-4 border rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* Input pour le nom de la carte */}
      <input
        type="text"
        placeholder="Nom de la carte"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        className="w-full max-w-md p-3 mb-4 border rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* Input pour le numéro de carte */}
      <input
        type="text"
        placeholder="Numéro de la carte"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        className="w-full max-w-md p-3 mb-4 border rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <div className="w-full max-w-md flex items-center gap-4 mb-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-1/3 p-3 border rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="" disabled>
            Mois
          </option>
          {months.map((month, index) => (
            <option key={index + 1} value={(index + 1).toString().padStart(2, "0")}>
              {month}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-1/3 p-3 border rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
          className="w-1/3 p-3 border rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="w-full max-w-md flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          checked={saveCard}
          onChange={(e) => setSaveCard(e.target.checked)}
          className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
        />
        <label className="text-gray-700">Enregistrer la carte</label>
      </div>

      <button
        onClick={handlePayment}
        className="bg-[#587208] text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Acheter {price ? `(${price} €)` : ""}
      </button>
    </div>
  );
};

export default PaymentPage;
