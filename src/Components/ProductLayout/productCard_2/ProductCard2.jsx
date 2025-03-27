import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./productCard2.css";
import axios from "axios";
import { useGlobalContext } from "../../../Context/GlobalContext";
import { useNavigate } from "react-router-dom";
import supabase from "../../../supabaseClient";

function ProductCard2() {
  
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_APIKEY = import.meta.env.VITE_SUPABASE_API_KEY;

  const [productCard2, setProductCard2] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { NavigateToProduct } = useGlobalContext();
  const NavigateNow = useNavigate();

  
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(10);

      if (data && data.length > 0) {
        setProductCard2(data);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("خطأ في تحميل المنتجات:", err);
      setIsLoading(false);
    }
  }, [SUPABASE_URL, SUPABASE_APIKEY]);

  useEffect(() => {
    fetchData();

    return () => {
      setProductCard2([]);
      setRandomProducts([]);
    };
  }, [fetchData]);

  useEffect(() => {
    handleRandomProducts();
  }, [productCard2]);

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

  const handleProductClick = useCallback(
    async (product) => {
      await NavigateToProduct(product);
      NavigateNow(`/product/${product.id}`);
    },
    [NavigateToProduct, NavigateNow]
  );

  const LoadingProducts = useMemo(() => {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل المنتجات...</p>
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
            {randomProducts.length > 0 && productList}
          </div>
        </div>
      </div>

      {isLoading && LoadingProducts}
    </>
  );
}

export default React.memo(ProductCard2);
