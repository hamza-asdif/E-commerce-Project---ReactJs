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
import axios from "axios";
import Cart from "./Components/Cart/Cart.jsx";
import { CAlert } from "@coreui/react";
import SearchForProducts from "./Components/SearchForProducts/SearchForProducts.jsx";

function AppContent() {
  const { cartSideBarToggle, toggleCart, setSearchState } = useGlobalContext();

  useEffect(() => {
    return () => {
      toggleCart(false);
      setSearchState(false);
    };
  }, []);

  // للحصول على منتج محدد عن طريق ID
  useEffect(() => {
    const productId = 2; // المنتج المطلوب

    axios
      .get("https://api.jsonbin.io/v3/b/67c54486e41b4d34e49fc194", {
        headers: {
          "X-Access-Key":
            "$2a$10$lHC6.TYTGJdHEzvNt8D6DOCWIDRJHjfUUWMBzLBRfhQGlEBEIK6oa",
        },
      })
      .then((res) => {
        const product = res.data.record.Products.find(
          (p) => p.id === productId
        );
        console.log(product);
      })
      .catch((err) => console.log(err));
  }, []);

// استرجاع جميع المنتجات


// استيراد مكتبة axios
// Note: axios is already imported at the top of the file

// الدالة لحذف منتج بناءً على معرّفه (ID)
function deleteProduct(productId) {
  axios.delete(`http://localhost:1337/api/products/${productId}`, {
    headers: {
      Authorization: '3fdf80a577dbcff1752df84b751f394ef5fb11d33a68f08ce3f25b8acb118fd6bc668f1ec6724d2b8bcacb5ab7b310a2aaf3c33873f70dc4c007b0014411eea39b1219488fc3b48807b8c8f4c4ac3bb28ff1eaddae943e3e5335dacd9872813f0b67277e16e31576b2728ad010e01f27632bdf9303fc3998a81d676e51975ad9', // استخدم التوكن الخاص بك هنا
    }
  })
  .then(response => {
    console.log(`تم حذف المنتج بنجاح!`);
  })
  .catch(error => {
    console.error('حدث خطأ أثناء حذف المنتج:', error);
  });
}

// استدعاء الدالة لحذف منتج
deleteProduct(14);  // استبدل "14" بمعرف المنتج الذي تريد حذفه



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
    <BrowserRouter basename="/shopping-cart-react">
      <GlobalProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="cart" element={<Cart />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="/search" element={<SearchForProducts />} />
        </Routes>
        <Footer />
      </GlobalProvider>
    </BrowserRouter>
  );
}

export default App;
