import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import PropTypes from "prop-types";
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

const contextModule = {
  GlobalContext,
  GlobalProvider: ({ children }) => {
    // حالات المنتجات
    const [allProducts, setAllProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [productPage_Product, setproductPage_Product] = useState({});
    const [favoriteProducts, setFavoriteProducts] = useState([]);

    // حالات السلة
    const [productsInCart, setProductsInCart] = useState([]);
    const [productsInCart_TotalPrice, setProductsInCart_TotalPrice] =
      useState(0);
    const [addData_ToCart_State, setAddData_ToCart_State] = useState(false);
    const [cartSideBarToggle, setCartSideBarToggle] = useState(false);

    // حالات البحث
    const [searchState, setSearchState] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // حالات واجهة المستخدم
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [adminStatus, setAdminStatus] = useState(true);
    const [submittedOrder, setsubmittedOrder] = useState({});
    const [allOrders, setAllOrders] = useState([]);

    // حساب إجمالي سعر المنتجات في السلة
    const calculateTotalPrice = useCallback(() => {
      const totalPrice = productsInCart.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );
      setProductsInCart_TotalPrice(totalPrice);
    }, [productsInCart]);

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
          setAllProducts(response.data);
        } catch (error) {
          console.error("Error loading products");
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
          }
        }
      } catch (error) {
        console.error("Error loading cart from localStorage");
      }
    }, []);

    // حفظ بيانات السلة في التخزين المحلي
    const saveCartToLocalStorage = useCallback(() => {
      try {
        if (productsInCart.length > 0) {
          localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(productsInCart)
          );
        } else {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      } catch (error) {
        console.error("Error saving cart to localStorage");
      }
    }, [productsInCart]);

    // تحميل المفضلة من التخزين المحلي
    const loadFavoritesFromStorage = useCallback(() => {
      const savedFavorites = localStorage.getItem("Fav_Products");
      if (savedFavorites) {
        try {
          const parsedFavorites = JSON.parse(savedFavorites);
          // Just store the IDs initially
          return parsedFavorites
            .filter((fav) => fav.isFav)
            .map((fav) => fav.id);
        } catch (error) {
          console.error("Error loading favorites:", error);
          return [];
        }
      }
      return [];
    }, []);

    // Initialize favorites immediately
    useEffect(() => {
      const favoriteIds = loadFavoritesFromStorage();
      // When allProducts loads, match the IDs with full product data
      if (allProducts.length > 0) {
        const favoriteItems = allProducts.filter((product) =>
          favoriteIds.includes(product.id)
        );
        setFavoriteProducts(favoriteItems);
      }
    }, [loadFavoritesFromStorage, allProducts]);

    // تهيئة التطبيق عند التحميل
    useEffect(() => {
      try {
        fetchProducts();
        loadCartFromLocalStorage();
        setCartSideBarToggle(false);
      } catch (error) {
        console.error("Error in initialization");
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
    }, [productsInCart, saveCartToLocalStorage, calculateTotalPrice]);

    // التبديل بين عرض وإخفاء السلة
    const toggleCart = useCallback((val) => {
      setCartSideBarToggle(val);
    }, []);

    // إعادة تعيين جميع الحالات - للتنقل بين المكونات
    const resetAllStates = useCallback(() => {
      toggleCart(false);
      setSearchState(false);
      setMobileMenuOpen(false);
    }, [toggleCart]);

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
            // المنتج موجود بالفعل، تحديث الكمية
            const newQuantity =
              updatedCart[existingProductIndex].quantity + quantity;
            updatedCart[existingProductIndex] = {
              ...updatedCart[existingProductIndex],
              quantity: newQuantity,
            };
            alertify.success(`تم زيادة الكمية إلى ${newQuantity}`);
          } else {
            // إضافة منتج جديد
            updatedCart.push({
              ...product,
              id: productId,
              quantity: quantity,
            });
            alertify.success("تم إضافة المنتج إلى السلة بنجاح");
          }

          setProductsInCart(updatedCart);
          return true;
        } catch (error) {
          console.error("Error adding product to cart:", error);
          alertify.error("حدث خطأ في إضافة المنتج إلى السلة");
          return false;
        }
      },
      [productsInCart]
    );

    // إزالة منتج من السلة
    const removeProductFromCart = useCallback(
      async (productId) => {
        try {
          const id = parseInt(productId);
          const updatedCart = productsInCart.filter(
            (item) => parseInt(item.id) !== id
          );

          return new Promise((resolve) => {
            alertify
              .confirm(
                "تأكيد الحذف",
                "هل تريد حذف هذا المنتج من السلة؟",
                function () {
                  setProductsInCart(updatedCart);
                  alertify.success("تم حذف المنتج بنجاح ✅");
                  resolve(true);
                },
                function () {
                  alertify.error("تم إلغاء العملية");
                  resolve(false);
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
              });
          });
        } catch (error) {
          alertify.error("حدث خطأ في حذف المنتج");
          return false;
        }
      },
      [productsInCart]
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
          return true;
        } catch (error) {
          console.error("Error updating product quantity");
          return false;
        }
      },
      [productsInCart]
    );

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
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error loading product data");
        return false;
      }
    }, []);

    // الحصول على المنتجات بناءً على رقم المسؤول
    const ProductsByNumber = useCallback(
      (Num = allProducts.length) => {
        const limitedProducts =
          Num < 8 && allProducts.length > 0
            ? allProducts.slice(0, Num)
            : allProducts;
        setDisplayedProducts(limitedProducts);
        return limitedProducts;
      },
      [allProducts]
    );

    const getAllOrders_checkoutPageUse = useCallback(async () => {
      const { data } = await supabase.from("orders").select("user_id");

      if (data && data.length > 0) {
        setAllOrders(data);
      }
    }, []);

    // تبديل حالة المفضلة للمنتج
    const toggleFavorite = useCallback(
      async (product) => {
        try {
          const productId = parseInt(product.id);
          const isCurrentlyFavorite = favoriteProducts.some(
            (fav) => parseInt(fav.id) === productId
          );

          let updatedFavorites;
          if (isCurrentlyFavorite) {
            updatedFavorites = favoriteProducts.filter(
              (fav) => parseInt(fav.id) !== productId
            );
            alertify.success("تم إزالة المنتج من المفضلة");
          } else {
            const productToAdd =
              allProducts.find((p) => parseInt(p.id) === productId) || product;
            updatedFavorites = [...favoriteProducts, productToAdd];
            alertify.success("تم إضافة المنتج إلى المفضلة");
          }

          setFavoriteProducts(updatedFavorites);

          // تحديث التخزين المحلي
          const storageData = updatedFavorites.map((item) => ({
            id: parseInt(item.id),
            isFav: true,
          }));
          localStorage.setItem("Fav_Products", JSON.stringify(storageData));

          return true;
        } catch (error) {
          console.error("Error toggling favorite:", error);
          alertify.error("حدث خطأ في تحديث المفضلة");
          return false;
        }
      },
      [favoriteProducts, allProducts]
    );

    // التحقق مما إذا كان المنتج في المفضلة
    const checkIfFavorite = useCallback(
      (productId) => {
        return favoriteProducts.some(
          (product) => parseInt(product.id) === parseInt(productId)
        );
      },
      [favoriteProducts]
    );

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
        favoriteProducts,
        setFavoriteProducts,

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

        // وظائف المفضلة
        toggleFavorite,
        checkIfFavorite,

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
        favoriteProducts,
        toggleFavorite,
        checkIfFavorite,
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
  },
};

contextModule.GlobalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const { GlobalContext: GlobalContextExport, GlobalProvider } =
  contextModule;
export { useGlobalContext } from "./GlobalContextHooks";
