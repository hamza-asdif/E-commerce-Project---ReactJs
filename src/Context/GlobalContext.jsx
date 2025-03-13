import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import "alertifyjs/build/css/alertify.rtl.css";
import "alertifyjs/build/css/themes/default.rtl.css";
import "./alertify.custom.css";
import alertify from "alertifyjs";
// استيراد الثيم الافتراضي // استيراد ملف الـ CSS الخاص بـ AlertifyJS
import { CAlert } from "@coreui/react";
import SearchForProducts from "../Components/SearchForProducts/SearchForProducts";

// تحديد URLs و المعلومات الضرورية للـ API
const JSONBIN_BASE_URL = "https://67c919230acf98d07088c32f.mockapi.io/products"; // رابط ملف المنتجات
const MASTER_KEY =
  "$2a$10$JSduiJIAxlAAiB5UQSJ9n.rCUN94IKEeZ8QwNDmKsxfCuURp/m3Xe";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [productsInCart, setProductsInCart] = useState([]);
  const [productsInCart_TotalPrice, setProductsInCart_TotalPrice] = useState(0);
  const [addData_ToCart_State, setAddData_ToCart_State] = useState(false);
  const [cartSideBarToggle, setCartSideBarToggle] = useState(false);
  const [searchState, setSearchState] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [productPage_Product, setproductPage_Product] = useState({});
  const [isFav, setIsFav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const API_URL = 'http://localhost:1337/api';
  const TOKEN = '20c532f89bb0f0520e494a15fbe8025076035ac07a9b9b555618ae1cbc54ea22c7c3114da16c6f34da7451cdcf14e135e7917770624c8ec1a20b313ecce3899063fdc6f60406a14bf5761788c5788124bf45f981ddad4949642f43615972aebd69a7dfa41eac4937ef2db1d7ffd01875137f5adb3ab33ac4575c5666b2a06442';
  

  useEffect(() => {
    console.log("GlobalProvider mounted");
    try {
      fetchProducts();
      loadCartFromLocalStorage();
    } catch (error) {
      console.error("Error in GlobalProvider:", error);
    }
  }, []);

  // جلب بيانات المنتجات عند بدء التطبيق
  useEffect(() => {
    fetchProducts();
    loadCartFromLocalStorage();
    setCartSideBarToggle(false); // استرجاع بيانات السلة من التخزين المحلي عند بدء التطبيق
  }, []);

  // تحديث إجمالي السعر عندما تتغير المنتجات في السلة
  useEffect(() => {
    calculateTotalPrice();
    saveCartToLocalStorage(); // حفظ بيانات السلة في التخزين المحلي عند أي تغيير
  }, [productsInCart]);

  // جلب بيانات المنتجات من jsonbin.io
  const fetchProducts = async () => {
    try {
      const response = await axios.get(JSONBIN_BASE_URL);
      setAllProducts(response.data);
      console.log("تم تحميل المنتجات بنجاح:", response.data);
    } catch (error) {
      console.error("خطأ في تحميل المنتجات:", error);
    }
  };


  // const fetchProducts = async () => {
  //   try {
  //     const response = await axios.get(`${API_URL}/products`, {
  //       headers: {
  //         Authorization: `Bearer ${TOKEN}`
  //       },
  //       params: {
  //         populate: '*'
  //       }
  //     });
      
  //     const requestData = response.data.data;
  //     console.log("All Products here: ", requestData);
  //     // Log images specifically
  //     requestData.forEach(product => {
  //       console.log("Product images: ", product.Image);
  //     });
      
  //     setAllProducts(requestData);
  //   }
  //   catch (err) {
  //     console.error(err);
  //   }
  // };

  // Fix the loading from localStorage function
  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem("ProductsInCart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setProductsInCart(parsedCart);
          console.log("Cart loaded from localStorage:", parsedCart);
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  };

  // !!!! Function to reset all states ----- navigate between components
  const resetAllStates = () => {
    toggleCart(false);
    setSearchState(false);
    setMobileMenuOpen(false);
  };

  // Fix the saving to localStorage function
  const saveCartToLocalStorage = () => {
    try {
      if (productsInCart) {
        localStorage.setItem("ProductsInCart", JSON.stringify(productsInCart));
        console.log("Cart saved to localStorage:", productsInCart);
      }
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  };

  // Update the addProductToCart function
  const addProductToCart = async (product) => {
    try {
      const productId = parseInt(product.id);
      const existingProductIndex = productsInCart.findIndex(
        (item) => parseInt(item.id) === productId
      );

      let updatedCart = [...productsInCart];

      if (existingProductIndex !== -1) {
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: updatedCart[existingProductIndex].quantity + 1,
        };
      } else {
        updatedCart.push({
          ...product,
          id: productId,
          quantity: 1,
        });
      }

      // Update state first
      setProductsInCart(updatedCart);

      // Then save to localStorage
      localStorage.setItem("ProductsInCart", JSON.stringify(updatedCart));
      return true;
    } catch (error) {
      console.error("Error adding product to cart:", error);
      return false;
    }
  };

  // حساب إجمالي سعر المنتجات في السلة
  const calculateTotalPrice = () => {
    const totalPrice = productsInCart.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);
    setProductsInCart_TotalPrice(totalPrice);
  };

  const alertifyPopUp_Confirm = (id, set_Function, updatedData) => {
    alertify
      .confirm(
        "تأكيد الحذف",
        "هل تريد حذف هذا المنتج من السلة؟",
        function () {
          // استدعاء الدالة مباشرة مع البيانات المحدثة
          set_Function(updatedData);
          alertify.success("تم حذف المنتج بنجاح ✅");
          console.log("تمت إزالة المنتج من السلة، المعرف:", id);
        },
        function () {
          alertify.error("تم إلغاء العملية");
        }
      )
      .set({
        labels: {
          ok: "حذف",
          cancel: "إلغاء",
        },
        transition: "slide",
        movable: false,
        closableByDimmer: false,
        defaultFocusOn: "cancel",
        padding: 10,
        closable: false,
        rtl: true,
        delay: 200,
        pinnable: false,
        theme: {
          input: "alertify-input",
          ok: "alertify-ok-button",
          cancel: "alertify-cancel-button",
        },
      });
  };

  // إزالة منتج من السلة
  const removeProductFromCart = async (productId) => {
    try {
      // تحويل المعرف إلى رقم
      const id = parseInt(productId);

      // إنشاء نسخة جديدة من السلة بدون المنتج المحدد
      const updatedCart = productsInCart.filter(
        (item) => parseInt(item.id) !== id
      );

      console.log(updatedCart.length);

      alertifyPopUp_Confirm(id, setProductsInCart, updatedCart);

      return true;
    } catch (error) {
      console.error(`خطأ في إزالة المنتج، المعرف ${productId}:`, error);
      return false;
    }
  };

  // تحديث كمية منتج في السلة
  const updateProductQuantity = (productId, newQuantity) => {
    try {
      const id = parseInt(productId);
      const updatedCart = productsInCart.map((item) => {
        if (parseInt(item.id) === id) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      setProductsInCart(updatedCart);
      console.log(`تم تحديث كمية المنتج (${id}) إلى ${newQuantity}`);

      return true;
    } catch (error) {
      console.error(`خطأ في تحديث كمية المنتج (${productId}):`, error);
      return false;
    }
  };

  // التبديل بين عرض وإخفاء السلة
  const toggleCart = (val) => {
    setCartSideBarToggle(val);
  };

  const refreshCart = () => {
    // التأكد من حفظ البيانات الحالية
    saveCartToLocalStorage();
    // ثم تحديث الحالة
    setAddData_ToCart_State((prev) => !prev);
  };

  // الانتقال إلى صفحة المنتج

  const NavigateToProduct = async (product) => {
    // تعريف المتغيرات الأساسية

    const BIN_ID = "67c54486e41b4d34e49fc194";
    const ACCESS_KEY =
      "$2a$10$lHC6.TYTGJdHEzvNt8D6DOCWIDRJHjfUUWMBzLBRfhQGlEBEIK6oa";
    const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
    const productId = parseInt(product.id);

    try {
      const response = await axios.get(API_URL, {
        headers: {
          "X-Access-Key": ACCESS_KEY,
        },
      });

      const productData = await response.data.record.Products.find(
        (product) => product.id === productId
      );
      if (productData) {
        setproductPage_Product(productData);
        localStorage.setItem(
          "productPage_Product",
          JSON.stringify(productData)
        );
        console.log(true, "here's the product", productData);
      }
    } catch (error) {
      console.error("Error fetching product data", error);
    }
  };

  // Get Products Based on the Admin Number
  const ProductsByNumber = (Num = allProducts.length) => {
    if (Num < 8) {
      let allData = allProducts;

      allData = allData.splice(0, Num);
      setAllProducts(allData);
    } else {
      allProducts.length ? (Num = allProducts.length) : null;
    }
  };


  return (
    <GlobalContext.Provider
      value={{
        allProducts,
        setAllProducts,
        productsInCart,
        setProductsInCart,
        productsInCart_TotalPrice,
        setProductsInCart_TotalPrice,
        refreshCart,
        addData_ToCart_State,
        setAddData_ToCart_State,
        addProductToCart,
        removeProductFromCart,
        updateProductQuantity,
        cartSideBarToggle,
        toggleCart,
        NavigateToProduct,
        // الثوابت
        MASTER_KEY,
        ProductsByNumber,
        displayedProducts,
        setDisplayedProducts,
        productPage_Product,
        setproductPage_Product,
        setSearchResults,
        searchResults,
        searchQuery,
        setSearchQuery,
        searchState,
        setSearchState,
        isMobile,
        setIsMobile,
        mobileMenuOpen,
        setMobileMenuOpen,
        resetAllStates,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
