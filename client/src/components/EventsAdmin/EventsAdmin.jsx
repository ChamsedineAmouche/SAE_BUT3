import React, { useEffect, useState } from "react";
import Switch from "../Switch/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from '../DataTable/DataTable';
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const EventsAdmin = () => {
    const [selectedOption, setSelectedOption] = useState("Liste des évènements");
    const [allEvents, setAllEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // remettre true quand back lié
    
    const columns = ['nom', 'date_event', 'price', 'action'];
    const columnNames = ['Nom', 'Date de l\'évènement', 'Prix', 'Action'];

    const formattedAllEvents = [{
        nom: "Réunion avec les acteurs Green Circle",
        date_event: "02/01/2025 15:15:01",
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
        <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Évènements</h2>

        <Switch 
            option1Title={"Liste des évènements"} 
            option2Title={"Créer un évènement"} 
            selectedDefault={"Liste des évènements"} 
            onSwitchChange={handleSwitchChange}
        />

        {selectedOption === "Liste des évènements" && (
            <div id="Liste des évènements" className="overflow-y-auto h-[70vh]">
                {isLoading ? (
                    <p>Chargement en cours...</p>
                ) : (
                    <DataTable columns={columns} columnNames={columnNames} data={formattedAllEvents} rowsPerPage={10} />
                )}
            </div>
        )}

        {selectedOption === "Créer un évènement" && (
            <div id="Créer un évènement" className="overflow-y-auto h-[70vh]">
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

export default EventsAdmin;