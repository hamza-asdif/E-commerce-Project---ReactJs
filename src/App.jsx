import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { GlobalProvider, useGlobalContext } from "./Context/GlobalContext.jsx";

// Static imports (small components used immediately)
import {
  Navbar,
  HeroImage,
  SectionTitle,
  ProductLayout,
  ProductCard2,
  WhyUsSection,
  Footer,
  Breadcrumb,
  FloatingBtn,
  ToShopSections,
} from "./Components";

// Components
import ErrorBoundary from "./Components/ErrorBoundary";
import LoadingFallback from "./Components/LoadingFallback";
import AdminProvider from "./Components/AdminPanel/AdminGlobalContext.jsx";
import AdminLayout from "./Components/AdminLayout.jsx";

// Lazy-loaded components
const ProductPage = lazy(
  () => import("./Components/productPage/ProductPage.jsx")
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

const AppContent = React.memo(() => {
  const { toggleCart, setSearchState, resetAllStates } = useGlobalContext();

  useEffect(() => {
    resetAllStates();
    return () => {
      toggleCart(false);
      setSearchState(false);
    };
  }, [resetAllStates, toggleCart, setSearchState]);

  if (!toggleCart || !setSearchState) {
    return <LoadingFallback />;
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
});
AppContent.displayName = "AppContent";

const CartBreadcrumb = React.memo(() => (
  <>
    <Breadcrumb pathNameInfo="سلة التسوق" />
    <Suspense fallback={<LoadingFallback />}>
      <Cart />
    </Suspense>
  </>
));
CartBreadcrumb.displayName = "CartBreadcrumb";

const SearchBreadcrumb = React.memo(() => (
  <>
    <Breadcrumb pathNameInfo="نتائج البحث" />
    <Suspense fallback={<LoadingFallback />}>
      <SearchForProducts />
    </Suspense>
  </>
));
SearchBreadcrumb.displayName = "SearchBreadcrumb";

const CheckoutBreadcrumb = React.memo(() => (
  <>
    <Breadcrumb pathNameInfo="تأكيد الطلب وإتمام الشراء" />
    <Suspense fallback={<LoadingFallback />}>
      <Checkout />
    </Suspense>
  </>
));
CheckoutBreadcrumb.displayName = "CheckoutBreadcrumb";

const ShopPageBreadcrumb = React.memo(() => (
  <>
    <Breadcrumb pathNameInfo="جميع المنتجات" />
    <Suspense fallback={<LoadingFallback />}>
      <ShopPage />
    </Suspense>
  </>
));
ShopPageBreadcrumb.displayName = "ShopPageBreadcrumb";

const HandleNavbar = React.memo(() => {
  const location = useLocation();
  const isAdminPanel = location.pathname.startsWith("/admin");
  return !isAdminPanel && <Navbar />;
});
HandleNavbar.displayName = "HandleNavbar";

const HandleFooter = React.memo(() => {
  const location = useLocation();
  const isAdminPanel = location.pathname.startsWith("/admin");
  return !isAdminPanel && <Footer />;
});
HandleFooter.displayName = "HandleFooter";

const AdminPanel_GlobalContext = React.memo(() => (
  <AdminProvider>
    <Suspense fallback={<LoadingFallback />}>
      <AdminPanel />
    </Suspense>
  </AdminProvider>
));
AdminPanel_GlobalContext.displayName = "AdminPanel_GlobalContext";

function App() {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <ErrorBoundary>
          <div className="app-container">
            <HandleNavbar />
            <Routes>
              <Route path="/" element={<AppContent />} />
              <Route
                path="/login"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Login />
                  </Suspense>
                }
              />

              <Route path="/cart" element={<CartBreadcrumb />} />
              <Route
                path="/product/:id"
                element={
                  <Suspense fallback={<LoadingFallback />}>
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
                  <Suspense fallback={<LoadingFallback />}>
                    <ThankYouPage />
                  </Suspense>
                }
              />

              {/* Protected Admin Routes */}
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminPanel_GlobalContext />}>
                  <Route
                    path=""
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Home_States />
                      </Suspense>
                    }
                  />
                  <Route
                    path="products"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Products />
                      </Suspense>
                    }
                  />
                  <Route
                    path="edit-product/:id"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <ProductEditPage isAddProduct={false} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="add-product"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <ProductEditPage isAddProduct={true} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="orders"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Orders />
                      </Suspense>
                    }
                  />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            {!window.location.pathname.startsWith("/admin") && <FloatingBtn />}
            <HandleFooter />
          </div>
        </ErrorBoundary>
      </GlobalProvider>
    </BrowserRouter>
  );
}

export default App;
