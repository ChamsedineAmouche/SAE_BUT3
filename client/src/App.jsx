import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Home from "./pages/Home";
import Deposit from "./pages/Deposit";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import NewDeposit from "./pages/NewDeposit.jsx";
import Evenenement from "./pages/Evenement.jsx";
import Veille from "./pages/Veille.jsx";
import Elearning from "./pages/Elearning.jsx";
import LoginAdmin from "./pages/LoginAdmin";
import InscriptionValidation from "./pages/InscriptionValidation";
import Test from "./pages/Test.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword.jsx";
import Account from "./pages/Account.jsx";
import { Toaster } from 'react-hot-toast';  
import DetailsEvent from "./pages/DetailsEvents.jsx";
import DetailsEventFuture from "./pages/DetailsEventsFuture.jsx";
import DetailsVeille from "./pages/DetailsVeille.jsx";
import DetailsElearning from "./pages/DetailsElearning.jsx";
import DetailsDeposit from "./pages/DetailsDeposit.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute .jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import ElearningAccess from "./pages/ElearningAcces.jsx";
import ElearningEmploye from "./pages/ElearningEmploye.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx"

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/getSession", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
  
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification :", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
  
    checkAuth();
  }, []);
  
  if (loading) {
    return <div>Chargement...</div>; // Ou un spinner de chargement
  }
  
  
  return (
    <Router>
      <Toaster />
      <Routes>
          {/* Pages auxquelles on peut accéder sans être connecté */}
          <Route path="/connexion" element={<Login />} />
          <Route path="/connexion_admin" element={<LoginAdmin />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/inscription_validation" element={<InscriptionValidation />} />
          <Route path="/oubli_mot_de_passe" element={<ForgotPassword />} />
          <Route path="/reinitialisation_mot_de_passe" element={<ResetPassword />} />

        {/* Route avec le Layout global */}
        <Route path="/" element={<Layout />}>
          {/* Pages où la connexion est obligatoire */}
          <Route 
            index 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/depot" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Deposit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/nouveau_depot" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <NewDeposit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/evenement" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Evenenement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/veille" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Veille />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/elearning" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Elearning />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/test" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Test />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mon_compte" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Account />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/details_event/:eventId" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DetailsEvent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/details_event_future/:eventId" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DetailsEventFuture />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/details_veille/:id" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DetailsVeille />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/details_elearning/:id" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DetailsElearning />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/depot/:id" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DetailsDeposit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payement" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <PaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/acces_elearning" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ElearningAccess />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/elearning_employe" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <PrivateRoute>
                  <ElearningEmploye />
                </PrivateRoute>
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
