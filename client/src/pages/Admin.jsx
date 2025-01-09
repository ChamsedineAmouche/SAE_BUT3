import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faGraduationCap,
  faCalendarAlt,
  faEye,
  faComments,
  faWarehouse
} from "@fortawesome/free-solid-svg-icons";

import Users from "../components/Users/Users";
import DepositsAdmin from "../components/DepositsAdmin/DepositsAdmin";
import ElearningAdmin from "../components/ElearningAdmin/ElearningAdmin";
import EventsAdmin from "../components/EventsAdmin/EventsAdmin";
import VeillesAdmin from "../components/VeillesAdmin/VeillesAdmin";
import ForumAdmin from "../components/ForumAdmin/ForumAdmin"

const Account = () => {
  const menuItems = [
    { id: 1, label: "Utilisateurs", icon: faPen, component: <Users /> },
    { id: 2, label: "Dépôts", icon: faWarehouse, component: <DepositsAdmin/> },
    { id: 3, label: "E-learning", icon: faGraduationCap, component: <ElearningAdmin /> },
    { id: 4, label: "Evenements", icon: faCalendarAlt, component: <EventsAdmin /> },
    { id: 5, label: "Veilles", icon: faEye, component: <VeillesAdmin /> },
    { id: 6, label: "Forum", icon: faComments, component: <ForumAdmin/> }
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
                Se déconnecter
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
