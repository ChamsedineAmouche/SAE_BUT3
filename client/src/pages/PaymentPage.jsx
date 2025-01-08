import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const PaymentPage = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 14 }, (_, i) => currentYear + i);
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const [cardNumber, setCardNumber] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  useEffect(() => {
    const fetchDefaultCard = async () => {
      try {
        const response = await fetch("/getDefaultCard");
        const data = await response.json();

        if (data.cards && data.cards.length > 0) {
          const defaultCard = data.cards[0];
          const [month, year] = defaultCard.expiryDate.split("/");

          setCardNumber(defaultCard.cardNumber);
          setSelectedMonth(month);
          setSelectedYear(`20${year}`);
        }
      } catch (error) {
        console.error("Erreur lors du fetch de la carte par défaut :", error);
      }
    };

    fetchDefaultCard();
  }, []);

  const handlePayment = () => {
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
      allowOutsideClick: false, // Désactiver la fermeture en dehors du modal
      didOpen: () => {
        // Ajouter un événement pour le lien dans Swal
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
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Paiement</h1>

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
        Acheter
      </button>
    </div>
  );
};

export default PaymentPage;
