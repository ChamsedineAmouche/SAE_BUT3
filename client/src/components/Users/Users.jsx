import React, { useEffect, useState } from "react";
import Switch from "../Switch/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import DataTable from '../DataTable/DataTable';

const Users = () => {
    const [selectedOption, setSelectedOption] = useState("Liste des utilisateurs");
    const [allUsers, setAllUsers] = useState([]);
    const [allInscriptions, setAllInscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/allUsers')
        .then((response) => {
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setAllUsers(data.users);
            setAllInscriptions(data.inscriptions);
            setIsLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        });
    }, []);

    const columns = ['nom', 'email', 'phone', 'address', 'action'];
    const columnNames = ['Nom', 'Mail', 'Téléphone', 'Adresse', 'Action'];

    const formattedUsers = allUsers.map((user) => ({
        nom: user.nom,
        email: user.email,
        phone: user.phone,
        address: user.adress,
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
    }));

    const formattedInscriptions = allInscriptions.map((inscription) => ({
        nom: inscription.nom,
        email: inscription.email,
        phone: inscription.phone,
        address: inscription.adress,
        action: (
            <div className="flex space-x-2">
                <button
                    //onClick={() => }
                    className="text-green-600 bg-green-500 p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-green-400"
                >
                    <FontAwesomeIcon icon={faCheck} />
                </button>
                <button
                    //onClick={() => }
                    className="text-red-600 bg-red p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-red-400"
                >
                    <FontAwesomeIcon icon={faTrashAlt} />
                </button>
            </div>
        )
    }))

    const handleSwitchChange = (option) => {
        setSelectedOption(option);
      };

    return (
        <div className="bg-white w-full">
        <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Utilisateurs</h2>
        
        <Switch 
            option1Title={"Liste des utilisateurs"} 
            option2Title={"Demandes d'inscriptions"} 
            selectedDefault={"Liste des utilisateurs"} 
            onSwitchChange={handleSwitchChange}
        />

        {selectedOption === "Liste des utilisateurs" && (
            <div id="Liste des utilisateurs" className="overflow-y-auto h-[70vh]">
                {isLoading ? (
                    <p>Chargement en cours...</p>
                ) : (
                    <DataTable columns={columns} columnNames={columnNames} data={formattedUsers} rowsPerPage={10} />
                )}
            </div>
        )}

        {selectedOption === "Demandes d'inscriptions" && (
            <div id="Demandes d'inscriptions" className="overflow-y-auto h-[70vh] py-4">
                {isLoading ? (
                    <p>Chargement en cours...</p>
                ) : (
                    <DataTable columns={columns} columnNames={columnNames} data={formattedInscriptions} rowsPerPage={10} />
                )}
            </div>
        )}
        </div>
    );
}

export default Users;