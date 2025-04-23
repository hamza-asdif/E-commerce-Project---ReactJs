import { FaBox, FaLock } from "react-icons/fa";
import "./Checkout.css";
import CheckoutForm from "./CheckoutForm/CheckoutForm";
import { useGlobalContext } from "../../hooks/GlobalContextHooks";

function Checkout() {
  const { productsInCart_TotalPrice } = useGlobalContext();

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>إتمام الطلب</h1>
          <p>مراجعة وإكمال عملية الشراء</p>
        </div>

        <div className="checkout-content">
          <div className="checkout-summary">
            <div className="summary-header">
              <FaBox className="summary-icon" />
              <h2>ملخص الطلب</h2>
            </div>

            <div className="summary-content">
              <div className="summary-subtotal">
                <div className="summary-row">
                  <span>المجموع الفرعي</span>
                  <span className="amount">
                    {productsInCart_TotalPrice} ريال سعودي
                  </span>
                </div>

                <div className="summary-row highlight">
                  <span>رسوم الشحن</span>
                  <span className="free-shipping">مجاناً</span>
                </div>

                <div className="summary-row">
                  <span>خيار التوصيل</span>
                  <span className="cash-on-delivery">الدفع عند الاستلام</span>
                </div>
              </div>

              <div className="summary-divider" />

              <div className="summary-total">
                <div className="total-row">
                  <span>الإجمالي</span>
                  <span className="total-amount">
                    {productsInCart_TotalPrice} ريال سعودي
                  </span>
                </div>
              </div>

              <div className="secure-badge">
                <FaLock />
                <span>الدفع آمن ومشفر 100%</span>
              </div>
            </div>
          </div>

          <CheckoutForm checkoutStyle={true} />
        </div>
      </div>
    </div>
  );
}

export default Checkout;
