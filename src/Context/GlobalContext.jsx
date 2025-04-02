import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import "alertifyjs/build/css/alertify.rtl.css";
import "alertifyjs/build/css/themes/default.rtl.css";
import "./alertify.custom.css";
import alertify from "alertifyjs";
import supabase from "../supabaseClient";

// import the supabase variables
const SUPABASE_API_URL = import.meta.env.VITE_SUPABASE_API_URL;
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

const CART_STORAGE_KEY = "ProductsInCart";
const PRODUCT_PAGE_STORAGE_KEY = "productPage_Product";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // حالات المنتجات
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [productPage_Product, setproductPage_Product] = useState({});

  // حالات السلة
  const [productsInCart, setProductsInCart] = useState([]);
  const [productsInCart_TotalPrice, setProductsInCart_TotalPrice] = useState(0);
  const [addData_ToCart_State, setAddData_ToCart_State] = useState(false);
  const [cartSideBarToggle, setCartSideBarToggle] = useState(false);

  // حالات البحث
  const [searchState, setSearchState] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // حالات واجهة المستخدم
  const [isFav, setIsFav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminStatus, setAdminStatus] = useState(false);
  const [submittedOrder, setsubmittedOrder] = useState({});
  const [allOrders, setAllOrders] = useState([]);

  // جلب بيانات المنتجات من Supabase
  const fetchProducts = useCallback(async () => {
    if (allProducts.length === 0) {
      try {
        const response = await axios.get(SUPABASE_API_URL, {
          headers: {
            apikey: SUPABASE_API_KEY,
            Authorization: `bearer ${SUPABASE_API_KEY}`,
          },
        });
        console.log("PRODUCT DATA TO SEE IMAGES", response.data);
        setAllProducts(response.data);
        console.log("تم تحميل المنتجات بنجاح:", response.data);
      } catch (error) {
        console.error("خطأ في تحميل المنتجات:", error);
      }
    }
  }, [allProducts.length]);

  // تحميل بيانات السلة من التخزين المحلي
  const loadCartFromLocalStorage = useCallback(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
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
  }, []);

  // حفظ بيانات السلة في التخزين المحلي
  const saveCartToLocalStorage = useCallback(() => {
    try {
      if (productsInCart.length > 0) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(productsInCart));
        console.log("Cart saved to localStorage:", productsInCart);
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [productsInCart]);

  // تهيئة التطبيق عند التحميل
  useEffect(() => {
    console.log("GlobalProvider mounted");
    try {
      fetchProducts();
      loadCartFromLocalStorage();
      setCartSideBarToggle(false);
    } catch (error) {
      console.error("Error in GlobalProvider initialization:", error);
    }
  }, [fetchProducts, loadCartFromLocalStorage]);

  // تحديث إجمالي السعر وحفظ السلة عند تغيير المنتجات
  useEffect(() => {
    if (productsInCart.length > 0) {
      calculateTotalPrice();
      saveCartToLocalStorage();
    } else {
      setProductsInCart_TotalPrice(0);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [productsInCart, saveCartToLocalStorage]);

  // إعادة تعيين جميع الحالات - للتنقل بين المكونات
  const resetAllStates = useCallback(() => {
    toggleCart(false);
    setSearchState(false);
    setMobileMenuOpen(false);
  }, []);

  // إعادة تعيين السلة بعد إرسال الطلب
  const resetall_OrderSubmited = useCallback(() => {
    setProductsInCart([]);
    setProductsInCart_TotalPrice(0);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  // إضافة منتج إلى السلة
  const addProductToCart = useCallback(
    async (product, quantity = 1) => {
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

        setProductsInCart(updatedCart);
        return true;
      } catch (error) {
        console.error("Error adding product to cart:", error);
        return false;
      }
    },
    [productsInCart]
  );

  // حساب إجمالي سعر المنتجات في السلة
  const calculateTotalPrice = useCallback(() => {
    const totalPrice = productsInCart.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    setProductsInCart_TotalPrice(totalPrice);
  }, [productsInCart]);

  // تأكيد حذف منتج باستخدام alertify
  const alertifyPopUp_Confirm = useCallback((id, set_Function, updatedData) => {
    alertify
      .confirm(
        "تأكيد الحذف",
        "هل تريد حذف هذا المنتج من السلة؟",
        function () {
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
  const removeProductFromCart = useCallback(
    async (productId) => {
      try {
        const id = parseInt(productId);
        const updatedCart = productsInCart.filter(
          (item) => parseInt(item.id) !== id
        );

        alertifyPopUp_Confirm(id, setProductsInCart, updatedCart);
        return true;
      } catch (error) {
        console.error(`خطأ في إزالة المنتج، المعرف ${productId}:`, error);
        return false;
      }
    },
    [productsInCart, alertifyPopUp_Confirm]
  );

  // تحديث كمية منتج في السلة
  const updateProductQuantity = useCallback(
    (productId, newQuantity) => {
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
    },
    [productsInCart]
  );

  // التبديل بين عرض وإخفاء السلة
  const toggleCart = useCallback((val) => {
    setCartSideBarToggle(val);
  }, []);

  // تحديث السلة
  const refreshCart = useCallback(() => {
    saveCartToLocalStorage();
    setAddData_ToCart_State((prev) => !prev);
  }, [saveCartToLocalStorage]);

  // الانتقال إلى صفحة المنتج
  const NavigateToProduct = useCallback(async (product) => {
    const productId = parseInt(product.id);
    const productPage_API = `${SUPABASE_API_URL}?id=eq.${productId}`;

    try {
      const response = await axios.get(productPage_API, {
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `bearer ${SUPABASE_API_KEY}`,
        },
      });

      const productData = response.data;
      if (productData && productData.length > 0) {
        setproductPage_Product(productData[0]);
        localStorage.setItem(
          PRODUCT_PAGE_STORAGE_KEY,
          JSON.stringify(productData[0])
        );
        console.log("تم تحميل بيانات المنتج بنجاح:", productData[0]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("خطأ في تحميل بيانات المنتج:", error);
      return false;
    }
  }, []);

  // الحصول على المنتجات بناءً على رقم المسؤول
  const ProductsByNumber = useCallback(
    (Num = allProducts.length) => {
      const limitedProducts =
        Num < 8 && allProducts.length > 0 ?
          allProducts.slice(0, Num)
        : allProducts;
      setDisplayedProducts(limitedProducts);
      return limitedProducts;
    },
    [allProducts]
  );

  const getAllOrders_checkoutPageUse = useCallback(async () => {
    const { data, error } = await supabase.from("orders").select("user_id");

    if (data && data.length > 0) {
      setAllOrders(data);
    }
  }, []);

  // القيم المصدرة للسياق
  const contextValue = useMemo(
    () => ({
      // حالات المنتجات
      allProducts,
      setAllProducts,
      displayedProducts,
      setDisplayedProducts,
      productPage_Product,
      setproductPage_Product,

      // حالات السلة
      productsInCart,
      setProductsInCart,
      productsInCart_TotalPrice,
      setProductsInCart_TotalPrice,
      addData_ToCart_State,
      setAddData_ToCart_State,
      cartSideBarToggle,

      // وظائف السلة
      addProductToCart,
      removeProductFromCart,
      updateProductQuantity,
      toggleCart,
      refreshCart,
      resetall_OrderSubmited,

      // وظائف التنقل
      NavigateToProduct,
      ProductsByNumber,

      // حالات البحث
      searchState,
      setSearchState,
      searchQuery,
      setSearchQuery,
      searchResults,
      setSearchResults,

      // حالات واجهة المستخدم
      isMobile,
      setIsMobile,
      mobileMenuOpen,
      setMobileMenuOpen,
      resetAllStates,

      // حالات المسؤول
      adminStatus,
      setAdminStatus,

      // thank you page states neededs
      submittedOrder,
      setsubmittedOrder,
      getAllOrders_checkoutPageUse,
      allOrders,
      setAllOrders,

      // ثوابت API
      supabase_APIKEY: SUPABASE_API_KEY,
      Supabase_APIURL: SUPABASE_API_URL,
    }),
    [
      allProducts,
      displayedProducts,
      productPage_Product,
      productsInCart,
      productsInCart_TotalPrice,
      addData_ToCart_State,
      cartSideBarToggle,
      searchState,
      searchQuery,
      searchResults,
      isMobile,
      mobileMenuOpen,
      adminStatus,
      submittedOrder,
      allOrders,
      addProductToCart,
      removeProductFromCart,
      updateProductQuantity,
      toggleCart,
      refreshCart,
      resetall_OrderSubmited,
      NavigateToProduct,
      ProductsByNumber,
      resetAllStates,
      getAllOrders_checkoutPageUse,
    ]
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
