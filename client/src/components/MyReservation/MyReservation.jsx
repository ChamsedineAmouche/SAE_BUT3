import React, { useState, useEffect } from 'react';

const MyReservation = () => {
  // Données de réservation simulées (à remplacer par une API)
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState("")
  const reservationsPerPage = 10;

  useEffect(() => {
    // Simuler la récupération de données (à remplacer par un appel API réel)
    fetch('/profileTransactions')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data)
      setReservations(data.transactions);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    })
  }, []);

  // Logique pour gérer la pagination
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(indexOfFirstReservation, indexOfLastReservation);

  const totalPages = Math.ceil(reservations.length / reservationsPerPage);
  console.log(totalPages)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Mes Reservations</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-yellowGreen1 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Nom objet</th>
              <th className="px-4 py-2 text-left">Date de récupération</th>
              <th className="px-4 py-2 text-left">Adresse de récupération</th>
              <th className="px-4 py-2 text-left">Statut</th>
            </tr>
          </thead>
          <tbody>
            {currentReservations.map((reservation, index) => {
              const date = new Date(reservation.dateTransaction);
              const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                let statusText;
                switch (reservation.status) {
                case 'reserved':
                  statusText = 'En attente';
                  break;
                case 'picked':
                  statusText = 'Récupéré';
                  break;
                default:
                  statusText = 'Inconnu';
                }

                return (
                <tr key={reservation.id} className={index % 2 === 0 ? 'bg-yellowGreen1 bg-opacity-10' : 'bg-white'}>
                  <td className="px-4 py-2">{reservation.title}</td>
                  <td className="px-4 py-2">{formattedDate}</td>
                  <td className="px-4 py-2">{reservation.address}</td>
                  <td className="px-4 py-2">{statusText}</td>
                </tr>
                );
            })}
          </tbody>
        </table>
      </div>

       {/* Pagination */}
       <div className="flex justify-center mt-4">
        <nav aria-label="Page navigation">
          <ul className="flex list-style-none ">
            {/* Previous Page */}
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className={`px-4 py-2 border overflow-hidden text-darkGreen border-gray-300 rounded-l-lg ${
                  currentPage === 1 
                    ? 'bg-yellowGreen1 bg-opacity-20 text-darkGreen'
                    : 'hover:bg-yellowGreen1 hover:text-white'
                }`}
                disabled={currentPage === 1}
              >
                Précedent
              </button>
            </li>
            
            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1}>
                <button
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 border-y border-r text-darkGreen border-gray-300 ${
                    i + 1 === currentPage
                      ? 'bg-yellowGreen1 text-white'
                      : 'hover:bg-yellowGreen1 hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            
            {/* Next Page */}
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className={`px-4 py-2 border-y border-r text-darkGreen border-gray-300 rounded-r-lg ${
                  currentPage === totalPages
                    ? 'bg-yellowGreen1 bg-opacity-20 text-darkGreen'
                    : 'hover:bg-yellowGreen1 hover:text-white'
                }`}
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MyReservation;
