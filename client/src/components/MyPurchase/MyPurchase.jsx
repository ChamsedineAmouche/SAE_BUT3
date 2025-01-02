import React, { useEffect, useState } from "react";
import Switch from "../Switch/Switch";
import SquareGrid from "../SquareGrid/SquareGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingColumns, faEdit, faPlusSquare, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { faApple, faApplePay, faGooglePay, faPaypal } from "@fortawesome/free-brands-svg-icons";
import ElearningThumbnail from "../ElearningThumbnail/ElearningThumbnail";

const MyPurchase = () => {
	const navigate = useNavigate();
	const [selectedOption, setSelectedOption] = useState("E-learning acheté");
	const [cards, setCards] = useState([]);
	const [editCard, setEditCard] = useState(null);
	const [formData, setFormData] = useState({
	  cardName: "",
	  holderName: "",
	  cardNumber: "",
	  month: "",
	  year: "",
	  cvc: ""
	});
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/profilePurchases')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data)
      setData(data);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    })
  }, []);

  if (isLoading) {
    return <p>Chargement en cours...</p>;
  }

  if (!data) {
    return <p>Erreur lors du chargement des données.</p>;
  }

  const elearningThumbnail = data.purchases.map((elearning) => (
    <ElearningThumbnail key={`thumbnail-${elearning.id_item}`} elearning={elearning} />
  ));

  
	const handleSwitchChange = (option) => {
	  setSelectedOption(option);
	};
  
	const handleInputChange = (e) => {
	  const { name, value } = e.target;
	  setFormData((prevData) => ({ ...prevData, [name]: value }));
	};
  
	const handleAddCard = () => {
	  if (editCard === null) {
		// Ajouter une nouvelle carte
		setCards((prevCards) => [
		  ...prevCards,
		  { ...formData, id: Date.now() } // Ajoute un ID unique pour chaque carte
		]);
	  } else {
		// Modifier une carte existante
		setCards((prevCards) =>
		  prevCards.map((card) =>
			card.id === editCard.id ? { ...formData, id: card.id } : card
		  )
		);
	  }
  
	  // Réinitialiser le formulaire après l'ajout ou la modification
	  setFormData({
		cardName: "",
		holderName: "",
		cardNumber: "",
		month: "",
		year: "",
		cvc: ""
	  });
	  setEditCard(null); // Réinitialiser l'état d'édition
	};
  
	const handleDeleteCard = (cardId) => {
	  setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
	};
  
	const handleEditCard = (card) => {
	  setFormData(card);
	  setEditCard(card);
	};

  return (
    <div className="bg-white w-full">
      <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Mes achats</h2>
      
      <Switch 
        option1Title={"E-learning acheté"} 
        option2Title={"Moyen de paiement"} 
        selectedDefault={"E-learning acheté"} 
        onSwitchChange={handleSwitchChange}
      />

	{selectedOption === "E-learning acheté" && (
        <div id="E-learning acheté" className="overflow-y-auto h-[70vh]">
          <SquareGrid items={elearningThumbnail}/>
        </div>
      )}

      {selectedOption === "Moyen de paiement" && (
        <div id="Moyen de paiement" className="overflow-y-auto h-[70vh] py-4">
          <h2 className="text-xl font-semibold text-darkGreen mb-8 text-center">Mes cartes bancaires</h2>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Formulaire d'ajout de carte */}
            <div className="w-full lg:w-1/2 p-6 bg-yellowGreen1 bg-opacity-10 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-8">
                {editCard ? "Modifier une carte bancaire" : "Ajouter une carte bancaire"}
              </h2>
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
                  name="holderName"
                  value={formData.holderName}
                  onChange={handleInputChange}
                  placeholder="Nom du titulaire" 
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md"
                />
                <input 
                  type="text" 
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="Numéro de carte" 
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
                    {/* Liste des mois */}
                    {[...Array(12).keys()].map(i => (
                      <option key={i} value={String(i + 1).padStart(2, "0")}>
                        {new Date(0, i).toLocaleString('fr-FR', { month: 'long' })}
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
                    placeholder="CVC" 
                    className="w-1/3 p-3 border border-gray-300 rounded-md"
                  />
                </div>
                
                <button 
                  type="button" 
                  onClick={handleAddCard}
                  className="w-full bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200"
                >
                  {editCard ? "Mettre à jour" : "Sauvegarder"}
                </button>
              </form>
            </div>

            {/* Cartes bancaires enregistrées */}
            <div className="w-full lg:w-1/2 p-6 bg-yellowGreen1 bg-opacity-10 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Cartes enregistrées</h3>
              <div className="space-y-4">
                {cards.length > 0 ? 
					cards.map((card) => (
					<div key={card.id} className="flex justify-between items-center bg-darkGreen bg-opacity-30 p-4 rounded-lg">
						<span className="text-darkGreen font-semibold text-xl">{card.cardName}</span>
						<div className="flex space-x-2">
						<button 
						onClick={() => handleEditCard(card)} 
						className="text-blue-600 bg-blue p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-blue-400"
						>
						<FontAwesomeIcon icon={faEdit} />
						</button>
						<button 
						onClick={() => handleDeleteCard(card.id)} 
						className="text-red-600 bg-red p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-red-400"
						>
						<FontAwesomeIcon icon={faTrashAlt} />
						</button>
						</div>
					</div>
					))
					: "Aucune carte enregistrée"
                }
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-darkGreen mb-8 text-center mt-5">Mes modes de paiements tiers</h2>
		  
		  <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
			<div className=" w-32 h-24 rounded-lg shadow-lg flex items-center justify-center text-5xl text-yellowGreen1 cursor-pointer hover:bg-yellowGreen1 hover:bg-opacity-20">
				<FontAwesomeIcon icon={faPaypal} />
			</div>
			<div className=" w-32 h-24 rounded-lg shadow-lg flex items-center justify-center text-5xl text-yellowGreen1 cursor-pointer hover:bg-yellowGreen1 hover:bg-opacity-20">
				<FontAwesomeIcon icon={faApplePay} />
			</div>
			<div className=" w-32 h-24 rounded-lg shadow-lg flex items-center justify-center text-5xl text-yellowGreen1 cursor-pointer hover:bg-yellowGreen1 hover:bg-opacity-20">
				<FontAwesomeIcon icon={faGooglePay} />
			</div>
			<div className=" w-32 h-24 rounded-lg shadow-lg flex items-center justify-center text-5xl text-yellowGreen1 cursor-pointer hover:bg-yellowGreen1 hover:bg-opacity-20">
				<FontAwesomeIcon icon={faBuildingColumns} />
			</div>
		  </div>

        </div>
      )}
    </div>
  );
};

export default MyPurchase;
