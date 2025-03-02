/* eslint-disable react/jsx-key */
import React, { useState } from "react";
import { useEffect } from "react";
import ProductCard from "./ProductCard/ProductCard";
import axios from "axios";
import './Productayout.css'

export default function ProductLayout() {
  const [ProductsData, setProductsData] = useState([]);

  useEffect(() => {
    let URL =
      "http://localhost:5000/Products";
    axios
      .get(URL)
      .then((res) => {
        console.log(res.data);
        setProductsData(res.data);
      })
      .catch((err) => console.error("Products Data : ", err));
  }, []);

  return (
    <>
      <div className="container">
      <div className="product-data-section">
      {
        ProductsData.length ? (
            ProductsData.map( (Product) => {
                return (
                    <ProductCard 
                    ProductTitle={Product.name}
                    ProductImage={Product.Image}
                    ProductId={Product.id}
                    ProductPrice={Product.price}
                    ProductOldPrice={Product.OldPrice}
                    key={Product.id}
                    />
                )
            })
        ) : <div>
            <h3> there's no prooduct data...</h3>
        </div>
      }
      </div>
      </div>
    </>
  );
}
