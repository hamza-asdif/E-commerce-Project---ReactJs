import { useEffect, useRef, useState, useCallback } from "react";
import { FaFilter, FaSort, FaTimes } from "react-icons/fa";
import { useGlobalContext } from "../../hooks/GlobalContextHooks";
import ProductCard from "../../shared/ui/ProductLayout/ProductCard/ProductCard";
import "./ShopPage.css";

function ShopPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [isSortActive, setIsSortActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("جاري تحميل المنتجات...");
  const [category, setCategory] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [shopPage_AllProducts, setShopPageAllProducts] = useState([]);
  const [filterPrice, setFiltterPrice] = useState({
    min: 0,
    max: 1000,
  });
  const filterSideBarRef_Mobile = useRef(null);
  const Min_PriceRef = useRef(null);
  const Max_PriceRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [itemsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const { allProducts } = useGlobalContext();

  const handleDrawCategory = useCallback(() => {
    if (shopPage_AllProducts && shopPage_AllProducts.length) {
      const getCategories = shopPage_AllProducts.map((product) => {
        return product.category;
      });

      const uniqueCategories = [...new Set(getCategories)];
      setCategory(uniqueCategories);
    }
  }, [shopPage_AllProducts]);

  useEffect(() => {
    if (allProducts && allProducts.length) {
      setShopPageAllProducts(allProducts);
      setLoading(false);
      handleDrawCategory();
    }
  }, [allProducts, handleDrawCategory]);

  const handleFilterByCategory = (categoryName) => {
    setLoading(true);

    if (allProducts.length) {
      const select = document.querySelector(".sort-select");
      if (select) select.value = "default";

      setIsSortActive(false);
      setSortedProducts([]);

      if (categoryName === "all") {
        setActiveCategory("all");
        setCategoryProducts([]);
        setLoading(false);
        return;
      }

      const selectedCategory = [...shopPage_AllProducts].filter(
        (product) => product.category === categoryName
      );

      setActiveCategory(categoryName);
      setCategoryProducts(selectedCategory);
      setLoading(false);
    }
  };

  const ProductsFilters = (arr) => {
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
        Rating={product.Rating}
      />
    ));
  };

  const handleFilterByPrice = () => {
    if (
      Object.values(filterPrice)[0] !== 0 &&
      Object.values(filterPrice)[1] !== 1000
    ) {
      setLoading(true);
      setLoadingText("جاري تصفية المنتجات حسب السعر...");

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

      setSortedProducts(NewProducts);
      setIsSortActive(true);

      setLoading(false);
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

  const handlePagination = useCallback(() => {
    const sourceProducts = isSortActive
      ? sortedProducts
      : activeCategory === "all"
        ? allProducts
        : categoryProducts;

    if (sourceProducts?.length) {
      const pageCount = Math.ceil(sourceProducts.length / itemsPerPage);
      setTotalPages(pageCount);

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      const currentPageProducts = sourceProducts.slice(startIndex, endIndex);
      setPaginatedProducts(currentPageProducts);
    }
  }, [
    isSortActive,
    sortedProducts,
    activeCategory,
    allProducts,
    categoryProducts,
    itemsPerPage,
    currentPage,
  ]);

  useEffect(() => {
    handlePagination();
  }, [
    currentPage,
    allProducts,
    activeCategory,
    isSortActive,
    sortedProducts,
    handlePagination,
  ]);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortProducts = (e) => {
    const targetOption = e.target.value;
    setLoading(true);
    setLoadingText("جاري ترتيب المنتجات...");

    if (targetOption === "default") {
      setIsSortActive(false);
      setSortedProducts([]);
      setLoading(false);
      return;
    }

    const productsToSort =
      activeCategory === "all"
        ? [...shopPage_AllProducts]
        : [...categoryProducts];

    const sorted = productsToSort.sort((a, b) => {
      switch (targetOption) {
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

    setSortedProducts(sorted);
    setIsSortActive(true);
    setLoading(false);
  };

  const clearAllFilters = () => {
    setActiveCategory("all");
    setCategoryProducts([]);
    setFiltterPrice({
      min: 0,
      max: 1000,
    });
    setSortedProducts([]);
    setIsSortActive(false);
    setCurrentPage(1);

    // Reset price inputs
    if (Min_PriceRef.current) Min_PriceRef.current.value = "";
    if (Max_PriceRef.current) Max_PriceRef.current.value = "";

    // Reset sort select
    const select = document.querySelector(".sort-select");
    if (select) select.value = "default";
  };

  const clearPriceFilter = () => {
    setFiltterPrice({
      min: 0,
      max: 1000,
    });
    if (Min_PriceRef.current) Min_PriceRef.current.value = "";
    if (Max_PriceRef.current) Max_PriceRef.current.value = "";
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>تسوق منتجاتنا</h1>
        <p>اكتشف مجموعتنا المميزة من المنتجات</p>
      </div>

      <div className="shop-container">
        <aside
          className={`shop-filters ${isFilterOpen ? "active" : ""}`}
          ref={filterSideBarRef_Mobile}
        >
          <div className="filters-header">
            <h3>تصفية المنتجات</h3>
            <button
              onClick={clearAllFilters}
              className="clear-all-btn"
              title="مسح جميع الفلاتر"
            >
              مسح الكل
            </button>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="close-filter-btn"
              aria-label="إغلاق"
            >
              <FaTimes />
            </button>
          </div>

          <div className="filter-section">
            <h4>الفئات</h4>
            <div className="categories-list">
              <h6
                className={`category-name ${
                  activeCategory === "all" ? "active" : ""
                }`}
                onClick={() => handleFilterByCategory("all")}
              >
                عرض الكل
              </h6>
              {category.length > 0 &&
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
            </div>
          </div>

          <div className="filter-section">
            <div className="price-header">
              <h4>نطاق السعر</h4>
              <button
                onClick={clearPriceFilter}
                className="clear-price-btn"
                title="مسح فلتر السعر"
              >
                مسح
              </button>
            </div>
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

              <button
                className="apply-filter-btn"
                onClick={handleFilterByPrice}
              >
                تطبيق السعر
              </button>
            </div>
          </div>
        </aside>

        <main className="shop-content">
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
