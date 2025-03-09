import React, { useEffect, useState } from "react";
import DataTable from '../DataTable/DataTable';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const DepositsAdmin = () => {
    const navigate = useNavigate();
    const [deposits, setDeposits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/getSusObject')
        .then((response) => {
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setDeposits(data.deposits);
            setIsLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        });
    }, []);
    
    const columns = ['title', 'date_posted', 'company', 'statut', 'action'];
    const columnNames = ['Nom objet', 'Date de mise en ligne', 'Entreprise', 'Statut', 'Action'];

    const formattedDepositsAdmin = deposits.map((deposit) => {
        const date = new Date(deposit.date_posted);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`; // Formater en JJ/MM/YYYY
    
        return {
            title: deposit.title,
            date_posted: formattedDate,
            company: deposit.company_name,
            statut: deposit.valid === 'false' ? 'En file d\'attente' : 'Validé',
            action: deposit.status === 'picked' ? (
                <span className="text-green-600 font-bold">Récupéré</span>
            ) : (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleViewDeposit(deposit.id_item)}
                        className="text-blue-600 bg-blue p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-blue-400"
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                        onClick={() => handleDeletionDeposit(deposit.id_item)}
                        className="text-red-600 bg-red p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-red-400"
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                </div>
            ),
        };
    });

    const handleViewDeposit = async (idItem) => {
        navigate(`/depot/${idItem}`);
    }

    const handleDeletionDeposit = async (idItem) => {
        const confirmDeletion = await Swal.fire({
            title: 'Êtes-vous sûr de vouloir supprimer ce dépôt ?',
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
                const response = await fetch(`/deleteDepot?idItem=${idItem}`, {
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
                        text: 'Le dépôt a été supprimé avec succès !',
                        customClass: {
                            confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                        },
                    });
    
                    setDeposits((prevDeposits) =>
                        prevDeposits.filter((deposit) => deposit.id_item !== idItem)
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
                console.error('Erreur lors de la suppression du dépôt :', error);
    
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Erreur interne. Veuillez réessayer.',
                    customClass : {
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

    return (
        <div className="bg-white w-full">
            <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Dépôts</h2>
            <p className="text font-bold text-darkGreen mb-8 text-center">gestion des annonces</p>

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