import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ProductCard from "./ProductCard/ProductCard";
import "./ProductLayout.css";
import { useGlobalContext } from "../../../hooks/GlobalContextHooks";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ProductLayout({ Num }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { allProducts, setDisplayedProducts, displayedProducts } =
    useGlobalContext();

  useEffect(() => {
    if (allProducts.length > 0) {
      setLoading(false);
    } else if (!loading && allProducts.length === 0) {
      setError("تعذر تحميل المنتجات. يرجى المحاولة مرة أخرى لاحقاً.");
    }
  }, [allProducts, loading]);

  useEffect(() => {
    if (allProducts.length > 0) {
      if (Num) {
        const numberOfProducts = parseInt(Num, 10);
        let shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, numberOfProducts);
        setDisplayedProducts(selected);
      } else {
        setDisplayedProducts(allProducts);
      }
    }
  }, [allProducts, Num, setDisplayedProducts]);

  const NoProduct = () => {
    if (displayedProducts.length === 0) {
      return (
        <div className="container">
          <div className="no-products-container">
            <div className="no-products-icon">📦</div>
            <h3>لا توجد منتجات</h3>
            <p>لم نتمكن من العثور على أي منتجات لعرضها في الوقت الحالي.</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const MemoizedNoProduct = React.memo(NoProduct);

  const LoadingSkeleton = () => (
    <div className="skeleton-grid">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="skeleton-product-card">
          <div className="skeleton-image">
            <Skeleton
              height="100%"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          </div>
          <div className="skeleton-content">
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
            <Skeleton height={36} width="100%" />
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="container">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h3>{error}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="product-data-section">
        {displayedProducts.length ? (
          displayedProducts.map((product) => (
            <ProductCard
              ProductTitle={product.name}
              ProductImage={product.Image}
              ProductId={product.id}
              ProductPrice={product.price}
              ProductOldPrice={product.OldPrice}
              addittional_Images={product.addittional_Images}
              key={product.id}
              Rating={product.Rating}
            />
          ))
        ) : (
          <MemoizedNoProduct />
        )}
      </div>
    </div>
  );
}

ProductLayout.propTypes = {
  Num: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default React.memo(ProductLayout);
