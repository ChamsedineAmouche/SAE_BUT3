import React, { useState } from 'react';

const DataTable = ({ columns, columnNames, data, rowsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const sortedData = [...data].sort((a, b) => {
    if (sortColumn === null) return 0; // Pas de tri

    const valueA = a[sortColumn];
    const valueB = b[sortColumn];

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-yellowGreen1 text-white">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort(column)} // Gère le clic pour trier
                >
                  <div className="flex items-center">
                    {columnNames[index]}
                    {sortColumn === column && (
                      <span className="ml-2">
                        {sortOrder === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'bg-yellowGreen1 bg-opacity-10' : 'bg-white'}
              >
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