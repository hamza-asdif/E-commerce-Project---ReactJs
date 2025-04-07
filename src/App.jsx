/* eslint-disable react/prop-types */
import React, { useState, useEffect, Suspense, lazy } from "react";
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

// Static imports (small components used immediately)
import {
  Navbar,
  HeroImage,
  SectionTitle,
  SideBarWidget,
  ProductLayout,
  ProductCard2,
  WhyUsSection,
  Footer,
  Breadcrumb,
  FloatingBtn,
  ToShopSections,
} from "./Components";

// Lazy-loaded components (large or route-specific)
const ProductPage = lazy(
  () => import("./Components/ProductPage/ProductPage.jsx")
);
const Cart = lazy(() => import("./Components/Cart/Cart.jsx"));
const SearchForProducts = lazy(
  () => import("./Components/SearchForProducts/SearchForProducts.jsx")
);
const Checkout = lazy(() => import("./Components/Checkout/Checkout.jsx"));
const ShopPage = lazy(() => import("./Components/ShopPage/ShopPage.jsx"));
const AdminPanel = lazy(() => import("./Components/AdminPanel/AdminPanel.jsx"));
const Products = lazy(
  () => import("./Components/AdminPanel/Products/Products.jsx")
);
const Home_States = lazy(
  () => import("./Components/AdminPanel/Home_States/Home_States.jsx")
);
const Login = lazy(() => import("./Components/Login/Login.jsx"));
const Register = lazy(() => import("./Components/Register/Register"));
const ThankYouPage = lazy(
  () => import("./Components/Checkout/Thank_you_page/ThankyouPage.jsx")
);
const ProductEditPage = lazy(
  () =>
    import(
      "./Components/AdminPanel/Products/EditProductComponent/EditProduct.jsx"
    )
);
const Orders = lazy(() => import("./Components/AdminPanel/Orders/Orders.jsx"));

// Skeleton loading component (for fallback)
import Skeleton from "react-loading-skeleton";
import AdminProvider from "./Components/AdminPanel/AdminGlobalContext.jsx";

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
    console.log("AppContent mounted");
    resetAllStates();

    return () => {
      toggleCart(false);
      setSearchState(false);
    };
  }, []);

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
      <Suspense fallback={<Skeleton count={5} />}>
        <Cart />
      </Suspense>
    </>
  );
};

const SearchBreadcrumb = () => {
  return (
    <>
      <Breadcrumb pathNameInfo="نتائج البحث" />
      <Suspense fallback={<Skeleton count={5} />}>
        <SearchForProducts />
      </Suspense>
    </>
  );
};

const CheckoutBreadcrumb = () => {
  return (
    <>
      <Breadcrumb pathNameInfo="تأكيد الطلب وإتمام الشراء" />
      <Suspense fallback={<Skeleton count={5} />}>
        <Checkout />
      </Suspense>
    </>
  );
};

const ShopPageBreadcrumb = () => {
  return (
    <>
      <Breadcrumb pathNameInfo="جميع المنتجات" />
      <Suspense fallback={<Skeleton count={5} />}>
        <ShopPage />
      </Suspense>
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
      <Suspense fallback={<div>Loading Admin Panel...</div>}>
        <AdminPanel />
      </Suspense>
    </AdminProvider>
  );
};

function App() {
  const { adminStatus} = useGlobalContext();

  return (
    <BrowserRouter>
      <GlobalProvider>
        <div className="app-container">
          <HandleNavbar />
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route
              path="/login"
              element={
                <Suspense fallback={<div>Loading Login...</div>}>
                  <Login />
                </Suspense>
              }
            />

            <Route path="/cart" element={<CartBreadcrumb />} />

            <Route
              path="/product/:id"
              element={
                <Suspense fallback={<Skeleton count={5} />}>
                  <ProductPage />
                </Suspense>
              }
            />

            <Route path="/search" element={<SearchBreadcrumb />} />
            <Route path="/checkout" element={<CheckoutBreadcrumb />} />
            <Route path="/shop" element={<ShopPageBreadcrumb />} />

            <Route
              path="/thank-you"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ThankYouPage />
                </Suspense>
              }
            />

            {adminStatus && (
              <Route path="/admin" element={<AdminPanel_GlobalContext />}>
                <Route
                  path="products"
                  element={
                    <Suspense fallback={<div>Loading Products...</div>}>
                      <Products />
                    </Suspense>
                  }
                />
                <Route
                  path="edit-product/:id"
                  element={
                    <Suspense fallback={<div>Loading Editor...</div>}>
                      <ProductEditPage isAddProduct={false} />
                    </Suspense>
                  }
                />
                <Route
                  path=""
                  element={
                    <Suspense fallback={<div>Loading Dashboard...</div>}>
                      <Home_States />
                    </Suspense>
                  }
                />
                <Route
                  path="add-product"
                  element={
                    <Suspense fallback={<div>Loading Editor...</div>}>
                      <ProductEditPage isAddProduct={true} />
                    </Suspense>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <Suspense fallback={<div>Loading Orders...</div>}>
                      <Orders />
                    </Suspense>
                  }
                />
              </Route>
            )}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {!window.location.pathname.startsWith("/admin") && <FloatingBtn />}
          <HandleFooter />
        </div>
      </GlobalProvider>
    </BrowserRouter>
  );
}

export default App;
