import React, { useEffect, useState } from "react";
import ProductCard from "../ProductLayout/ProductCard/ProductCard";
import { useGlobalContext } from "../../Context/GlobalContext";
import './SearchForProducts.css';

function SearchForProducts() {
  const { searchResults, setSearchResults, seachForProductFunction, resetAllStates } =
    useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [searchResults_InPage, setSearchResults_InPage] = useState([]);

  useEffect(() => {
    setSearchResults_InPage(searchResults);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [searchResults]);

  useEffect( () => {
    resetAllStates()
  }, [] )

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>جاري البحث...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <div className="product-data-section">
          {searchResults_InPage && searchResults_InPage.length ? (
            searchResults_InPage.map((product) => {
              const productProps = {
                ProductId: product.id,
                ProductTitle: product.name,
                ProductImage: product.Image,
                ProductPrice: product.price,
                ProductOldPrice: product.oldPrice,
              };
              return <ProductCard key={product.id} {...productProps} />;
            })
          ) : (
            <h1>لا توجد نتائج بحث</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchForProducts;
