import React, { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaSadTear } from "react-icons/fa";
import ProductCard from "../ProductLayout/ProductCard/ProductCard";
import { useGlobalContext } from "../../Context/GlobalContext";
import './SearchForProducts.css';

function SearchForProducts() {
  const { searchResults, resetAllStates } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [searchResults_InPage, setSearchResults_InPage] = useState([]);
  const [filterPrice, setFilterPrice] = useState(false)

  useEffect(() => {
    setSearchResults_InPage(searchResults);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    

  }, [searchResults]);

  useEffect(() => {
    resetAllStates()
    
  }, []);

  useEffect(() => {
    searchedProductsFiltering_Price()
  }, [filterPrice])

  const searchedProductsFiltering_Price = () => {
    if(searchResults.length){
      const displayedProducts =  [...searchResults_InPage]
      const filteredByPrice = displayedProducts.sort( (a, b)  => {
        return a.price - b.price
      } )
      


      setSearchResults_InPage(filteredByPrice)
      console.log("filtering : ", filteredByPrice)
    }
  }

  const handleFilteringClick = () =>{
    setFilterPrice(val => !val)
  }
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>جاري البحث عن المنتجات...</p>
      </div>
    );
  }


  return (
    <div className="search-results-page">
      <div className="search-header">
        <div className="search-info">
          <h1>نتائج البحث</h1>
          <p>تم العثور على {searchResults_InPage.length} منتج</p>
        </div>
        <div className="search-filters">
          <button className="filter-btn" onClick={handleFilteringClick}>
            <FaFilter />
            <span>تصفية النتائج</span>
          </button>
        </div>
      </div>

      <div className="search-content">
        {searchResults_InPage && searchResults_InPage.length ? (
          <>
            <div className="products-grid">
              {searchResults_InPage.map((product) => (
                <ProductCard
                  key={product.id}
                  ProductId={product.id}
                  ProductTitle={product.name}
                  ProductImage={product.Image}
                  ProductPrice={product.price}
                  ProductOldPrice={product.oldPrice}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="no-results">
            <FaSadTear className="no-results-icon" />
            <h2>لم يتم العثور على نتائج</h2>
            <p>جرب البحث باستخدام كلمات مختلفة أو تصفح الفئات</p>
            <button className="browse-categories-btn">
              تصفح جميع المنتجات
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchForProducts;