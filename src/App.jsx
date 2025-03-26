import React, { useState, useEffect, Suspense } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { GlobalProvider, useGlobalContext } from "./Context/GlobalContext.jsx";
import { YMInitializer } from 'react-yandex-metrika';

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
  ToShopSections,
  AdminPanel,
} from "./Components";
import Products from "./Components/AdminPanel/Products/Products.jsx";
import Home_States from "./Components/AdminPanel/Home_States/Home_States.jsx";
import Login from "./Components/Login/Login.jsx";
import Register from "./Components/Register/Register";
import ThankYouPage from "./Components/Checkout/Thank_you_page/ThankyouPage.jsx";
import AdminProvider from "./Components/AdminPanel/AdminGlobalContext.jsx";
import EditProduct_Modal from "./Components/AdminPanel/Products/EditProductComponent/EditProduct.jsx";
import ProductEditPage from "./Components/AdminPanel/Products/EditProductComponent/EditProduct.jsx";
import Orders from "./Components/AdminPanel/Orders/Orders.jsx";

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

const HandleNavbar = () => {
  let location = useLocation();
  const isAdminPanel = location.pathname.startsWith("/admin");

  return <>{!isAdminPanel && <Navbar />}</>;
};

const HandleFooter = () => {
  let location = useLocation();
  const isAdminPanel = location.pathname.startsWith("/admin");

  return <>{!isAdminPanel && <Footer />}</>;
};

const AdminPanel_GlobalContext = () => {
  return (
    <AdminProvider>
      <AdminPanel />
    </AdminProvider>
  );
};

function App() {
  const { adminStatus, productsInCart } = useGlobalContext();
  return (
    <div className="App">
      {/* مكان كود Yandex Metrica */}
      <YMInitializer 
        accounts={[123456]} // استبدل برقم العداد الخاص بك
        options={{
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          ecommerce: "dataLayer" // مهم للتجارة الإلكترونية
        }}
        version="2"
      />
      

      <BrowserRouter>
      <GlobalProvider>
        <div className="app-container">
          <HandleNavbar />
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<CartBreadcrumb />} />
            <Route
              path="/product/:id"
              element={
                <Suspense>
                  <ProductPage />
                </Suspense>
              }
            />
            <Route path="/search" element={<SearchBreadcrumb />} />
            <Route path="/checkout" element={<CheckoutBreadcrumb />} />

            <Route path="/shop" element={<ShopPageBreadcrumb />} />
            <Route path="/thank-you" element={<ThankYouPage />} />

            {adminStatus && (
              <Route path="/admin" element={<AdminPanel_GlobalContext />}>
                <Route path="products" element={<Products />} />
                <Route
                  path="edit-product/:id"
                  element={<ProductEditPage isAddProduct={false} />}
                />
                <Route path="" element={<Home_States />} />
                <Route
                  path="add-product"
                  element={<ProductEditPage isAddProduct={true} />}
                />
                <Route path="orders" element={<Orders />} />
              </Route>
            )}

            {/* Add a catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {!window.location.pathname.startsWith("/admin") && <FloatingBtn />}
          <HandleFooter />
        </div>
      </GlobalProvider>
    </BrowserRouter>
      {/* باقي مكونات تطبيقك */}
    </div>
  );
}

export default App;
