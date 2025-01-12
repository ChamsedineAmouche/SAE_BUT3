import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const DetailsEventFuture = () => {
  const [eventData, setEventData] = useState(null);
  const [numberOfParticipants, setNumberOfParticipants] = useState(0);
  const [capacityRemaining, setCapacityRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionError, setSessionError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Nouvel état pour vérifier si l'utilisateur est connecté
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
        setNumberOfParticipants(data.numberOfParticipants[0]?.number || 0);
        setCapacityRemaining(data.capacityRemaining);

        // Vérification de la session utilisateur
        const sessionResponse = await fetch("/getSession");
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          const siren = sessionData.session?.siren;

          if (siren) {
            setIsLoggedIn(true); // Utilisateur connecté
            const companyRegistered = data.companyInEvent.includes(siren);
            setIsRegistered(companyRegistered);
          }
        }
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

  const handleInscription = async (whatToDo) => {
    try {
      const sessionResponse = await fetch("/getSession");
      if (!sessionResponse.ok) {
        throw new Error("Erreur lors de la récupération de la session.");
      }
      const sessionData = await sessionResponse.json();
      const siren = sessionData.session?.siren;

      if (!siren) {
        throw new Error("SIREN introuvable dans la session.");
      }

      if (!isRegistered) {
        const inscriptionResponse = whatToDo === "subscribe" 
          ? await fetch(
            `/inscriptionEvent?eventId=${eventId}&siren=${siren}`,
            { method: "GET" }
          )
          : await fetch(
            `/desinscriptionEvent?eventId=${eventId}&siren=${siren}`,
            { method: "GET" }
          );

        if (!inscriptionResponse.ok) {
          throw new Error("Erreur lors de l'inscription à l'événement.");
        }

        const updatedData = await inscriptionResponse.json();
        setCapacityRemaining(updatedData.capacityRemaining);
        setNumberOfParticipants((prev) => prev + 1);
        setIsRegistered(true);

        toast.success("Réussi ! Vous êtes inscrit à un nouvel événement !");
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Déjà inscrit',
          text: 'Vous êtes déjà inscrit à cet événement.',
        });
      }
    } catch (err) {
      setSessionError(err.message);
    }
  };

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
      <div className="text-center mt-12">
        <h1 className="text-4xl font-bold text-darkGreen">{eventData.title}</h1>
      </div>

      <div className="flex justify-center mt-12">
        <img
          src="/event_default.jpg"
          alt={eventData.title}
          className="w-3/4 md:w-1/2 lg:w-1/3 rounded-lg shadow-lg"
        />
      </div>

      <div className="text-center mt-12 max-w-3xl mx-auto">
        <p className="text-lg text-gray-600 leading-relaxed">
          {eventData.description}
        </p>
      </div>

      <div className="text-center mt-6 text-gray-500">
        <p>Date : {new Date(eventData.event_date).toLocaleString()}</p>
        <p>Lieu : {eventData.location}</p>
        <p>Capacité maximale : {eventData.capacity}</p>
      </div>

      <div className="flex justify-center mt-12 mb-8">
        <div
          className="flex items-center justify-center bg-yellowGreen1 text-white rounded-lg w-3/4 md:w-1/2 lg:w-1/3 p-4 shadow-lg"
        >
          <div className="flex items-center justify-center bg-white text-yellowGreen1 font-bold rounded-full w-16 h-16 mr-4">
            <span className="text-sm md:text-base lg:text-lg">{numberOfParticipants}</span>
          </div>
          <div className="text-lg font-semibold">participants</div>
        </div>
      </div>

      {/* Affichage conditionnel du bouton d'inscription */}
      <div className="flex justify-center mb-8">
        {isLoggedIn ? (
          isRegistered ? (
            <button
              className="bg-red text-white text-lg font-semibold rounded-lg px-6 py-3 shadow-lg hover:bg-opacity-80 transition duration-200"
              onClick={handleInscription('unsubscribe')}
            >
              Se désinscrire (places restantes : {capacityRemaining})
            </button>
          ) : capacityRemaining > 0 ? (
            <button
              className="bg-yellowGreen1 text-white text-lg font-semibold rounded-lg px-6 py-3 shadow-lg hover:bg-[#466205] transition duration-200"
              onClick={handleInscription('subscribe')}
            >
              Inscription (places restantes : {capacityRemaining})
            </button>
          ) : (
            <div className="text-red-600 text-lg font-semibold">
              Événement complet !
            </div>
          )
        ) : (
          <div className="text-lg text-gray-600">
            Connectez-vous pour vous inscrire à cet événement.
          </div>
        )}
      </div>

      {sessionError && (
        <div className="text-center mt-6 text-red-500">{sessionError}</div>
      )}

    </div>
  );
};

export default DetailsEventFuture;
