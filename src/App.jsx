import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, Link, useLocation } from "react-router-dom";
import "./App.css";
import { GlobalProvider, useGlobalContext } from "./Context/GlobalContext.jsx";




import {
  Navbar,
  HeroImage,
  SectionTitle,
  SideBarWidget,
  ProductLayout,
  ProductCard2,
  WhyUsSection,
  Footer,
  ProductPage,
  Cart,
  SearchForProducts,
  Checkout,
  Breadcrumb,
  ShopPage,
  FloatingBtn,
  ToShopSections
} from "./Components";


function AppContent() {
  const pathname = useLocation()

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

  const getpath = () => {
    console.log("this is the page here : ",  pathname)
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
      <WhyUsSection />
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

const ShopPageBreadcrumb = () => {
  return (
    <>
      <Breadcrumb pathNameInfo="جميع المنتجات" />
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
            <Route path="/shop" element={<ShopPageBreadcrumb />} />
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
