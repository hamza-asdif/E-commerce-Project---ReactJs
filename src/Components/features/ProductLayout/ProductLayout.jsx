import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductLayout.css";
import { useGlobalContext } from "../../hooks/GlobalContextHooks";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductLayout = ({ products, isLoading }) => {
  const { globalState } = useGlobalContext();

  return (
    <div className="product-layout">
      {isLoading ? (
        <Skeleton count={5} />
      ) : (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
};

ProductLayout.propTypes = {
  products: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default ProductLayout;
