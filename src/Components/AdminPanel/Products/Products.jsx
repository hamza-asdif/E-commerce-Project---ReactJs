import React, { useEffect, useState } from "react";
import "./Products.css";
import axios from "axios";

const Products = () => {
  const Supabase_APIURL = import.meta.env.VITE_SUPABASE_APIURL;
  const supabase_APIKEY = import.meta.env.VITE_SUPABASE_APIKEY;
  const [loadingText, setLoadingText] = useState("جاري تحميل المنتجات...");
  const [loading, setLoading] = useState(true);
  const [adminProducts, setAdminProducts] = useState([]);

  useEffect(() => {
    fetchAdminProductData();
  }, []);

  const fetchAdminProductData = async () => {
    setLoading(true)
    const response = await axios.get(Supabase_APIURL, {
      headers: {
        apikey: supabase_APIKEY,
        Authorization: `bearer ${supabase_APIKEY}`,
      },
    });

    setTimeout(() => {
        setLoading(false)
    }, 1000);
    console.log("ADMIN PROODUCTS DATA :  ", response.data);
    setAdminProducts(response.data);
  };

  return (
    <div className="products-container">
      {/* عنوان الصفحة */}
      <div className="products-header">
        <h2>إدارة المنتجات</h2>
        <p>قم بإدارة منتجاتك بسهولة من هنا.</p>
      </div>

      {/* زر إضافة منتج جديد */}
      <button className="add-product-btn">
        <span>+</span> إضافة منتج جديد
      </button>

      {/* جدول المنتجات */}
      <div className="products-table">
        <div className="table-header">
          <div className="header-item">الصورة</div>
          <div className="header-item">اسم المنتج</div>
          <div className="header-item">السعر</div>
          <div className="header-item">الكمية</div>
          <div className="header-item">الحالة</div>
          <div className="header-item">الإجراءات</div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{loadingText}</p>
          </div>
        ) : adminProducts.length ? (
          adminProducts.map((product) => {
            return (
              <>
                <div className="table-row">
                  <div className="table-item">
                    <img
                      src={`/${product.Image}`}
                      alt="Product"
                      className="product-image"
                    />
                  </div>
                  <div className="table-item"> {product.name} </div>
                  <div className="table-item">{product.price} ريال</div>
                  <div className="table-item">١٠٠</div>
                  <div className="table-item">
                    <span className="status active">متوفر</span>
                  </div>
                  <div className="table-item">
                    <button className="action-btn edit">تعديل</button>
                    <button className="action-btn delete">حذف</button>
                  </div>
                </div>
              </>
            );
          })
        ) : (
          <div>none products</div>
        )}
        {/* صفوف المنتجات */}
        <div className="table-row">
          <div className="table-item">
            <img
              src="https://via.placeholder.com/50"
              alt="Product"
              className="product-image"
            />
          </div>
          <div className="table-item">منتج 1</div>
          <div className="table-item">٦٩ ريال</div>
          <div className="table-item">١٠٠</div>
          <div className="table-item">
            <span className="status active">متوفر</span>
          </div>
          <div className="table-item">
            <button className="action-btn edit">تعديل</button>
            <button className="action-btn delete">حذف</button>
          </div>
        </div>

        <div className="table-row">
          <div className="table-item">
            <img
              src="https://via.placeholder.com/50"
              alt="Product"
              className="product-image"
            />
          </div>
          <div className="table-item">منتج 2</div>
          <div className="table-item">٩٩ ريال</div>
          <div className="table-item">٥٠</div>
          <div className="table-item">
            <span className="status inactive">غير متوفر</span>
          </div>
          <div className="table-item">
            <button className="action-btn edit">تعديل</button>
            <button className="action-btn delete">حذف</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
