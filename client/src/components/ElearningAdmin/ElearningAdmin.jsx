import React, { useEffect, useState } from "react";
import Switch from "../Switch/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from '../DataTable/DataTable';
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const ElearningAdmin = () => {
    const [selectedOption, setSelectedOption] = useState("Liste des e-learnings");
    const [allElearnings, setAllElearnings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/allElearning')
        .then((response) => {
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setAllElearnings(data.result.elearnings);
            setIsLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        });
    }, []);
    
    const columns = ['nom', 'date_posted', 'price', 'action'];
    const columnNames = ['Nom', 'Date de mise en ligne', 'Prix', 'Action'];

    const formattedAllELearnings = allElearnings.map((elearning) => ({
        nom: elearning.title,
        date_posted: "01/01/2025", // Il faut rajouter le champ date_posted dans la BDD
        price: elearning.price,
        action: (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleDeletionElearning(elearning.course_id) }
                            className="text-red-600 bg-red p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-red-400"
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                )
    }));

    const handleSwitchChange = (option) => {
        setSelectedOption(option);
      };

    const handleDeletionElearning = async (courseId) => {
        const confirmDeletion = await Swal.fire({
            title: 'Êtes-vous sûr de vouloir supprimer ce e-learning ?',
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
                const response = await fetch(`/deleteELearning?courseId=${courseId}`, {
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
                        text: 'Le e-learning a été supprimé avec succès !',
                        confirmButtonColor: '#3085d6',
                    });
    
                    setAllElearnings((prevElearnings) =>
                        prevElearnings.filter((elearning) => elearning.course_id !== courseId)
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
                console.error('Erreur lors de la suppression du e-learning :', error);

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
        <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">E-learnings</h2>

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