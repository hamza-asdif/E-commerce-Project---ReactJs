import React from "react";
import "./ToShopSection.css";
import { Link } from "react-router-dom";
import { FaStore } from "react-icons/fa";
function FloatingButton() {
  return (
    <>
      <section className="show-all-section">
        <div className="show-all-container">
          <h2>اكتشف المزيد من المنتجات</h2>
          <p>تصفح مجموعتنا الكاملة للمزيد من العناصر الرائعة</p>
          <Link to="/shop" className="product-btn-shop">
            عرض جميع المنتجات
          </Link>
        </div>

        
      </section>
    </>
  );
}

export default FloatingButton;
