/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard/ProductCard";
import axios from "axios";
import "./ProductLayout.css";

export default function ProductLayout({ Num }) {
  const [ProductsData, setProductsData] = useState([]);
  const [FilteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const URL = "http://localhost:5000/Products";
    axios
      .get(URL)
      .then((res) => {
        console.log("Fetched Data:", res.data);
        setProductsData(res.data);
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
