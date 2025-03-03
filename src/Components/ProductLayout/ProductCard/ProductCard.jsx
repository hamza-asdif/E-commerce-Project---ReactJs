import React, { useState, useEffect } from "react";
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
  const { addProductToCart, toggleCart, refreshCart, saveProductToFavorites } = useGlobalContext();
 
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded_ToFavorite, setIsAdded_ToFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buyNow_Loading, setBuyNow_Loading] = useState(false);

  // تأكد من أن المعرف هو قيمة رقمية
  const productIdNumeric = parseInt(ProductId);

  // التحقق من حالة المفضلة عند تحميل المكون
  useEffect(() => {
    const storedFavorites = localStorage.getItem("Fav_Products");
    if (storedFavorites) {
      const favorites = JSON.parse(storedFavorites);
      const isProductFavorite = favorites.some(item => item.id === ProductId && item.isFav === true);
      setIsFavorite(isProductFavorite);
      setIsAdded_ToFavorite(isProductFavorite);
    }
  }, [ProductId]);

  // في مكون ProductCard.js، تأكد من استدعاء refreshCart بعد إضافة منتج بنجاح
  const handleAddToCart = () => {
    const product = {
      "id": parseInt(ProductId),
      "name": ProductTitle,
      "Image": ProductImage,
      "price": parseInt(ProductPrice),
      "OldPrice": parseInt(ProductOldPrice),
      "quantity": 1,
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
        isFav: newFavoriteState
      };
      
      // الحصول على المفضلات المخزنة
      const storedFavorites = localStorage.getItem("Fav_Products");
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      
      // التحقق مما إذا كان المنتج موجودًا بالفعل في المفضلة
      const existingIndex = favorites.findIndex(item => item.id === ProductId);
      
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

  return (
    <div className="product-card" key={productIdNumeric}>
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
          <button 
            className="product-btn" 
            id="buynow" 
            onClick={handleAddToCart}
            disabled={buyNow_Loading} // تعطيل الزر أثناء التحميل
          >
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