import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import "./searchBar.css";
import { useGlobalContext } from "../../Context/GlobalContext";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const { allProducts, seachForProductFunction, searchForProduct, setSearchResults } =
    useGlobalContext();
  const [showAlert, setShowAlert] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigateToSearchNow = useNavigate();

  const categories = [
    "المنتجات الأكثر طلبا في المملكة🔥",
    "Women Bra Products",
    "Women 25",
    "التصنيف الأول",
    "منتجات حصريا في المملكة العربية السعودية🔥",
    "Beauty",
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length < 3) {
      setShowAlert(false);
    }

    seachForProductFunction(e);
  };

// Inside your handleSearchClick function
const handleSearchClick = () => {
  if (searchQuery.length < 3) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
  } else {
      // Clear previous results first
      setSearchResults([]);
      // Perform search
      seachForProductFunction({ target: { value: searchQuery } });
      // Navigate to search page
      navigateToSearchNow("/search");
  }
};

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    
    // You can add additional category filtering logic here
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" ) {
      searchQuery.length > 3 && navigateToSearchNow("/search");
      handleSearchClick();
    }
  };

  const handleIconClick = () => {
    navigateToSearchNow("/search");
  };

  // Alert Component
  const AlertBox = () => (
    <div className="alert-box">
      <p>الرجاء إدخال أكثر من 3 أحرف للبحث</p>
      <button onClick={() => setShowAlert(false)}>إغلاق</button>
    </div>
  );

  const handleAllFunctions = (e) =>  {
    if(searchQuery.length  > 3){
      handleIconClick();
      handleSearchClick(e)
    }
    else{
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  }

  return (
    <div className="search-bar">
      <div className="search-bar-box">
        <div className="categories-box">
          <select
            title="collections"
            name="collection"
            onChange={handleCategoryChange}
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
          <input
            type="text"
            placeholder="البحث عن منتج"
            id="seachBar"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyUp={handleKeyPress}
          />
          <IoIosSearch
            id="search-bar-icon"
            onClick={(e) => {
              handleAllFunctions(e);
            }}
          />
        </div>

        {showAlert && <AlertBox />}
      </div>
    </div>
  );
}

export default SearchBar;
