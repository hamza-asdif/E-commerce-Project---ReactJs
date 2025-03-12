import React, { useEffect, useState } from "react";
import { FaFilter, FaSort, FaSearch } from "react-icons/fa";
import { useGlobalContext } from "../../Context/GlobalContext";
import ProductCard from "../ProductLayout/ProductCard/ProductCard";
import "./ShopPage.css";
import axios from "axios";

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
  const [filterPrice, setFiltterPrice] = useState({
    min: 0,
    max: 1000,
  });

  // Get products from context
  const { allProducts } = useGlobalContext();

  // Remove or modify this useEffect

  useEffect(() => {
    const initializePage = async () => {
      if (allProducts.length) {
        try {
          handleDrawCategory();
          // Wait a bit for smooth transition
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error("Error initializing shop:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    initializePage();
  }, [allProducts]);

  // Functions you'll need to implement:
  // 1. handleFilterByCategory - Filter products by category
  // 2. handleSortProducts - Sort by price, name, newest
  // 3. handlePriceRangeFilter - Filter by price range
  // 4. handleSearch - Search products by name
  // 5. handlePagination - Implement pagination for products

  const handleSortProducts = (e) => {
    if (allProducts && allProducts.length) {
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

      // Choose which products array to sort - category products or all products
      const productsToSort =
        activeCategory === "all" ? [...allProducts] : [...categoryProducts];

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
      }, 500); // Add this line
    }
  };

  // Fix the handleDrawCategory function
  const handleDrawCategory = () => {
    const allCategories = allProducts.map((p) => p.category);
    const uniqueCategories = [...new Set(allCategories.slice(0, 10))];
    setCategory(uniqueCategories);
  };

  const handleFilterByCategory = (categoryName) => {
    setLoading(true);
    if (allProducts.length) {
      if (categoryName === "all") {
        setActiveCategory("all");
        setCategoryProducts([]); // Add this
        setIsSortActive(false); // Add this
        setSortedProducts([]); // Reset sort
        setLoading(false);
        return;
      }

      const selectedCategory = [...allProducts].filter(
        (product) => product.category === categoryName
      );

      setActiveCategory(categoryName);
      setCategoryProducts(selectedCategory);
      setIsSortActive(false); // Reset sort state when changing category
      setSortedProducts([]); // Reset sorted products
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
    setIsSortActive(false); // Add this
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
    setLoading(true);
    setLoadingText("جاري تصفية المنتجات حسب السعر...");

    // Fix the condition to check for "all" instead of !activeCategory
    const getProductsFirst =
      activeCategory === "all" ? [...allProducts] : [...categoryProducts];

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
    }, 500);
  };

  const handlePriceInput = (e) => {
    const { name, value } = e.target;
    setFiltterPrice((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
    console.log(`${name} price:`, value);
  };

  return (
    <div className="shop-page">
      {/* Shop Header */}
      <div className="shop-header">
        <h1>تسوق منتجاتنا</h1>
        <p>اكتشف مجموعتنا المميزة من المنتجات</p>
      </div>

      <div className="shop-container">
        {/* Filters Panel */}
        <aside className={`shop-filters ${isFilterOpen ? "active" : ""}`}>
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

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{loadingText}</p>
            </div>
          ) : (
            <div className="products-grid">
              {ProductsFilters(
                isSortActive
                  ? sortedProducts
                  : activeCategory === "all"
                  ? allProducts
                  : categoryProducts || []
              )}
            </div>
          )}
          {/* Pagination */}
          <div className="shop-pagination">
            {/* Add pagination controls here */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ShopPage;
