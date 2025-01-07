import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Correction de l'icône du marqueur
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Map = ({ adress, zipcode, city }) => {
  useEffect(() => {
    // Créer la carte
    const map = L.map("map").setView([48.8566, 2.3522], 13); // Coordonnées par défaut (Paris)

    // Ajouter une couche de tuiles OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Convertir l'adresse en coordonnées géographiques (géocodage)
    const fullAddress = `${adress}, ${zipcode} ${city}`;
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        fullAddress
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          console.log("Coordonnées trouvées :", lat, lon); // Vérifiez ici

          // Centrer la carte sur les coordonnées trouvées
          map.setView([lat, lon], 15);

          // Ajouter un marqueur à l'emplacement
          L.marker([lat, lon], { icon: defaultIcon })
            .addTo(map)
            .bindPopup(fullAddress)
            .openPopup();
        } else {
          console.error("Aucune coordonnée trouvée pour l'adresse :", fullAddress);
        }
      })
      .catch((error) => {
        console.error("Erreur lors du géocodage :", error);
      });

    // Nettoyer la carte lors du démontage du composant
    return () => {
      map.remove();
    };
  }, [adress, zipcode, city]);

  return <div id="map" style={{ height: "100%", width: "100%" }}></div>;
};

export default Map;