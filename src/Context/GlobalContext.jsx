import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// تحديد URL واحد للـ API
const API_BASE_URL = "https://api.jsonbin.io/v3/b/67c54486e41b4d34e49fc194";
const API_BASE_URL_Cart = "http://localhost:3000"
const DATA_PATH_API = "data.record.Products"
const Master_Key = "$2a$10$JSduiJIAxlAAiB5UQSJ9n.rCUN94IKEeZ8QwNDmKsxfCuURp/m3Xe"

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [productsInCart, setProductsInCart] = useState([]);
  const [productsInCart_TotalPrice, setProductsInCart_TotalPrice] = useState(0);
  const [addData_ToCart_State, setAddData_ToCart_State] = useState(false);
  const [cartSideBarToggle, setCartSideBarToggle] = useState(false);

  // جلب بيانات المنتجات عند بدء التطبيق
  useEffect(() => {
    fetchProducts();
    fetchCartProducts();
  }, []);

  // تحديث إجمالي السعر عندما تتغير المنتجات في السلة
  useEffect(() => {
    calculateTotalPrice();
  }, [productsInCart]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers : {
          "X-Master-Key" : Master_Key
        }
      });
      setAllProducts(response.DATA_PATH_API);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCartProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL_Cart}/CartProducts`);
      setProductsInCart(response.data);
    } catch (err) {
      console.error("Cart Products Error:", err);
    }
  };

  const calculateTotalPrice = () => {
    const totalPrice = productsInCart.reduce((acc, product) => {
      return acc + (product.price * product.quantity);
    }, 0);

    setProductsInCart_TotalPrice(totalPrice);
  };

  const addProductToCart = async (product) => {
    try {
      const existingProduct = productsInCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        const updatedProduct = {
          ...existingProduct,
          quantity: existingProduct.quantity + 1,
        };

        await axios.put(`${API_BASE_URL_Cart}/CartProducts/${product.id}`, updatedProduct);
      } else {
        await axios.post(`${API_BASE_URL_Cart}/CartProducts`, product);
      }
      
      fetchCartProducts();
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const removeProductFromCart = async (productId) => {
    try {
      await axios.delete(`${API_BASE_URL_Cart}/CartProducts/${productId}`);
      fetchCartProducts();
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const toggleCart = (val) => {
    setCartSideBarToggle(val);
  };

  const refreshCart = () => {
    fetchCartProducts();
    setAddData_ToCart_State(prev => !prev);
  };

  const NavigateToProduct = (product) => {
    window.location = `/${product.id}`
  }

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
        cartSideBarToggle,
        toggleCart,
        NavigateToProduct,
        // !!! ----- API VARIABLES -------- !!! //
        DATA_PATH_API,
        Master_Key
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};