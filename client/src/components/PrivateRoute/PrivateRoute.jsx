import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const accessGranted = sessionStorage.getItem("accessGranted");

  return accessGranted === "true" ? (
    children
  ) : (
    <Navigate to="/acces_elearning" />
  );
};

export default PrivateRoute;
