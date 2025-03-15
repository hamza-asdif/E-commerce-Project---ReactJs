import React, { useEffect, useRef, useState } from "react";
import { FaFilter, FaSort, FaSearch } from "react-icons/fa";
import { useGlobalContext } from "../../Context/GlobalContext";
import ProductCard from "../ProductLayout/ProductCard/ProductCard";
import "./ShopPage.css";
import axios from "axios";
import { GoTrueAdminApi } from "@supabase/supabase-js";

function ShopPage() {
  // States needed for shop functionality
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [isSortActive, setIsSortActive] = useState(false);
  const [loading, setLoading] = useState(true); // Change this line
  const [loadingText, setLoadingText] = useState("جاري تحميل المنتجات...");
  const [category, setCategory] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [restorAllProducts, setRestorAllProducts] = useState(null);
  const [shopPage_AllProducts, setShopPageAllProducts] = useState([]);
  const [filterPrice, setFiltterPrice] = useState({
    min: 0,
    max: 1000,
  });
  const [isThisMobile, setIsThisMobile] = useState(false);
  const filterSideBarRef_Mobile = useRef(null);
  const Min_PriceRef = useRef(null);
  const Max_PriceRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [itemsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // Get products from context
  const { allProducts } = useGlobalContext();

  // Remove or modify this useEffect

  // Functions you'll need to implement:
  // 1. handleFilterByCategory - Filter products by category
  // 2. handleSortProducts - Sort by price, name, newest
  // 3. handlePriceRangeFilter - Filter by price range
  // 4. handleSearch - Search products by name
  // 5. handlePagination - Implement pagination for products

  useEffect(() => {
    const pageInitialize = async () => {
      if (allProducts && allProducts.length) {
        setLoading(false);
        setShopPageAllProducts(allProducts);

        setTimeout(() => {
          console.log(shopPage_AllProducts);
        }, 1000);
      }
    };

    pageInitialize();
  }, [allProducts]);

  useEffect(() => {
    console.log(shopPage_AllProducts);
    handleDrawCategory();
  }, [shopPage_AllProducts]);

  useEffect(() => {
    handlePagination();
  }, []);

  // Modified handleSortProducts
  const handleSortProducts = (e) => {
    if (allProducts.length) {
      setLoading(true);
      setLoadingText("جاري تصفية المنتجات...");

      const Targetoption = e.target.value;

      // Reset to default view
      if (Targetoption === "default") {
        setIsSortActive(false);
        setSortedProducts([]);
        setLoading(false);
        return;
      }

      // Get the correct source of products to sort
      let productsToSort;
      if (isSortActive) {
        productsToSort = [...sortedProducts];
      } else if (activeCategory === "all") {
        productsToSort = [...shopPage_AllProducts];
      } else {
        productsToSort = [...categoryProducts];
      }

      const cloneProducts_Sorted = productsToSort.sort((a, b) => {
        switch (Targetoption) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "name-asc":
            return a.name.localeCompare(b.name, "ar");
          default:
            return 0;
        }
      });

      setSortedProducts(cloneProducts_Sorted);
      setIsSortActive(true);

      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  // Fix the handleDrawCategory function
  const handleDrawCategory = () => {
    if (shopPage_AllProducts && shopPage_AllProducts.length) {
      const getCategories = shopPage_AllProducts.map((product) => {
        return product.category;
      });

      const uniqueCategories = [...new Set(getCategories)];
      setCategory(uniqueCategories);
      console.log("CATEGORY", getCategories, uniqueCategories);
    }
  };

  const handlePriceInput_reset = () => {
    Min_PriceRef.current.value = "";
    Max_PriceRef.current.value = "";
  };

  // Modified handleFilterByCategory
  const handleFilterByCategory = (categoryName) => {
    setLoading(true);

    if (allProducts.length) {
      // Clear sorting state
      const select = document.querySelector(".sort-select");
      if (select) select.value = "default";

      // Reset all filters first
      setIsSortActive(false);
      setSortedProducts([]);

      if (categoryName === "all") {
        setActiveCategory("all");
        setCategoryProducts([]);
        setLoading(false);
        return;
      }

      // Get fresh products from the main source
      const selectedCategory = [...shopPage_AllProducts].filter(
        (product) => product.category === categoryName
      );

      setActiveCategory(categoryName);
      setCategoryProducts(selectedCategory);
      // Reset shopPage_AllProducts to original state
      handlePriceInput_reset();
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);

    handleFilterSideBar_Mobile();
  };

  const ProductsFilters = (arr) => {
    // Only show no products message if we're not loading and array is empty
    if (!loading && (!arr || arr.length === 0)) {
      return (
        <div className="no-products">
          <p>لا توجد منتجات متاحة</p>
        </div>
      );
    }

    return arr?.map((product) => (
      <ProductCard
        key={product.id}
        ProductId={product.id}
        ProductTitle={product.name}
        ProductImage={product.Image}
        ProductPrice={product.price}
        ProductOldPrice={product.oldPrice}
      />
    ));
  };

  const handleToggle_reset_filters = () => {
    setIsFilterOpen(false);
    setActiveCategory("all"); // Change from false to "all"
    setCategoryProducts([]); // Add this
    setSortedProducts([]); // Add this
    setIsSortActive(false); // Add this*
    setFiltterPrice(() => ({
      min: 0,
      max: 1000,
    }));

    Min_PriceRef.current.value = "";
    Max_PriceRef.current.value = "";
  };

  const resetFilters = () => {
    setIsFilterOpen(false);
    setActiveCategory("all");
    setCategoryProducts([]);
    setSortedProducts([]);
    setIsSortActive(false);
    setLoadingText("جاري تحميل المنتجات..."); // Reset loading text
  };

  const handleFilterByPrice = () => {
    if (
      Object.values(filterPrice)[0] !== 0 &&
      Object.values(filterPrice)[1] !== 1000
    ) {
      setLoading(true);
      setLoadingText("جاري تصفية المنتجات حسب السعر...");

      // Fix the condition to check for "all" instead of !activeCategory
      const getProductsFirst =
        activeCategory === "all"
          ? [...shopPage_AllProducts]
          : [...categoryProducts];

      const NewProducts = getProductsFirst.filter((product) => {
        const PriceMin = parseInt(filterPrice.min);
        const PriceMax = parseInt(filterPrice.max);
        const ProductPrice = Number(product.price);

        return ProductPrice >= PriceMin && ProductPrice <= PriceMax;
      });

      // Update the filtered products state
      setSortedProducts(NewProducts);
      setIsSortActive(true);

      setTimeout(() => {
        setLoading(false);
      }, 1000);

      handleFilterSideBar_Mobile();
    }
  };

  const handlekeyPress = (e) => {
    if (e.key === "Enter") {
      handleFilterByPrice();
    }
  };

  const handlePriceInput = (e) => {
    const { name, value } = e.target;
    setFiltterPrice((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
    console.log(`${name} price:`, value);
  };

  const handleFilterSideBar_Mobile = () => {
    window.addEventListener("resize", () => {
      if (window.outerWidth < 980) {
        filterSideBarRef_Mobile.current.classList.remove("active");
        setIsFilterOpen(false);
      }
    });

    if (window.outerWidth < 1280) {
      filterSideBarRef_Mobile.current.classList.remove("active");
      setIsFilterOpen(false);
    }
  };

  const handlePagination = () => {
    // Get the correct products array based on current filters/sorts
    const sourceProducts = isSortActive
      ? sortedProducts
      : activeCategory === "all"
      ? allProducts
      : categoryProducts;

    if (sourceProducts?.length) {
      // Calculate total pages
      const pageCount = Math.ceil(sourceProducts.length / itemsPerPage);
      setTotalPages(pageCount);

      // Calculate slice indexes
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // Get current page products
      const currentPageProducts = sourceProducts.slice(startIndex, endIndex);
      setPaginatedProducts(currentPageProducts);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setLoading(true)

    setTimeout(() => {
      handlePagination();
      setLoading(false)
    }, 800);
  }, [currentPage, allProducts, activeCategory, isSortActive, sortedProducts]);

  return (
    <div className="shop-page">
      {/* Shop Header */}
      <div className="shop-header">
        <h1>تسوق منتجاتنا</h1>
        <p>اكتشف مجموعتنا المميزة من المنتجات</p>
      </div>

      <div className="shop-container">
        {/* Filters Panel */}
        <aside
          className={`shop-filters ${isFilterOpen ? "active" : ""}`}
          ref={filterSideBarRef_Mobile}
        >
          <div className="filters-header">
            <h3>تصفية المنتجات</h3>
            <button onClick={handleToggle_reset_filters} className="filter-btn">
              &times;
            </button>
          </div>

          {/* Categories Filter */}
          <div className="filter-section">
            <h4>الفئات</h4>
            <div className="categories-list">
              {/* Map through your categories here */}
              {category.length &&
                category.map((categ, index) => (
                  <h6
                    key={index}
                    className={`category-name ${
                      activeCategory === categ ? "active" : ""
                    }`}
                    onClick={() => handleFilterByCategory(categ)}
                  >
                    {categ}
                  </h6>
                ))}
              <h6
                className={`category-name ${
                  activeCategory === "all" ? "active" : ""
                }`}
                onClick={() => handleFilterByCategory("all")}
              >
                عرض الكل
              </h6>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <h4>نطاق السعر</h4>
            <div className="price-ranges">
              <div className="price-inputs">
                <div className="price-field">
                  <label>من</label>
                  <div className="input-with-currency">
                    <input
                      type="number"
                      placeholder="0"
                      name="min"
                      onChange={(e) => handlePriceInput(e)}
                      onKeyDown={(e) => handlekeyPress(e)}
                      ref={Min_PriceRef}
                    />
                    <span className="currency">ر.س</span>
                  </div>
                </div>
                <div className="price-field">
                  <label>إلى</label>
                  <div className="input-with-currency">
                    <input
                      type="number"
                      placeholder="1000"
                      name="max"
                      onChange={(e) => handlePriceInput(e)}
                      onKeyDown={(e) => handlekeyPress(e)}
                      ref={Max_PriceRef}
                    />
                    <span className="currency">ر.س</span>
                  </div>
                </div>
              </div>

              <div className="price-slider">
                <div className="slider-track"></div>
                <input type="range" className="min-price" />
                <input type="range" className="max-price" />
              </div>

              <button
                className="apply-filter-btn"
                onClick={handleFilterByPrice}
              >
                تطبيق السعر
              </button>
            </div>
          </div>
        </aside>

        {/* Products Section */}
        <main className="shop-content">
          {/* Controls Bar */}
          <div className="shop-controls">
            <button
              className="filter-toggle"
              onClick={() => setIsFilterOpen(true)}
            >
              <FaFilter /> تصفية
            </button>

            <div className="sort-control">
              <FaSort />
              <select className="sort-select" onChange={handleSortProducts}>
                <option value="default">ترتيب حسب</option>
                <option value="newest">الأحدث</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="name-asc">أبجدياً: أ-ي</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}

          {/* Products Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{loadingText}</p>
            </div>
          ) : (
            <div className="products-grid">
              {ProductsFilters(paginatedProducts)}
            </div>
          )}

          {/* Pagination */}
          <div className="shop-pagination">
            <div className="pagination-container">
              <button
                className="pagination-button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                السابق
              </button>

              <div className="pagination-numbers">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`pagination-number ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                    onClick={() => handlePageClick(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                className="pagination-button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                التالي
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ShopPage;
