import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch, faSquarePlus, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'

const Navbar = () => {
  const navigate = useNavigate();
  const [userSession, setUserSession] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

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
          if (sessionData.role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
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
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la session :", error);
        setUserSession(null);
        setIsAdmin(false);
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
        Cookies.remove('jwt',{path:'/'})
        navigate("/connexion"); 
      } else {
        console.error("Échec de la déconnexion");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  const toggleAccountMenu = () => {
    setShowAccountMenu((prev) => !prev);
  };

  return (
    <nav className="bg-oliveGreen text-white fixed top-0 left-0 w-full z-20 shadow-xl">
      <div className="flex items-center justify-between py-3 px-4 ">
        {/* Left Section - Logo */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <a href="/">
            <img src="/logo_gc.png" alt="Logo" className="h-14" />
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

          <div className="relative">
            <div 
              className="h-10 w-10 rounded-full overflow-hidden border border-white cursor-pointer"
              onClick={toggleAccountMenu}
            >
              <img src="/default_user.png" alt="Profil" className="h-full w-full object-cover" />
            </div>

            {showAccountMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
              
              {isAdmin ? (
              <button 
                className="block w-full text-left px-4 py-2 hover:bg-gray-200 hover:rounded-t-lg"
                onClick={() => navigate("/admin")}
              >
                Tableau de bord
              </button>
              ) : (
              <button 
                className="block w-full text-left px-4 py-2 hover:bg-gray-200 hover:rounded-t-lg"
                onClick={() => navigate("/mon_compte")}
              >
                Voir le profil
              </button>
              )}

              <button 
                className="block w-full text-left px-4 py-2 hover:bg-gray-200 hover:rounded-b-lg"
                onClick={handleLogout}
              >
                Se déconnecter
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
