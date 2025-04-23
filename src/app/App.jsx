import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import "../styles/App.css";
import { useGlobalContext } from "../hooks/GlobalContextHooks";
import { GlobalProvider } from "../Context/GlobalContext";

// Components
import ErrorBoundary from "../shared/layout/ErrorBoundary";
import LoadingFallback from "../shared/layout/LoadingFallback";
import AdminProvider from "../pages/AdminPanel/AdminGlobalContext";
import AdminLayout from "../shared/layout/AdminLayout";
import {
  Navbar,
  Footer,
  FloatingBtn,
  Breadcrumb,
  HeroImage,
  SectionTitle,
  ProductLayout,
  ToShopSections,
  ProductCard2,
  WhyUsSection,
} from "../Components";

// Lazy-loaded components
const ProductPage = lazy(() => import("../pages/ProductPage/ProductPage"));
const Cart = lazy(() => import("../pages/Cart/Cart"));
const SearchForProducts = lazy(
  () => import("../pages/SearchForProducts/SearchForProducts")
);
const Checkout = lazy(() => import("../pages/Checkout/Checkout"));
const ShopPage = lazy(() => import("../pages/ShopPage/ShopPage"));
const AdminPanel = lazy(() => import("../pages/AdminPanel/AdminPanel"));
const Products = lazy(() => import("../pages/AdminPanel/Products/Products"));
const Home_States = lazy(
  () => import("../pages/AdminPanel/Home_States/Home_States")
);
const Login = lazy(() => import("../pages/Login/Login"));
const ThankYouPage = lazy(
  () => import("../pages/Checkout/Thank_you_page/ThankyouPage")
);
const ProductEditPage = lazy(
  () => import("../pages/AdminPanel/Products/EditProductComponent/EditProduct")
);
const Orders = lazy(() => import("../pages/AdminPanel/Orders/Orders"));
const Favorites = lazy(() => import("../shared/ui/Favorites/Favorites"));

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

const FavoritesBreadcrumb = React.memo(() => (
  <>
    <Breadcrumb pathNameInfo="المنتجات المفضلة" />
    <Suspense fallback={<LoadingFallback />}>
      <Favorites />
    </Suspense>
  </>
));
FavoritesBreadcrumb.displayName = "FavoritesBreadcrumb";

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

const HandleFloatingButton = React.memo(() => {
  const location = useLocation();
  const isAdminPanel = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/login";

  // Don't show floating button on admin panel or login page
  if (isAdminPanel || isLoginPage) return null;

  return <FloatingBtn />;
});
HandleFloatingButton.displayName = "HandleFloatingButton";

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
              <Route path="/favorites" element={<FavoritesBreadcrumb />} />
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
            <HandleFloatingButton />
            <HandleFooter />
          </div>
        </ErrorBoundary>
      </GlobalProvider>
    </BrowserRouter>
  );
}

export default App;
