import React, { useState, useEffect } from "react";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import "./searchBar.css";
import { useGlobalContext } from "../../Context/GlobalContext";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const {
    allProducts,
    seachForProductFunction,
    searchForProduct,
    Search_Products,
    setSearchQuery,
    searchQuery,
    setSearchResults,
    searchResults
  } = useGlobalContext();
  const [showAlert, setShowAlert] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigateToSearchNow = useNavigate();

  const categories = [
    "المنتجات الأكثر طلبا في المملكة🔥",
    "Women Bra Products",
    "Women 25",
    "التصنيف الأول",
    "منتجات حصريا في المملكة العربية السعودية🔥",
    "Beauty",
  ];


  const handleInputSearch = (e) => {
    const value = e.target.value.trim()
    setSearchQuery(value)
  }

  const handleIconClick = () => {
    if(searchQuery.length >= 3 && allProducts) {
      const searchRes = allProducts.filter( (p) => {
        return p.name.toLowerCase().includes(searchQuery.toLowerCase())
      } )

      setSearchResults(searchRes)
      navigateToSearchNow("/search")
    }
    else{
      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false)
      }, 3000);
    }
  }


  const handleKeyUp = (e) => {
    if(e.key === "Enter"){
      handleIconClick()
    }
  }

  // Alert Component
  const AlertBox = () => (
    <div className="alert-box-container">
      <div className="alert-box">
        <p>الرجاء إدخال أكثر من 3 أحرف للبحث</p>
        <button className="alert-close" onClick={() => setShowAlert(false)}>
          <IoMdClose />
        </button>
      </div>
    </div>
  );

  return (
    <div className="search-bar">
      <div className="search-bar-box">
        <div className="categories-box">
          <select
            title="collections"
            name="collection"
            value={selectedCategory}
          >
            <option value="" id="select-first">
              جميع التشكيلات
            </option>
            {categories.map((category, index) => (
              <option value={category} key={index} id={`categorie-${index}`}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="search-input-box">
          <input type="text" placeholder="البحث عن منتج" id="seachBar" onChange={handleInputSearch} onKeyUp={handleKeyUp} />
          <IoIosSearch id="search-bar-icon" onClick={handleIconClick} />
        </div>

        {showAlert && <AlertBox />}
      </div>
    </div>
  );
}

export default SearchBar;
