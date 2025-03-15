import React from "react";
import {
  FaShoppingCart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaLock,
  FaBox,
} from "react-icons/fa";
import "./Checkout.css";
import CheckoutForm from "./CheckoutForm/CheckoutForm";

function Checkout() {
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Enhanced Steps Indicator */}
        <div className="checkout-header">
          <h1> إتمام الطلب </h1>
          <p>مراجعة وإكمال عملية الشراء</p>
        </div>

        <div className="checkout-content">
          {/* Order Summary - Left Side */}
          <div className="checkout-summary">
            <h2 className="checkout-title">
              <FaBox className="section-icon" />
              ملخص الطلب
            </h2>
            <div className="checkout-summary-items">
              <div className="summary-row">
                <span>المجموع الفرعي</span>
                <span className="amount">299 ريال سعودي</span>
              </div>
              <div className="summary-row">
                <span>رسوم الشحن</span>
                <span className="free-shipping">مجاناً</span>
              </div>
              <div className="summary-total">
                <span>الإجمالي</span>
                <span className="total-amount">299 ريال سعودي</span>
              </div>
            </div>
            <div className="checkout-secure">
              <FaLock />
              <span>الدفع آمن ومشفر 100%</span>
            </div>
          </div>

          {/* Shipping Form - Right Side */}
          <CheckoutForm checkoutStyle={true}/>
          {/* <div className="checkout-form">
            <h2 className="checkout-title">
              <FaMapMarkerAlt className="section-icon" />
              معلومات التوصيل
            </h2>
            <form className="shipping-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>الاسم الكامل</label>
                  <input
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    name="fullName"
                  />
                </div>
                <div className="form-group">
                  <label>رقم الهاتف</label>
                  <input type="tel" placeholder="05xxxxxxxx" name="phone" dir="rtl"/>
                </div>
                <div className="form-group">
                  <label>البريد الإلكتروني</label>
                  <input
                    type="email"
                    placeholder="example@domain.com"
                    name="email"
                  />
                </div>
                <div className="form-group">
                  <label>المدينة</label>
                  <select name="city" defaultValue="">
                    <option value="" disabled>
                      اختر المدينة
                    </option>
                    <option value="riyadh">الرياض</option>
                    <option value="jeddah">جدة</option>
                    <option value="dammam">الدمام</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>العنوان التفصيلي</label>
                  <textarea
                    placeholder="أدخل العنوان التفصيلي"
                    name="address"
                    rows="4"
                  ></textarea>
                </div>
              </div>
              <button type="submit" className="checkout-submit">
                متابعة الطلب
              </button>
            </form>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
