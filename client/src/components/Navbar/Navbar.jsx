import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch, faSquarePlus, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate()
  const [userSession, setUserSession] = useState(null); // State to manage user session info

  const handleLogout = async () => {
    try {
        const response = await fetch("/destroy-session", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
        });

        const result = await response.json();
        if (response.ok) {
            setUserSession(result);
            console.log("Session:", result);
        } else {
            console.error("Failed to get session:", result);
        }
    } catch (error) {
        console.error("Error fetching session:", error);
    }
};

  return (
    <nav className="bg-oliveGreen text-white fixed top-0 left-0 w-full z-20 shadow-xl">
      <div className="flex items-center justify-between py-4 px-4 ">
        {/* Left Section - Logo */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <a href="/">
            <img src="" alt="Logo" className="h-10 w-10" />
          </a>

          <h1 className="text-xl font-bold">Green Circle</h1>
        </div>

        {/* Center Section - Menu Links */}
        <div className="hidden md:flex flex-1 justify-center space-x-6">
          <a href="/depot" className="hover:text-darkGreen text-xl">
            Dépôt
          </a>
          <a href="/elearning" className="hover:text-darkGreen text-xl">
            E-learning
          </a>
          <a href="/veille" className="hover:text-darkGreen text-xl">
            Veille
          </a>
          <a href="/evenement" className="hover:text-darkGreen text-xl">
            Événement
          </a>
          <a href="/" className="hover:text-darkGreen text-xl">
            Forum
          </a>
        </div>

        {/* Search bar */}
        <div className="hidden md:flex items-center relative w-72 mr-12">
            <button className="bg-darkGreen text-white px-4 py-2 rounded-l-full">
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
            <input
              type="text"
              placeholder="Rechercher"
              className="bg-white text-black px-4 py-2 rounded-md focus:outline-none w-full rounded-r-full"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

        {/* Right Section - Search bar and Icons */}
        <div className="flex items-center flex-shrink-0 space-x-4">
          {/* Add button */}
          <button className="relative" onClick={() => navigate('/nouveau_depot')}>
            <FontAwesomeIcon icon={faSquarePlus} className="text-2xl hover:text-darkGreen" />
          </button>

          {/* Notification */}
          <button className="relative">
            <FontAwesomeIcon icon={faBell} className="text-2xl hover:text-darkGreen" />
          </button>

          {/* User profile picture */}
          <div className="h-10 w-10 rounded-full overflow-hidden border border-white ml-12">
            <a href="/">
                <img
                src="/default_user.png"
                alt="Profil"
                className="h-full w-full object-cover"
                />
            </a>
          </div>
        </div>

        {/* "Logout" button destroy session */}
        <button onClick={handleLogout} className="ml-4 text-white hover:text-darkGreen">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
