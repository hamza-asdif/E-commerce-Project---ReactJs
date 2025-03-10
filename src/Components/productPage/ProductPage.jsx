import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../Context/GlobalContext";
import { FaCartPlus } from "react-icons/fa";
import "./Productpage.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../Breadcrumb/Breadcrumb";

function ProductPage() {
  const {
    productPage_Product,
    setproductPage_Product,
    toggleCart,
    setSearchState,
    resetAllStates,
  } = useGlobalContext();
  const [productPage_Storage, setProductPage_Storage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noProduct, setNoProduct] = useState(false);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullName: "hamza",
    tel: "0645660940",
    city: "test",
    address: "test",
  });

  useEffect(() => {
    resetAllStates();
    return () => {
      toggleCart(false);
      setSearchState(false);
    };
  }, []);

  const getPoductById = async () => {
    try {
      const response = await axios.get(
        `https://api.jsonbin.io/v3/b/67c54486e41b4d34e49fc194`,
        {
          headers: {
            "X-Access-Key":
              "$2a$10$lHC6.TYTGJdHEzvNt8D6DOCWIDRJHjfUUWMBzLBRfhQGlEBEIK6oa",
          },
        }
      );

      const product = response.data.record.Products.find(
        (p) => p.id === parseInt(id)
      );

      if (product) {
        setproductPage_Product(product);
        setLoading(false);
        setNoProduct(false);
      } else {
        // No product found with that ID
        setproductPage_Product({});
        setLoading(false);
        setNoProduct(true);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
      setNoProduct(true);
    }
  };

  useEffect(() => {
    getPoductById();
  }, [id]); // Add id as dependency

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>جاري تحميل المنتج...</p>
      </div>
    );
  }

  if (noProduct) {
    return (
      <div className="product-not-found">
        <div className="container">
          <h2>المنتج غير موجود</h2>
          <p>عذراً، لم يتم العثور على المنتج المطلوب.</p>
        </div>
      </div>
    );
  }

  // Add debug logging
  console.log("Product page data:", productPage_Product);

  // Simulated product images array (since we're not using an API)
  const productImages = [
    productPage_Product.Image,
    productPage_Product.Image,
    productPage_Product.Image,
    productPage_Product.Image,
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("full name");
    const tel = formData.get("tel");
    const city = formData.get("city");
    const address = formData.get("address");

    // Here you can handle form submission manually
    console.log("Order submitted");
  };

  const handleInputChange = (e) => {
    e.target.value.trim() != "" &&
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
    <Breadcrumb
        pathNameInfo="
المنتجات الأكثر طلبا في المملكة"
      />
    <div className="single-product-page">
      {/* Breadcrumb Navigation */}

      {/* Product Content */}
      <div className="single-product-container">
        <div className="container">
          <div className="single-product-content">
            {/* Product Gallery */}
            <div className="single-product-gallery">
              <div className="single-product-main-image">
                <img
                  src={`/${productPage_Product.Image}`}
                  alt={productPage_Product.name}
                />
              </div>
              <div className="single-product-thumbnails">
                {productImages.map((image, index) => (
                  <div key={index} className="single-product-thumbnail">
                    <img
                      src={`/${image}`}
                      alt={`${productPage_Product.name} - ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="single-product-details">
              <h1 className="single-product-title">
                {productPage_Product.name}
              </h1>

              <div className="single-product-pricing">
                <span className="single-product-current-price">
                  {productPage_Product.price} ريال سعودي
                </span>
                {productPage_Product.OldPrice && (
                  <span className="single-product-old-price">
                    {productPage_Product.OldPrice} ريال سعودي
                  </span>
                )}
              </div>

              {/* Order Form */}
              <div className="single-product-order-section">
                <h3 className="single-product-order-title">
                  للطلب يرجى إدخال معلوماتك في الخانات أسفله
                </h3>

                <form
                  className="single-product-order-form"
                  onSubmit={handleSubmit}
                  onChange={handleInputChange}
                >
                  <div className="single-product-form-grid">
                    <input
                      type="text"
                      placeholder="الاسم بالكامل"
                      required
                      name="fullName"
                    />
                    <input
                      type="tel"
                      placeholder="رقم الهاتف"
                      required
                      dir="rtl"
                      name="tel"
                    />
                    <input
                      type="text"
                      placeholder="المدينة"
                      required
                      name="city"
                    />
                    <input
                      type="text"
                      placeholder="العنوان"
                      required
                      name="address"
                    />
                  </div>

                  <button
                    type="submit"
                    className="single-product-submit-button"
                  >
                    <FaCartPlus className="single-product-cart-icon" />
                    <span>لتأكيد الطلب اضغط هنا</span>
                  </button>
                </form>
              </div>

              {/* Product Stats */}
              <div className="single-product-stats">
                <p className="single-product-stats-item">
                  🔥أكثر من 2500 زبون راض عن هذا المنتج🔥
                </p>
                <p className="single-product-stats-item">
                  📦 التوصيل مجاني داخل مدينة الرياض ومدن المملكة الكبرى
                </p>
                <p className="single-product-stats-item">
                  👁‍🗨 يشاهده{" "}
                  <span className="single-product-highlight">48</span> زبون في
                  الوقت الحالي
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
}

export default ProductPage;

// "📦 التوصيل مجاني داخل مدينة الرياض ومدن المملكة الكبرى"
