import React from "react";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar.jsx";
import HeroImage from "./Components/HeroImage/HeroImg.jsx";
import SectionTitle from "./Components/SectionTitle/SectionTitle.jsx";
import SideBarWidget from "./Components/SideBarWidget/SideBarWidget.jsx";
import { GlobalProvider, useGlobalContext } from "./Context/GlobalContext.jsx";
import ProductLayout from "./Components/ProductLayout/ProductLayout.jsx";

function AppContent() {
  const { cartSideBarToggle } = useGlobalContext();

  return (
    <div>
      <Navbar />
      <HeroImage />
      <SectionTitle />
      <ProductLayout />
      {cartSideBarToggle && <SideBarWidget />}
    </div>
  );
}

function App() {
  return (
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  );
}

export default App;