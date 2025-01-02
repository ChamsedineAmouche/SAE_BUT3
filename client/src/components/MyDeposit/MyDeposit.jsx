import React, { useEffect, useState } from "react";
import Switch from "../Switch/Switch";
import SquareGrid from "../SquareGrid/SquareGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import DepositThumbnail from "../DepositThumbnail/DepositThumbnail";
import ElearningThumbnail from "../ElearningThumbnail/ElearningThumbnail";

const MyDeposit = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("Publié");
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleSwitchChange = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    fetch('/profileListing')
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

  const activeDepositThumbnails = data.active.depots.map((depots) => (
    <DepositThumbnail key={`thumbnail-${depots.id_item}`} object={depots} />
  ));

  const draftDepositThumbnails = data.draft.depots.map((depots) => (
    <DepositThumbnail key={`thumbnail-${depots.id_item}`} object={depots} />
  ));

  return (
    <div className="bg-white w-full">
      <button 
        className="bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200 absolute top-28 right-12"
        onClick={() => navigate("/nouveau_depot")}
      >
        <FontAwesomeIcon icon={faPlusSquare} className="pr-2"/>
        Dépôts
      </button>
      <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Mes Dépots</h2>
      
      <Switch 
        option1Title={"Publié"} 
        option2Title={"Brouillon"} 
        selectedDefault={"Publié"} 
        onSwitchChange={handleSwitchChange}
      />

      {selectedOption === "Publié" && (
        <div id="Publié" className="overflow-y-auto h-[70vh]">
          <SquareGrid items={activeDepositThumbnails}/>
        </div>
      )}
      {selectedOption === "Brouillon" && (
        <div id="Brouillon" className="overflow-y-auto h-[70vh]">
          <SquareGrid items={draftDepositThumbnails}/>
        </div>
      )}
    </div>
  );
};

export default MyDeposit;