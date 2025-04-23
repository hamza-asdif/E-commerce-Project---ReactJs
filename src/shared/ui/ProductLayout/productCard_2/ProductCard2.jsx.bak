import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./productCard2.css";
import { useGlobalContext } from "../../../Context/GlobalContext";
import { useNavigate } from "react-router-dom";

const SkeletonCard = () => (
  <div className="card2-box">
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-price"></div>
        <div className="skeleton-price"></div>
      </div>
    </div>
  </div>
);

function ProductCard2() {
  const [productCard2, setProductCard2] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { NavigateToProduct, allProducts } = useGlobalContext();
  const NavigateNow = useNavigate();

  const handleRandomProducts_main = useCallback(() => {
    if (allProducts && allProducts.length) {
      setProductCard2(allProducts);
      setIsLoading(false);
    }
  }, [allProducts]);

  useEffect(() => {
    handleRandomProducts_main();
  }, [handleRandomProducts_main]);

  const handleRandomProducts = useCallback(() => {
    if (productCard2.length <= 3) {
      setRandomProducts([...productCard2]);
      return;
    }

    const randomIndexes = [];
    while (randomIndexes.length < 3) {
      const randomIndex = Math.floor(Math.random() * productCard2.length);
      if (!randomIndexes.includes(randomIndex)) {
        randomIndexes.push(randomIndex);
      }
    }

    const selectedProducts = randomIndexes.map((index) => productCard2[index]);
    setRandomProducts(selectedProducts);
  }, [productCard2]);

  useEffect(() => {
    handleRandomProducts();
  }, [handleRandomProducts]);

  const handleProductClick = useCallback(
    async (product) => {
      await NavigateToProduct(product);
      NavigateNow(`/product/${product.id}`);
    },
    [NavigateToProduct, NavigateNow]
  );

  const LoadingProducts = useMemo(() => {
    return (
      <div className="card2">
        <div className="container">
          <div className="product-card2-container">
            {[1, 2, 3].map((index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }, []);

  const productList = useMemo(() => {
    return randomProducts.map((item) => (
      <div
        className="card2-box"
        key={item.id}
        onClick={() => handleProductClick(item)}
      >
        <div className="card2-content">
          <img
            src={item.Image}
            alt={item.name || "منتج"}
            className="card-product-img"
            loading="lazy" // إضافة تحميل كسول للصور
          />
          <div className="card2-product-card-info">
            <div className="card2-product-title">
              <h3>{item.name}</h3>
            </div>
            <div className="card2-product-infos-box">
              <span className="card2-product-old-price">
                {item.OldPrice} ريال سعودي
              </span>
              <span className="card2-product-price">
                {item.price} ريال سعودي
              </span>
            </div>
          </div>
        </div>
      </div>
    ));
  }, [randomProducts, handleProductClick]);

  return (
    <>
      <div className="card2">
        <div className="container">
          <div className="product-card2-container">
            {!isLoading && randomProducts.length > 0 && productList}
          </div>
        </div>
      </div>

      {isLoading && LoadingProducts}
    </>
  );
}

export default React.memo(ProductCard2);
