import React from "react";
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
import { Toaster } from 'react-hot-toast';  // Importation de Toaster

const App = () => {
  return (
    <Router>
      {/* Le composant Toaster est ici pour afficher les toasts */}
      <Toaster />
      <Routes>
        {/* Route avec le Layout global */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
          <Route path="/depot" element={<Deposit />} />
          <Route path="/nouveau_depot" element={<NewDeposit />} />
          <Route path="/login" element={<Login />} />
          <Route path="/loginadmin" element={<LoginAdmin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/evenement" element={<Evenenement />} />
          <Route path="/veille" element={<Veille />} />
          <Route path="/elearning" element={<Elearning />} />
          <Route path="/inscription_validation" element={<InscriptionValidation />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/test" element={<Test />} />
          <Route path="/mon_compte" element={<Account />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
