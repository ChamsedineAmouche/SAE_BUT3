import { faEdit, faEnvelope, faHeart, faTicket, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Carousel from "../components/Carousel/Carousel";
import DepositThumbnail from "../components/DepositThumbnail/DepositThumbnail";
import Map from "../components/Map/Map";
import Swal from "sweetalert2";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { getAuthHeaders } from "../utils/jwtAuth";
import ReservationSwal from "../components/ReservationSwal/ReservationSwal";
import toast from 'react-hot-toast'; // Import de react-hot-toast
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const DetailsDeposit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [itemsData, setItemsData] = useState({
    id_item: id,
    title: null,
    category: null,
    condition: null,
    availability: null,
    description: null,
    adress: null,
    city: null,
    zipcode: null,
    images: [],
    isUrgent: true,
    dimensions: null,
    datePosted: null,
    likes: null,
    valid: null,
  });
  const [data, setData] = useState(null);
  const [dataImg, setDataImg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [companySeller, setCompanySeller] = useState(null);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/getSession", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const sessionData = await response.json();
          setIsAdmin(sessionData.role === "admin");
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Erreur session:", error);
        setIsAdmin(false);
      }
    };

    fetchSession(); // Appelle la fonction async

  }, []);

  useEffect(() => {
    fetch(`/product?id=${id}`) //{ headers: { 'Authorization': getAuthHeaders } }
      .then((response) => {
        if (!response.status == 401) {
          //toast.error("Connectez vous")
          navigate("/login");
        }
        else if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setData(data);
        setIsLoading(false);
        setItemsData((prevState) => ({
          ...prevState,
          title: data.product[0].title,
          category: data.product[0].category,
          condition: data.product[0].state,
          description: data.product[0].description,
          adress: data.product[0].adress,
          city: data.product[0].city,
          zipcode: data.product[0].zipcode,
          dimensions: data.product[0].dimension,
          datePosted: data.product[0].date_posted,
          likes: data.product[0].nbLikes,
          status: data.product[0].status,
          valid: data.product[0].valid,
        }));
        setCompanySeller(data.companySeller[0]);
        setCurrentCompany(data.currentCompany[0] ? data.currentCompany[0] : "");
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
      .then((dataImg) => {
        console.log(dataImg);
        if (dataImg && dataImg.length > 0) {
          const images = dataImg.map((imageData) => {
            const byteArray = new Uint8Array(imageData.data);
            const blob = new Blob([byteArray], { type: imageData.mimeType });
            return URL.createObjectURL(blob);
          });

          setDataImg(images);
          setItemsData((prevState) => ({
            ...prevState,
            images: images,
          }));
          setSelectedImage(images[0]);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des images :", error);
      });
  }, [id]);

  useEffect(() => {
    return () => {
      itemsData.images.forEach((image) => URL.revokeObjectURL(image));
    };
  }, [itemsData.images]);

  useEffect(() => {
    if (!isLoading && itemsData.valid === "false" && !isAdmin) {
      toast.error("Ce dépôt n'est pas encore validé !");
      navigate("/depot"); // 🔄 Redirige l'utilisateur
    }
  }, [isLoading, itemsData.valid, isAdmin, navigate]);

  if (isLoading) {
    return <p>Chargement en cours...</p>;
  }

  if (!dataImg) {
    setDataImg(['/' + itemsData.category.replace(/ /g, '_').replace(/é/g, 'e').replace(/'/g, '_').toLowerCase() + '.jpg']);
  }

  if (!data || !dataImg) {
    return <p className="h-screen top-50">Erreur lors du chargement des données.</p>;
  }

  const depositThumbnails = data.recommandation.map((object) => (
    <DepositThumbnail key={`thumbnail-${object.id_item}`} object={object} />
  ));

  const handleContactSeller = () => {
    Swal.fire({
      title: "Contacter le donneur",
      html: `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <h2 class="text-lg font-bold text-darkGreen">Envoyer un message au donneur</h2>
        <textarea id="swal-input3" class="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-oliveGreen focus:border-oliveGreen" placeholder="Votre message"></textarea>
        <br>
        <h2 class="text-lg font-bold text-darkGreen pt-2">Ou contactez le via ses coordonnées</h2>
        <div class="flex w-full items-center justify-between p-6">
          <div class="flex items-center space-x-2">
            <i class="fas fa-envelope text-darkGreen"></i>
            <p class="text-darkGreen">${companySeller.email}</p>
          </div>
          <div class="flex items-center space-x-2">
            <i class="fas fa-phone text-darkGreen"></i>
            <p class="text-darkGreen">${companySeller.phone}</p>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Envoyer",
      cancelButtonText: "Annuler",
      customClass: {
        confirmButton: "px-4 py-2 bg-oliveGreen text-white rounded-md shadow hover:bg-yellowGreen1 mx-2",
        cancelButton: "px-4 py-2 border bg-white border-red text-red rounded-md shadow hover:bg-rose-100 mx-2",
      },
      preConfirm: async () => {
        const message = document.getElementById("swal-input3").value;

        if (!message) {
          Swal.showValidationMessage("Veuillez remplir tous les champs");
          return false;
        try {
          // 1️⃣ Vérifier si la discussion existe déjà
          const discussionResponse = await fetch(`/specificDiscussion?siren=${companySeller.siren}&idItem=${itemsData.id_item}`, {
            method: "GET",
            credentials: "include",
          });
  
          if (!discussionResponse.ok) throw new Error("Problème lors de la récupération de la discussion");
  
          const discussionData = await discussionResponse.json();
          let discussionId;
  
          if (discussionData.specificDiscussion.length > 0) {
            // 🔹 Si la discussion existe, on récupère son ID
            discussionId = discussionData.specificDiscussion[0].id;
          } else {
            // 🔹 Sinon, on crée une nouvelle discussion
            const createDiscussionResponse = await fetch(`/insertCompanyDiscussion?siren=${companySeller.siren}&idItem=${itemsData.id_item}`, {
              method: "GET",
              credentials: "include",
            });
  
            if (!createDiscussionResponse.ok) throw new Error("Problème lors de la création de la discussion");
  
            // 🔹 Après création, on récupère la discussion
            const newDiscussionResponse = await fetch(`/specificDiscussion?siren=${companySeller.siren}&idItem=${itemsData.id_item}`, {
              method: "GET",
              credentials: "include",
            });
  
            if (!newDiscussionResponse.ok) throw new Error("Problème lors de la récupération de la nouvelle discussion");
  
            const newDiscussionData = await newDiscussionResponse.json();
            discussionId = newDiscussionData.specificDiscussion[0].id;
          }
  
          // 3️⃣ Insérer le message dans la discussion trouvée/créée
          const chatResponse = await fetch(`/insertChat?discussionId=${discussionId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ message }),
          });
  
          if (!chatResponse.ok) throw new Error("Problème lors de l'envoi du message");
  
          return true;
        } catch (error) {
          console.error("Erreur lors de l'insertion du chat :", error);
          Swal.showValidationMessage("Une erreur est survenue. Veuillez réessayer.");
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Message envoyé !", "Le vendeur a été notifié de votre message.", "success");
      }
    });
  };
  
  

  const handleDelete = () => {
    // Confirmation de suppression avec SweetAlert
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ce dépôt ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      cancelButtonText: "Annuler",
      customClass: {
        confirmButton: "bg-red-500 text-white",
        cancelButton: "bg-gray-300 text-black",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/deleteDepotUser?idItem=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Erreur lors de la suppression");
            }
            toast.success("Dépôt supprimé avec succès !");
            navigate("/");
          })
          .catch((error) => {
            console.error("Erreur de suppression:", error);
            toast.error("Une erreur est survenue lors de la suppression.");
          });
      }
    });
  };

  const handleValidate = async () => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir valider ce dépôt ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
      customClass: {
        confirmButton: "bg-green-500 text-white",
        cancelButton: "bg-gray-300 text-black",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log(`🚀 Envoi de la requête GET pour valider l'objet ID: ${id}`);

          const response = await fetch(`/validateDepot?idItem=${id}`, { // ✅ Ajout de l'ID dans l'URL
            method: "GET",  // ✅ On garde GET comme tu veux
            headers: {
              "Content-Type": "application/json",
            },
          });

          console.log("🛠️ Réponse reçue :", response);

          if (response.ok) {
            toast.success("Dépôt validé avec succès !");
            setItemsData((prevState) => ({
              ...prevState,
              valid: "true", // ✅ Met à jour localement pour masquer le bouton après validation
            }));
          } else {
            const errorData = await response.json();
            console.error("❌ Erreur renvoyée par l'API :", errorData);
            throw new Error(errorData.error || "Erreur lors de la validation");
          }
        } catch (error) {
          console.error("❌ Erreur validation:", error);
          toast.error("Une erreur est survenue lors de la validation.");
        }
      }
    });
  };

  const handleCancel = async () => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir refuser ce dépôt ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Refuser",
      cancelButtonText: "Annuler",
      customClass: {
        confirmButton: "bg-red-500 text-white",
        cancelButton: "bg-gray-300 text-black",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log(`🚀 Envoi de la requête GET pour supprimer l'objet ID: ${id}`);

          const response = await fetch(`/deleteDepot?idItem=${id}`, {  // ✅ Envoi en GET
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          console.log("🛠️ Réponse reçue :", response);

          if (response.ok) {
            toast.success("Dépôt refusé avec succès !");
            navigate("/"); // ✅ Redirige l'utilisateur après suppression
          } else {
            const errorData = await response.json();
            console.error("❌ Erreur renvoyée par l'API :", errorData);
            throw new Error(errorData.error || "Erreur lors du refus");
          }
        } catch (error) {
          console.error("❌ Erreur suppression:", error);
          toast.error("Une erreur est survenue lors du refus.");
        }
      }
    });
  };

  return (
    <div className="h-screen mt-24 px-10 overflow-y-auto">
      {/* Section top */}
      <div className="px-12 flex justify-end space-x-6">
        {itemsData.status === "reserved" &&
          (
            <div className="bg-oliveGreen bg-opacity-60 px-6 py-3 text-lg font-semibold rounded-md text-white">
              Réservé
            </div>
          )}
        {itemsData.status === "picked" && (
          <div className="bg-oliveGreen bg-opacity-60 px-6 py-3 text-lg font-semibold rounded-md text-white">
            Donné
          </div>
        )}
        {isAdmin && itemsData.valid === "false" && (
          <div className="flex flex-col w-1/2 space-y-4">
            <button
              className="bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-green-700 transition duration-200"
              onClick={handleValidate}
            >
              <FontAwesomeIcon icon={faCheck} />
              <span> Valider l'objet</span>
            </button>
            <button
              className="bg-red text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-red-700 transition duration-200"
              onClick={handleCancel}
            >
              <FontAwesomeIcon icon={faTimes} />
              <span> Refuser l'objet</span>
            </button>
          </div>
        )}
        <div className="flex items-center justify-end space-x-2 border p-3 rounded-lg">
          <button
            className="text-lightGreen hover:text-red transition duration-200"
          >
            <FontAwesomeIcon icon={faHeart} className="text-xl" />
          </button>
          <span className="text-lightGreen">{itemsData.likes} favoris</span>
        </div>
      </div>

      {/* Section principale */}
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 px-12 pt-12 space-x-6">
        {/* Section Image */}
        <div className="w-full lg:w-1/2 flex rounded-lg space-y-2">
          <div className="flex flex-col space-y-2 pt-2 overflow-y-auto w-48 max-h-[500px]">
            {itemsData.images && itemsData.images.length > 0 ? (
              itemsData.images.map((image, index) => (
                <div
                  key={index}
                  className="w-32 h-32 rounded-lg border mx-2 cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image}
                    alt={`thumbnail-${index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))
            ) : (
              <p>Aucune image disponible</p>
            )}
          </div>
          <div className="relative flex items-center justify-center w-full">
            {selectedImage && (
              <Zoom>
                <img
                  src={selectedImage}
                  alt={itemsData.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </Zoom>
            )}
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

              {companySeller.siren === currentCompany.siren
                ? (<div className="flex flex-col w-1/2 space-y-4">
                  <p className="text-2xl font-semibold text-darkGreen">{itemsData.category}</p>
                  <button
                    className="bg-blue text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200 h-14"
                    onClick={() => navigate('/nouveau_depot')}
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Modifier
                  </button>
                  <button
                    className="bg-red text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200 h-14"
                    onClick={handleDelete}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Supprimer
                  </button>
                </div>)
                : (<div className="flex flex-col w-1/2 space-y-4">
                  <p className="text-2xl font-semibold text-darkGreen">{itemsData.category}</p>
                  {/* Bouton "Réserver" */}
                  <ReservationSwal id={id} isAdmin={isAdmin} />
                  <button
                    className={`bg-oliveGreen bg-opacity-60 text-white px-6 py-3 text-lg font-semibold rounded-md 
                        hover:bg-opacity-50 transition duration-200 h-14 
                        ${isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleContactSeller}
                    disabled={isAdmin}
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-xl" />
                    Contacter le donneur
                  </button>
                </div>)
              }
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
                    })} par {companySeller.nom}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4 bg-darkGreen bg-opacity-20 rounded-lg h-72">
              {/* Localisation */}
              <div className="rounded-lg p-3">
                <h3 className="font-semibold text-lg text-darkGreen">Localisation</h3>
                <p className="text-sm text-gray-600">{itemsData.adress + ", " + itemsData.zipcode + ", " + itemsData.city}</p>
              </div>
              <div className="bg-white m-3 h-48 flex flex-col">
                <div className="flex-grow"><Map adress={itemsData.adress} zipcode={itemsData.zipcode} city={itemsData.city} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Recommandations */}
      {depositThumbnails[0] && <div className="p-8">
        <Carousel items={depositThumbnails} title={"Ces objets pourraient vous intéressser..."} />
      </div>}
    </div>
  );
};

export default DetailsDeposit;
