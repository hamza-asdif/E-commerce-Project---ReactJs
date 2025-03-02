import React, { useState } from "react";
import "./ProductCard.css";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useGlobalContext } from "../../../Context/GlobalContext";

function ProductCard({
  ProductTitle,
  ProductImage,
  ProductPrice,
  ProductOldPrice,
  ProductId,
}) {
  const { addProductToCart, toggleCart } = useGlobalContext();
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded_ToFavorite, setIsAdded_ToFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buyNow_Loading, setBuyNow_Loading] = useState(false);

  const handleAddToCart = () => {
    const product = {
      id: ProductId,
      name: ProductTitle,
      Image: ProductImage,
      price: ProductPrice,
      OldPrice: ProductOldPrice,
      quantity: 1,
    };
    
    setBuyNow_Loading(true);
    setTimeout(() => {
      setBuyNow_Loading(false);
      toggleCart(true);
      addProductToCart(product);
    }, 1500);
  };

  const handleFavoriteClick = () => {
    setLoading(true);
    setTimeout(() => {
      setIsAdded_ToFavorite((prev) => !prev);
      setIsFavorite((prev) => !prev);
      setLoading(false);
    }, 500);
  };

  const getText_Favorite = () => {
    if (loading) return "جاري التحميل...";
    return isAdded_ToFavorite ? (
      <div className="cursor-X">تمت إضافته إلى المفضلة</div>
    ) : (
      "أضف إلى المفضلة"
    );
  };

  const getText_BuyNow = () => {
    if (buyNow_Loading) return <div className="loader"></div>;
    return "للطلب اضغطي هنا";
  };

  return (
    <div className="product-card" key={ProductId}>
      <div className="product-container">
        <div className="product-img-box">
          <img src={ProductImage} alt={ProductTitle} className="product-img" />
        </div>

        <div className="product-infos-box">
          <h3 className="product-title">{ProductTitle}</h3>
          <div className="product-price-container">
            <span className="product-old-price">{ProductOldPrice} ريال سعودي</span>
            <span className="product-price">{ProductPrice} ريال سعودي</span>
          </div>
          <button className="product-btn" id="buynow" onClick={handleAddToCart}>
            {getText_BuyNow()}
          </button>
          <div className="favorite-a" onClick={handleFavoriteClick}>
            <div className="heart-icon-toggle">
              {isFavorite ? (
                <FaHeart className="favorite-icon" />
              ) : (
                <FaRegHeart className="favorite-icon" />
              )}
            </div>
            <span className="favorite-text">{getText_Favorite()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;