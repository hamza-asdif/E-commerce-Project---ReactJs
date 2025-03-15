import React, { useEffect, useRef, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import "./CheckoutForm.css";

function Checkout({ productPage_Product, checkoutStyle }) {
  const [isMainCheckout, setIsMainCheckout] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    tel: "",
    city: "",
    address: "",
  });

  const fullNameRef = useRef(null);
  const [errors, setErrors] = useState({});

  useEffect( () => {
    handleFormStyle()
  }, [] )


  useEffect(() => {
    if (fullNameRef.current) {
      fullNameRef.current.focus();
    }
  }, [productPage_Product]);

  const handleFormStyle  = () => {
    if(checkoutStyle == true){
      setIsMainCheckout(true)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = {};

    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = "الاسم مطلوب ويجب أن يكون 3 أحرف على الأقل";
      isValid = false;
    }

    if (!formData.tel || !/^(06)[0-9]{8}$/.test(formData.tel)) {
      newErrors.tel = "يجب إدخال رقم هاتف مغربي صحيح يبدأ بـ 06";
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
      console.log("Order submitted:", formData);
      // يمكنك إرسال البيانات إلى السيرفر هنا
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="single-product-order-section">
        <h3 className="single-product-order-title">
          للطلب يرجى إدخال معلوماتك في الخانات أسفله
        </h3>

        <form className="single-product-order-form" onSubmit={handleSubmit}>
          <div className={`single-product-form-grid ${isMainCheckout ? "active" : ""}`}>
            
            <div className="form-group">
              <input
                ref={fullNameRef}
                type="text"
                placeholder="الاسم بالكامل"
                name="fullName"
                onChange={handleInputChange}
                className={errors.fullName ? "error" : ""}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <input
                type="tel"
                placeholder="رقم الهاتف"
                name="tel"
                onChange={handleInputChange}
                className={errors.tel ? "error" : ""}
                dir="rtl"
              />
              {errors.tel && <span className="error-message">{errors.tel}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="المدينة"
                name="city"
                onChange={handleInputChange}
                className={errors.city ? "error" : ""}
              />
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="العنوان"
                name="address"
                onChange={handleInputChange}
                className={errors.address ? "error" : ""}
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
          </div>

          <button type="submit" className="single-product-submit-button">
            <span>لتأكيد الطلب اضغط هنا</span>
            <FaCartPlus className="single-product-cart-icon" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
