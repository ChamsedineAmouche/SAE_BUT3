import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import LocalisationSwal from '../components/LocalisationSwal/LocalisationSwal';
import toast from 'react-hot-toast';

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
    setSelectedFiles(filesRecup);
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation des champs
    let formErrors = {};

    if (title.trim() === '') formErrors.title = 'Le titre est requis';
    if (dimensions.longueur.trim() === '') formErrors.longueur = 'La longueur est requise';
    if (dimensions.largeur.trim() === '') formErrors.largeur = 'La largeur est requise';
    if (dimensions.hauteur.trim() === '') formErrors.hauteur = 'La hauteur est requise';
    if (description.trim() === '') formErrors.description = 'La description est requise';
    if (category.trim() === '') formErrors.category = 'La catégorie est requise';
    if (state.trim() === '') formErrors.state = 'L\'état est requis';
    if (location.trim() === '') formErrors.location = 'La localisation est requise';
    if (selectedFiles.length === 0) formErrors.files = 'Au moins une photo est requise';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return; // Empêche l'envoi si des erreurs existent
    }

    const base64Files = await Promise.all(
      selectedFiles.map((file) => readFileAsBase64(file))
    );

    const newSubmission = {
      title,
      dimensions,
      description,
      category,
      state,
      location,
      files: base64Files
    };

    try {
      const response = await fetch('http://localhost:5001/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubmission),
      });

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      const result = await response.json();
      setSubmissions([...submissions, newSubmission]);
      toast.success("Annonce publiée avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la publication de l'annonce, veuillez réessayer.");
    }

    // Réinitialisation du formulaire après envoi
    setTitle('');
    setDimensions({ longueur: '', largeur: '', hauteur: '' });
    setDescription('');
    setCategory('');
    setState('');
    setLocation('');
    setSelectedFiles([]);
    setErrors({});
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
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error('Erreur lors du chargement des données');
      });
  }, []);

  if (isLoading) return <p>Chargement...</p>;

  return (
    <div className="max-w-5xl mx-auto px-12 py-24">
      <h1 className="text-4xl font-bold text-start mb-6 text-darkGreen">Déposez votre objet !</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Photo Upload */}
        <div className="border p-4 border-2 rounded-lg border-yellowGreen1 bg-yellowGreen1 bg-opacity-20">
          <label className="block text-m font-medium pb-2 text-darkGreen">Ajoute jusqu'à 5 photos :</label>
          <div className="border p-4 border-yellowGreen1 rounded-lg border-dashed flex flex-col items-center justify-center">
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

        {/* Form Inputs */}
        <div className="border p-4 border-2 rounded-lg border-yellowGreen1 bg-yellowGreen1 bg-opacity-20">
          <div>
            <label className="block text-m font-medium pb-2 text-darkGreen">Titre</label>
            <input
              type="text"
              placeholder="ex : Table"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-2 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen ${errors.title ? 'border-red-500' : ''}`}
            />
          </div>

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
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen ${errors[placeholder.toLowerCase()] ? 'border-red-500' : ''}`}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-m font-medium pb-2 text-darkGreen">Description</label>
            <textarea
              placeholder="ex : Très bon état, peu servi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`mt-2 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen ${errors.description ? 'border-red-500' : ''}`}
            />
          </div>
        </div>

        {/* Category, State, Location */}
        <div className="border p-4 border-2 rounded-lg border-yellowGreen1 bg-yellowGreen1 bg-opacity-20">
          <div>
            <label className="block text-m font-medium pb-2 text-darkGreen">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`mt-2 block w-full px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen ${errors.category ? 'border-red-500' : ''}`}
            >
              <option value="">Choisir une catégorie</option>
              {data.categoriesForObjects.map((category, index) => (
                <option key={index} value={category.label}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-m font-medium pb-2 text-darkGreen">État</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={`mt-2 block w-full px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen ${errors.state ? 'border-red-500' : ''}`}
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

        {/* Location */}
        <div className="border p-4 border-2 rounded-lg border-yellowGreen1 bg-yellowGreen1 bg-opacity-20">
          <div className="flex items-center">
            <label className="block text-m font-medium text-darkGreen pr-32">Localisation</label>
            <input
              type="text"
              placeholder="Aucun emplacement choisi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`mt-2 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen mx-2 ${errors.location ? 'border-red-500' : ''}`}
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
            onClick={() => console.log('Draft saved')}
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
