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
import { useGlobalContext } from "../../Context/GlobalContext";

function Checkout() {
  const { productsInCart_TotalPrice } = useGlobalContext();
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
                <span className="amount">
                  {productsInCart_TotalPrice} ريال سعودي
                </span>
              </div>
              <div className="summary-row">
                <span>رسوم الشحن</span>
                <span className="free-shipping">مجاناً</span>
              </div>

              <div className="summary-row">
                <span>خيار التوصيل</span>
                <span className="cash-on-delivery">الدفع عند الاستلام</span>
              </div>

              <div className="summary-total">
                <span>الإجمالي</span>
                <span className="total-amount">
                  {productsInCart_TotalPrice} ريال سعودي
                </span>
              </div>
            </div>
            <div className="checkout-secure">
              <FaLock />
              <span>الدفع آمن ومشفر 100%</span>
            </div>
          </div>

          {/* Shipping Form - Right Side */}
          <CheckoutForm checkoutStyle={true} />
        </div>
      </div>
    </div>
  );
}

export default Checkout;
