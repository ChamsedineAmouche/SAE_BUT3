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

const Account = () => {
  const menuItems = [
    { id: 1, label: "Editer mon profil", icon: faPen },
    { id: 2, label: "Mes favoris", icon: faHeart },
    { id: 3, label: "Mes dépôts", icon: faBox },
    { id: 4, label: "Mes achats", icon: faShoppingCart },
    { id: 5, label: "Mes réservations", icon: faCalendarCheck },
    { id: 6, label: "Paramètres", icon: faCog },
    { id: 7, label: "Aide", icon: faQuestionCircle },
  ];

  // Initialiser l'état avec le premier élément actif
  const [activeItem, setActiveItem] = useState(menuItems[0].id);

  return (
    <div className="h-screen flex">
      {/* Menu vertical */}
      <div className="w-1/5 bg-yellowGreen1 bg-opacity-20 shadow-md pt-20 flex flex-col">
        <ul className="mt-10 rounded-xl overflow-hidden">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`text-white text-xl font-semibold cursor-pointer flex items-center space-x-6 px-6 py-5 ${
                activeItem === item.id
                  ? "bg-darkGreen bg-opacity-80"
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
              <FontAwesomeIcon icon={item.icon} className="text-2xl" />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-center">
            <button className="bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200 w-auto mt-24 w-44">
                Se déconnecter
          </button>
        </div>
        
      </div>
      {/* Contenu principal */}
      <div className="flex-1 p-8">
        {/* Cette partie est vide pour l'instant */}
      </div>
    </div>
  );
};

export default Account;
