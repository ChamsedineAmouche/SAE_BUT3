import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faLinkedin, faXTwitter, faFacebook } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-oliveGreen text-white">
      {/* Contenu principal du footer */}
      <div className="container mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation */}
        <div>
          <h3 className="font-bold text-lg mb-4">Navigation</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:underline">Accueil</a></li>
            <li><a href="/depot" className="hover:underline">Dépôt</a></li>
            <li><a href="/e-learning" className="hover:underline">E-learning</a></li>
            <li><a href="/veille" className="hover:underline">Veille</a></li>
            <li><a href="/evenements" className="hover:underline">Événements</a></li>
            <li><a href="/mon-compte" className="hover:underline">Mon compte</a></li>
            <li><a href="/forum" className="hover:underline">Forum</a></li>
          </ul>
        </div>

        {/* À propos */}
        <div>
          <h3 className="font-bold text-lg mb-4">À propos</h3>
          <ul className="space-y-2">
            <li><a href="/consulting" className="hover:underline">Digimmo Consulting</a></li>
            <li><a href="/cgv" className="hover:underline">Conditions générales de vente</a></li>
            <li><a href="/confidentialite" className="hover:underline">Politique de confidentialité</a></li>
            <li><a href="/mentions-legales" className="hover:underline">Mentions légales</a></li>
          </ul>
        </div>

        {/* Besoin d'aide ? */}
        <div>
          <h3 className="font-bold text-lg mb-4">Besoin d'aide ?</h3>
          <ul className="space-y-2">
            <li><a href="/faq" className="hover:underline">FAQ</a></li>
            <li><a href="/contact" className="hover:underline">Aide et contact</a></li>
          </ul>
        </div>

        {/* Suivez-nous */}
        <div>
          <h3 className="font-bold text-lg mb-4">Suivez-nous !</h3>
          <div className="flex space-x-4">
            <a href="https://www.instagram.com" className="hover:text-darkGreen">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a href="https://www.linkedin.com" className="hover:text-darkGreen">
              <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
            <a href="https://www.twitter.com" className="hover:text-darkGreen">
              <FontAwesomeIcon icon={faXTwitter} size="2x" />
            </a>
            <a href="https://www.facebook.com" className="hover:text-darkGreen">
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </a>
          </div>
        </div>
      </div>

      {/* Bas du footer */}
      <div className="bg-green text-center py-4">
        <p className="text-sm">&copy; 2024 Green Circle - Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
