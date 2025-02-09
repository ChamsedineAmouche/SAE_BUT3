import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import LocalisationSwal from '../components/LocalisationSwal/LocalisationSwal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { getAuthHeaders } from '../utils/jwtAuth';

const NewDeposit = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [dimensions, setDimensions] = useState({ longueur: '', largeur: '', hauteur: '' });
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [errors, setErrors] = useState({});

  // Limite de la taille d'une image
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2mo

  const dragItem = useRef();

  const handleFileChange = (event) => {
    const filesRecup = Array.from(event.target.files);

    const validFiles = filesRecup.filter((file) => {
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: 'error',
          title: 'Fichier non autorisé !',
          text: `Le fichier "${file.name}" n'est pas valide. Seules les images sont autorisées !`,
          showCancelButton: false,
          confirmButtonText: 'OK',
        });
        return false;
      } 
      if (file.size > MAX_FILE_SIZE) {
        Swal.fire({
          icon: 'error',
          title: 'Fichier trop volumineux !',
          text: `Le fichier "${file.name}" dépasse la taille maximale autorisée de 2 Mo.`,
          showCancelButton: false,
          confirmButtonText: 'OK',
        });
        return false;
      }
      return true;
    });

    const nonDuplicateFiles = validFiles.filter((file) =>
      !selectedFiles.some(
        (existingFile) =>
          existingFile.name === file.name &&
          existingFile.size === file.size &&
          existingFile.lastModified === file.lastModified
      )
    );

    if (nonDuplicateFiles.length < validFiles.length) {
      Swal.fire({
        icon: 'error',
        title: 'Image(s) déjà ajoutée(s)',
        text: 'Certaines images ont déjà été ajoutées et ne seront pas ajoutées à nouveau.',
        showCancelButton: false,
        confirmButtonText: 'OK',
      });
    }

    const uniqueNewFiles = nonDuplicateFiles.filter(
      (file, index, self) =>
        index === self.findIndex(
          (f) =>
            f.name === file.name &&
            f.size === file.size &&
            f.lastModified === file.lastModified
        )
    );

    if (uniqueNewFiles.length < nonDuplicateFiles.length) {
      Swal.fire({
        icon: 'error',
        title: 'Images en double dans la sélection',
        text: 'Certaines images sélectionnées sont en double et seront ajoutées une seule fois.',
        showCancelButton: false,
        confirmButtonText: 'OK',
      });
    }

    if (selectedFiles.length + uniqueNewFiles.length > 5) {
      Swal.fire({
        icon: 'error',
        title: 'Limite d\'images dépassée',
        text: `Vous pouvez ajouter jusqu'à 5 images uniquement. Vous avez déjà sélectionné ${selectedFiles.length} image(s).`,
        showCancelButton: false,
        confirmButtonText: 'OK',
      });
      return;
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...uniqueNewFiles]);
  };

  useEffect(() => {
    const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);

    return () => {
      newPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const handleRemoveImage = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleDragStart = (e, index) => {
    dragItem.current = index;
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = dragItem.current;
    if (dragIndex === undefined || dragIndex === dropIndex) return;

    const updatedFiles = [...selectedFiles];
    const [draggedItem] = updatedFiles.splice(dragIndex, 1);
    updatedFiles.splice(dropIndex, 0, draggedItem);
    setSelectedFiles(updatedFiles);
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
      const response = await fetch('/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(newSubmission),
      });
      console.log(response);
      if (response.status === 401) {
        toast.error("Connectez vous pour déposer une annonce");
        navigate("/login");
      } else if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const res = await response.json();
      setSubmissions([...submissions, newSubmission]);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Annonce publiée avec succès !',
        showCancelButton: true,
        confirmButtonText: 'Voir',
        cancelButtonText: 'Fermer',
        customClass: {
          confirmButton: "px-4 py-2 bg-oliveGreen text-white rounded-md shadow hover:bg-yellowGreen1 mx-2",
          cancelButton: "px-4 py-2 border bg-white border-oliveGreen text-oliveGreen rounded-md shadow hover:bg-oliveGreen hover:bg-opacity-20 mx-2",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/depot/${res.idItem}`);
        } else {
          navigate('/');
        }
      });
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
    const authToken = Cookies.get('jwt');
    if (!authToken) {
      toast.error("Connectez vous pour déposer une annonce");
      navigate("/login");
      return; 
    }
  
    fetch('/addAnnounce', { headers: getAuthHeaders() })
      .then((response) => {
        if (response.status === 401) {
          toast.error("Connectez vous pour déposer une annonce");
          navigate("/login");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
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
          <label className="block text-m font-medium pb-2 text-darkGreen">
            Ajoute jusqu'à 5 photos :
          </label>
          <div className="border p-4 border-yellowGreen1 rounded-lg border-dashed flex flex-col items-center justify-center">
            <label className="cursor-pointer text-center">
              <span className="block text-m text-darkGreen my-4 py-2 px-4 rounded-md border border-yellowGreen1 bg-yellowGreen1 bg-opacity-20 hover:bg-opacity-50">
                <FontAwesomeIcon icon={faPlus} className='pr-2' />
                Photo
              </span>
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {/* Affichage des aperçus avec icône de suppression et possibilité de réorganiser par glisser-déposer */}
            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-5 gap-4">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <img
                      src={url}
                      alt={`Aperçu ${index}`}
                      className="object-cover h-32 w-32 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-red hover:text-red/50" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="border p-4 border-2 rounded-lg border-yellowGreen1 bg-yellowGreen1 bg-opacity-20 space-y-4">
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

        {/* Category, State */}
        <div className="border p-4 border-2 rounded-lg border-yellowGreen1 bg-yellowGreen1 bg-opacity-20  space-y-4">
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
