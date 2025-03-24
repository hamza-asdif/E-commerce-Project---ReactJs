import React, { useEffect, useState } from "react";
import "./productCard2.css";
import ImgProduct from "../../../../public/images/products/crystal.webp";
import axios from "axios";
import { useGlobalContext } from "../../../Context/GlobalContext";
import { useNavigate } from "react-router-dom";

function ProductCard2() {
  const JSONBIN_BASE_URL =
    "https://api.jsonbin.io/v3/b/67c54486e41b4d34e49fc194";
  const MASTER_KEY =
    "$2a$10$JSduiJIAxlAAiB5UQSJ9n.rCUN94IKEeZ8QwNDmKsxfCuURp/m3Xe";
  const SUPABASE_URL = "https://tbllwzcqhdgztsqybfwg.supabase.co";
  const SUPABASE_APIKEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibGx3emNxaGRnenRzcXliZndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMDY4NzQsImV4cCI6MjA1NzU4Mjg3NH0.xAfedGGwK7595FJ5rk1tbePdPdOk1W-Wr12e-mLvjIM";
  const [productCard2, setProductCard2] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);

  const { NavigateToProduct } = useGlobalContext();
  const NavigateNow = useNavigate();

  useEffect(() => {
    fetchData(); // جلب البيانات من API عند تحميل الصفحة
  }, []);

  useEffect(() => {
    if (productCard2.length > 0) {
      getRandomProducts(); // عندما يتم تحميل المنتجات، نقوم باختيار 3 منتجات عشوائية
    }
  }, [productCard2]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${SUPABASE_URL}/rest/v1/products`, {
        headers: {
          apikey: SUPABASE_APIKEY,
          Authorization: `bearer ${SUPABASE_APIKEY}`,
        },
      });

      console.log("تم تحميل المنتجات بنجاح CART ------", response.data);
      setProductCard2(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getRandomProducts = () => {
    // إذا كانت هناك منتجات، نقوم باختيار 3 منتجات عشوائية
    const randomIndexes = [];
    while (randomIndexes.length < 3) {
      const randomIndex = Math.floor(Math.random() * productCard2.length);
      if (!randomIndexes.includes(randomIndex)) {
        randomIndexes.push(randomIndex);
      }
    }

    const selectedProducts = randomIndexes.map((index) => productCard2[index]);
    setRandomProducts(selectedProducts); // تخزين المنتجات العشوائية
  };

  const handleProductClick = async (product) => {
    await NavigateToProduct(product);
    await NavigateNow(`/product/${product.id}`);
  };

  const loadingProducts = () => {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  };

  const MemomizedLoadingProducts = React.memo(loadingProducts);

  return (
    <>
      <div className="card2">
        <div className="container">
          <div className="product-card2-container">
            {randomProducts.length > 0 &&
              randomProducts.map((item) => (
                <div
                  className="card2-box"
                  key={item.id}
                  onClick={() => handleProductClick(item)}
                >
                  <div className="card2-content">
                    <img src={item.Image} alt="" className="card-product-img" />
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
              ))}
          </div>
        </div>
      </div>

      {randomProducts.length === 0 && <MemomizedLoadingProducts />}
    </>
  );
}

export default ProductCard2;
