import React, { useState } from "react";
import Switch from "../Switch/Switch";
import SquareGrid from "../SquareGrid/SquareGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const MyDeposit = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("Publié");

  const handleSwitchChange = (option) => {
    setSelectedOption(option);
  };

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
          <SquareGrid items={['exemple', 'exemple', 'exemple', 'exemple', 'exemple', 'exemple', 'exemple', 'exemple']}/>
        </div>
      )}
      {selectedOption === "Brouillon" && (
        <div id="Brouillon" className="overflow-y-auto h-[70vh]">
          <SquareGrid items={['exempddle', 'exemple', 'exemple', 'exemple', 'exemple', 'exemple', 'exemple', 'exemple']}/>
        </div>
      )}
    </div>
  );
};

export default MyDeposit;