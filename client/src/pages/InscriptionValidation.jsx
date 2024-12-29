import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const ValidationAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const checkSession = async () => {
        try {
          const response = await fetch("/getSession");
          if (response.ok) {
            const sessionData = await response.json();
            if (sessionData.role !== "admin") {
              console.error("Accès refusé : rôle non administrateur.");
              navigate("/"); // Redirection vers la page d'accueil
            }
          } else {
            console.error("Session non valide ou expirée.");
            navigate("/"); // Redirection vers la page d'accueil
          }
        } catch (error) {
          console.error("Erreur lors de la vérification de la session:", error);
          navigate("/"); 
        }
      };

    const fetchAccounts = async () => {
      try {
        const response = await fetch("/validationAccount");
        const result = await response.json();
        if (result.success) {
          setAccounts(result.account);
        } else {
          setError(result.message || "Erreur lors de la récupération des comptes.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des comptes:", error);
        setError("Erreur serveur.");
      }
    };

    checkSession();
    fetchAccounts();
  }, [navigate]);

  const handleAction = async (action, siren) => {
    try {
      let endpoint;
      const options = { method: "POST", headers: { "Content-Type": "application/json" } };

      if (action === "validate") {
        endpoint = `/validateInscription`;
        options.body = JSON.stringify({ siren });
      } else if (action === "reject") {
        endpoint = "/deleteInscription";
        options.body = JSON.stringify({ siren });
      }

      const response = await fetch(`${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ siren }),
      });
      console.log(endpoint)
      if (response.ok) {
        if (action === "reject") {
          setAccounts((prevAccounts) => prevAccounts.filter((account) => account.siren !== siren));
        } else {
          setAccounts((prevAccounts) => prevAccounts.filter((account) => account.siren !== siren));
        }
        alert(`Compte ${action === "validate" ? "validé" : "rejeté"} avec succès.`);
      } else {
        alert(`Erreur lors de la tentative de ${action === "validate" ? "validation" : "rejet"} du compte.`);
      }
    } catch (error) {
      console.error(`Erreur lors de la tentative de ${action}:`, error);
      alert("Erreur serveur.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <br />
      <br />
      <br />
      <br />
      <h1 className="text-2xl font-bold mb-4">Validation des Comptes</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Nom</th>
            <th className="border border-gray-300 px-4 py-2">Siren</th>
            <th className="border border-gray-300 px-4 py-2">Mail</th>
            <th className="border border-gray-300 px-4 py-2">Adresse</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td className="border border-gray-300 px-4 py-2">{account.nom}</td>
              <td className="border border-gray-300 px-4 py-2">{account.siren}</td>
              <td className="border border-gray-300 px-4 py-2">{account.email}</td>
              <td className="border border-gray-300 px-4 py-2">{account.adress}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleAction( "validate" ,account.siren)}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Valider
                </button>
                <button
                  onClick={() => handleAction("reject", account.siren,)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  Refuser
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ValidationAccount;
