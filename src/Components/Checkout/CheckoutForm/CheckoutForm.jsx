import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { useGlobalContext } from "../../../Context/GlobalContext";
import supabase from "../../../supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import alertify from "alertifyjs";
import PropTypes from "prop-types";
import "./CheckoutForm.css";

function CheckoutForm({ productPage_Product, checkoutStyle }) {
  const {
    productsInCart,
    productsInCart_TotalPrice,
    resetall_OrderSubmited,
    setsubmittedOrder,
    setProductsInCart,
  } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    tel: "",
    city: "",
    address: "",
  });

  const fullNameRef = useRef(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Ensure product quantity is included in order
  useEffect(() => {
    if (productPage_Product) {
      localStorage.setItem(
        "productPage_Product",
        JSON.stringify(productPage_Product)
      );
    }
  }, [productPage_Product]);

  useLayoutEffect(() => {
    // Handle form style directly in the effect
    if (checkoutStyle) {
      // Any form style logic can go here if needed in the future
      return;
    }
  }, [checkoutStyle]);

  useEffect(() => {
    if (fullNameRef.current) {
      fullNameRef.current.focus();
    }
  }, [productPage_Product]);

  const saveOrder = async (order) => {
    if (Object.keys(order).length > 0) {
      try {
        const { error } = await supabase.from("orders").insert([order]);

        if (error) {
          throw error;
        }

        // Save the order ID for the thank you page
        localStorage.setItem("lastOrderId", order.user_id);
        alertify.success("تم إرسال الطلب بنجاح");
        return true;
      } catch (err) {
        console.error("Error saving order:", err);
        alertify.error("حدث خطأ غير متوقع");
        return false;
      }
    } else {
      alertify.error("لا يمكن إرسال طلب فارغ");
      return false;
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // التحقق من صحة الاسم الكامل
    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = "الاسم مطلوب ويجب أن يكون 3 أحرف على الأقل";
      isValid = false;
    }

    // التحقق من صحة رقم الهاتف
    const phoneRegex = /^(06|(\+212)|(00212))[0-9]{8}$/;
    if (!formData.tel || !phoneRegex.test(formData.tel)) {
      newErrors.tel = "يجب إدخال رقم هاتف صحيح (يبدأ بـ 06 أو +212)";
      isValid = false;
    }

    // التحقق من المدينة
    if (!formData.city) {
      newErrors.city = "المدينة مطلوبة";
      isValid = false;
    }

    // التحقق من العنوان
    if (!formData.address || formData.address.length < 10) {
      newErrors.address = "يرجى إدخال عنوان تفصيلي (10 أحرف على الأقل)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCartAfterOrder = (isExpressCheckout, product = null) => {
    if (isExpressCheckout && product) {
      // For express checkout, only remove the ordered product if it exists in cart
      const productInCart = productsInCart.find(
        (item) => item.id === product.id
      );
      if (productInCart) {
        const updatedCart = productsInCart.filter(
          (item) => item.id !== product.id
        );
        setProductsInCart(updatedCart);
      }
      // If product not in cart, do nothing
    } else {
      // For regular checkout, clear the entire cart
      resetall_OrderSubmited();
    }
  };

  const getProductQuantity = (product) => {
    if (!product) return 1;
    const cartProduct = productsInCart.find((item) => item.id === product.id);
    return cartProduct ? cartProduct.quantity : product.quantity || 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);

      try {
        let submittedOrder;
        const isExpressCheckout = !!productPage_Product;

        if (!isExpressCheckout && productsInCart.length !== 0) {
          // Regular checkout
          submittedOrder = {
            user_id: uuidv4(),
            products: [...productsInCart],
            total_price: productsInCart_TotalPrice,
            status: "pending",
            Customer_Infos: formData,
            created_at: new Date().toISOString(),
          };
        } else if (isExpressCheckout) {
          // Express checkout - use cart quantity if product exists in cart
          const quantity = getProductQuantity(productPage_Product);
          submittedOrder = {
            user_id: uuidv4(),
            products: [
              {
                ...productPage_Product,
                quantity,
              },
            ],
            total_price: productPage_Product.price * quantity,
            status: "pending",
            Customer_Infos: formData,
            created_at: new Date().toISOString(),
          };
        } else {
          throw new Error("No products in cart");
        }

        setsubmittedOrder(submittedOrder);
        const saved = await saveOrder(submittedOrder);

        if (saved) {
          // Handle cart based on checkout type
          handleCartAfterOrder(isExpressCheckout, productPage_Product);
          navigate("/thank-you");
        }
      } catch (error) {
        console.error("Checkout error:", error);
        alertify.error("حدث خطأ أثناء معالجة طلبك");
      } finally {
        setLoading(false);
      }
    }
  };

  // معالجة تغيير الإدخال
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // مسح الأخطاء الخاصة بالحقل الحالي
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // تحديث بيانات النموذج
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className={`checkout-form ${
        checkoutStyle
          ? "checkout-form--page-checkout"
          : "checkout-form--express"
      }`}
    >
      <div className="checkout-form__order-section">
        <h3 className="checkout-form__order-title">
          للطلب يرجى إدخال معلوماتك في الخانات أسفله
        </h3>

        <form className="checkout-form__form" onSubmit={handleSubmit}>
          <div className="checkout-form__grid">
            {/* Input fields remain the same */}
            <div className="checkout-form__form-group">
              <input
                ref={fullNameRef}
                type="text"
                placeholder="الاسم بالكامل"
                name="fullName"
                onChange={handleInputChange}
                className={`checkout-form__input ${
                  errors.fullName ? "checkout-form__input--error" : ""
                }`}
              />
              {errors.fullName && (
                <span className="checkout-form__error-message">
                  {errors.fullName}
                </span>
              )}
            </div>

            <div className="checkout-form__form-group">
              <input
                type="tel"
                placeholder="رقم الهاتف"
                name="tel"
                onChange={handleInputChange}
                className={`checkout-form__input ${
                  errors.tel ? "checkout-form__input--error" : ""
                }`}
                dir="rtl"
              />
              {errors.tel && (
                <span className="checkout-form__error-message">
                  {errors.tel}
                </span>
              )}
            </div>

            <div className="checkout-form__form-group">
              <input
                type="text"
                placeholder="المدينة"
                name="city"
                onChange={handleInputChange}
                className={`checkout-form__input ${
                  errors.city ? "checkout-form__input--error" : ""
                }`}
              />
              {errors.city && (
                <span className="checkout-form__error-message">
                  {errors.city}
                </span>
              )}
            </div>

            <div className="checkout-form__form-group">
              <input
                type="text"
                placeholder="العنوان"
                name="address"
                onChange={handleInputChange}
                className={`checkout-form__input ${
                  errors.address ? "checkout-form__input--error" : ""
                }`}
              />
              {errors.address && (
                <span className="checkout-form__error-message">
                  {errors.address}
                </span>
              )}
            </div>
          </div>

          {/* Submit button remains the same */}
          <button type="submit" className="checkout-form__submit-button">
            {loading ? (
              <div className="checkout-form__loader">جار التحميل...</div>
            ) : (
              <>
                <span>لتأكيد الطلب اضغط هنا</span>
                <FaCartPlus className="checkout-form__cart-icon" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

CheckoutForm.propTypes = {
  productPage_Product: PropTypes.object,
  checkoutStyle: PropTypes.bool,
};

export default CheckoutForm;
