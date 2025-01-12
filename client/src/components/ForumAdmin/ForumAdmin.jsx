import React, { useEffect, useState } from "react";
import Switch from "../Switch/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from '../DataTable/DataTable';
import { faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ForumAdmin = () => {
    const [selectedOption, setSelectedOption] = useState("Messages signalés");
    const [reportedMessages, setReportedMessages] = useState([]);
    const [reportedAccounts, setReportedAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // remettre true une fois le back lié
    
    const columnsMessages = ['motif', 'date_posted', 'company', 'reported_by', 'action'];
    const columnNamesMessages = ['Motif', 'Date de mise en ligne', 'Entreprise', 'Signalé par', 'Action'];

    const formattedReportedMessages = [{
        motif: 'Incorrect',
        date_posted: '18/02/2024',
        company: 'CCI 77',
        reported_by: 'Ada Location',
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

    const columnsAccounts = ['motif', 'date_posted', 'company', 'reported_by', 'action'];
    const columnNamesAccounts = ['Motif', 'Date de mise en ligne', 'Entreprise', 'Signalé par', 'Action'];

    const formattedReportedAccounts = [{
        motif: 'Incorrect',
        date_posted: '18/02/2024',
        company: 'Ada Location',
        reported_by: 'CCI 77',
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

    const handleSwitchChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className="bg-white w-full">
        <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Forum</h2>
        
        <Switch 
            option1Title={"Messages signalés"} 
            option2Title={"Comptes signalés"} 
            selectedDefault={"Messages signalés"} 
            onSwitchChange={handleSwitchChange}
        />

        {selectedOption === "Messages signalés" && (
            <div id="Messages signalés" className="overflow-y-auto h-[70vh]">
                {isLoading ? (
                    <p>Chargement en cours...</p>
                ) : (
                    <DataTable columns={columnsMessages} columnNames={columnNamesMessages} data={formattedReportedMessages} rowsPerPage={10} />
                )}
            </div>
        )}

        {selectedOption === "Comptes signalés" && (
            <div id="Messages signalés" className="overflow-y-auto h-[70vh]">
                {isLoading ? (
                    <p>Chargement en cours...</p>
                ) : (
                    <DataTable columns={columnsAccounts} columnNames={columnNamesAccounts} data={formattedReportedAccounts} rowsPerPage={10} />
                )}
            </div>
        )}
        </div>
    );
}

export default ForumAdmin;
