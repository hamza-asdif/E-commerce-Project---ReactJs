import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, Link } from "react-router-dom";
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
import Breadcrumb from "./Components/Breadcrumb/Breadcrumb.jsx";
import ShopPage from "./Components/ShopPage/ShopPage.jsx";
import { FaArrowLeft } from "react-icons/fa";
import ToShopSections from "./Components/GoToShop_Buttons/ToShopSection";
import FloatingBtn from "./Components/GoToShop_Buttons/FloatingBtn.jsx";

function AppContent() {
  const {
    toggleCart,
    setSearchState,
    isMobile,
    setIsMobile,
    mobileMenuOpen,
    setMobileMenuOpen,
    resetAllStates,
  } = useGlobalContext();

  useEffect(() => {
    console.log("AppContent mounted"); // إضافة
    // *** reset all states ***
    resetAllStates();

    // clean the comp when is lefted
    return () => {
      toggleCart(false);
      setSearchState(false);
    };
  }, []);

  // إضافة معالج أخطاء
  if (!toggleCart || !setSearchState) {
    console.error("GlobalContext values are missing");
    return <div>Loading...</div>;
  }

  return (
    <>
      <HeroImage />
      <SectionTitle />
      <ProductLayout Num="8" />
      <ToShopSections />
      <SectionTitle
        SectionTitle="🔥 الأكثر مبيعا 🔥"
        SectionSpan="منتجات موصى بها"
      />
      <ProductCard2 />
      <Why_Us_Section />
    </>
  );
}

const CartBreadcrumb = () => {
  return (
    <>
      <Breadcrumb pathNameInfo="سلة التسوق" />
      <Cart />
    </>
  );
};

const SearchBreadcrumb = () => {
  return (
    <>
      <Breadcrumb pathNameInfo="نتائج البحث" />
      <SearchForProducts />
    </>
  );
};

const CheckoutBreadcrumb = () => {
  return (
    <>
      <Breadcrumb pathNameInfo="تأكيد الطلب وإتمام الشراء" />
      <Checkout />
    </>
  );
};

const ShopPageBrreadcrumb = () => {
  return (
    <>
      <Breadcrumb pathNameInfo={"hello"} />
      <ShopPage />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="/cart" element={<CartBreadcrumb />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/search" element={<SearchBreadcrumb />} />
            <Route path="/checkout" element={<CheckoutBreadcrumb />} />
            <Route path="/shop" element={<ShopPageBrreadcrumb />} />
            {/* Add a catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <FloatingBtn />
          <Footer />
        </div>
      </GlobalProvider>
    </BrowserRouter>
  );
}

export default App;
