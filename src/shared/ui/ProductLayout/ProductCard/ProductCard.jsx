import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { useGlobalContext } from "../../../../hooks/GlobalContextHooks";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.rtl.css";
import "alertifyjs/build/css/themes/default.rtl.css";
import "../../../../../styles/alertify.custom.css";
import "./ProductCard.css";

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="product-card__rating">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar
          key={`full-${i}`}
          className="product-card__star product-card__star--full"
        />
      ))}
      {hasHalfStar && (
        <FaStarHalfAlt
          key="half"
          className="product-card__star product-card__star--half"
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar
          key={`empty-${i}`}
          className="product-card__star product-card__star--empty"
        />
      ))}
    </div>
  );
};

RatingStars.propTypes = {
  rating: PropTypes.number.isRequired,
};

function ProductCard({
  ProductTitle,
  ProductImage,
  ProductPrice,
  ProductOldPrice,
  ProductId,
  Rating,
}) {
  const [loading, setLoading] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const { toggleFavorite, checkIfFavorite, addProductToCart } =
    useGlobalContext();
  const navigate = useNavigate();
  const productIdNumeric = parseInt(ProductId);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setIsFavorite(checkIfFavorite(productIdNumeric));
    setRating(Rating || 0);
  }, [productIdNumeric, Rating, checkIfFavorite]);

  const handleNavigation = () => {
    navigate(`/product/${ProductId}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (addToCartLoading) return;

    setAddToCartLoading(true);
    try {
      const product = {
        id: productIdNumeric,
        name: ProductTitle,
        Image: ProductImage,
        price: parseInt(ProductPrice),
        OldPrice: ProductOldPrice ? parseInt(ProductOldPrice) : null,
      };

      const success = await addProductToCart(product, 1);
      if (success) {
        setTimeout(() => {
          setAddToCartLoading(false);
          // alertify.success("تم إضافة المنتج إلى السلة بنجاح");
        }, 400);
      } else {
        setAddToCartLoading(false);
        alertify.error("حدث خطأ أثناء إضافة المنتج إلى السلة");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAddToCartLoading(false);
      alertify.error("حدث خطأ أثناء إضافة المنتج إلى السلة");
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const product = {
        id: productIdNumeric,
        name: ProductTitle,
        Image: ProductImage,
        price: parseInt(ProductPrice),
        OldPrice: parseInt(ProductOldPrice),
      };

      toggleFavorite(product);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-card" onClick={handleNavigation}>
      <div className="product-card__container">
        <div className="product-card__image-box">
          <img
            src={ProductImage}
            alt={ProductTitle}
            className="product-card__image"
            loading="lazy"
          />
          <button
            className={`product-card__heart-button ${
              isFavorite ? "product-card__heart-button--active" : ""
            }`}
            onClick={handleFavoriteClick}
            disabled={loading}
          >
            {isFavorite ? (
              <FaHeart className="product-card__heart-icon" />
            ) : (
              <FaRegHeart className="product-card__heart-icon" />
            )}
          </button>
        </div>
        <div className="product-card__info">
          <h3 className="product-card__title">{ProductTitle}</h3>
          <div className="product-card__price-container">
            {ProductOldPrice && (
              <span className="product-card__old-price">
                {ProductOldPrice} ريال سعودي
              </span>
            )}
            <span className="product-card__price">{ProductPrice} ريال سعودي</span>
          </div>
          <button
            className={`product-card__button ${addToCartLoading ? "loading" : ""}`}
            onClick={handleAddToCart}
            disabled={addToCartLoading}
          >
            {addToCartLoading ? (
              <div className="button-content">
                <div>
                {/* <span className="loading-spinner" /> */}
                <span className="loading-text">جاري الإضافة...</span>
                </div>
              </div>
            ) : (
              "للطلب اضغطي هنا"
            )}
          </button>
          <RatingStars rating={rating} />
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  ProductTitle: PropTypes.string.isRequired,
  ProductImage: PropTypes.string.isRequired,
  ProductPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  ProductOldPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ProductId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  Rating: PropTypes.number,
};

ProductCard.defaultProps = {
  ProductOldPrice: null,
  Rating: 0,
};

export default ProductCard;
