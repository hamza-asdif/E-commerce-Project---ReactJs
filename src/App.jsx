import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar.jsx";
import HeroImage from "./Components/HeroImage/HeroImg.jsx";
import SectionTitle from "./Components/SectionTitle/SectionTitle.jsx";
import SideBarWidget from "./Components/SideBarWidget/SideBarWidget.jsx";
import { GlobalProvider, useGlobalContext } from "./Context/GlobalContext.jsx";
import ProductLayout from "./Components/ProductLayout/ProductLayout.jsx";
import ProductCard2 from "./Components/ProductLayout/productCard_2/ProductCard2.jsx";
import Why_Us_Section from "./Components/WhyUsSection/WhyUs_Section.jsx";
import Footer from "./Components/footer/Footer.jsx";
import ProductPage from "./Components/productPage/ProductPage.jsx";
import Cart from "./Components/Cart/Cart.jsx";
import SearchForProducts from "./Components/SearchForProducts/SearchForProducts.jsx";
import Checkout from "./Components/Checkout/Checkout.jsx";

function AppContent() {
  const { toggleCart, setSearchState } = useGlobalContext();

  useEffect(() => {
    console.log('AppContent mounted'); // إضافة
    toggleCart(false);
    setSearchState(false);
    return () => {
      toggleCart(false);
      setSearchState(false);
    };
  }, []);

  // إضافة معالج أخطاء
  if (!toggleCart || !setSearchState) {
    console.error('GlobalContext values are missing');
    return <div>Loading...</div>;
  }

  return (
    <>
      <HeroImage />
      <SectionTitle />
      <ProductLayout Num="8" />
      <SectionTitle
        SectionTitle="🔥 الأكثر مبيعا 🔥"
        SectionSpan="منتجات موصى بها"
      />
      <ProductCard2 />
      <Why_Us_Section />
    </>
  );
}

function App() {
  return (
    <BrowserRouter> {/* Removed basename */}
      <GlobalProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/search" element={<SearchForProducts />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Footer />
      </GlobalProvider>
    </BrowserRouter>
  );
}

export default App;