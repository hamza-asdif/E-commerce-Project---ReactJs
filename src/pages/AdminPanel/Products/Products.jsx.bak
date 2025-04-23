import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminGlobalContext } from "../AdminGlobalContext";
import supabase from "../../../supabaseClient";
import alertify from "alertifyjs";
import { FiSearch, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import "./Products.css";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const navigateTo = useNavigate();
  const { productsData, setProductsData } = useAdminGlobalContext();

  // Fetch products with search and pagination
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let query = supabase.from("products").select("*");

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      setProductsData(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products");
      alertify.error("حدث خطأ في تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  }, [setProductsData]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return productsData.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [productsData, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle checkbox change for express checkout
  const handleCheckBoxClick = async (product) => {
    try {
      const { error: updateError } = await supabase
        .from("products")
        .update({ isExpressCheckoutEnabled: !product.isExpressCheckoutEnabled })
        .eq("id", product.id);

      if (updateError) throw updateError;

      setProductsData((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id
            ? { ...p, isExpressCheckoutEnabled: !p.isExpressCheckoutEnabled }
            : p
        )
      );

      alertify.success("تم تحديث حالة الطلب السريع بنجاح");
    } catch (error) {
      console.error("Error updating express checkout:", error);
      alertify.error("حدث خطأ في تحديث حالة الطلب السريع");
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    try {
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (deleteError) throw deleteError;

      setProductsData((prevProducts) =>
        prevProducts.filter((p) => p.id !== productId)
      );
      alertify.success("تم حذف المنتج بنجاح");
    } catch (error) {
      console.error("Error deleting product:", error);
      alertify.error("حدث خطأ في حذف المنتج");
    }
  };

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchProducts} className="retry-button">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="products-container">
        <div className="header-section">
          <h1 className="admin-h1">المنتجات</h1>
          <div className="actions-bar">
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder="البحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="search-icon" />
            </div>
            <button
              className="add-product-btn"
              onClick={() => navigateTo("/admin/add-product")}
            >
              <span className="plus-icon">+</span>
              إضافة منتج جديد
            </button>
          </div>
        </div>

        <div className="table-responsive">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>جاري تحميل المنتجات...</p>
            </div>
          ) : (
            <>
              <table className="products-table">
                <thead>
                  <tr>
                    <th>المنتج</th>
                    <th>السعر</th>
                    <th>المخزون</th>
                    <th>الفئة</th>
                    <th>الطلب السريع</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="image-container-admin">
                          <img
                            src={product.Image}
                            alt={product.name}
                            className="product-image"
                          />
                        </div>
                      </td>
                      <td>
                        <span className="price-amount">{product.price}</span>
                        <span className="price-currency">ر.س</span>
                      </td>
                      <td>
                        <span
                          className={`stock-badge ${product.Stock > 0 ? "in-stock" : "out-stock"}`}
                        >
                          {product.Stock}
                        </span>
                      </td>
                      <td>{product.category || "بدون فئة"}</td>
                      <td>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={product.isExpressCheckoutEnabled}
                            onChange={() => handleCheckBoxClick(product)}
                          />
                          <span className="slider"></span>
                        </label>
                      </td>
                      <td className="actions-cell_products">
                        <div className="action-buttons_2">
                          <button
                            className="action-btn view-btn"
                            title="عرض التفاصيل"
                          >
                            <a
                              href={`/product/${product.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="open-product-link"
                            >
                              <FiEye />
                            </a>
                          </button>
                          <button
                            className="action-btn print-btn"
                            title="تعديل المنتج"
                            onClick={() =>
                              navigateTo(`/admin/edit-product/${product.id}`)
                            }
                          >
                            <FiEdit />
                          </button>
                          <button
                            className="action-btn more-btn"
                            title="حذف المنتج"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  السابق
                </button>
                <div className="pagination-numbers">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      className={`pagination-number ${currentPage === i + 1 ? "active" : ""}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  className="pagination-btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  التالي
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
