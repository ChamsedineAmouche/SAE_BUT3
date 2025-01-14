import React, { useEffect, useState } from "react";
import Switch from "../Switch/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import DataTable from '../DataTable/DataTable';
import Swal from "sweetalert2";

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

    const columns = ['siren', 'nom', 'email', 'phone', 'address', 'action'];
    const columnNames = ['SIRET', 'Nom', 'Mail', 'Téléphone', 'Adresse', 'Action'];

    const formattedUsers = allUsers.map((user) => ({
        siren: user.siren,
        nom: user.nom,
        email: user.email,
        phone: user.phone,
        address: user.adress,
        action: (
            <div className="flex space-x-2">
                <button
                    onClick={() => handleDeletionUser(user.siren)}
                    className="text-red-600 bg-red p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-red-400"
                >
                    <FontAwesomeIcon icon={faTrashAlt} />
                </button>
            </div>
        )
    }));

    const formattedInscriptions = allInscriptions.map((inscription) => ({
        siren: inscription.siren,
        nom: inscription.nom,
        email: inscription.email,
        phone: inscription.phone,
        address: inscription.adress,
        action: (
            <div className="flex space-x-2">
                <button
                    onClick={() => handleValidationInscription(inscription.siren)}
                    className="text-green-600 bg-green-500 p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-green-400"
                >
                    <FontAwesomeIcon icon={faCheck} />
                </button>
                <button
                    onClick={() => handleDeletionUser(inscription.siren)}
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

    const handleDeletionUser = async (siren) => {
        const confirmDeletion = await Swal.fire({
            title: 'Êtes-vous sûr de vouloir supprimer cette inscription ?',
            text: "Cette action est irréversible.",
            icon: 'warning',
            showCancelButton: true,
            customClass: {
                confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                cancelButton: 'bg-red text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
            },
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
        });
    
        if (confirmDeletion.isConfirmed) {
            try {
                const response = await fetch('/deleteInscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ siren }),
                });
    
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ! Status : ${response.status}`);
                }
    
                const result = await response.json();
                if (result.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Succès',
                        text: 'Inscription supprimée avec succès !',
                        customClass: {
                            confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                        },
                    });
    
                    setAllInscriptions((prevInscriptions) =>
                        prevInscriptions.filter((inscription) => inscription.siren !== siren)
                    );
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur',
                        text: result.message || 'Une erreur est survenue.',
                        customClass: {
                            confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                        },
                    });
                }
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'inscription :', error);
    
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Erreur interne. Veuillez réessayer.',
                    customClass: {
                        confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                    },
                });
            }
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Annulé',
                text: 'La suppression a été annulée.',
                customClass: {
                    confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                },
            });
        }
    };

    const handleValidationInscription = async (siren) => {
        const confirmValidation = await Swal.fire({
            title: 'Êtes-vous sûr de vouloir valider cette inscription ?',
            text: "L'utilisateur sera ajouté à la liste des utilisateurs.",
            icon: 'warning',
            showCancelButton: true,
            customClass: {
                confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                cancelButton: 'bg-red text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
            },
            confirmButtonText: 'Oui, valider',
            cancelButtonText: 'Annuler',
        });
    
        if (confirmValidation.isConfirmed) {
            try {
                const response = await fetch('/validateInscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ siren }),
                });
    
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ! Status : ${response.status}`);
                }
    
                const result = await response.json();
                if (result.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Succès',
                        text: 'Inscription validée avec succès !',
                        customClass: {
                            confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                        },
                    });
    
                    const validatedInscription = allInscriptions.find(
                        (inscription) => inscription.siren === siren
                    );
    
                    setAllUsers((prevUsers) => [...prevUsers, validatedInscription]);
    
                    setAllInscriptions((prevInscriptions) =>
                        prevInscriptions.filter((inscription) => inscription.siren !== siren)
                    );
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur',
                        text: result.message || 'Une erreur est survenue.',
                        customClass: {
                            confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                        },
                    });
                }
            } catch (error) {
                console.error('Erreur lors de la validation de l\'inscription :', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Erreur interne. Veuillez réessayer.',
                    customClass: {
                        confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                    },
                });
            }
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Annulé',
                text: 'La validation a été annulée.',
                customClass: {
                    confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                },
            });
        }
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