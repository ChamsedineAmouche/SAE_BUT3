import React, { useState, useEffect } from 'react';
import DataTable from '../DataTable/DataTable';

const MyReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/profileTransactions')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setReservations(data.transactions);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  const columns = ['title', 'dateTransaction', 'address', 'status'];
  const columnNames = ['Titre', 'Date de récupération', 'Adresse', 'Statut'];

  const formattedReservations = reservations.map((reservation) => ({
    title: reservation.title,
    dateTransaction: new Date(reservation.dateTransaction).toLocaleDateString(),
    address: reservation.address,
    status: reservation.status === 'reserved' ? 'En attente' : reservation.status === 'picked' ? 'Récupéré' : 'Inconnu',
  }));

  return (
    <div>
      <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Mes Réservations</h2>
      {isLoading ? (
        <p>Chargement en cours...</p>
      ) : (
        <DataTable columns={columns} columnNames={columnNames}  data={formattedReservations} rowsPerPage={10} />
      )}
    </div>
  );
};

export default MyReservation;