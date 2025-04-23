import { useState, useCallback, useEffect, useMemo } from "react";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import "./searchBar.css";
import { useGlobalContext } from "../../../hooks/GlobalContextHooks";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";

function SearchBar() {
  const { allProducts, setSearchQuery, searchQuery, setSearchResults, setSearchState } =
    useGlobalContext();

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

  const searchProducts = useCallback(
    (query) => {
      if (query.length >= 3 && allProducts) {
        const searchRes = allProducts.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(searchRes);
        navigateToSearchNow("/search");
      }
    },
    [allProducts, setSearchResults, navigateToSearchNow]
  );

  const debouncedSearch = useMemo(
    () => debounce((query) => searchProducts(query), 300),
    [searchProducts]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputSearch = (e) => {
    const value = e.target.value.trim();
    setSearchQuery(value);

    if (value.length >= 3) {
      debouncedSearch(value);
    } else if (value.length > 0) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (searchQuery.length >= 3) {
      debouncedSearch(searchQuery);
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter" && searchQuery.length >= 3) {
      debouncedSearch.flush();
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.length >= 3) {
      debouncedSearch.flush();
    } else {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleCloseSearch = () => {
    setSearchState(false);
    setSearchQuery("");
  };

  return (
    <div className="search-bar">
      <div className="search-bar-box">
        <div className="categories-box">
          <select
            title="collections"
            name="collection"
            value={selectedCategory}
            onChange={handleCategoryChange}
            aria-label="اختر التصنيف"
          >
            <option value="" id="select-first">
              جميع التشكيلات
            </option>
            {categories.map((category, index) => (
              <option value={category} key={index}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="search-input-box">
          <input
            type="text"
            placeholder="البحث عن منتج"
            value={searchQuery}
            onChange={handleInputSearch}
            onKeyUp={handleKeyUp}
            aria-label="البحث عن منتج"
          />
          <IoIosSearch
            id="search-bar-icon"
            onClick={handleSearchClick}
            role="button"
            aria-label="بحث"
          />
          <button 
            className="search-close-button"
            onClick={handleCloseSearch}
            aria-label="إغلاق البحث"
          >
            <IoMdClose />
          </button>
        </div>

        {showAlert && (
          <div className="alert-box-container" role="alert">
            <div className="alert-box">
              <p>الرجاء إدخال أكثر من 3 أحرف للبحث</p>
              <button
                className="alert-close"
                onClick={() => setShowAlert(false)}
                aria-label="إغلاق التنبيه"
              >
                <IoMdClose />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
