import React, { useEffect, useState } from "react";
import homeImage from "../assets/images/home_image.png";
import { useNavigate } from "react-router-dom";
import Carousel from "../components/Carousel/Carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxArchive, faCalendarDay, faEye, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import DepositThumbnail from "../components/DepositThumbnail/DepositThumbnail";
import ElearningThumbnail from "../components/ElearningThumbnail/ElearningThumbnail";
import OtherThumbnail from "../components/OtherThumbnail/OtherThumbnail";
import {getAuthHeaders}  from "../utils/jwtAuth";

const Home = () => {
  
  const navigate = useNavigate()
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastObject, setLastObject] = useState(null);
  const [lastElearning, setLastElearning] = useState(null);
  const [lastArticle, setLastArticle] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    fetch('/homepage')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setData(data);

        if (data.object && data.object.length > 0) {
          const mostRecentObject = data.object.reduce((latest, current) => {
            const latestDate = new Date(latest.date_posted);
            const currentDate = new Date(current.date_posted);
            return currentDate > latestDate ? current : latest;
          });

          setLastObject(mostRecentObject);
        }

        if (data.elearning && data.elearning.length > 0) {
          const mostRecentElearning = data.elearning.reduce((latest, current) => {
            const latestDate = new Date(latest.date_posted);
            const currentDate = new Date(current.date_posted);
            return currentDate > latestDate ? current : latest;
          });

          setLastElearning(mostRecentElearning);
        }

        if (data.article && data.article.length > 0) {
          const mostRecentArticle = data.article.reduce((latest, current) => {
            const latestDate = new Date(latest.date_posted);
            const currentDate = new Date(current.date_posted);
            return currentDate > latestDate ? current : latest;
          });

          setLastArticle(mostRecentArticle);
        }

        if (data.event && data.event.length > 0) {
          const mostRecentEvent = data.event.reduce((latest, current) => {
            const latestDate = new Date(latest.date_posted);
            const currentDate = new Date(current.date_posted);
            return currentDate > latestDate ? current : latest;
          });

          setLastEvent(mostRecentEvent);
        }

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

  const depositThumbnails = data.object.map((object) => (
    <DepositThumbnail key={`thumbnail-${object.id_item}`} object={object} />
  ));

  const elearningThumbnail = data.elearning.map((elearning) => (
    <ElearningThumbnail key={`thumbnail-${elearning.id_item}`} elearning={elearning} />
  ));

  const articleThumbnail = data.article.map((article) => (
    <OtherThumbnail key={`thumbnail-${article.id_item}`} other={article} type={"veille"} />
  ));

  const eventThumbnail = data.event.map((event) => (
    <OtherThumbnail key={`thumbnail-${event.id_item}`} other={event} type={"event"} />
  ));
  

  return (
    <div className="home-page">
      <div
        className="home-image flex flex-col justify-center items-center text-center"
        style={{
          backgroundImage: `url(${homeImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100vw",
          height: "100vh",
        }}
      >
        {/* Titre */}
        <h1 className="text-9xl font-bold text-darkGreen mb-4 drop-shadow-md">
          Green Circle
        </h1>

        {/* Texte descriptif */}
        <p className="text-2xl text-white mb-8 max-w-2xl drop-shadow-md font-bold">
          Votre partenaire pour une entreprise écoresponsable.
        </p>

        {/* Boutons */}
        <div className="flex space-x-4">
          <button 
            className="bg-oliveGreen text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200"
            onClick={ () => navigate("/depot") }
          >
            Voir les dépôts
          </button>
          <button 
            className="bg-white text-darkGreen px-6 py-3 text-lg font-semibold rounded-md hover:bg-opacity-90 transition duration-200"
            onClick={ () => navigate("/elearning")}
          >
            Voir les e-learning
          </button>
        </div>
      </div>

      {/* Section En ce moment */}
      <div className="bg-yellowGreen1 py-6 px-12 rounded-lg mx-12 my-8 max-w-full shadow-md bg-opacity-20">
        <h2 className="text-3xl font-semibold text-darkGreen mb-6">
          En ce moment...
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Bloc 1 */}
          <div className="bg-yellowGreen1 p-4 rounded-lg flex items-center justify-center bg-opacity-60 space-x-4">
            {/* Cercle avec le chiffre */}
            <div
              className="font-bold text-darkGreen border-4 border-darkGreen rounded-full w-20 h-20 flex items-center justify-center"
              style={{
                fontSize: "clamp(1rem, 4vw, 2.5rem)",
              }}
            >
              {data.numberOfCompany}
            </div>

            {/* Texte aligné verticalement */}
            <p className="text-darkGreen font-medium text-4xl flex items-center">
              Entreprises membres
            </p>
          </div>


          {/* Bloc 2 */}
          <div className="bg-yellowGreen1 p-4 rounded-lg flex items-center justify-center bg-opacity-60 space-x-4">
          <div 
            className="font-bold text-darkGreen border-4 border-darkGreen rounded-full w-20 h-20 flex items-center justify-center"
            style={{
              fontSize: "clamp(1rem, 4vw, 2.5rem)",
            }}
          >
            { data.numberActive }
          </div>

            <p className="text-darkGreen font-medium text-4xl flex items-center">
            Objets déposés
            </p>
          </div>

          {/* Bloc 3 */}
          <div className="bg-yellowGreen1 p-4 rounded-lg flex items-center justify-center bg-opacity-60 space-x-4">
            <div 
              className="font-bold text-darkGreen border-4 border-darkGreen rounded-full w-20 h-20 flex items-center justify-center"
              style={{
                fontSize: "clamp(1rem, 4vw, 2.5rem)",
              }}
            >
              { data.numberGiven}
            </div>
            <p className="text-darkGreen font-medium text-4xl flex items-center">
              Objets récupérés
            </p>
          </div>
        </div>
      </div>

      {/* Section Derniers tous */}
      <div className=" max-w-full py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col items-center">
            <div className="flex flex-row items-center text-left w-3/4">
              <FontAwesomeIcon icon={faBoxArchive} className="mr-2 text-xl mb-6" />
              <h2 className="text-2xl font-bold text-darkGreen mb-6 flex items-center whitespace-nowrap">
                Dépôt
              </h2>
            </div>
            <div className="w-80 h-80 flex items-center justify-center bg-[#e0e0e0] rounded-xl shadow-md">
              <DepositThumbnail object={ lastObject } />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex flex-row items-center text-left w-3/4">
              <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-xl mb-6" />
              <h2 className="text-2xl font-bold text-darkGreen mb-6 flex items-center whitespace-nowrap">
                E-learning
              </h2>
            </div>
            <div className="w-80 h-80 flex items-center justify-center bg-[#e0e0e0] rounded-xl shadow-md">
              <ElearningThumbnail elearning={ lastElearning } />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex flex-row items-center text-left w-3/4">
              <FontAwesomeIcon icon={faEye} className="mr-2 text-xl mb-6" />
              <h2 className="text-2xl font-bold text-darkGreen mb-6 flex items-center whitespace-nowrap">
                Veille
              </h2>
            </div>
            <div className="w-80 h-80 flex items-center justify-center bg-[#e0e0e0] rounded-xl shadow-md">
              <OtherThumbnail other={lastArticle} type={'veille'}/>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex flex-row items-center text-left w-3/4">
              <FontAwesomeIcon icon={faCalendarDay} className="mr-2 text-xl mb-6" />
              <h2 className="text-2xl font-bold text-darkGreen mb-6 flex items-center whitespace-nowrap">
                Événement
              </h2>
            </div>
            <div className="w-80 h-80 flex items-center justify-center bg-[#e0e0e0] rounded-xl shadow-md">
              <OtherThumbnail other={lastEvent} type={'event'}/>
            </div>
          </div>
        </div>
      </div>

      {/* Section derniers dépots */}
      <div className="p-8">
        <Carousel items={depositThumbnails} title={"Derniers dépôts"} />
      </div>

      {/* Section derniers e-learnings */}
      <div className="p-8">
        <Carousel items={elearningThumbnail} title={"Derniers e-learnings"} />
      </div>

      {/* Section derniers articles */}
      <div className="p-8">
        <Carousel items={articleThumbnail} title={"Derniers articles"} />
      </div>

      {/* Section derniers événements */}
      <div className="p-8">
        <Carousel items={eventThumbnail} title={"Derniers événements"} />
      </div>
    </div>
  );
};

export default Home;
