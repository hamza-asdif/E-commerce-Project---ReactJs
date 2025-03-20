import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaHome, FaShoppingCart } from "react-icons/fa";
import './ThankyouPage.css'
function ThankYouPage() {
  return (
    <div className="thank-you-page">
      {/* قسم التأكيد */}
      <div className="thank-you-container">
        {/* أيقونة التأكيد */}
        <div className="thank-you-icon">
          <FaCheckCircle />
        </div>

        {/* عنوان الشكر */}
        <h1 className="thank-you-title">شكرًا لك على طلبك!</h1>

        {/* رسالة التأكيد */}
        <p className="thank-you-message">
          تم استلام طلبك بنجاح، وسيتم توصيله إليك في أقرب وقت ممكن.
        </p>

        {/* معلومات الطلب */}
        <div className="order-details">
          <h2>تفاصيل الطلب:</h2>
          <ul>
            <li>
              <strong>رقم الطلب:</strong> #123456
            </li>
            <li>
              <strong>تاريخ الطلب:</strong> ١٠ أكتوبر ٢٠٢٣
            </li>
            <li>
              <strong>المجموع:</strong> ٢٥٠ ريال سعودي
            </li>
          </ul>
        </div>

        {/* أزرار التنقل */}
        <div className="thank-you-actions">
          <Link to="/" className="thank-you-button home-button">
            <FaHome /> العودة إلى الصفحة الرئيسية
          </Link>
          <Link to="/cart" className="thank-you-button cart-button">
            <FaShoppingCart /> عرض سلة التسوق
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ThankYouPage;