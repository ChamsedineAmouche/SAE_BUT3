import React, { useEffect, useState } from "react";
import Switch from "../Switch/Switch";
import SquareGrid from "../SquareGrid/SquareGrid";
import DepositThumbnail from "../DepositThumbnail/DepositThumbnail";
import ElearningThumbnail from "../ElearningThumbnail/ElearningThumbnail";

const MyFavorite = () => {
  const [selectedOption, setSelectedOption] = useState("Dépots");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [elearningFavorites, setElearningFavorites] = useState([]);

  const handleSwitchChange = (option) => {
    setSelectedOption(option);
  };

  const toggleFavorite = async (id, isFavorite, type) => {
    const url =
      type === "deposit"
        ? isFavorite
          ? `/deleteListingFavorite?idItem=${id}`
          : `/addListingFavorite?idItem=${id}`
        : isFavorite
        ? `/deleteElearningFavorite?elearningid=${id}`
        : `/addElearningFavorite?elearningid=${id}`;

    try {
      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout ou de la suppression du favori");
      }

      // Mise à jour des favoris localement en fonction du type
      if (type === "deposit") {
        setFavorites((prevFavorites) =>
          isFavorite
            ? prevFavorites.filter((fav) => fav !== id)
            : [...prevFavorites, id]
        );
      } else if (type === "elearning") {
        setElearningFavorites((prevFavorites) =>
          isFavorite
            ? prevFavorites.filter((fav) => fav !== id)
            : [...prevFavorites, id]
        );
      }
    } catch (error) {
      console.error("Erreur lors du changement de favori :", error);
    }
  };

  useEffect(() => {
    fetch("/profileFavorite")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setIsLoading(false);
        // Initialisation des favoris pour les dépôts
        const initialFavorites = data.depots.map((deposit) => deposit.id_item);
        setFavorites(initialFavorites);

        // Initialisation des favoris pour les e-learning
        const initialElearningFavorites = data.elearning.map((elearning) => elearning.id_elearning);
        setElearningFavorites(initialElearningFavorites);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Chargement en cours...</p>;
  }

  if (!data) {
    return <p>Erreur lors du chargement des données.</p>;
  }

  const depositThumbnails = data.depots.map((depots) => (
    <DepositThumbnail
      key={`thumbnail-${depots.id_item}`}
      object={depots}
      isFavorite={favorites.includes(depots.id_item)}
      onToggleFavorite={() =>
        toggleFavorite(depots.id_item, favorites.includes(depots.id_item), "deposit")
      }
    />
  ));

  const elearningThumbnail = data.elearning.map((elearning) => (
    <ElearningThumbnail
      key={`thumbnail-${elearning.id_elearning}`}
      elearning={elearning}
      isFavorite={elearningFavorites.includes(elearning.id_elearning)} // Vérifie si l'élément est favori
      onToggleFavorite={() => toggleFavorite(elearning.id_elearning, elearningFavorites.includes(elearning.id_elearning), "elearning")}
    />
  ));
  

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
          <SquareGrid items={depositThumbnails} />
        </div>
      )}
      {selectedOption === "E-learnings" && (
        <div id="E-learnings" className="overflow-y-auto h-[70vh]">
          <SquareGrid items={elearningThumbnail} />
        </div>
      )}
    </div>
  );
};

export default MyFavorite;
