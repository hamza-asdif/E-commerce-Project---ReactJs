/* eslint-disable react/display-name */
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useGlobalContext } from "../../Context/GlobalContext";
import { FaCartPlus, FaMinus, FaPlus } from "react-icons/fa";
import "./Productpage.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { useForm } from "react-hook-form";
import CheckoutForm from "../Checkout/CheckoutForm/CheckoutForm";
import { createClient } from "@supabase/supabase-js";
import { FaCartArrowDown } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ProductPage() {
  const {
    productPage_Product,
    setproductPage_Product,
    toggleCart,
    setSearchState,
    resetAllStates,
    Supabase_APIURL,
    supabase_APIKEY,
    allProducts,
    updateProductQuantity,
    productsInCart,
    setProductsInCart,
    addProductToCart,
    refreshCart,
  } = useGlobalContext();
  const [productPage_Storage, setProductPage_Storage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noProduct, setNoProduct] = useState(false);
  const { id } = useParams();
  const [randomVisitors, setRandomVisitors] = useState(0);
  const [productPage, setProductPage] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [isExpressCheckoutEnable, setIsExpressCheckoutEnable] = useState(false);
  const [ProductPage_Quantity, setProductPage_Quantity] = useState(1);
  const [btnText, setBtnText] = useState("أضف إلى السلة");
  const [btnLoader, setBtnLoader] = useState(false);
  const [productPage_MainImage, setProductPage_MainImage] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [imageIndex, setImageIndex] = useState(null);
  const mainImageRef = useRef(null);

  useEffect(() => {
    if (productPage) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [productPage]);

  useEffect(() => {
    const data = productPage;
    const thisData = data?.additional_images;

    if (thisData) {
      setProductImages(thisData);
      const test = thisData.map((img) => {
        console.log(img);
        return img;
      });
    }

    console.log(thisData);
  }, [productPage]);

  useEffect(() => {
    handleVisitorsRandom();
    fetchProductPage_Product(id);
  }, []);

  const handleVisitorsRandom = () => {
    const randomDelay = Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000;
    setInterval(() => {
      const randomNumber = Math.floor(Math.random() * (120 - 30 + 1)) + 30;

      setRandomVisitors(randomNumber);
    }, randomDelay);
  };

  const fetchProductPage_Product = async (id) => {
    const productPage_Api = `${Supabase_APIURL}?id=eq.${id}`;
    try {
      console.log("FETCH PRODUCT PAGE ID HERE :", id);
      const response = await axios.get(productPage_Api, {
        headers: {
          apikey: supabase_APIKEY,
          Authorization: `bearer ${supabase_APIKEY}`,
        },
      });

      console.log("FETCH PRODUCT PAGE ID HERE :", response.data);
      setProductPage(response.data[0]);
      await new Promise((resolve) => {
        setProductPage_MainImage(`${response.data[0].Image}`);
        resolve();
      });

      if (response.data[0].isExpressCheckoutEnabled) {
        setIsExpressCheckoutEnable(true);
        return;
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Define a memoized loading component
  const LoadingComponent = React.memo(() => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>جاري تحميل المنتج...</p>
    </div>
  ));

  // Then use it in your conditional
  if (loading) {
    return <LoadingComponent />;
  }

  if (noProduct) {
    return (
      <div className="product-not-found">
        <div className="container-product-page">
          <h2>المنتج غير موجود</h2>
          <p>عذراً، لم يتم العثور على المنتج المطلوب.</p>
        </div>
      </div>
    );
  }

  const handleBtnButton_Loading = async () => {
    setBtnLoader(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setBtnLoader(false);

    addProductToCart(productPage, ProductPage_Quantity);
    toggleCart(true);
    setProductPage_Quantity(1);
  };

  const handleAddToCart = async () => {
    if (ProductPage_Quantity >= 1) {
      const newProductsInCart = productsInCart.map((product) => {
        return product.id === id
          ? { ...product, quantity: product.quantity + ProductPage_Quantity }
          : product;
      });

      setProductsInCart(newProductsInCart);
      handleBtnButton_Loading();
    } else {
      handleBtnButton_Loading();
    }
  };

  return (
    <>
      <Breadcrumb
        pathNameInfo="
المنتجات الأكثر طلبا في المملكة"
      />
      <div className="single-product-page">
        {/* Breadcrumb Navigation */}
        {/* Product Content */}
        <div className="single-product-container">
          <div className="container-product-page">
            <div className="single-product-content">
              {/* Product Gallery */}
              <div className="single-product-gallery">
                <div className="single-product-main-image">
                  {!productPage_MainImage ? (
                    <Skeleton height={"100%"} width={"100%"} />
                  ) : (
                    <img
                      src={`${productPage_MainImage}`}
                      alt={productPage.name}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="single-product-thumbnails">
                  <div
                    ref={mainImageRef}
                    className="single-product-thumbnail"
                    onClick={() => {
                      setProductPage_MainImage(`${productPage.Image}`),
                        setImageIndex(null),
                        mainImageRef.current.classList.add("active");
                    }}
                  >
                    <img
                      src={`${productPage.Image}`}
                      alt={`${productPage.name}`}
                      className="image-thumbnail"
                      loading="lazy"
                    />
                  </div>
                  {productImages.map((image, index) => (
                    <div
                      key={index}
                      className={`single-product-thumbnail ${
                        imageIndex === index
                          ? "active"
                          : index >= 3
                            ? "hidden"
                            : ""
                      }`}
                      onClick={() => {
                        setProductPage_MainImage(image),
                          setImageIndex(index),
                          mainImageRef.current.classList.remove("active");
                      }}
                    >
                      <img
                        src={`${image}`}
                        alt={`${productPage.name} - ${index + 1}`}
                        className={`image-thumbnail ${
                          index >= 4 ? "hidden" : ""
                        }`}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="single-product-details">
                {!productPage.name ? (
                  <Skeleton height="50px" width="100%" />
                ) : (
                  <h1 className="single-product-title">{productPage.name}</h1>
                )}
                <div className="single-product-pricing">
                  <span className="single-product-current-price">
                    {productPage.price} ريال سعودي
                  </span>
                  {productPage.OldPrice && (
                    <span className="single-product-old-price">
                      {productPage.OldPrice} ريال سعودي
                    </span>
                  )}
                </div>

                {/* Order Form */}

                {!loading && isExpressCheckoutEnable ? (
                  <CheckoutForm />
                ) : (
                  <div className="checkout-btn-product-page">
                    <div className="checkout-btn-product-page-quantitySelect">
                      <button
                        className="quantity-btn minus-btn"
                        onClick={() =>
                          ProductPage_Quantity > 1 &&
                          setProductPage_Quantity((val) => val - 1)
                        }
                        disabled={ProductPage_Quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <div className="quantity-number">
                        {" "}
                        {ProductPage_Quantity}{" "}
                      </div>
                      <button
                        className="quantity-btn plus-btn"
                        onClick={() =>
                          ProductPage_Quantity < 10 &&
                          setProductPage_Quantity((val) => val + 1)
                        }
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <div className="checkout-btn-product-page-button">
                      <button className="buy-now-btn" onClick={handleAddToCart}>
                        {btnLoader ? <div className="loader"></div> : btnText}
                        {!btnLoader && (
                          <FaCartArrowDown id="buy-now-btn-icon" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Product Stats */}
                <div className="single-product-stats">
                  <p className="single-product-stats-item">
                    🔥أكثر من 2500 زبون راض عن هذا المنتج🔥
                  </p>
                  <p className="single-product-stats-item">
                    📦 التوصيل مجاني داخل مدينة الرياض ومدن المملكة الكبرى
                  </p>
                  <p className="single-product-stats-item">
                    👁‍🗨 يشاهده{" "}
                    <span className="single-product-highlight">
                      {" "}
                      {randomVisitors}{" "}
                    </span>{" "}
                    زبون في الوقت الحالي
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage;
