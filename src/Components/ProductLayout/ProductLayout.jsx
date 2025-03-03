/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard/ProductCard";
import "./ProductLayout.css";
import { useGlobalContext } from "../../Context/GlobalContext";

export default function ProductLayout({ Num }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { allProducts } = useGlobalContext();

  useEffect(() => {
    // Simulate loading time for demonstration
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Check if there was an error loading products
  useEffect(() => {
    if (!loading && !allProducts.length) {
      setError("Unable to load products. Please try again later.");
    } else {
      setError(null);
    }
  }, [loading, allProducts]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  

  if (!allProducts.length) {
    return (
      <div className="container">
        <div className="no-products-container">
          <div className="no-products-icon">📦</div>
          <h3>No Products Found</h3>
          <p>We couldn't find any products to display at the moment.</p>
          <p>Check back soon or try adjusting your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="product-data-section">
        {allProducts.map((Product) => (
          <ProductCard
            ProductTitle={Product.name}
            ProductImage={Product.Image}
            ProductId={Product.id}
            ProductPrice={Product.price}
            ProductOldPrice={Product.OldPrice}
            key={Product.id}
          />
        ))}
      </div>
    </div>
  );
}