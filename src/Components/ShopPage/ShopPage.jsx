import React, { useState } from 'react';
import { FaFilter, FaSort, FaSearch } from 'react-icons/fa';
import { useGlobalContext } from '../../Context/GlobalContext';
import ProductCard from '../ProductLayout/ProductCard/ProductCard';
import './ShopPage.css';

function ShopPage() {
  // States needed for shop functionality
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get products from context
  const { allProducts } = useGlobalContext();

  // Functions you'll need to implement:
  // 1. handleFilterByCategory - Filter products by category
  // 2. handleSortProducts - Sort by price, name, newest
  // 3. handlePriceRangeFilter - Filter by price range
  // 4. handleSearch - Search products by name
  // 5. handlePagination - Implement pagination for products

  return (
    <div className="shop-page">
      {/* Shop Header */}
      <div className="shop-header">
        <h1>تسوق منتجاتنا</h1>
        <p>اكتشف مجموعتنا المميزة من المنتجات</p>
      </div>

      <div className="shop-container">
        {/* Filters Panel */}
        <aside className={`shop-filters ${isFilterOpen ? 'active' : ''}`}>
          <div className="filters-header">
            <h3>تصفية المنتجات</h3>
            <button onClick={() => setIsFilterOpen(false)} className='filter-btn'>&times;</button>
          </div>

          {/* Categories Filter */}
          <div className="filter-section">
            <h4>الفئات</h4>
            <div className="categories-list">
              {/* Map through your categories here */}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <h4>نطاق السعر</h4>
            <div className="price-ranges">
              {/* Add your price range options here */}
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
              <select className="sort-select">
                <option value="newest">الأحدث</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="name-asc">أبجدياً: أ-ي</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {allProducts?.map(product => (
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