import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Navbar() {
  const navigate = useNavigate();
  const [userSession, setUserSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // ----- Dépôt -----
  const [depositSearchText, setDepositSearchText] = useState("");
  const [depositCategory, setDepositCategory] = useState("");
  const [depositState, setDepositState] = useState("");
  const [depositLocation, setDepositLocation] = useState("");
  const [depositSort, setDepositSort] = useState("");
  const [depositCategories, setDepositCategories] = useState([]);
  const [depositStatesList, setDepositStatesList] = useState([]);
  const [depositLocationsList, setDepositLocationsList] = useState([]);

  // ----- E-learning -----
  const [elearningSearchText, setElearningSearchText] = useState("");
  const [elearningCategory, setElearningCategory] = useState("");
  const [elearningSort, setElearningSort] = useState("");
  const [elearningCategories, setElearningCategories] = useState([]);

  useEffect(() => {
    checkSession();
    fetchDepositData();
    fetchElearningData();
  }, []);

  async function checkSession() {
    try {
      const response = await fetch("/getSession", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const sessionData = await response.json();
        if (sessionData.role === "admin") setIsAdmin(true);
        if (sessionData.session?.siren || sessionData.session?.id) {
          setUserSession(sessionData.session.siren || sessionData.session.id);
        }
      } else {
        setUserSession(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Erreur session:", error);
      setUserSession(null);
      setIsAdmin(false);
    }
  }

  async function fetchDepositData() {
    try {
      const response = await fetch("/catalog");
      const data = await response.json();
      const cat = data.objectTypes.map((type) => ({
        label: type.label,
        id_object_type: type.id_object_type,
      }));
      setDepositCategories(cat);

      const uniqueLocations = [...new Set(data.objects.map((obj) => obj.location))];
      setDepositLocationsList(uniqueLocations);

      const uniqueStates = [...new Set(data.objects.map((obj) => obj.state))];
      setDepositStatesList(uniqueStates);
    } catch (error) {
      console.error("Erreur lors du fetch /catalog:", error);
    }
  }

  async function fetchElearningData() {
    try {
      const response = await fetch("/elearningList");
      const data = await response.json();
      const catList = data.categories.map((c) => ({
        label: c.Libelle,
        id_category: c.id,
      }));
      setElearningCategories(catList);
    } catch (err) {
      console.error("Erreur lors du fetch /elearningList:", err);
    }
  }

  // ----- Recherche Dépôt -----
  function handleSearchDepot() {
    const params = new URLSearchParams({
      searchText: depositSearchText,
      category: depositCategory,
      state: depositState,
      location: depositLocation,
      sort: depositSort,
    });
    navigate(`/depot?${params.toString()}`);
    setIsSearchOpen(false);
  }

  // ----- Recherche E-learning -----
  function handleSearchElearning() {
    const params = new URLSearchParams({
      searchText: elearningSearchText,
      category: elearningCategory,
      sort: elearningSort,
    });
    // ex. /elearning?searchText=...&category=...&sort=...
    navigate(`/elearning?${params.toString()}`);
    setIsSearchOpen(false);
  }

  async function handleLogout() {
    try {
      const response = await fetch("/destroySession", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        setUserSession(null);
        setIsAdmin(false);
        Cookies.remove("jwt", { path: "/" });
        navigate("/connexion");
      } else {
        console.error("Échec de la déconnexion");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  }

  return (
    <nav className="bg-oliveGreen text-white fixed top-0 left-0 w-full z-20 shadow-xl">
      <div className="flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <a href="/">
            <img src="/logo_gc.png" alt="Logo" className="h-14" />
          </a>
          <h1 className="text-xl font-bold">
            <a href="/">Green Circle</a>
          </h1>
        </div>

        {/* Menu central */}
        <div className="hidden md:flex flex-1 justify-center space-x-6">
<<<<<<< HEAD
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
          <a href="/forum" className="hover:text-darkGreen text-xl">
            Forum
          </a>
=======
          <a href="/depot" className="hover:text-darkGreen text-xl">Dépôt</a>
          <a href="/elearning" className="hover:text-darkGreen text-xl">E-learning</a>
          <a href="/veille" className="hover:text-darkGreen text-xl">Veille</a>
          <a href="/evenement" className="hover:text-darkGreen text-xl">Événement</a>
          <a href="/" className="hover:text-darkGreen text-xl">Forum</a>
>>>>>>> bcd777a (recherche avancée sur tout le site pour les elearning et les dépots)
        </div>

        {/* Actions droites */}
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate("/nouveau_depot")} className="relative">
            <FontAwesomeIcon icon={faSquarePlus} className="text-2xl hover:text-darkGreen" />
          </button>
          <button className="relative">
            <FontAwesomeIcon icon={faBell} className="text-2xl hover:text-darkGreen" />
          </button>
          <button onClick={() => setIsSearchOpen(true)} className="relative">
            <FontAwesomeIcon icon={faSearch} className="text-2xl hover:text-darkGreen" />
          </button>

          <div className="relative">
            <div
              className="h-10 w-10 rounded-full overflow-hidden border border-white cursor-pointer"
              onClick={() => setShowAccountMenu(!showAccountMenu)}
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

      {/* Overlay de recherche (accordéon) */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-oliveGreen bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-3xl rounded-lg p-6 relative max-h-[80vh] overflow-auto">
            <h2 className="text-2xl mb-4 text-darkGreen">Rechercher</h2>

            <details className="bg-oliveGreen/80 p-3 mb-3 rounded open:shadow-md">
              <summary className="cursor-pointer font-medium text-lg">Dépôt</summary>
              <div className="mt-2 flex flex-col space-y-2">
                <input
                  type="text"
                  placeholder="Mot-clé..."
                  value={depositSearchText}
                  onChange={(e) => setDepositSearchText(e.target.value)}
                  className="border rounded p-1 text-darkGreen"
                />

                <label className="font-semibold">Catégorie</label>
                <select
                  className="mt-2 text-darkGreen block w-full px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none"
                  value={depositCategory}
                  onChange={(e) => setDepositCategory(e.target.value)}
                >
                  <option value="">Toutes les catégories</option>
                  {depositCategories.map((c) => (
                    <option key={c.id_object_type} value={c.label}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <label className="font-semibold">État</label>
                <select
                  className="mt-2 text-darkGreen block w-full px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none"
                  value={depositState}
                  onChange={(e) => setDepositState(e.target.value)}
                >
                  <option value="">Tous les états</option>
                  {depositStatesList.map((st, i) => (
                    <option key={i} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                <label className="font-semibold">Localisation</label>
                <select
                  className="mt-2 text-darkGreen block w-full px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none"
                  value={depositLocation}
                  onChange={(e) => setDepositLocation(e.target.value)}
                >
                  <option value="">Toutes les localisations</option>
                  {depositLocationsList.map((loc, i) => (
                    <option key={i} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>

                <label className="font-semibold">Tri</label>
                <select
                  className="mt-2 text-darkGreen block w-full px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none"
                  value={depositSort}
                  onChange={(e) => setDepositSort(e.target.value)}
                >
                  <option value="pertinence">Pertinence</option>
                  <option value="">Trier par</option>
                  <option value="title_asc">Nom (A-Z)</option>
                  <option value="title_desc">Nom (Z-A)</option>
                  <option value="date_asc">Date (plus ancien→récent)</option>
                  <option value="date_desc">Date (plus récent→ancien)</option>
                </select>

                <button
                  onClick={handleSearchDepot}
                  className="bg-oliveGreen text-white text-lg justify-center w-full px-3 py-1 rounded-lg self-start"
                >
                  Rechercher (Dépôt)
                </button>
              </div>
            </details>

            <details className="bg-oliveGreen/80 p-3 mb-3 rounded open:shadow-md">
              <summary className="cursor-pointer font-medium text-lg">E-learning</summary>
              <div className="mt-2 flex flex-col space-y-2">
                <input
                  type="text"
                  placeholder="Mot-clé..."
                  value={elearningSearchText}
                  onChange={(e) => setElearningSearchText(e.target.value)}
                  className="border rounded p-1 text-darkGreen"
                />

                <label className="font-semibold">Catégorie</label>
                <select
                  className="mt-2 text-darkGreen block w-full px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none"
                  value={elearningCategory}
                  onChange={(e) => setElearningCategory(e.target.value)}
                >
                  <option value="">Toutes</option>
                  {elearningCategories.map((cat) => (
                    <option key={cat.id_category} value={cat.label}>
                      {cat.label}
                    </option>
                  ))}
                </select>

                <label className="font-semibold">Tri</label>
                <select
                  className="mt-2 text-darkGreen block w-full px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none"
                  value={elearningSort}
                  onChange={(e) => setElearningSort(e.target.value)}
                >
                  <option value="">Trier par</option>
                  <option value="title_asc">Nom (A-Z)</option>
                  <option value="title_desc">Nom (Z-A)</option>
                  <option value="price_asc">Prix (croissant)</option>
                  <option value="price_desc">Prix (décroissant)</option>
                </select>

                <button
                  onClick={handleSearchElearning}
                  className="bg-oliveGreen text-white text-lg justify-center w-full px-3 py-1 rounded-lg self-start"
                >
                  Rechercher (E-learning)
                </button>
              </div>
            </details>


            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="bg-white border-darkGreen border-2 text-darkGreen px-4 py-2 rounded-full hover:bg-darkGreen hover:text-white"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
