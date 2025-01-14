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
    // Form
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [capacity, setCapacity] = useState('');
    const [errors, setErrors] = useState({});

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
            customClass: {
                confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                cancelButton: 'bg-red text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
            },
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
                        customClass: {
                            confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                        },
                    });
    
                    setAllEvents((prevEvents) =>
                        prevEvents.filter((event) => event.id_event !== eventId)
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
                console.error('Erreur lors de la suppression de l\'évènement :', error);
    
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
    }

    const isFormValid = () => {
        return (
            title.trim() !== '' &&
            description.trim() !== '' &&
            location.trim() !== '' &&
            date.trim() !== '' &&
            capacity.trim() !== ''
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newSubmission = {
            title,
            description,
            event_date: date,
            location,
            capacity
        };

        try {
            const response = await fetch('/insertEvent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSubmission),
            });

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const result = await response.json();

            console.log("Réponse du serveur :", result);

            if (result.success === undefined) {
                console.error("Réponse inattendue du serveur. Vérifiez l'API :", result);
            }

            console.log(result);

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Succès',
                    text: result.message,
                    customClass: {
                        confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                    },
                }).then(() => window.location.reload());
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Erreur lors de la soumission. Veuillez réessayer.',
                customClass: {
                    confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                },
            });
            console.error('Erreur lors de la soumission :', error);
        }
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
                <form
                        className="flex flex-col lg:flex-row gap-6"
                        onSubmit={handleSubmit}
                    >                 
                        <div className="w-full lg:w-1/2 p-6 bg-yellowGreen1 bg-opacity-10 rounded-lg">
                            {/* Titre */}
                            <div>
                                <label className="block text-lg font-medium text-darkGreen">
                                    Titre
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Titre de l'évènement"
                                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-oliveGreen focus:border-oliveGreen"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-lg font-medium text-darkGreen">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Description de l'évènement"
                                    className="mt-1 block w-full h-32 px-4 py-2 border rounded-md shadow-sm focus:ring-oliveGreen focus:border-oliveGreen"
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-lg font-medium text-darkGreen">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="mt-2 block w-full text-darkGreen border border-oliveGreen bg-white rounded-md shadow-sm"
                                />
                            </div>

                            {/* Lieu */}
                            <div>
                                <label className="block text-lg font-medium text-darkGreen">
                                    Lieu
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Lieu de l'évènement"
                                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-oliveGreen focus:border-oliveGreen"
                                />
                            </div>

                            {/* Capacité */}
                            <div>
                                <label className="block text-lg font-medium text-darkGreen">
                                    Capacité
                                </label>
                                <input
                                    type="number"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    placeholder="Capacité maximale"
                                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-oliveGreen focus:border-oliveGreen"
                                />
                            </div>

                            {/* Bouton de soumission */}
                            <button
                                type="submit"
                                className={`w-full bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200
                                    ${isFormValid() ? 'hover:bg-yellowGreen1' : 'opacity-50 cursor-not-allowed'}`}
                                        disabled={!isFormValid()}
                            >
                                Publier
                            </button>
                        </div>   
                    </form>
            </div>
        )}
        </div>
    );
}

export default EventsAdmin;