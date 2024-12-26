import React from "react";
import Switch from "../Switch/Switch";

const MyFavorite = () => {
  return (
    <div className="bg-white w-full">
      <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Mes Favoris</h2>
      
      <Switch option1Title={"Dépots"} option2Title={"E-learnings"} />
    </div>
  );
};

export default MyFavorite;
