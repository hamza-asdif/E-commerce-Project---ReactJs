import { useEffect, useState } from "react";
import { FaFilter, FaSadTear } from "react-icons/fa";
import ProductCard from "../ProductLayout/ProductCard/ProductCard";
import { useGlobalContext } from "../../Context/GlobalContext";
import "./SearchForProducts.css";

function SearchForProducts() {
  const { searchResults } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [searchResults_InPage, setSearchResults_InPage] = useState([]);
  const [filterActive, setfilterActive] = useState(false);
  const [searchReasults_Restor, setSearchReasults_Restor] = useState([]);
  const [clickToFilter, setClickToFilter] = useState(false);
  const [filter_loading, setFilter_loading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setSearchReasults_Restor(searchResults);
  }, [searchResults]);

  useEffect(() => {
    setSearchResults_InPage(searchResults);
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchResults]);

  const filterToggle = () => {
    setClickToFilter((prev) => !prev);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    // Prevent body scroll when filter is open
    document.body.style.overflow = !isFilterOpen ? "hidden" : "auto";
  };

  const handleFilteringClick = (e) => {
    e.stopPropagation();
    const value = e.target.value;

    if (value === "default") {
      setSearchResults_InPage(searchReasults_Restor);
      return;
    }

    const searchResults_Filtering = [...searchResults].sort((a, b) => {
      switch (value) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setfilterActive(true);
    setSearchResults_InPage(searchResults_Filtering);
    setTimeout(() => {
      setfilterActive(false);
    }, 1000);
  };

  const handleSelectClick = (e) => {
    e.stopPropagation();
    if (window.innerWidth <= 768) {
      setClickToFilter(true);
    }
  };

  const handleSelectChange = (e) => {
    handleFilteringClick(e);
    setIsFilterOpen(false);
    document.body.style.overflow = "auto";
    if (window.innerWidth <= 768) {
      setClickToFilter(false);
    }
  };

  useEffect(() => {
    setFilter_loading(true);

    setTimeout(() => {
      setFilter_loading(false);
    }, 1500);
  }, [filterActive]);

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
        <div className={`search-filters ${isFilterOpen ? "active" : ""}`}>
          <button
            className="filter-btn"
            onClick={toggleFilter}
            aria-label="Toggle filter menu"
          >
            <FaFilter />
            <span>تصفية النتائج</span>
          </button>

          <select
            name="filter-select"
            id="filter_select"
            className="filter-select"
            onChange={handleSelectChange}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="default">ترتيب حسب</option>
            <option value="price-asc">السعر: من الأقل إلى الأعلى</option>
            <option value="price-desc">السعر: من الأعلى إلى الأقل</option>
            <option value="name-asc">الإسم: أ-ي</option>
          </select>
        </div>
      </div>

      <div className="search-content">
        {filter_loading ? (
          <div className="filter-loading-overlay">
            <div className="loading-spinner"></div>
            <p>جاري تصفية المنتجات...</p>
          </div>
        ) : searchResults_InPage && searchResults_InPage.length ? (
          <div className="products-grid">
            {searchResults_InPage.map((product) => (
              <ProductCard
                key={product.id}
                ProductId={product.id}
                ProductTitle={product.name}
                ProductImage={product.Image}
                ProductPrice={product.price}
                ProductOldPrice={product.oldPrice}
                Rating={product.Rating}
              />
            ))}
          </div>
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
