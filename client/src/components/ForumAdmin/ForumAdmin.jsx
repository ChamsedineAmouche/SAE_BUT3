import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from '../DataTable/DataTable';
import { faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const ForumAdmin = () => {
    const navigate = useNavigate();
    const [reportedMessages, setReportedMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);

        fetch('/getReportedMessages')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setReportedMessages(data.messages);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    }, []);

    const handleDeletion = async (messageId) => {
        Swal.fire({
            title: "Êtes-vous sûr de vouloir supprimer ce message ?",
            text: "Cette action est irréversible.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Supprimer",
            cancelButtonText: "Annuler",
            confirmButtonColor: "#d33",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    console.log(`🚀 Suppression en cours pour le message ID: ${messageId}`);

                    const response = await fetch(`/deleteMessage?messageId=${messageId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    console.log("🛠️ Réponse reçue :", response);

                    if (!response.ok) {
                        throw new Error("Erreur lors de la suppression du message");
                    }

                    toast.success("Message supprimé avec succès !");
                    setReportedMessages((prevMessages) =>
                        prevMessages.filter((message) => message.id !== messageId)
                    ); // ✅ Met à jour l'affichage des messages
                } catch (error) {
                    console.error("❌ Erreur suppression :", error);
                    toast.error("Une erreur est survenue lors de la suppression.");
                }
            }
        });
    };

    const columnsMessages = ['motif', 'date_posted', 'message', 'siret', 'action'];
    const columnNamesMessages = ['Motif', 'Date du message', 'Message', 'Siret', 'Action'];

    const formattedReportedMessages = reportedMessages.map((report) => {
        const date = new Date(report.date_of_message);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`; // Formater en JJ/MM/YYYY

        return {
            motif: report.reason,
            date_posted: formattedDate,
            message: report.message,
            siret: report.siren,
            action: (
                <div className="flex space-x-2">
                    <button
                        onClick={() => navigate(`/details_forum/id:${report.discussion_id}`)}
                        className="text-blue-600 bg-blue p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-blue-400"
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                        onClick={() => handleDeletion(report.id)}
                        className="text-red-600 bg-red p-2 w-10 h-10 rounded-lg text-white text-lg hover:text-red-400"
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                </div>
            )
        };
    });

    return (
        <div className="bg-white w-full">
            <h2 className="text-3xl font-bold text-darkGreen mb-8 text-center">Forum</h2>
            <p className="text font-bold text-darkGreen mb-8 text-center">gestion des messages suspects</p>

            <div id="Messages signalés" className="overflow-y-auto h-[70vh]">
                {isLoading ? (
                    <p>Chargement en cours...</p>
                ) : (
                    <DataTable columns={columnsMessages} columnNames={columnNamesMessages} data={formattedReportedMessages} rowsPerPage={10} />
                )}
            </div>

        </div>
    );
}

export default ForumAdmin;
