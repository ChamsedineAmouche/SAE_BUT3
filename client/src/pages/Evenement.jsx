import React, { useState, useEffect } from "react";
import circularEconomyImg from "../assets/images/circular_economy.png";
import Carousel from "../components/Carousel/Carousel";
import OtherThumbnail from "../components/OtherThumbnail/OtherThumbnail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Evenement = () => {
  const [searchText, setSearchText] = useState("");
  const [incomingEvents, setIncomingEvents] = useState([]);
  const [passedEvents, setPassedEvents] = useState([]);
  const [filteredIncomingEvents, setFilteredIncomingEvents] = useState([]);
  const [filteredPassedEvents, setFilteredPassedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gérer le changement de texte dans la barre de recherche
  const handleChange = (event) => {
    const text = event.target.value;
    setSearchText(text);
    filterEvents(text); // Filtrer les événements en temps réel
  };

  // Fonction pour filtrer les événements en fonction du texte de recherche
  const filterEvents = (searchText) => {
    const filteredIncoming = incomingEvents.filter((event) =>
      event.title.toLowerCase().includes(searchText.toLowerCase())
    );
    const filteredPassed = passedEvents.filter((event) =>
      event.title.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredIncomingEvents(filteredIncoming);
    setFilteredPassedEvents(filteredPassed);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/catalogEvent");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des événements.");
        }
        const data = await response.json();

        // Utilisation directe des données fournies par l'endpoint
        setIncomingEvents(data.events.Incoming || []);
        setPassedEvents(data.events.Passed || []);
        setFilteredIncomingEvents(data.events.Incoming || []); // Initialiser les événements filtrés
        setFilteredPassedEvents(data.events.Passed || []); // Initialiser les événements filtrés
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center mt-24">Chargement des événements...</div>;
  }

  if (error) {
    return <div className="text-center mt-24 text-red-500">{error}</div>;
  }

  return (
    <div className="evenement">
      {/* Image en haut à droite */}
      <img
        src={circularEconomyImg}
        alt="Circular Economy"
        className="absolute top-1 right-1 w-1/5 h-auto"
      />

      <h1 className="text-4xl font-poppins max-w-[51%] pt-[150px] pl-[60px]">
        Bienvenue sur la page des événements, explorez le catalogue et faites votre choix !
      </h1>

      {/* Barre de recherche */}
      <div className="flex justify-center items-center mt-8">
        <div className="flex items-center bg-white rounded-full shadow-md w-1/2 p-2">
          <input
            type="text"
            value={searchText}
            onChange={handleChange}
            placeholder="Rechercher un événement"
            className="bg-white text-black px-4 py-2 rounded-full focus:outline-none w-full"
          />
          <FontAwesomeIcon icon={faSearch} className="h-6 w-6 text- mr-3" />
        </div>
      </div>

      {/* Carrousel des événements Incoming */}
      <div className="p-8">
      {filteredIncomingEvents.length === 0 ? (
        <div className="text-center mt-8 text-gray-500">
          Aucun événement à venir trouvé pour "{searchText}".
        </div>
      ) : (
        <Carousel
          items={filteredIncomingEvents.map((event) => (
            <OtherThumbnail
              key={event.event_id}
              other={{
                id_event: event.event_id,
                title: event.title,
                status: event.status,
              }}
              type="event"
            />
          ))}
          title={"Les prochains événements à ne pas manquer"}
        />
      )}
      </div>

      {/* Carrousel des événements Passés */}
      <div className="p-8">
      {filteredPassedEvents.length === 0 ? (
        <div className="text-center mt-8 text-gray-500">
          Aucun événement passé trouvé pour "{searchText}".
        </div>
      ) : (
        <Carousel
          items={filteredPassedEvents.map((event) => (
            <OtherThumbnail
              key={event.event_id}
              other={{
                id_event: event.event_id,
                title: event.title,
              }}
              type="event"
            />
          ))}
          title={"Replay des derniers événements"}
        />
      )}
      </div>
    </div>
  );
};

export default Evenement;