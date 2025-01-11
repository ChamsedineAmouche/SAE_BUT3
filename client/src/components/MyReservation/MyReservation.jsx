import React, { useState, useEffect } from 'react';
import DataTable from '../DataTable/DataTable';
import Swal from 'sweetalert2';

const MyReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const response = await fetch('/profileTransactions');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setReservations(data.transactions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handlePickUp = (id) => {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de bien avoir récupéré l\'objet et que tout s\'est bien passé ?',
      icon: 'question',
      showCancelButton: true,
      customClass: {
        confirmButton: "px-4 py-2 bg-oliveGreen text-white rounded-md shadow hover:bg-yellowGreen1 mx-2",
        cancelButton: "px-4 py-2 border bg-white border-redd text-red rounded-md shadow hover:bg-rose-100 mx-2",
      },
      confirmButtonText: 'Oui, j\'ai récupéré',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/pickProduct?idItem=${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          Swal.fire('Succès !', 'La récupération a été confirmée.', 'success');

          // Recharger les données après confirmation
          await fetchReservations();
        } catch (error) {
          console.error("Error:", error);
          Swal.fire("Erreur", "Une erreur est survenue lors de la réservation.", "error");
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Annulé", "Votre réservation a été annulée.", "info");
      }
    });
  };

  const columns = ['title', 'dateTransaction', 'address', 'status'];
  const columnNames = ['Titre', 'Date de récupération', 'Adresse', 'Statut'];

  const formattedReservations = reservations.map((reservation) => {
    let statusElement;
    if (reservation.status === 'picked') {
      statusElement = <span className="text-oliveGreen font-semibold">Récupéré</span>;
    } else if (reservation.status === 'waiting') {
      statusElement = <span className="text-orange-500 font-semibold">En attente</span>;
    } else if (reservation.status === 'reserved') {
      statusElement = (
        <button
          className="bg-oliveGreen bg-opacity-80 text-white p-2 font-semibold rounded-md hover:bg-opacity-50 transition duration-200"
          onClick={() => handlePickUp(reservation.idItem)}
        >
          J'ai récupéré l'objet
        </button>
      );
    } else {
      statusElement = <span className="text-gray-500">Inconnu</span>;
    }

    return {
      id: reservation.idItem,
      title: reservation.title,
      dateTransaction: new Date(reservation.dateTransaction).toLocaleDateString(),
      address: reservation.address,
      status: statusElement, // Statut formaté avec Tailwind
    };
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Mes Réservations</h2>
      {isLoading ? (
        <p>Chargement en cours...</p>
      ) : (
        <DataTable columns={columns} columnNames={columnNames} data={formattedReservations} rowsPerPage={10} />
      )}
    </div>
  );
};

export default MyReservation;
