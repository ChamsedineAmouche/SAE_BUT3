import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const NewDeposit = () => {
  const [title, setTitle] = useState('');
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleSaveDraft = () => {
    console.log('Draft saved');
  };

  const handlePublish = () => {
    console.log('Object published');
  };

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/add_')
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
      <h1 className="text-4xl font-bold text-start mb-6 text-darkGreen">Dépose ton objet !</h1>
      <form className="space-y-6">
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
            <label className="block text-m font-medium pb-2 text-darkGreen">Dimensions</label>
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
              <option value="meubles">Meubles</option>
              <option value="électroménager">Électroménager</option>
              <option value="décoration">Décoration</option>
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
              <option value="neuf">Neuf</option>
              <option value="bon état">Bon état</option>
              <option value="usé">Usé</option>
            </select>
          </div>
        </div>

        <div className="border p-4 border-2 rounded-lg border-yellowGreen1 bg-yellowGreen1 bg-opacity-20">
          {/* Location */}
          <div className='flex items-center'>
            <label className="block text-m font-medium text-darkGreen pr-32 ">Localisation</label>
            <button
              type="button"
              className="mt-2 w-full px-4 py-2 bg-oliveGreen text-white rounded-md shadow hover:bg-yellowGreen1"
              onClick={() => console.log('Choose location')}
            >
              Choisir un emplacement
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            className="px-4 py-2 border border-red text-red text-white rounded-md shadow hover:bg-rose-100 mx-2"
            onClick={() => console.log('Cancelled')}
          >
            Annuler
          </button>
          <button
            type="button"
            className="px-4 py-2 text-oliveGreen border border-oliveGreen text-white rounded-md shadow hover:bg-gray-100 mx-2"
            onClick={handleSaveDraft}
          >
            Sauvegarder le brouillon
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-oliveGreen text-white rounded-md shadow hover:bg-yellowGreen1 mx-2"
            onClick={handlePublish}
          >
            Publier
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewDeposit;