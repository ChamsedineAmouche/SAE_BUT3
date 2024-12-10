import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import LocalisationSwal from '../components/LocalisationSwal/LocalisationSwal';

const NewDeposit = () => {
  const [title, setTitle] = useState('');
  const [dimensions, setDimensions] = useState({ longueur: '', largeur: '', hauteur: '' });
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [errors, setErrors] = useState({});

  const handleFileChange = (event) => {
    const filesRecup = Array.from(event.target.files);
    console.log('Fichiers sélectionnés :', filesRecup); // Vérifie ici
    setSelectedFiles(filesRecup);
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64Data = reader.result.split(',')[1]; // Supprimer le préfixe "data:"
        resolve(base64Data);
      };

      reader.onerror = (error) => {
        console.error(`Erreur lors de la lecture du fichier ${file.name} :`, error);
        reject(error);
      };

      reader.readAsDataURL(file); // Lire le fichier en Base64
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const base64Files = await Promise.all(
        selectedFiles.map((file) => readFileAsBase64(file))
    );

    console.log('binaryFiles :', base64Files);

    const newSubmission = {
      title,
      dimensions,
      description,
      category,
      state,
      location,
      files : base64Files,
    };

    try {
      // Envoi des données au backend
      const response = await fetch('http://localhost:5001/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubmission), // Conversion en JSON pour le backend
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json(); // Résultat renvoyé par le serveur
      console.log('Données envoyées avec succès :', newSubmission);

      // Mettre à jour le tableau local des soumissions
      setSubmissions([...submissions, newSubmission]);
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données :', error);
    }

    // Réinitialise le formulaire
    setTitle('');
    setDimensions({longueur: '', largeur: '', hauteur: ''});
    setDescription('');
    setCategory('');
    setState('');
    setLocation('');
    setSelectedFiles([]);
  };

  const handleSaveDraft = () => {
    console.log('Draft saved');
  };

  const isFormValid = () => {
    return (
      title.trim() !== '' &&
      dimensions.longueur.trim() !== '' &&
      dimensions.largeur.trim() !== '' &&
      dimensions.hauteur.trim() !== '' &&
      description.trim() !== '' &&
      category.trim() !== '' &&
      state.trim() !== '' &&
      location.trim() !== '' &&
      selectedFiles.length > 0
    );
  };

  useEffect(() => {
    fetch('/addAnnounce')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Chargement en cours...</p>;
  }

  if (!data) {
    return <p>Erreur lors du chargement des données.</p>;
  }


  return (
    <div className="max-w-5xl mx-auto px-12 py-24">
      <h1 className="text-4xl font-bold text-start mb-6 text-darkGreen">Déposez votre objet !</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Photo Upload */}
        <div className="border p-4 border-2 rounded-lg border-yellowGreen1 bg-yellowGreen1 bg-opacity-20">
          <label className="block text-m font-medium pb-2 text-darkGreen">Ajoute jusqu'à 5 photos :</label>
          <div className="border p-4 border-yellowGreen1 rounded-lg border-dashed flex flex-col items-center justify-center">
            {/* Conteneur personnalisé pour masquer le texte */}
            <label className="cursor-pointer text-center">
              <span className="block text-m text-darkGreen my-4 py-2 px-4 rounded-md border border-yellowGreen1 bg-yellowGreen1 bg-opacity-20 hover:bg-opacity-50">
                <FontAwesomeIcon icon={faPlus} className='pr-2' />
                Photo
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Liste des fichiers sélectionnés */}
            {selectedFiles.length > 0 && (
              <ul className="mt-4 text-sm text-gray-600">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="truncate">
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        <div className="border p-4 border-2 rounded-lg border-yellowGreen1 bg-yellowGreen1 bg-opacity-20">
          {/* Title */}
          <div>
            <label className="block text-m font-medium pb-2 text-darkGreen">Titre</label>
            <input
              type="text"
              placeholder="ex : Table"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen"
            />
          </div>

          <span className="block w-full border-b border-darkGreen my-4"></span>

          {/* Dimensions */}
          <div>
            <label className="block text-m font-medium pb-2 text-darkGreen">Dimensions (en cm)</label>
            <div className="mt-2 grid grid-cols-3 gap-4">
              {['Longueur', 'Largeur', 'Hauteur'].map((placeholder, index) => (
                <input
                  key={index}
                  type="number"
                  placeholder={placeholder}
                  value={dimensions[placeholder.toLowerCase()]}
                  onChange={(e) =>
                    setDimensions({ ...dimensions, [placeholder.toLowerCase()]: e.target.value })
                  }
                  className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen"
                />
              ))}
            </div>
          </div>

          <span className="block w-full border-b border-darkGreen my-4"></span>

          {/* Description */}
          <div>
            <label className="block text-m font-medium pb-2 text-darkGreen">Description</label>
            <textarea
              placeholder="ex : Très bon état, peu servi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen"
            ></textarea>
          </div>
        </div>

        <div className="border p-4 border-2 rounded-lg border-yellowGreen1 bg-yellowGreen1 bg-opacity-20">
          {/* Category */}
          <div>
            <label className="block text-m font-medium pb-2 text-darkGreen">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen"
            >
              <option value="">Choisir une catégorie</option>
              {data.categoriesForObjects.map((category, index) => (
                <option key={index} value={category.label}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <span className="block w-full border-b border-darkGreen my-4"></span>

          {/* State */}
          <div>
            <label className="block text-m font-medium pb-2 text-darkGreen">État</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen"
            >
              <option value="">Choisir un état</option>
              {data.statesForObjects.map((state, index) => (
                <option key={index} value={state.label}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border p-4 border-2 rounded-lg border-yellowGreen1 bg-yellowGreen1 bg-opacity-20">
          {/* Location */}
          <div className='flex items-center'>
            <label className="block text-m font-medium text-darkGreen pr-32 ">Localisation</label>
            <input
              type="text"
              placeholder="Aucun emplacement choisi"
              id='location'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen mx-2"
              readOnly
            />
            <LocalisationSwal locations={data.containerAvailable} onLocationSelect={(selectedLocation) => setLocation(selectedLocation)} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            className="px-4 py-2 border border-red text-red rounded-md shadow hover:bg-rose-100 mx-2"
            onClick={() => console.log('Cancelled')}
          >
            Annuler
          </button>
          <button
            type="button"
            className="px-4 py-2 text-oliveGreen border border-oliveGreen rounded-md shadow hover:bg-gray-100 mx-2"
            onClick={handleSaveDraft}
          >
            Sauvegarder le brouillon
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-oliveGreen text-white rounded-md shadow hover:bg-yellowGreen1 mx-2 
              ${isFormValid() ? 'hover:bg-yellowGreen1' : 'opacity-50 cursor-not-allowed'}`}
            disabled={!isFormValid()}
          >
            Publier
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewDeposit;
