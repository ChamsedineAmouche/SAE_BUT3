import { faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Swal from "sweetalert2";

const ReservationSwal = ({ id }) => {
  const handleReservation = () => {
    Swal.fire({
      title: "Confirmer la réservation",
      text: "Êtes-vous sûr de vouloir réserver cet objet ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, réserver",
      cancelButtonText: "Annuler",
      customClass: {
        confirmButton: "px-4 py-2 bg-oliveGreen text-white rounded-md shadow hover:bg-yellowGreen1 mx-2",
        cancelButton: "px-4 py-2 border bg-white border-redd text-red rounded-md shadow hover:bg-rose-100 mx-2",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/reserveProduct?idItem=${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          Swal.fire("Réservé !", "Votre réservation a bien été prise en compte.", "success");
        } catch (error) {
          console.error("Error:", error);
          Swal.fire("Erreur", "Une erreur est survenue lors de la réservation.", "error");
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Annulé", "Votre réservation a été annulée.", "info");
      }
    });
  };

  return (
      <button 
        onClick={handleReservation}
        className="bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200 h-14"
      >
        <FontAwesomeIcon icon={faTicket} className="mr-2 text-xl"/>
        Réserver
      </button>
  );
};

export default ReservationSwal;