import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import veilleImage from "../assets/images/circular_economy.png";
import Carousel from "../components/Carousel/Carousel";
import OtherThumbnail from "../components/OtherThumbnail/OtherThumbnail"; // Assurez-vous d'importer correctement ce composant

const DetailsVeille = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [article, setArticle] = useState(null); // État pour stocker les données de l'article
  const [lastArticles, setLastArticles] = useState([]); // État pour stocker les dernières actualités
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs

  useEffect(() => {
    window.scrollTo(0, 0);

    // Vérifier si l'ID est valide
    if (!id) {
      setError("Aucun ID fourni dans l'URL.");
      setLoading(false);
      return;
    }

    // Appel API pour récupérer les données de l'article
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/article?id=${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données.");
        }
        const data = await response.json();
        setArticle(data.articleData[0]); // On prend le premier article
        setLastArticles(data.lastArticles); // On stocke les dernières actualités
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-24">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center mt-24 text-red-500">{error}</div>;
  }

  if (!article) {
    return (
      <div className="text-center mt-24 text-gray-600">
        Aucun article trouvé pour l'ID {id}.
      </div>
    );
  }

  return (
    <div className="details-veille pt-24 px-6 md:px-12 lg:px-24">
      {/* Texte en haut à gauche */}
      <div className="text-left">
        <p className="text-lg font-medium text-gray-700">
          Veille/{article.title}
        </p>
      </div>

      {/* Titre centré */}
      <div className="text-center mt-12">
        <h1 className="text-4xl font-bold text-darkGreen">{article.title}</h1>
      </div>

      {/* Image en cercle à droite et texte avec auteur et date */}
      <div className="flex items-center justify-start mt-12">
        {/* Image circulaire */}
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
          <img
            src={veilleImage}
            alt="Auteur"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Texte avec nom d'auteur et date */}
        <div>
          <p className="text-lg font-medium text-gray-700">{article.author}</p>
          <p className="text-sm text-gray-500">
            {new Date(article.article_date).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Image centrée */}
      <div className="flex justify-center mt-12">
        <img
          src={article.image || veilleImage}
          alt={article.title}
          className="w-3/4 md:w-1/2 lg:w-1/3 rounded-lg shadow-lg"
        />
      </div>

      {/* Contenu de l'article */}
      <div className="text-center mt-12 max-w-3xl mx-auto mb-12">
        <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
          {article.content}
        </p>
      </div>

      {/* Carrousel des dernières actualités */}
      <div className="p-8">
        <Carousel
          items={lastArticles.map((article) => (
            <OtherThumbnail
              key={article.id_veille}
              other={{
                id_veille: article.id_veille,
                title: article.title,
              }}
              type="veille"
            />
          ))}
          title={"Les dernières actualités"}
        />
      </div>
    </div>
  );
};

export default DetailsVeille;
