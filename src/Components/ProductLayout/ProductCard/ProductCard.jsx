import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { FaRegHeart, FaHeart, FaRegClosedCaptioning } from "react-icons/fa";
import { useGlobalContext } from "../../../Context/GlobalContext";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";

function ProductCard({
  ProductTitle,
  ProductImage,
  ProductPrice,
  ProductOldPrice,
  ProductId,
  Rating,
}) {
  const {
    addProductToCart,
    toggleCart,
    refreshCart,
    saveProductToFavorites,
    NavigateToProduct,
  } = useGlobalContext();

  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded_ToFavorite, setIsAdded_ToFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buyNow_Loading, setBuyNow_Loading] = useState(false);
  const [rating, setRating] = useState(0);
  const NavigateNow = useNavigate();

  // تأكد من أن المعرف هو قيمة رقمية
  const productIdNumeric = parseInt(ProductId);

  // التحقق من حالة المفضلة عند تحميل المكون
  useEffect(() => {
    const storedFavorites = localStorage.getItem("Fav_Products");
    if (storedFavorites) {
      const favorites = JSON.parse(storedFavorites);
      const isProductFavorite = favorites.some(
        (item) => item.id === ProductId && item.isFav === true,
      );
      setIsFavorite(isProductFavorite);
      setIsAdded_ToFavorite(isProductFavorite);
    }
  }, [ProductId]);

  useEffect(() => {
    handleDrawRatings();

    if (Rating) {
      setRating(Rating);
    }

    return () => {
      toggleCart(false);
    };
  }, []);

  // في مكون ProductCard.js، تأكد من استدعاء refreshCart بعد إضافة منتج بنجاح
  const handleAddToCart = () => {
    const product = {
      id: parseInt(ProductId),
      name: ProductTitle,
      Image: ProductImage,
      price: parseInt(ProductPrice),
      OldPrice: parseInt(ProductOldPrice),
      quantity: 1,
    };

    setBuyNow_Loading(true);
    setTimeout(() => {
      setBuyNow_Loading(false);
      toggleCart(true);

      // إضافة المنتج ثم تحديث السلة
      addProductToCart(product).then(() => {
        refreshCart(); // تأكد من استدعاء هذه الدالة بعد إضافة المنتج بنجاح
      });
    }, 1500);
  };

  const handleFavoriteClick = () => {
    setLoading(true);

    setTimeout(() => {
      // تبديل حالة المفضلة
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);
      setIsAdded_ToFavorite(newFavoriteState);

      // إنشاء كائن المفضلة
      const favoriteObj = {
        id: ProductId,
        isFav: newFavoriteState,
      };

      // الحصول على المفضلات المخزنة
      const storedFavorites = localStorage.getItem("Fav_Products");
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      // التحقق مما إذا كان المنتج موجودًا بالفعل في المفضلة
      const existingIndex = favorites.findIndex(
        (item) => item.id === ProductId,
      );

      if (existingIndex !== -1) {
        // تحديث حالة المنتج الموجود
        favorites[existingIndex].isFav = newFavoriteState;
      } else {
        // إضافة منتج جديد إلى المفضلة
        favorites.push(favoriteObj);
      }

      // تخزين المفضلات المحدثة
      localStorage.setItem("Fav_Products", JSON.stringify(favorites));

      // اختياري: استدعاء saveProductToFavorites إذا كان متاحًا

      setLoading(false);
    }, 500);
  };

  const getText_Favorite = () => {
    if (loading) return "جاري التحميل...";
    return isAdded_ToFavorite ? "تمت إضافته إلى المفضلة" : "أضف إلى المفضلة";
  };

  const getText_BuyNow = () => {
    if (buyNow_Loading) return <div className="loader"></div>;
    return "للطلب اضغطي هنا";
  };

  const handleProductClick = () => {
    // Remove ProductId parameter since it's already in props
    const product = {
      id: parseInt(ProductId), // Use ProductId directly from props
      name: ProductTitle,
      Image: ProductImage,
      price: parseInt(ProductPrice),
      OldPrice: parseInt(ProductOldPrice),
      quantity: 1,
    };

    NavigateToProduct(product, false);
    console.log("here's the product page clicked product :", product);
    NavigateNow(`/product/${ProductId}`); // Use ProductId directly from props
  };

  const handleDrawRatings = () => {
    if (rating !== 0) {
      const rates = Array.from({ length: rating });
      console.log(rates);
    }
  };

  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating); // عدد النجوم الممتلئة
    const hasHalfStar = rating % 1 !== 0; // هل يوجد نصف نجمة؟
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // عدد النجوم الفارغة

    return (
      <div className="rating-stars">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="star-icon full-star" />
        ))}

        {hasHalfStar && (
          <FaStarHalfAlt key="half" className="star-icon half-star" />
        )}

        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="star-icon empty-star" />
        ))}
      </div>
    );
  };

  return (
    <div className="product-card" key={productIdNumeric}>
      <div className="product-container">
        <div className="product-img-box" onClick={handleProductClick}>
          <img src={ProductImage} alt={ProductTitle} className="product-img" />
        </div>
        <div className="product-infos-box">
          <h3 className="product-title">{ProductTitle}</h3>
          <div className="product-price-container">
            <span className="product-old-price">
              {ProductOldPrice} ريال سعودي
            </span>
            <span className="product-price">{ProductPrice} ريال سعودي</span>
          </div>
          <button
            className="product-btn"
            id="buynow"
            onClick={handleAddToCart}
            disabled={buyNow_Loading}
          >
            {getText_BuyNow()}
          </button>
          <div className="rating-container">
            <div className="rating-box">
              <RatingStars rating={rating} />
            </div>
          </div>
          <div className="favorite-a" onClick={handleFavoriteClick}>
            <span className="favorite-text">{getText_Favorite()}</span>
            <div className="heart-icon-toggle">
              {isFavorite ? (
                <FaHeart className="favorite-icon" />
              ) : (
                <FaRegHeart className="favorite-icon" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProductCard);
