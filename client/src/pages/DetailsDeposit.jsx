import { faEnvelope, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Importation de useParams

const DetailsDeposit = () => {
  const { id } = useParams(); // Récupération de l'id de l'objet à partir des paramètres de l'URL

  const [itemsData, setItemsData] = useState({
    id_item: id,
    title: null,
    category: null,
    condition: null,
    availability: null,
    description: null,
    location: null,
    images: [],
    isUrgent: true, 
    dimensions: null,
    datePosted: null
  });
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState(true);
  const [selectedImage, setSelectedImage] = useState(itemsData.images[0]);


  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  useEffect(() => {
    fetch(`/product?id=${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data)
        setData(data);
        setIsLoading(false);
        setItemsData({
          title: data.product[0].title,
          category: data.product[0].category,
          condition: data.product[0].state,
          description: data.product[0].description,
          location: data.product[0].id_emplacement,
          dimension	: data.product[0].dimension,
          datePosted	: data.product[0].date_posted,
          images: image
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(`/image?id=${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          const images = data.map((imageData) => {
            const blob = new Blob([new Uint8Array(imageData.data)], { type: imageData.mimeType });
            return URL.createObjectURL(blob);
          });
          setImage(images);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des images :", error);
      });
  }, [id]);
  
  if (isLoading) {
    return <p>Chargement en cours...</p>;
  }

  if (!data) {
    return <p>Erreur lors du chargement des données.</p>;
  }

  return (
    <div className="h-screen mt-24 px-10">
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 px-12 pt-12 space-x-6">
        {/* Section Image */}
        <div className="w-full lg:w-1/2 flex rounded-lg space-y-2">
          <div className="flex flex-col space-y-2">
            {itemsData.images.map((image, index) => (
              <div
                key={index}
                className="w-32 h-32 rounded-lg border mx-2 cursor-pointer"
                onClick={() => handleImageClick(image)} // Changer l'image sélectionnée au clic
              >
                <img
                  src={image}
                  alt={`thumbnail-${index}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
          <div className="relative flex items-center justify-center w-full">
            <img
              src={selectedImage}
              alt={itemsData.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Section Détails de l'objet */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="flex justify-between">
            <h2 className="text-4xl font-bold text-darkGreen">{itemsData.title}</h2>
            {/* Tag URGENT */}
            {itemsData.isUrgent && (
              <div className="bg-red text-white text-xl font-bold px-2 py-1 rounded-md">
                URGENT
              </div>
            )}
          </div>
          
          <div className="flex flex-col">
            <div className="flex w-full space-x-4">
              {/* Première colonne (boutons) */}
              <div className="flex flex-col w-1/2 space-y-4">
                <p className="text-2xl font-semibold text-darkGreen">{itemsData.category}</p>
                {/* Bouton "Réserver" */}
                <button className="bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200 h-14">
                  <FontAwesomeIcon icon={faTicket} className="mr-2 text-xl"/>
                  Réserver
                </button>
                <button className="bg-oliveGreen bg-opacity-60 text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-50 transition duration-200 h-14">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-xl"/>
                  Contacter le vendeur
                </button>
              </div>

              {/* Deuxième colonne (description) */}
              <div className="flex flex-col w-1/2 space-y-4">
                <p className="text-2xl text-darkGreen/75">{itemsData.condition}</p>
                <div className="bg-oliveGreen bg-opacity-40 px-6 py-3 rounded-md h-32 overflow-y-auto">
                  {/* Description */}
                  <h3 className="font-bold text-lg text-darkGreen">Description de l'objet</h3>
                  <h2 className="text-sm font-semibold text-darkGreen">Dimensions : {itemsData.dimensions}</h2>
                  <p className="text-sm text-darkGreen">{itemsData.description}</p>
                  <p className="text-xs text-darkGreen font-light">
                    Posté le : {new Date(itemsData.datePosted).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  </div>
                  </div>
                  </div>

                  <div className="space-y-2 mt-4 bg-darkGreen bg-opacity-20 rounded-lg h-72">
                  {/* Localisation */}
              <div className="rounded-lg p-3">
                <h3 className="font-semibold text-lg text-darkGreen">Localisation</h3>
                <p className="text-sm text-gray-600">{itemsData.location}</p>  
              </div>
              <div className="bg-white m-3 h-48 flex flex-col">
                <div className="flex-grow">Carte ici</div>
              </div>
            </div>
          </div> 
        </div>
      </div>
    </div>
  );
};

export default DetailsDeposit;