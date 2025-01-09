import React, { useEffect, useState } from "react";
import DataTable from '../DataTable/DataTable';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const DepositsAdmin = () => {
    const [deposits, setDeposits] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Remplacer par true quand lié au back
    
    const columns = ['title', 'date_posted', 'company', 'action'];
    const columnNames = ['Nom objet', 'Date de mise en ligne', 'Entreprise', 'Action'];

    const formattedDepositsAdmin = [{
        title: 'Bureau',
        date_posted: '11/12/2024',
        company: 'CCI 77',
        action: (
                    <div className="flex space-x-2">
                        <button
                            //onClick={() => }
                            className="text-blue-600 bg-blue p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-blue-400"
                        >
                            <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                            //onClick={() => }
                            className="text-red-600 bg-red p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-red-400"
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                )
    }];

    return (
        <div className="bg-white w-full">
            <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Dépôts</h2>
            <p className="text font-bold text-darkGreen mb-8 text-center">gestion des annonces considérées suspectes</p>

            <div id="Dépôts" className="overflow-y-auto h-[70vh]">
                {isLoading ? (
                    <p>Chargement en cours...</p>
                ) : (
                    <DataTable columns={columns} columnNames={columnNames} data={formattedDepositsAdmin} rowsPerPage={10} />
                )}
            </div>
        </div>
    );
}

export default DepositsAdmin;