import React, { useState } from 'react';

const DataTable = ({ columns, data, rowsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Logique pour gérer la pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-yellowGreen1 text-white">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-4 py-2 text-left">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-yellowGreen1 bg-opacity-10' : 'bg-white'}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-4 py-2">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <nav aria-label="Page navigation">
          <ul className="flex list-style-none">
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
                Précédent
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

export default DataTable;