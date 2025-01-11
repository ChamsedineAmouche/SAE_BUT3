import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DetailsEvent = () => {
  const [eventData, setEventData] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { eventId } = useParams();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`/event?id=${eventId}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données de l'événement.");
        }
        const data = await response.json();
        setEventData(data.eventData[0]);
        setParticipantCount(data.numberOfParticipants[0]?.number || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    } else {
      setError("Aucun ID d'événement fourni.");
      setLoading(false);
    }
  }, [eventId]);

  if (loading) {
    return <div className="text-center mt-24">Chargement des détails de l'événement...</div>;
  }

  if (error) {
    return <div className="text-center mt-24 text-red-500">{error}</div>;
  }

  if (!eventData) {
    return <div className="text-center mt-24">Aucune donnée pour cet événement.</div>;
  }

  return (
    <div className="details-event pt-24 px-6 md:px-12 lg:px-24">
      {/* Titre centré */}
      <div className="text-center mt-12">
        <h1 className="text-4xl font-bold text-darkGreen">{eventData.title}</h1>
      </div>

      {/* Image centrée */}
      <div className="flex justify-center mt-12">
        <img
          src="/event_default.jpg"
          alt={eventData.title}
          className="w-3/4 md:w-1/2 lg:w-1/3 rounded-lg shadow-lg"
        />
      </div>

      {/* Pavé de texte centré */}
      <div className="text-center mt-12 max-w-3xl mx-auto">
        <p className="text-lg text-gray-600 leading-relaxed">
          {eventData.description}
        </p>
      </div>

      {/* Informations supplémentaires */}
      <div className="text-center mt-6 text-gray-500">
        <p>Date : {new Date(eventData.event_date).toLocaleString()}</p>
        <p>Lieu : {eventData.location}</p>
        <p>Capacité maximale : {eventData.capacity}</p>
      </div>

      {/* Rectangle vert avec cercle et texte */}
      <div className="flex justify-center mt-12 mb-12">
        <div
          className="flex items-center justify-center bg-[#587208] text-white rounded-lg w-3/4 md:w-1/2 lg:w-1/3 p-4 shadow-lg"
        >
          {/* Cercle avec le nombre */}
          <div className="flex items-center justify-center bg-white text-[#587208] font-bold rounded-full w-16 h-16 mr-4">
            <span className="text-sm md:text-base lg:text-lg">{participantCount}</span>
          </div>
          {/* Texte "participants" */}
          <div className="text-lg font-semibold">participants</div>
        </div>
      </div>
    </div>
  );
};

export default DetailsEvent;
