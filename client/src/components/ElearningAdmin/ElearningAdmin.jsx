import React, { useEffect, useState } from "react";
import Switch from "../Switch/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from '../DataTable/DataTable';
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ElearningAdmin = () => {
    const [selectedOption, setSelectedOption] = useState("Liste des e-learnings");
    const [allElearnings, setAllElearnings] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // remettre true quand back lié
    
    const columns = ['nom', 'date_posted', 'price', 'action'];
    const columnNames = ['Nom', 'Date de mise en ligne', 'Prix', 'Action'];

    const formattedAllELearnings = [{
        nom: "La Face Cachée de l'économie Circulaire",
        date_posted: "18/02/2024",
        price: "35€",
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
        <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Utilisateurs</h2>

        <Switch 
            option1Title={"Liste des e-learnings"} 
            option2Title={"Créer un e-learning"} 
            selectedDefault={"Liste des e-learnings"} 
            onSwitchChange={handleSwitchChange}
        />

        {selectedOption === "Liste des e-learnings" && (
            <div id="Liste des e-learnings" className="overflow-y-auto h-[70vh]">
                {isLoading ? (
                    <p>Chargement en cours...</p>
                ) : (
                    <DataTable columns={columns} columnNames={columnNames} data={formattedAllELearnings} rowsPerPage={10} />
                )}
            </div>
        )}

        {selectedOption === "Créer un e-learning" && (
            <div id="Créer un e-learning" className="overflow-y-auto h-[70vh]">
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

export default ElearningAdmin;