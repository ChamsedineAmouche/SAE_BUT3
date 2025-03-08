import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Footer/Footer";
import ChatBot from "../ChatBot/ChatBot";

const Layout = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();

  const isChatbotPage = location.pathname === "/mon_compte";

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />

      {!isChatbotPage && (
        <div className="fixed bottom-5 right-5 flex flex-col items-end">
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center hover:scale-110 transition-all"
          >
            <img src="/greeny.png" alt="Chatbot" className="w-12 h-12" />
          </button>

          {/* ChatBot en popup avec des bords arrondis */}
          {chatOpen && (
            <div>
              {/* En-tête avec bouton de fermeture */}
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-white text-lg font-bold"
                >
                  ×
                </button>

              <ChatBot isPopup={true} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Layout;
