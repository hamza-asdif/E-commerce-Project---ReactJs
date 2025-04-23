import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./productCard2.css";
import { useGlobalContext } from "../../hooks/GlobalContextHooks";
import { useNavigate } from "react-router-dom";

const ProductCard2 = ({ product }) => {
  const { addToCart } = useGlobalContext();
  const navigate = useNavigate();

  const handleAddToCart = useCallback(() => {
    addToCart(product);
  }, [addToCart, product]);

  const handleNavigate = useCallback(() => {
    navigate(`/product/${product.id}`);
  }, [navigate, product]);

  return (
    <div className="product-card2">
      <img
        src={product.image}
        alt={product.name}
        className="product-card2-image"
      />
      <div className="product-card2-details">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>${product.price}</p>
        <button onClick={handleAddToCart}>Add to Cart</button>
        <button onClick={handleNavigate}>View Details</button>
      </div>
    </div>
  );
};

export default ProductCard2;
