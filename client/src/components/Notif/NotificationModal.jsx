import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

function NotificationModal({ onClose }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('/getNotifs')
      .then(response => response.json())
      .then(data => {
        if (data.notRead) {
          setNotifications(data.notRead);
        }
      })
      .catch(error => console.error('Erreur lors de la récupération des notifications:', error));
  }, []);

  // Fonction pour marquer une notification comme lue
  const markAsRead = async (id) => {
    try {
      const response = await fetch('/updateNotif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        setNotifications(notifications.filter(notification => notification.id !== id));
      } else {
        console.error("Erreur lors de la mise à jour de la notification");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la requête:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-[500px] max-h-[70vh] overflow-y-auto shadow-lg relative">
        {/* Bouton de fermeture */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        {/* Titre */}
        <h2 className="text-2xl font-semibold mb-6 text-darkGreen text-center">Mes Notifications</h2>

        {/* Liste des notifications */}
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map(notification => (
              <li
                key={notification.id}
                className="bg-darkGreen/25 text-white text-lg px-4 py-3 rounded-lg shadow-md flex justify-between items-center"
              >
                <span>{notification.message}</span>
                <button
                  className="bg-oliveGreen text-white px-3 py-1 rounded-lg hover:bg-green-700 flex items-center"
                  onClick={() => markAsRead(notification.id)}
                >
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  Lu
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">Aucune nouvelle notification.</p>
        )}
      </div>
    </div>
  );
}

export default NotificationModal;
