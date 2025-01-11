import React, { useEffect, useState } from "react";
import Switch from "../Switch/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from '../DataTable/DataTable';
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const EventsAdmin = () => {
    const [selectedOption, setSelectedOption] = useState("Liste des évènements");
    const [allEvents, setAllEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/allEvents')
        .then((response) => {
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setAllEvents(data.result.events);
            setIsLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        });
    }, []);
    
    const columns = ['nom', 'date_event', 'status', 'action'];
    const columnNames = ['Nom', 'Date de l\'évènement', 'Statut', 'Action'];

    const formattedAllEvents = allEvents.map((event) => {
        const date = new Date(event.event_date);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

        return {
            nom: event.title,
            date_event: formattedDate,
            status: event.status,
            action: (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEventDeletion(event.id_event) }
                                className="text-red-600 bg-red p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-red-400"
                            >
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                        </div>
                    )
        };
    });

    const handleSwitchChange = (option) => {
        setSelectedOption(option);
      };

    const handleEventDeletion = async (eventId) => {
        const confirmDeletion = await Swal.fire({
            title: 'Êtes-vous sûr de vouloir supprimer cet évènement ?',
            text: "Cette action est irréversible.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
        });
    
        if (confirmDeletion.isConfirmed) {
            try {
                const response = await fetch(`/deleteEventAdmin?eventId=${eventId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ! Status : ${response.status}`);
                }
    
                const result = await response.json();
    
                if (result.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Succès',
                        text: 'L\'évènement a été supprimé avec succès !',
                        confirmButtonColor: '#3085d6',
                    });
    
                    setAllEvents((prevEvents) =>
                        prevEvents.filter((event) => event.id_event !== eventId)
                    );
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur',
                        text: result.message || 'Une erreur est survenue.',
                        confirmButtonColor: '#d33',
                    });
                }
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'évènement :', error);
    
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Erreur interne. Veuillez réessayer.',
                    confirmButtonColor: '#d33',
                });
            }
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Annulé',
                text: 'La suppression a été annulée.',
                confirmButtonColor: '#3085d6',
            });
        }
    }

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