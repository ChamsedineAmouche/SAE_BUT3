import React, { useEffect, useState } from "react";
import Switch from "../Switch/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from '../DataTable/DataTable';
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const VeillesAdmin = () => {
    const [selectedOption, setSelectedOption] = useState("Liste des veilles");
    const [allVeilles, setAllVeilles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/allArticles')
        .then((response) => {
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setAllVeilles(data.result.articles);
            setIsLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        });
    }, []);
    
    const columns = ['nom', 'date_article', 'auteur', 'action'];
    const columnNames = ['Nom', 'Date de l\'évènement', 'Auteur', 'Action'];

    const formattedAllVeilles = allVeilles.map((veille) => {
        const date = new Date(veille.article_date);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

        return {
            nom: veille.title,
            date_article: formattedDate,
            auteur: veille.author,
            action: (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleVeilleDeletion(veille.id_veille) }
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

    const handleVeilleDeletion = async (veilleId) => {
        const confirmDeletion = await Swal.fire({
            title: 'Êtes-vous sûr de vouloir supprimer cette veille ?',
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
                const response = await fetch(`/deleteArticleAdmin?articleId=${veilleId}`, {
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
                        text: 'La veille a été supprimée avec succès !',
                        confirmButtonColor: '#3085d6',
                    });
    
                    setAllVeilles((prevVeilles) =>
                        prevVeilles.filter((veille) => veille.id_veille !== veilleId)
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
                console.error('Erreur lors de la suppression de la veille :', error);
    
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