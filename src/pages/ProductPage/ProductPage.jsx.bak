import { useEffect, useRef, useState, useCallback } from "react";
import { useGlobalContext } from "../../Context/GlobalContext";
import { FaMinus, FaPlus, FaCartArrowDown, FaChevronLeft, FaChevronRight, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import CheckoutForm from "../Checkout/CheckoutForm/CheckoutForm";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Productpage.css";
import PropTypes from 'prop-types';

const ProductPageSkeleton = () => (
  <div className="single-product-page">
    <div className="single-product-container">
      <div className="container-product-page">
        <div className="single-product-content">
          {/* Gallery Section */}
          <div className="single-product-gallery">
            {/* Main Image with 1:1 aspect ratio */}
            <div
              className="single-product-main-image"
              style={{ aspectRatio: "1/1" }}
            >
              <Skeleton
                height="100%"
                style={{
                  transform: "none",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            </div>
            {/* Thumbnails with proper grid layout */}
            <div className="single-product-thumbnails">
              {[1, 2, 3, 4].map((_, index) => (
                <div
                  key={index}
                  className="single-product-thumbnail"
                  style={{ aspectRatio: "1/1" }}
                >
                  <Skeleton
                    height="100%"
                    style={{
                      transform: "none",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: "var(--radius-md)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div
            className="single-product-details"
            style={{ textAlign: "right" }}
          >
            {/* Title */}
            <Skeleton height={45} width="85%" style={{ transform: "none" }} />

            {/* Pricing */}
            <div className="single-product-pricing">
              <Skeleton height={35} width={150} style={{ transform: "none" }} />
              <Skeleton
                height={35}
                width={100}
                style={{ transform: "none", opacity: 0.7 }}
              />
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="checkout-btn-product-page">
              <div
                className="checkout-btn-product-page-quantitySelect"
                style={{ background: "transparent" }}
              >
                <Skeleton
                  height={50}
                  style={{
                    transform: "none",
                    borderRadius: "var(--radius-md)",
                  }}
                />
              </div>
              <div
                className="checkout-btn-product-page-button"
                style={{ marginTop: "1rem" }}
              >
                <Skeleton
                  height={50}
                  style={{
                    transform: "none",
                    borderRadius: "var(--radius-md)",
                  }}
                />
              </div>
            </div>

            {/* Stats Section */}
            <div className="single-product-stats">
              {[1, 2, 3].map((_, index) => (
                <div key={index} style={{ padding: "0.5rem 0" }}>
                  <Skeleton
                    height={40}
                    style={{
                      marginBottom: "0.5rem",
                      borderRadius: "var(--radius-sm)",
                      transform: "none",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Star Rating Component
const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} />);
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" />);
  }
  
  // Add empty stars to make 5 total
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i <emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} />);
  }
  
  return <div className="product-reviews-stars">{stars}</div>;
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  maxRating: PropTypes.number,
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

function ProductPage() {
  const {
    toggleCart,
    Supabase_APIURL,
    supabase_APIKEY,
    productsInCart,
    setProductsInCart,
    addProductToCart,
  } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const [noProduct, setNoProduct] = useState(false);
  const { id } = useParams();
  const [randomVisitors, setRandomVisitors] = useState(0);
  const [productPage, setProductPage] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [isExpressCheckoutEnable, setIsExpressCheckoutEnable] = useState(false);
  const [ProductPage_Quantity, setProductPage_Quantity] = useState(1);
  const [btnText] = useState("أضف إلى السلة");
  const [btnLoader, setBtnLoader] = useState(false);
  const [productPage_MainImage, setProductPage_MainImage] = useState("");
  const [imageIndex, setImageIndex] = useState(null);
  const mainImageRef = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentThumbnailPage, setCurrentThumbnailPage] = useState(0);
  const thumbnailsPerPage = 4;

  const fetchProductPage_Product = useCallback(
    async (productId) => {
      const productPage_Api = `${Supabase_APIURL}?id=eq.${productId}`;
      try {
        // console.log("FETCH PRODUCT PAGE ID HERE :", productId);
        const response = await axios.get(productPage_Api, {
          headers: {
            apikey: supabase_APIKEY,
            Authorization: `bearer ${supabase_APIKEY}`,
          },
        });

        // console.log("FETCH PRODUCT PAGE ID HERE :", response.data);

        // Check if we got any data back
        if (!response.data || response.data.length === 0) {
          setNoProduct(true);
          setLoading(false);
          return;
        }

        setProductPage(response.data[0]);
        await new Promise((resolve) => {
          setProductPage_MainImage(`${response.data[0].Image}`);
          resolve();
        });

        if (response.data[0].isExpressCheckoutEnabled) {
          setIsExpressCheckoutEnable(true);
        }
      } catch (err) {
        console.error(err);
        setNoProduct(true);
        setLoading(false);
      }
    },
    [Supabase_APIURL, supabase_APIKEY]
  );

  const handleVisitorsRandom = useCallback(() => {
    const randomDelay = Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000;
    setInterval(() => {
      const randomNumber = Math.floor(Math.random() * (120 - 30 + 1)) + 30;
      setRandomVisitors(randomNumber);
    }, randomDelay);
  }, []);

  useEffect(() => {
    handleVisitorsRandom();
    fetchProductPage_Product(id);
  }, [id, fetchProductPage_Product, handleVisitorsRandom]);

  useEffect(() => {
    if (productPage) {
      // Save product data for express checkout
      localStorage.setItem(
        "productPage_Product",
        JSON.stringify({
          ...productPage,
          quantity: ProductPage_Quantity,
        })
      );
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [productPage, ProductPage_Quantity]);

  useEffect(() => {
    const data = productPage;
    const thisData = data?.additional_images;

    if (thisData) {
      setProductImages(thisData);
    }
  }, [productPage]);

  // Handle image zoom toggle
  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  // Handle thumbnail navigation
  const handleNextThumbnails = () => {
    if ((currentThumbnailPage + 1) * thumbnailsPerPage < productImages.length + 1) {
      setCurrentThumbnailPage(currentThumbnailPage + 1);
    }
  };

  const handlePrevThumbnails = () => {
    if (currentThumbnailPage > 0) {
      setCurrentThumbnailPage(currentThumbnailPage - 1);
    }
  };

  // Calculate visible thumbnails
  const getVisibleThumbnails = () => {
    const startIdx = currentThumbnailPage * thumbnailsPerPage;
    const endIdx = startIdx + thumbnailsPerPage;
    
    // First thumbnail is always the main product image
    const allThumbnails = [{ image: productPage.Image, isMain: true }, 
      ...productImages.map(img => ({ image: img, isMain: false }))];
    
    return allThumbnails.slice(startIdx, endIdx);
  };

  // Replace the old loading component with our new skeleton
  if (loading) {
    return <ProductPageSkeleton />;
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

  const getReviewCount = (product) => {
    if (!product) return 0;

    // Base review count based on price range
    let baseCount;
    if (product.price <= 100) baseCount = 180;
    else if (product.price <= 200) baseCount = 250;
    else if (product.price <= 300) baseCount = 320;
    else baseCount = 400;

    // Add more reviews if the product has a discount
    const hasDiscount = product.OldPrice && product.OldPrice > product.price;
    if (hasDiscount) {
      const discountPercent =
        ((product.OldPrice - product.price) / product.OldPrice) * 100;
      baseCount += Math.round(discountPercent * 3); // More discount = more reviews
    }

    // Add variation based on product ID (to make it unique per product)
    const variation = (product.id * 17) % 50; // Using prime number for better distribution

    return baseCount + variation;
  };

  const visibleThumbnails = getVisibleThumbnails();
  const hasMoreThumbnails = (currentThumbnailPage + 1) * thumbnailsPerPage < productImages.length + 1;
  const hasPrevThumbnails = currentThumbnailPage > 0;
  const rating = productPage.Rating ? productPage.Rating : 4.8;
  const reviewCount = getReviewCount(productPage);

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    
    // Create a combined array of all images
    const allImages = [productPage.Image, ...productImages];
    
    // Find current index
    let currentIndex;
    if (imageIndex === null) {
      currentIndex = 0; // Main image
    } else {
      currentIndex = imageIndex + 1; // +1 because main image is at index 0
    }
    
    // Calculate previous index with wrap-around
    let prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    
    // Update state
    if (prevIndex === 0) {
      setImageIndex(null); // Main image
      setProductPage_MainImage(productPage.Image);
    } else {
      setImageIndex(prevIndex - 1); // -1 because we're adjusting back to productImages index
      setProductPage_MainImage(productImages[prevIndex - 1]);
    }
  };

  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    
    // Create a combined array of all images
    const allImages = [productPage.Image, ...productImages];
    
    // Find current index
    let currentIndex;
    if (imageIndex === null) {
      currentIndex = 0; // Main image
    } else {
      currentIndex = imageIndex + 1; // +1 because main image is at index 0
    }
    
    // Calculate next index with wrap-around
    let nextIndex = (currentIndex + 1) % allImages.length;
    
    // Update state
    if (nextIndex === 0) {
      setImageIndex(null); // Main image
      setProductPage_MainImage(productPage.Image);
    } else {
      setImageIndex(nextIndex - 1); // -1 because we're adjusting back to productImages index
      setProductPage_MainImage(productImages[nextIndex - 1]);
    }
  };

  return (
    <>
      <Breadcrumb
        pathNameInfo="
المنتجات الأكثر طلبا في المملكة"
      />
      <div className="single-product-page">
        {/* Product Content */}
        <div className="single-product-container">
          <div className="container-product-page">
            <div className="single-product-content">
              {/* Product Gallery */}
              <div className="single-product-gallery">
                <div 
                  className={`single-product-main-image ${isZoomed ? 'zoomed' : ''}`}
                  onClick={handleZoomToggle}
                >
                  {!productPage_MainImage ? (
                    <Skeleton height={"100%"} width={"100%"} />
                  ) : (
                    <>
                      <img
                        src={`${productPage_MainImage}`}
                        alt={productPage.name}
                        loading="lazy"
                      />
                      <button 
                        className="image-nav-button prev-image" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevImage(e);
                        }}
                        aria-label="Previous image"
                      >
                        <FaChevronRight />
                      </button>
                      <button 
                        className="image-nav-button next-image" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextImage(e);
                        }}
                        aria-label="Next image"
                      >
                        <FaChevronLeft />
                      </button>
                    </>
                  )}
                </div>
                
                <div className="single-product-thumbnails-wrapper">
                  {hasPrevThumbnails && (
                    <button 
                      className="thumbnails-nav-button prev" 
                      onClick={handlePrevThumbnails}
                      aria-label="Previous thumbnails"
                    >
                      <FaChevronRight />
                    </button>
                  )}
                  
                  <div className="single-product-thumbnails">
                    {visibleThumbnails.map((item, idx) => (
                      <div
                        key={idx}
                        ref={item.isMain ? mainImageRef : null}
                        className={`single-product-thumbnail ${
                          (item.isMain && imageIndex === null) || 
                          (!item.isMain && imageIndex === productImages.indexOf(item.image)) 
                            ? "active" 
                            : ""
                        }`}
                        onClick={() => {
                          setProductPage_MainImage(item.image);
                          setImageIndex(item.isMain ? null : productImages.indexOf(item.image));
                          if (item.isMain) {
                            mainImageRef.current.classList.add("active");
                          } else {
                            mainImageRef.current.classList.remove("active");
                          }
                        }}
                      >
                        <img
                          src={item.image}
                          alt={`${productPage.name} - ${idx + 1}`}
                          className="image-thumbnail"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                  
                  {hasMoreThumbnails && (
                    <button 
                      className="thumbnails-nav-button next" 
                      onClick={handleNextThumbnails}
                      aria-label="Next thumbnails"
                    >
                      <FaChevronLeft />
                    </button>
                  )}
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
                  {productPage.OldPrice && (
                    <div className="discount-badge">
                      خصم {Math.round(((productPage.OldPrice - productPage.price) / productPage.OldPrice) * 100)}%
                    </div>
                  )}
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
                  <div className="single-product-express-checkout">
                    <CheckoutForm
                      productPage_Product={productPage}
                      checkoutStyle={false}
                    />
                  </div>
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
                        aria-label="Decrease quantity"
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
                        aria-label="Increase quantity"
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
                  {isExpressCheckoutEnable ? (
                    <div className="single-product-stats-compact">
                      <p className="single-product-stats-item">
                        <span className="stats-icon">🚚</span>
                        توصيل مجاني لجميع مدن المملكة
                      </p>
                      <p className="single-product-stats-item">
                        <span className="stats-icon">💯</span>
                        ضمان استرجاع خلال 14 يوم
                      </p>
                      <p className="single-product-stats-item highlight-stats">
                        <span className="stats-icon">👁️</span>
                        يشاهده حالياً{" "}
                        <span className="single-product-highlight">
                          <strong>{randomVisitors}</strong>
                        </span>{" "}
                        شخص
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="single-product-stats-item">
                        <span className="stats-icon">⭐</span>
                        تقييم عملائنا{" "}
                        {rating.toFixed(1)}
                        /5 ({reviewCount}+ تقييم)
                      </p>
                      {productPage.OldPrice && (
                        <p className="single-product-stats-item">
                          <span className="stats-icon">💥</span>
                          خصم{" "}
                          {Math.round(
                            ((productPage.OldPrice - productPage.price) /
                              productPage.OldPrice) *
                              100
                          )}
                          % لفترة محدودة
                        </p>
                      )}
                      <p className="single-product-stats-item">
                        <span className="stats-icon">📦</span>
                        {productPage.Stock > 10
                          ? "متوفر في المخزون"
                          : `باقي ${productPage.Stock} قطع فقط`}
                      </p>
                      <p className="single-product-stats-item">
                        <span className="stats-icon">🚚</span>
                        توصيل مجاني لجميع مدن المملكة
                      </p>
                      <p className="single-product-stats-item">
                        <span className="stats-icon">💯</span>
                        ضمان استرجاع خلال 14 يوم
                      </p>
                      <p className="single-product-stats-item highlight-stats">
                        <span className="stats-icon">👁️</span>
                        يشاهده حالياً{" "}
                        <span className="single-product-highlight">
                          <strong>{randomVisitors}</strong>
                        </span>{" "}
                        شخص
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Reviews Section Placeholder */}
            <div className="product-reviews-section">
              <div className="product-reviews-header">
                <h2 className="product-reviews-title">تقييمات المنتج</h2>
              </div>
              <div className="product-reviews-summary">
                <div className="product-reviews-average">
                  <div className="product-reviews-average-number">{rating.toFixed(1)}</div>
                  <StarRating rating={rating} />
                  <div className="product-reviews-count">{reviewCount} تقييم</div>
                </div>
              </div>
              <p style={{textAlign: 'center', padding: '20px'}}>سيتم إضافة نظام التقييمات قريباً</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage;
