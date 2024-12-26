import React, { useState } from "react";
import Switch from "../Switch/Switch";
import SquareGrid from "../SquareGrid/SquareGrid";

const MyFavorite = () => {
  const [selectedOption, setSelectedOption] = useState("Dépots");

  const handleSwitchChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="bg-white w-full">
      <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Mes Favoris</h2>
      
      <Switch 
        option1Title={"Dépots"} 
        option2Title={"E-learnings"} 
        selectedDefault={"Dépots"} 
        onSwitchChange={handleSwitchChange}
      />

      {selectedOption === "Dépots" && (
        <div id="Dépots" className="overflow-y-auto h-[70vh]">
          <SquareGrid items={['exemple', 'exemple', 'exemple', 'exemple', 'exemple', 'exemple', 'exemple', 'exemple']}/>
        </div>
      )}
      {selectedOption === "E-learnings" && (
        <div id="E-learnings" className="overflow-y-auto h-[70vh]">
          <SquareGrid items={['exempddle', 'exemple', 'exemple', 'exemple', 'exemple', 'exemple', 'exemple', 'exemple']}/>
        </div>
      )}
    </div>
  );
};

export default MyFavorite;