import React from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto py-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
