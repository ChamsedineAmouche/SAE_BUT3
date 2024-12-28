import React, { useState, useEffect } from 'react';

const MyReservation = () => {
  // Données de réservation simulées (à remplacer par une API)
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 10;

  useEffect(() => {
    // Simuler la récupération de données (à remplacer par un appel API réel)
    const fetchReservations = () => {
      const data = Array.from({ length: 60 }, (_, i) => ({
        id: i + 1,
        object: `Objet ${i + 1}`,
        date: '18/02/2024',
        address: `Siège entreprise exemple, 52 rue Albert Camus, 7770, Serris`
      }));
      setReservations(data);
    };
    fetchReservations();
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
      <h3 className="text-center text-2xl font-semibold mb-4">Mes réservations</h3>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-yellowGreen1 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Nom objet</th>
              <th className="px-4 py-2 text-left">Date de récupération</th>
              <th className="px-4 py-2 text-left">Adresse de récupération</th>
            </tr>
          </thead>
          <tbody>
            {currentReservations.map((reservation, index) => (
              <tr key={reservation.id} className={index % 2 === 0 ? 'bg-yellowGreen1 bg-opacity-10' : 'bg-white'}>
                <td className="px-4 py-2">{reservation.object}</td>
                <td className="px-4 py-2">{reservation.date}</td>
                <td className="px-4 py-2">{reservation.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* Pagination */}
       <div className="flex justify-center mt-4">
        <nav aria-label="Page navigation">
          <ul className="flex list-style-none rounded-lg oberflow-hidden">
            {/* Previous Page */}
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className={`px-4 py-2 border border-gray-300 ${
                  currentPage === 1 
                    ? 'bg-gray-300 text-gray-500'
                    : 'hover:bg-yellowGreen1 hover:text-white'
                }`}
                disabled={currentPage === 1}
              >
                «
              </button>
            </li>
            
            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1}>
                <button
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 border border-gray-300 ${
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
                className={`px-4 py-2 border border-gray-300 ${
                  currentPage === totalPages
                    ? 'bg-gray-300 text-gray-500'
                    : 'hover:bg-yellowGreen1 hover:text-white'
                }`}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MyReservation;
