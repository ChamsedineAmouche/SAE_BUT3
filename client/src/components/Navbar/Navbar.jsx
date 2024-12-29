import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch, faSquarePlus, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [userSession, setUserSession] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/getSession", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          const sessionData = await response.json();
          if (sessionData.session){
            if (sessionData.session.siren){
              setUserSession(sessionData.session.siren); 
            }
            if (sessionData.session.id){
              setUserSession(sessionData.session.id);
            }
          }
        } else {
          setUserSession(null);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la session :", error);
        setUserSession(null);
      }
    };
  
    checkSession();
  }, []);
  

  const handleLogout = async () => {
    try {
      const response = await fetch("/destroySession", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        setUserSession(null);
        setIsAdmin(false);
        navigate("/login"); 
      } else {
        console.error("Échec de la déconnexion");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
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

          <h1 className="text-xl font-bold">
          <a href="/">Green Circle </a></h1>

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

        {/* Right Section - Icons and Logout */}
        <div className="flex items-center flex-shrink-0 space-x-4">
          <button
            className="relative"
            onClick={() => navigate("/nouveau_depot")}
          >
            <FontAwesomeIcon icon={faSquarePlus} className="text-2xl hover:text-darkGreen" />
          </button>
          <button className="relative">
            <FontAwesomeIcon icon={faBell} className="text-2xl hover:text-darkGreen" />
          </button>


          <div className="h-10 w-10 rounded-full overflow-hidden border border-white ml-12">
            <a href="/">
              <img src="/default_user.png" alt="Profil" className="h-full w-full object-cover" />
            </a>

          </div>

          {/* "Logout" or "Se connecter" button */}
          {userSession ? (
            <button onClick={handleLogout} className="ml-4 text-white hover:text-darkGreen">
              Logout
            </button>
          ) : (
            <button onClick={() => navigate("/login")} className="ml-4 text-white hover:text-darkGreen">
              Se connecter
            </button>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
