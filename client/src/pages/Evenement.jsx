import React, { useState, useEffect } from "react";
import circularEconomyImg from "../assets/images/circular_economy.png";
import Carousel from "../components/Carousel/Carousel";
import OtherThumbnail from "../components/OtherThumbnail/OtherThumbnail";

const Evenement = () => {
  const [searchText, setSearchText] = useState("");
  const [incomingEvents, setIncomingEvents] = useState([]);
  const [passedEvents, setPassedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setSearchText(event.target.value);
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M8 11a4 4 0 118 0 4 4 0 01-8 0z" />
          </svg>
        </div>
      </div>

      {/* Carrousel des événements Incoming */}
      <div className="p-8">
        <Carousel
          items={incomingEvents
            .filter((event) =>
              event.title.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((event) => (
              <OtherThumbnail
                key={event.event_id}
                other={{
                  id_event: event.event_id,
                  title: event.title,
                  status: event.status
                }}
                type="event"
              />
            ))}
          title={"Les prochains événements à ne pas manquer"}
        />
      </div>

      {/* Carrousel des événements Passés */}
      <div className="p-8">
        <Carousel
          items={passedEvents
            .filter((event) =>
              event.title.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((event) => (
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
      </div>
    </div>
  );
};

export default Evenement;
