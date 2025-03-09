import React from 'react';
import { FaShoppingCart, FaMapMarkerAlt, FaTruck, FaLock } from 'react-icons/fa';
import './Checkout.css';

function Checkout() {
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Checkout Steps */}
        <div className="checkout-steps">
          <div className="step active">
            <FaShoppingCart />
            <span>تأكيد الطلب</span>
          </div>
          <div className="step">
            <FaMapMarkerAlt />
            <span>معلومات التوصيل</span>
          </div>
          <div className="step">
            <FaTruck />
            <span>الشحن والدفع</span>
          </div>
        </div>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="checkout-summary">
            <h2 className="checkout-title">ملخص الطلب</h2>
            <div className="checkout-summary-items">
              <div className="summary-row">
                <span>المجموع الفرعي</span>
                <span>299 ريال سعودي</span>
              </div>
              <div className="summary-row">
                <span>رسوم الشحن</span>
                <span className="free-shipping">مجاناً</span>
              </div>
              <div className="summary-total">
                <span>الإجمالي</span>
                <span>299 ريال سعودي</span>
              </div>
            </div>

            <div className="checkout-secure">
              <FaLock />
              <span>الدفع آمن ومشفر 100%</span>
            </div>
          </div>

          {/* Shipping Form */}
          <div className="checkout-form">
            <h2 className="checkout-title">معلومات التوصيل</h2>
            <form>
              <div className="form-grid">
                <div className="form-group">
                  <label>الاسم الكامل</label>
                  <input type="text" placeholder="أدخل اسمك الكامل" />
                </div>
                <div className="form-group">
                  <label>رقم الهاتف</label>
                  <input type="tel" placeholder="05xxxxxxxx" />
                </div>
                <div className="form-group">
                  <label>البريد الإلكتروني</label>
                  <input type="email" placeholder="example@domain.com" />
                </div>
                <div className="form-group">
                  <label>المدينة</label>
                  <input type="text" placeholder="أدخل اسم المدينة" />
                </div>
                <div className="form-group full-width">
                  <label>العنوان التفصيلي</label>
                  <textarea placeholder="أدخل العنوان التفصيلي"></textarea>
                </div>
              </div>

              <button type="submit" className="checkout-submit">
                متابعة الطلب
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;