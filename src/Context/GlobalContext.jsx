import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  lazy,
  Suspense,
} from "react";
import axios from "axios";
import "alertifyjs/build/css/alertify.rtl.css";
import "alertifyjs/build/css/themes/default.rtl.css";
import "./alertify.custom.css";
import alertify from "alertifyjs";
// استيراد الثيم الافتراضي // استيراد ملف الـ CSS الخاص بـ AlertifyJS
import { CAlert } from "@coreui/react";
import SearchForProducts from "../Components/SearchForProducts/SearchForProducts";
import supabase from "../supabaseClient";




// or via CommonJS

// تحديد URLs و المعلومات الضرورية للـ API

const Supabase_APIURL =
  "https://tbllwzcqhdgztsqybfwg.supabase.co/rest/v1/products";
const supabase_APIKEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibGx3emNxaGRnenRzcXliZndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMDY4NzQsImV4cCI6MjA1NzU4Mjg3NH0.xAfedGGwK7595FJ5rk1tbePdPdOk1W-Wr12e-mLvjIM";

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
  const [adminStatus, setAdminStatus] = useState(false)

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
      const response = await axios.get(Supabase_APIURL, {
        headers: {
          apikey: supabase_APIKEY,
          Authorization: `bearer ${supabase_APIKEY}`,
        },
      });
      setAllProducts(response.data);
      console.log("تم تحميل المنتجات بنجاح:", response.data);
    } catch (error) {
      console.error("خطأ في تحميل المنتجات:", error);
    }
  };

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

  const resetall_OrderSubmited = () => {
    setProductsInCart([])
    setProductsInCart_TotalPrice(0)
    localStorage.setItem("ProductsInCart2", [])
  }

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
  const addProductToCart = async (product, quantity = 1) => {
    try {
      const productId = parseInt(product.id);
      const existingProductIndex = productsInCart.findIndex(
        (item) => parseInt(item.id) === productId
      );

      let updatedCart = [...productsInCart];

      if (existingProductIndex !== -1) {
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: updatedCart[existingProductIndex].quantity + quantity,
        };
      } else {
        updatedCart.push({
          ...product,
          id: productId,
          quantity: quantity,
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
    const totalPrice = productsInCart.length ? (
      productsInCart.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0)
    ) : 0
    setProductsInCart_TotalPrice(totalPrice);
  };

  const alertifyPopUp_Confirm = useCallback((id, set_Function, updatedData) => {
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
        transition: "pulse",
        movable: false,
        closableByDimmer: false,
        defaultFocusOn: "cancel",
        padding: 10,
        closable: false,
        rtl: true,
        
        pinnable: false,
        theme: {
          input: "alertify-input",
          ok: "alertify-ok-button",
          cancel: "alertify-cancel-button",
        },
      });
  }, []);

  

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
    const productId = parseInt(product.id);
    const productPage_API = `${Supabase_APIURL}?id=eq.${productId}`;

    try {
      const response = await axios.get(productPage_API, {
        headers: {
          apikey: supabase_APIKEY,
          Authorization: `bearer ${supabase_APIKEY}`,
        },
      });

      const productData = response.data;
      console.log("PRODUCTDATA :", productData);

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
        adminStatus,
        setAdminStatus,
        supabase_APIKEY,
        Supabase_APIURL,
        resetall_OrderSubmited
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
