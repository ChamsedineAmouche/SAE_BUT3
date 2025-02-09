// utils/localisation.js

/**
 * --------------------------------------------------------------------------------
 * 1) Obtenir la position de l'utilisateur (latitude, longitude) via Geolocation
 * --------------------------------------------------------------------------------
 * Retourne une Promise qui résout un objet { lat, lng } ou rejette une erreur.
 */
export function getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("La géolocalisation n'est pas supportée par ce navigateur."));
      }
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true }
      );
    });
  }
  
  /**
   * --------------------------------------------------------------------------------
   * 2) Géocoder une adresse (récupérer lat/lng)
   * --------------------------------------------------------------------------------
   * Exemple avec OpenCage Data : https://opencagedata.com/
   * Il vous faut une clé API : remplacez "YOUR_OPENCAGE_API_KEY" ci-dessous.
   * 
   * L'adresse complète est la concaténation de:
   *  - address (ex: "1 BD RUE IRENE JOLIOT CURIE")
   *  - city (ex: "Bailly-Romainvilliers")
   *  - zipcode (ex: "77700")
   * 
   * Si l'API retourne un résultat, on renvoie { lat, lng }, sinon { lat: null, lng: null }.
   */
  export async function geocodeAddress(address, city, zipcode) {
    const fullAddress = `${address}, ${zipcode} ${city}`.trim();
  
    // Remplacez la clé ci-dessous par la vôtre
    const apiKey = "YOUR_OPENCAGE_API_KEY";  
    const baseUrl = "https://api.opencagedata.com/geocode/v1/json";
  
    const url = `${baseUrl}?q=${encodeURIComponent(fullAddress)}&key=${apiKey}&language=fr&limit=1`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erreur HTTP! status: ${response.status}`);
      }
      const data = await response.json();
  
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { lat, lng };
      } else {
        return { lat: null, lng: null };
      }
    } catch (err) {
      console.error("Erreur lors du géocodage :", err);
      return { lat: null, lng: null };
    }
  }
  
  /**
   * --------------------------------------------------------------------------------
   * 3) Calculer la distance entre deux points (formule de Haversine)
   * --------------------------------------------------------------------------------
   * @param {number} lat1
   * @param {number} lng1
   * @param {number} lat2
   * @param {number} lng2
   * @returns {number} distance en kilomètres
   */
  export function getDistanceInKm(lat1, lng1, lat2, lng2) {
    const R = 6371; // rayon moyen de la Terre en km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  /**
   * Petite fonction d'aide pour convertir en radians
   */
  function toRad(value) {
    return (value * Math.PI) / 180;
  }
  
  /**
   * --------------------------------------------------------------------------------
   * 4) Filtrer une liste d'objets dans un certain rayon
   * --------------------------------------------------------------------------------
   * On suppose que chaque objet a déjà { lat, lng } dans ses propriétés.
   * - userLat, userLng : latitude/longitude utilisateur
   * - objects : tableau d'objets
   * - radiusInKm : rayon (ex: 10 pour 10 km)
   *
   * Retourne un tableau d'objets (ceux qui sont dans le rayon).
   */
  export function filterObjectsWithinRadius(userLat, userLng, objects, radiusInKm) {
    if (!Array.isArray(objects)) {
      return [];
    }
  
    return objects.filter((obj) => {
      // Si l'objet n'a pas de coordonnées, on l'exclut
      if (typeof obj.lat !== "number" || typeof obj.lng !== "number") {
        return false;
      }
  
      const distance = getDistanceInKm(userLat, userLng, obj.lat, obj.lng);
      return distance <= radiusInKm;
    });
  }
  