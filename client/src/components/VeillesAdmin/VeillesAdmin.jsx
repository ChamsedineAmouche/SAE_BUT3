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
    //Form
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [auteur, setAuteur] = useState('');
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState({});

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

    useEffect(() => {
        fetch('/elearningCategories')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setCategories(data.category);
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
            customClass: {
                confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                cancelButton: 'bg-red text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
            },
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
                        customClass: {
                            confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                        },
                    });
    
                    setAllVeilles((prevVeilles) =>
                        prevVeilles.filter((veille) => veille.id_veille !== veilleId)
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
                console.error('Erreur lors de la suppression de la veille :', error);
    
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isFormValid()) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Veuillez remplir tous les champs obligatoires.',
                customClass: {
                    confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                },
            });
            return;
        }

        const newSubmission = {
            title: title,
            article_date: date,
            author: auteur,
            content: content,
            category: category,
        };

        try {
            const response = await fetch('/insertArticle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSubmission),
            });


            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Succès',
                    text: result.message,
                    customClass: {
                        confirmButton: 'bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200',
                    },
                })
                .then(() => {
                    window.location.reload();
                });
    
                setTitle('');
                setDate('');
                setAuteur('');
                setCategory('');
                setContent('');
                
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

    const isFormValid = () => {
        return (
            title.trim() !== '' &&
            category.trim() !== '' &&
            auteur.trim() !== '' &&
            content.trim() !== '' &&
            date.trim() !== ''
        );
    };

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
            <div id="Créer une veille" className="overflow-y-auto h-[70vh] py-4">
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
                                placeholder="Titre de la veille"
                                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-oliveGreen focus:border-oliveGreen"
                            />
                        </div>

                        {/* Catégorie */}
                        <div className="rounded-lg bg-opacity-20">
                            <label className="block text-lg font-medium text-darkGreen">Catégorie</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={`mt-2 block w-full px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen`}
                            >
                                <option value="">Choisir une catégorie</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.Libelle}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Auteur */}
                        <div>
                            <label className="block text-lg font-medium text-darkGreen">
                                Auteur
                            </label>
                            <input
                                type="text"
                                value={auteur}
                                onChange={(e) => setAuteur(e.target.value)}
                                placeholder="Auteur de la veille"
                                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-oliveGreen focus:border-oliveGreen"
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-lg font-medium text-darkGreen">
                                Date
                            </label>
                            <input
                                type="date"
                                onChange={(e) => setDate(e.target.value)}
                                className="mt-2 block w-full text-darkGreen border border-oliveGreen bg-white rounded-md shadow-sm"
                            />
                        </div>

                        {/* Ajouter une image */}
                        <div>
                            <label className="block text-lg font-medium text-darkGreen">
                                Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="mt-2 block w-full text-darkGreen border border-oliveGreen bg-white rounded-md shadow-sm"
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
                    
                    <div className="w-full lg:w-1/2 p-6 bg-yellowGreen1 bg-opacity-10 rounded-lg">
                        {/* Contenu */}
                        <div>
                            <label className="block text-lg font-medium text-darkGreen">
                                Contenu
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Rédigez le contenu ici..."
                                className="mt-1 block w-full h-32 px-4 py-2 border rounded-md shadow-sm focus:ring-oliveGreen focus:border-oliveGreen"
                            />
                        </div>
                    </div>
                </form>
            </div>
        )}
        </div>
    );
}

export default VeillesAdmin;