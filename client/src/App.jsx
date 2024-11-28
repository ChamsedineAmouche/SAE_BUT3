import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Home from "./pages/Home";
import Deposit from "./pages/Deposit";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route avec le Layout global */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
          <Route path="/depot" element={<Deposit />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
export default App;
