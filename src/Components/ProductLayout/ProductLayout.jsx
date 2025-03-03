/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard/ProductCard";
import axios from "axios";
import "./ProductLayout.css";
import { useGlobalContext } from "../../Context/GlobalContext";

export default function ProductLayout({ Num }) {
  const [ProductsData, setProductsData] = useState([]);
  const [FilteredProducts, setFilteredProducts] = useState([]);
  const {DATA_PATH_API, Master_Key} = useGlobalContext()

  useEffect(() => {
    const URL = "https://api.jsonbin.io/v3/b/67c54486e41b4d34e49fc194";
    axios
      .get(URL, {
        headers : {
          "X-Master-Key": Master_Key
        }
      })
      .then((res) => {
        console.log("Fetched Data:", res.data.record.Products);
        setProductsData(res.data.record.Products);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    if (ProductsData.length && Num) {
      const parsedNum = parseInt(Num, 10); // تحويل `Num` إلى رقم صحيح
      const filtered = ProductsData.slice(0, parsedNum); // استخراج العدد المطلوب من المنتجات
      setFilteredProducts(filtered);
      console.log("Filtered Products:", filtered);
    }
  }, [ProductsData, Num]); // تنفيذ هذا التأثير عند تحديث `ProductsData` أو `Num`

  return (
    <div className="container">
      <div className="product-data-section">
        {FilteredProducts.length ? (
          FilteredProducts.map((Product) => (
            <ProductCard
              ProductTitle={Product.name}
              ProductImage={Product.Image}
              ProductId={Product.id}
              ProductPrice={Product.price}
              ProductOldPrice={Product.OldPrice}
              key={Product.id}
            />
          ))
        ) : (
          <div>
            <h3>There's no product data...</h3>
          </div>
        )}
      </div>
    </div>
  );
}
