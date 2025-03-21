import { lazy } from "react";

export { default as Navbar } from "./Navbar/Navbar";
export { default as HeroImage } from "./HeroImage/HeroImg";
export { default as SectionTitle } from "./SectionTitle/SectionTitle";
export { default as SideBarWidget } from "./SideBarWidget/SideBarWidget";
export { default as ProductLayout } from "./ProductLayout/ProductLayout";
export { default as ProductCard2 } from "./ProductLayout/productCard_2/ProductCard2";
export { default as WhyUsSection } from "./WhyUsSection/WhyUs_Section";
export { default as Footer } from "./footer/Footer";
const ProductPage = lazy(() => import("./productPage/ProductPage"));
export { ProductPage };

export { default as Cart } from "./Cart/Cart";
export { default as SearchForProducts } from "./SearchForProducts/SearchForProducts";
export { default as Checkout } from "./Checkout/Checkout";
export { default as Breadcrumb } from "./Breadcrumb/Breadcrumb";
export { default as ShopPage } from "./ShopPage/ShopPage";
export { default as FloatingBtn } from "./GoToShop_Buttons/FloatingBtn";
export { default as ToShopSections } from "./GoToShop_Buttons/ToShopSection";
export {default as AdminPanel} from "./AdminPanel/AdminPanel"
