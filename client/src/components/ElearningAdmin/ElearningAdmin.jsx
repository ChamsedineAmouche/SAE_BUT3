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
    //Form
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});

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
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);
    
    const columns = ['nom', 'date_posted', 'price', 'action'];
    const columnNames = ['Nom', 'Date de mise en ligne', 'Prix', 'Action'];

    const formattedAllELearnings = allElearnings.map((elearning) => ({
        nom: elearning.title,
        date_posted: "01/01/2025", // Il faut rajouter le champ date_posted dans la BDD la on le simule
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

    const isFormValid = () => {
        return (
            title.trim() !== '' &&
            description.trim() !== '' &&
            price.trim() !== '' &&
            category.trim() !== ''
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isFormValid()) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Veuillez remplir tous les champs obligatoires.',
            });
            return;
        }

        const newSubmission = {
            title,
            description,
            price,
            category,
        };

        try {
            const response = await fetch('/insertElearning', {
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
                }).then(() => window.location.reload());
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Erreur lors de la soumission. Veuillez réessayer.',
            });
            console.error('Erreur lors de la soumission :', error);
        }
    };

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
            <div id="Créer un e-learning" className="overflow-y-auto h-[70vh] py-4">
                <form className="flex flex-col lg:flex-row gap-6" onSubmit={handleSubmit}>
                    <div className="w-full lg:w-1/2 p-6 bg-yellowGreen1 bg-opacity-10 rounded-lg">
                        <div>
                            <label className="block text-lg font-medium text-darkGreen">
                                Titre
                            </label>
                            <input
                                type="text"
                                placeholder="Titre de l'e-learning"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-oliveGreen focus:border-oliveGreen"                               
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-darkGreen">
                                Prix
                            </label>
                            <input
                                type="number"
                                placeholder="Prix"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-oliveGreen focus:border-oliveGreen"
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-darkGreen">
                                Catégorie
                            </label>
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
                        
                        <button
                            type="submit"
                            className={`w-full bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200
                            ${isFormValid() ? 'hover:bg-yellowGreen1' : 'opacity-50 cursor-not-allowed'}`}
                                disabled={!isFormValid()}
                        >
                            Créer
                        </button>
                    </div>
                    
                    <div className="w-full lg:w-1/2 p-6 bg-yellowGreen1 bg-opacity-10 rounded-lg">
                        <label className="block text-lg font-medium text-darkGreen">
                            Description
                        </label>
                        <textarea
                            placeholder="Rédigez la description ici..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full h-32 px-4 py-2 border rounded-md shadow-sm focus:ring-oliveGreen focus:border-oliveGreen"
                        />
                    </div>
                </form>
            </div>
        )}
        </div>
    );
}

export default ElearningAdmin;