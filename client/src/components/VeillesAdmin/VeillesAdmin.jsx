import React, { useEffect, useState } from "react";
import Switch from "../Switch/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from '../DataTable/DataTable';
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const VeillesAdmin = () => {
    const [selectedOption, setSelectedOption] = useState("Liste des veilles");
    const [allVeilles, setAllVeille] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // remettre true quand back lié
    
    const columns = ['nom', 'date_article', 'auteur', 'action'];
    const columnNames = ['Nom', 'Date de l\'évènement', 'Auteur', 'Action'];

    const formattedAllVeilles = [{
        nom: " L'Économie Circulaire : Une Révolution Durable",
        date_article: "2024-12-10 00:00:00",
        auteur: "Claire Martin",
        action: (
                    <div className="flex space-x-2">
                        <button
                            //onClick={() => }
                            className="text-blue-600 bg-blue p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-blue-400"
                        >
                            <FontAwesomeIcon icon={faEdit} />
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
        <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Veilles</h2>

        <Switch 
            option1Title={"Liste des veilles"} 
            option2Title={"Créer une veille"} 
            selectedDefault={"Liste des veilles"} 
            onSwitchChange={handleSwitchChange}
        />

        {selectedOption === "Liste des veilles" && (
            <div id="Liste des veilles" className="overflow-y-auto h-[70vh]">
                {isLoading ? (
                    <p>Chargement en cours...</p>
                ) : (
                    <DataTable columns={columns} columnNames={columnNames} data={formattedAllVeilles} rowsPerPage={10} />
                )}
            </div>
        )}

        {selectedOption === "Créer une veille" && (
            <div id="Créer une veille" className="overflow-y-auto h-[70vh]">
                {isLoading ? (
                    <p>Chargement en cours...</p>
                ) : (
                    <p>Créer</p> // Mettre ici le formulaire
                )}
            </div>
        )}
        </div>
    );
}

export default VeillesAdmin;