import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faHeart,
  faBox,
  faShoppingCart,
  faCalendarCheck,
  faCog,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

import EditProfile from "../components/EditProfile/EditProfile";
import MyFavorite from "../components/MyFavorite/MyFavorite";
import MyDeposit from "../components/MyDeposit/MyDeposit";
import MyPurchase from "../components/MyPurchase/MyPurchase"
import MyReservation from "../components/MyReservation/MyReservation";
import Parameters from "../components/Parameters/Parameters";

const Account = () => {
  const menuItems = [
    { id: 1, label: "Editer mon profil", icon: faPen, component: <EditProfile /> },
    { id: 2, label: "Mes favoris", icon: faHeart, component: <MyFavorite/> },
    { id: 3, label: "Mes dépôts", icon: faBox, component: <MyDeposit /> },
    { id: 4, label: "Mes achats", icon: faShoppingCart, component: <MyPurchase /> },
    { id: 5, label: "Mes réservations", icon: faCalendarCheck, component: <MyReservation /> },
    { id: 6, label: "Paramètres", icon: faCog, component: <Parameters/> },
    { id: 7, label: "Aide", icon: faQuestionCircle, component: <div>Contenu pour Aide</div> },
  ];

  // Initialiser l'état avec le premier élément actif
  const [activeItem, setActiveItem] = useState(menuItems[0].id);

  // Trouver le composant actif en fonction de l'élément sélectionné
  const activeComponent = menuItems.find((item) => item.id === activeItem)?.component;

  return (
    <div className="h-screen flex pt-20">
      {/* Menu vertical */}
      <div className="w-1/5 bg-yellowGreen1 bg-opacity-20 shadow-md flex flex-col">
        <ul className="mt-10 rounded-xl overflow-hidden">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`text-white text-lg font-semibold cursor-pointer flex items-center space-x-6 px-6 py-5 ${
                activeItem === item.id
                  ? "bg-yellowGreen1 bg-opacity-80"
                  : "bg-yellowGreen1 bg-opacity-60 hover:bg-opacity-40"
              } ${
                item.id === 1
                  ? "rounded-t-xl"
                  : item.id === menuItems.length
                  ? "rounded-b-xl"
                  : ""
              } border-x border-b border-yellowGreen1`}
              onClick={() => setActiveItem(item.id)} // Met à jour l'élément actif
            >
              <FontAwesomeIcon icon={item.icon} className="text-xl" />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        <div className="mt-24 flex justify-center">
            <button className="bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200">
                Se déconncter
            </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-8 overflow-y-auto"> 
        {activeComponent}
      </div>
    </div>
  );
};

export default Account;
