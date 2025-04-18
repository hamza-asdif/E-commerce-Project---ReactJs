import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { useGlobalContext } from "../../../Context/GlobalContext";
import supabase from "../../../supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import alertify from "alertifyjs";
import "./CheckoutForm.css";

function CheckoutForm({ productPage_Product, checkoutStyle }) {
  const {
    productsInCart,
    productsInCart_TotalPrice,
    resetall_OrderSubmited,
    setsubmittedOrder,
    allProducts,
    setProductsInCart,
  } = useGlobalContext();

  const [isMainCheckout, setIsMainCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    tel: "",
    city: "",
    address: "",
  });

  const fullNameRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState({});
  const navigate = useNavigate();

  useLayoutEffect(() => {
    handleFormStyle();
  }, []);

  useEffect(() => {
    if (fullNameRef.current) {
      fullNameRef.current.focus();
    }
  }, [productPage_Product]);

  const handleFormStyle = () => {
    if (checkoutStyle === true) {
      setIsMainCheckout(true);
    }
  };

  const saveOrder = async (order) => {
    if (Object.keys(order).length > 0) {
      try {
        const { data, error } = await supabase.from("orders").insert([order]);

        if (error) {
          alertify.error("حدث خطأ أثناء إرسال الطلب");
        } else {
          alertify.success("تم إرسال الطلب بنجاح");
        }
      } catch (err) {
        alertify.error("حدث خطأ غير متوقع");
      }
    } else {
      alertify.error("لا يمكن إرسال طلب فارغ");
    }
  };

  // معالجة إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = {};

    // التحقق من صحة الاسم الكامل
    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = "الاسم مطلوب ويجب أن يكون 3 أحرف على الأقل";
      isValid = false;
    }

    const phoneRegex = /^(06|(\+212)|(00212))[0-9]{8}$/;
    if (!formData.tel || !phoneRegex.test(formData.tel)) {
      newErrors.tel = "يجب إدخال رقم هاتف صحيح (يبدأ بـ 06 أو +212)";
      isValid = false;
    }

    if (!formData.city) {
      newErrors.city = "المدينة مطلوبة";
      isValid = false;
    }

    if (!formData.address || formData.address.length < 10) {
      newErrors.address = "يرجى إدخال عنوان تفصيلي (10 أحرف على الأقل)";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      if (
        window.location.pathname.endsWith("/checkout") &&
        productsInCart.length !== 0
      ) {
        setLoading(true);

        // إنشاء الطلب
        const submittedOrder = {
          user_id: uuidv4(),
          products: [...productsInCart],
          total_price: productsInCart_TotalPrice,
          status: "pending",
          Customer_Infos: formData,
        };

        setOrder(submittedOrder);
        // set the state of submitted order to use it in thank you page
        setsubmittedOrder(submittedOrder);

        try {
          // حفظ الطلب
          await saveOrder(submittedOrder);

          // انتظار ثانية واحدة قبل الانتقال
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // الانتقال لصفحة الشكر وإعادة تعيين الحالة
          navigate("/thank-you");
          resetall_OrderSubmited();
        } catch (error) {
          alertify.error("حدث خطأ أثناء معالجة طلبك");
        } finally {
          setLoading(false);
        }
      } else if (window.location.pathname !== "checkout") {
        setLoading(true);

        const product = JSON.parse(localStorage.getItem("productPage_Product"));

        // إنشاء الطلب
        const submittedOrder = {
          user_id: uuidv4(),
          products: [product],
          total_price: product.price * product.quantity,
          status: "pending",
          Customer_Infos: formData,
        };

        setsubmittedOrder(submittedOrder);

        try {
          // حفظ الطلب
          await saveOrder(submittedOrder);

          // انتظار ثانية واحدة قبل الانتقال
          await new Promise((resolve) => setTimeout(resolve, 1000));

          handleCartDuring_CheckoutExpress(product);

          // الانتقال لصفحة الشكر وإعادة تعيين الحالة
          navigate("/thank-you");
        } catch (error) {
          alertify.error("حدث خطأ أثناء معالجة طلبك");
        } finally {
          setLoading(false);
        }
      } else {
        // رسالة خطأ إذا كانت سلة التسوق فارغة
        alertify.error(
          "لا يمكن إرسال طلبك لأنك لا تمتلك أي منتجات في سلة التسوق"
        );
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

  const handleCartDuring_CheckoutExpress = (product) => {
    if (productsInCart.length > 0) {
      const cartProducts = productsInCart.filter(
        (item) => item.id !== product.id
      );
      setProductsInCart(cartProducts);
    }
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

export default CheckoutForm;
