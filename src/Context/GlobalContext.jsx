import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// تحديد URLs و المعلومات الضرورية للـ API
const JSONBIN_BASE_URL = "https://api.jsonbin.io/v3/b/67c54486e41b4d34e49fc194"; // رابط ملف المنتجات
const MASTER_KEY = "$2a$10$JSduiJIAxlAAiB5UQSJ9n.rCUN94IKEeZ8QwNDmKsxfCuURp/m3Xe";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [productsInCart, setProductsInCart] = useState([]);
  const [productsInCart_TotalPrice, setProductsInCart_TotalPrice] = useState(0);
  const [addData_ToCart_State, setAddData_ToCart_State] = useState(false);
  const [cartSideBarToggle, setCartSideBarToggle] = useState(false);
  const [isFav, setIsFav] = useState(false)

  // جلب بيانات المنتجات عند بدء التطبيق
  useEffect(() => {
    fetchProducts();
    loadCartFromLocalStorage(); // استرجاع بيانات السلة من التخزين المحلي عند بدء التطبيق
  }, []);

  // تحديث إجمالي السعر عندما تتغير المنتجات في السلة
  useEffect(() => {
    calculateTotalPrice();
    saveCartToLocalStorage(); // حفظ بيانات السلة في التخزين المحلي عند أي تغيير
  }, [productsInCart]);

  // جلب بيانات المنتجات من jsonbin.io
  const fetchProducts = async () => {
    try {
      const response = await axios.get(JSONBIN_BASE_URL, {
        headers: {
          "X-Master-Key": MASTER_KEY
        }
      });
      setAllProducts(response.data.record.Products);
      console.log("تم تحميل المنتجات بنجاح:", response.data.record.Products);
    } catch (error) {
      console.error("خطأ في تحميل المنتجات:", error);
    }
  };

  // تحميل بيانات السلة من التخزين المحلي
  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem("ProductsInCart2")
      if (savedCart) {
        console.log(savedCart)
        setProductsInCart(JSON.parse(savedCart));
        console.log("تم تحميل بيانات السلة من التخزين المحلي");
      }
    } catch (error) {
      console.error("خطأ في تحميل بيانات السلة من التخزين المحلي:", error);
    }
  };

  // حفظ بيانات السلة في التخزين المحلي
  const saveCartToLocalStorage = () => {
    try {
      localStorage.setItem("Products_In_Cart", JSON.stringify(productsInCart));
      console.log("تم حفظ بيانات السلة في التخزين المحلي");
    } catch (error) {
      console.error("خطأ في حفظ بيانات السلة في التخزين المحلي:", error);
    }
  };

  // حساب إجمالي سعر المنتجات في السلة
  const calculateTotalPrice = () => {
    const totalPrice = productsInCart.reduce((acc, product) => {
      return acc + (product.price * product.quantity);
    }, 0);
    setProductsInCart_TotalPrice(totalPrice);
  };

  // في GlobalContext.js
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
        quantity: updatedCart[existingProductIndex].quantity + 1
      };
    } else {
      updatedCart.push({
        ...product,
        id: productId,
        quantity: 1
      });
    }
    
    // تحديث حالة السلة مع حفظها فورًا
    setProductsInCart(updatedCart);
    localStorage.setItem("ProductsInCart2", JSON.stringify(updatedCart));
    
    return true;
  } catch (error) {
    console.error("خطأ في إضافة المنتج إلى السلة:", error);
    return false;
  }
};

  // إزالة منتج من السلة
  const removeProductFromCart = async (productId) => {
    try {
      // تحويل المعرف إلى رقم
      const id = parseInt(productId);
      
      // إنشاء نسخة جديدة من السلة بدون المنتج المحدد
      const updatedCart = productsInCart.filter(item => parseInt(item.id) !== id);
      
      // تحديث حالة السلة
      setProductsInCart(updatedCart);
      console.log("تمت إزالة المنتج من السلة، المعرف:", id);
      
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
      const updatedCart = productsInCart.map(item => {
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
    setAddData_ToCart_State(prev => !prev);
  };


  // الانتقال إلى صفحة المنتج
  const NavigateToProduct = (product) => {
    window.location = `/${product.id}`;
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
        MASTER_KEY
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};