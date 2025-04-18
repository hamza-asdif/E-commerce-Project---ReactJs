import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Favorites.css";
import { useGlobalContext } from "../../Context/GlobalContext";

const Favorites = () => {
  const {
    favoriteProducts,
    toggleFavorite,
    addProductToCart,
    toggleCart,
    allProducts,
  } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Wait for both allProducts to load and favoriteProducts to be initialized
    if (allProducts.length > 0 && favoriteProducts !== undefined) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsInitialized(true);
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [allProducts, favoriteProducts]);

  const handleAddToCart = (product) => {
    addProductToCart(product);
    toggleCart(true);
  };

  const LoadingSkeleton = () => (
    <div className="favorites-grid">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="favorite-item skeleton-item">
          <div className="favorite-image">
            <Skeleton height={280} />
          </div>
          <div className="favorite-content">
            <Skeleton
              height={20}
              width="80%"
              style={{ marginBottom: "0.5rem" }}
            />
            <Skeleton
              height={24}
              width="40%"
              style={{ marginBottom: "1rem" }}
            />
            <div className="favorite-actions">
              <Skeleton height={36} />
              <Skeleton height={36} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Function to render favorites content
  const renderContent = () => {
    if (isLoading || !isInitialized) {
      return (
        <>
          <div className="favorites-header">
            <h1>
              <Skeleton width={200} />
            </h1>
            <Skeleton width={100} />
          </div>
          <LoadingSkeleton />
        </>
      );
    }

    if (!favoriteProducts || favoriteProducts.length === 0) {
      return (
        <div className="no-favorites">
          <div className="empty-favorites">
            <FaHeart className="empty-heart" />
            <h2>لا توجد منتجات في المفضلة</h2>
            <p>لم تقم بإضافة أي منتجات إلى المفضلة بعد</p>
            <Link to="/shop" className="browse-products-btn">
              تصفح المنتجات
            </Link>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="favorites-header">
          <h1>
            المنتجات المفضلة <FaHeart className="heart-icon" />
          </h1>
          <p className="favorites-count">
            {favoriteProducts.length} منتج في المفضلة
          </p>
        </div>
        <div className="favorites-grid">
          {favoriteProducts.map((product) => (
            <div key={product.id} className="favorite-item">
              <div className="favorite-image">
                <img src={product.Image} alt={product.name} />
              </div>
              <div className="favorite-content">
                <h3>{product.name}</h3>
                <div className="favorite-price">
                  <span className="current-price">
                    {product.price} ريال سعودي
                  </span>
                  {product.OldPrice && (
                    <span className="old-price">
                      {product.OldPrice} ريال سعودي
                    </span>
                  )}
                </div>
                <div className="favorite-actions">
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    إضافة إلى السلة
                  </button>
                  <button
                    className="remove-favorite-btn"
                    onClick={() => toggleFavorite(product)}
                  >
                    إزالة من المفضلة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return <div className="favorites-container">{renderContent()}</div>;
};

export default Favorites;
