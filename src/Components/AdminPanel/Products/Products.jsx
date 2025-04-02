import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Products.css";
import { FcSearch } from "react-icons/fc";
import { ImSearch } from "react-icons/im";
import "alertifyjs/build/css/alertify.rtl.css";
import "alertifyjs/build/css/themes/default.rtl.css";
import "../../../Context/alertify.custom.css";
import alertify from "alertifyjs";
import supabase from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAdminGlobalContext } from "../AdminGlobalContext";
import { downloadCSV } from "../../../Context/DownloadCsv";

const Products = () => {
  const Supabase_APIURL = import.meta.env.VITE_SUPABASE_APIURL;
  const supabase_APIKEY = import.meta.env.VITE_SUPABASE_APIKEY;
  const [loadingText, setLoadingText] = useState("جاري تحميل المنتجات...");
  const [loading, setLoading] = useState(true);
  const [adminProducts, setAdminProducts] = useState([]);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationButtons, setPaginationButtons] = useState([]);
  const [priceCurrency, setPriceCurrency] = useState("ريال سعودي");
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpess, setIsExpress] = useState(false);
  const [open_EditProduct, setOpen_EditProduct] = useState(false);
  const { productsData, setProductsData } = useAdminGlobalContext();

  const navigateTo = useNavigate();

  useEffect(() => {
    fetchAdminProductData();
  }, [productsData]);

  useEffect(() => {
    handleLoading();
  }, [currentPage, adminProducts]);

  const fetchAdminProductData = () => {
    if (productsData?.length) {
      console.log("ADMIN PRODUCTS DATA :  ", productsData);

      setAdminProducts(productsData);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    } else {
      console.error("Error fetching products:", productsData);
      setLoading(false);
      setLoadingText("حدث خطأ أثناء تحميل المنتجات");
    }
  };

  const handlePagination = () => {
    if (adminProducts.length) {
      const filteredProducts =
        searchTerm ?
          adminProducts.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : adminProducts;

      const productsPerPage = 5;
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
      const currentIndex = (currentPage - 1) * productsPerPage;
      const endIndex = currentIndex + productsPerPage;

      setPaginatedProducts(filteredProducts.slice(currentIndex, endIndex));

      const buttons = Array.from({ length: totalPages }, (_, i) => i + 1);
      setPaginationButtons(buttons);

      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
      }
    }
  };

  useEffect(() => {
    handlePagination();
  }, [currentPage, adminProducts, searchTerm]);

  // !!! handle delete product from all products
  const handleDelete = async (productId) => {
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .select();

    if (error) {
      console.error("error deleting product", error);
    }
    console.log(data);

    setLoadingText("جاري تحميل المنتجات...");
    const newProducts = productsData.filter((item) => item.id !== productId);
    setProductsData(newProducts);
  };

  // !!! alertify popup function - optimize
  const alertify_DeleteProduct = useCallback((deleteFunction, productId) => {
    alertify
      .confirm(
        "تأكيد الحذف",
        "هل أنت متأكد أنك تريد حذف هذا المنتج؟",
        async function () {
          // ---- download the data first then remove the selected product
          await clone_RestoreProducts();
          if (deleteFunction) {
            await deleteFunction(productId);
            alertify.success("تم حذف المنتج بنجاح ✅");
          }
        },
        function () {
          alertify.error("تم إلغاء العملية");
        }
      )
      .set({
        labels: {
          ok: "حذف",
          cancel: "إلغاء",
        },
      });
  }, []);

  // ??? clone and downlaod all product before delete the product
  const clone_RestoreProducts = async () => {
    try {
      const { data: products, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      downloadCSV(products);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // !!! loading logic here
  const handleLoading = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  // !!! handle express checkout toggle function
  const expressCheckoutToggle = async (product) => {
    const productToUpdate = adminProducts.find((item) => {
      return item.id === product.id;
    });

    const newProducts = adminProducts.map((item) => {
      return item.id === product.id ?
          {
            ...productToUpdate,
            isExpressCheckoutEnabled: !product.isExpressCheckoutEnabled,
          }
        : item;
    });
    const newExpressCheckoutData = {
      isExpressCheckoutEnabled: !product.isExpressCheckoutEnabled,
    };

    const { data, error } = await supabase
      .from("products")
      .update(newExpressCheckoutData)
      .eq("id", product.id)
      .select();

    if (data && data.length) {
      setAdminProducts(newProducts);
    }
  };

  const handleCheckBoxClick = async (product) => {
    const action = product.isExpressCheckoutEnabled ? "إيقاف" : "تفعيل";
    const message = `هل أنت متأكد أنك تريد ${action} خيار الدفع السريع؟`;

    return alertify
      .confirm(
        `${action} خيار الدفع السريع`,
        message,
        async function () {
          if (product.isExpressCheckoutEnabled) {
            alertify.success("تم إيقاف خيار الدفع السريع");
          } else {
            alertify.success("تم تفعيل خيار الدفع السريع");
          }

          await expressCheckoutToggle(product);
        },
        function () {
          alertify.error("تم إلغاء العملية");
        }
      )
      .set({
        labels: {
          ok: "تأكيد",
          cancel: "إلغاء",
        },
      });
  };

  const ProductsTableData = () => {
    return (
      <div className="table-responsive">
        <table className="products-table">
          <thead>
            <tr>
              <th>التسلسل</th>
              <th>صورة المنتج</th>
              <th>اسم المنتج</th>
              <th>السعر</th>
              <th>الكمية</th>
              <th>الدفع السريع</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td className="td-img">
                  <div className="image-container-admin">
                    <img
                      src={product.Image}
                      alt={product.name}
                      className="product-image"
                      loading="lazy"
                    />
                  </div>
                </td>
                <td className="product-name">{product.name}</td>
                <td className="product-price">
                  <span className="price-amount">{product.price}</span>
                  <span className="price-currency">{priceCurrency}</span>
                </td>
                <td>
                  <span
                    className={`stock-badge ${
                      product.Stock > 0 ? "in-stock" : "out-stock"
                    }`}
                  >
                    {product.Stock}
                  </span>
                </td>
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
                <td className="actions-cell">
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
                        <i className="fas fa-eye"></i>
                      </a>
                    </button>
                    <button
                      className="action-btn print-btn"
                      title="تعديل المنتج"
                      onClick={() =>
                        navigateTo(`/admin/edit-product/${product.id}`)
                      }
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="action-btn more-btn"
                      onClick={() =>
                        alertify_DeleteProduct(handleDelete, product.id)
                      }
                      title="حذف المنتج"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="products-container">
        <div className="header-section">
          <h1 className="admin-h1">إدارة المنتجات</h1>
          <div className="actions-bar">
            <div className="search-box">
              <input
                type="text"
                placeholder="بحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <ImSearch className="search-icon" />
            </div>
            <button
              className="add-product-btn"
              onClick={() => navigateTo("/admin/add-product")}
            >
              <i className="plus-icon">+</i> إضافة منتج جديد
            </button>
          </div>
        </div>

        {loading ?
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{loadingText}</p>
          </div>
        : paginatedProducts.length === 0 ?
          <div className="no-products">
            <p>لا توجد منتجات متاحة</p>
          </div>
        : <ProductsTableData />}

        {!loading && paginatedProducts.length > 0 && (
          <div className="pagination-container">
            <button
              className="pagination-btn prev-btn"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              <i className="arrow-icon">◀</i>
              <span>السابق</span>
            </button>
            <div className="pagination-numbers">
              {paginationButtons.length > 5 ?
                <>
                  {currentPage > 1 && (
                    <button
                      className={`pagination-number`}
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </button>
                  )}

                  {currentPage > 3 && (
                    <span className="pagination-ellipsis">...</span>
                  )}

                  {paginationButtons
                    .filter(
                      (num) => num >= currentPage - 1 && num <= currentPage + 1
                    )
                    .map((num) => (
                      <button
                        key={num}
                        onClick={() => setCurrentPage(num)}
                        className={`pagination-number ${
                          currentPage === num ? "active" : ""
                        }`}
                      >
                        {num}
                      </button>
                    ))}

                  {currentPage < paginationButtons.length - 2 && (
                    <span className="pagination-ellipsis">...</span>
                  )}

                  {currentPage < paginationButtons.length && (
                    <button
                      className={`pagination-number`}
                      onClick={() => setCurrentPage(paginationButtons.length)}
                    >
                      {paginationButtons.length}
                    </button>
                  )}
                </>
              : paginationButtons.map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`pagination-number ${
                      currentPage === num ? "active" : ""
                    }`}
                  >
                    {num}
                  </button>
                ))
              }
            </div>
            <button
              className="pagination-btn next-btn"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === paginationButtons.length}
            >
              <span>التالي</span>
              <i className="arrow-icon">▶</i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
