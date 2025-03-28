/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from "react";
import { FaShoppingCart, FaTrash, FaEdit } from "react-icons/fa";
import "./Cart.css";
import { useGlobalContext } from "../../Context/GlobalContext";
import "alertifyjs/build/css/alertify.rtl.css";
import "alertifyjs/build/css/themes/default.rtl.css";
import "../../Context/alertify.custom.css";
import alertify from "alertifyjs";
import { Link, Navigate, useNavigate } from "react-router-dom";

function Cart() {
  const {
    productsInCart,
    setProductsInCart,
    productsInCart_TotalPrice,
    toggleCart,
    cartSideBarToggle,
    removeProductFromCart,
    resetAllStates,
  } = useGlobalContext();
  const decs_Btn = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    resetAllStates();
    return () => {
      toggleCart(false);
    };
  }, []);

  const Alertify_Prompt_Quanity_edit = (product) => {
    const activeProduct = productsInCart.find((item) => item.id == product.id);
    console.log(activeProduct);

    alertify
      .prompt(
        "تعديل الكمية",
        "الرجاء إدخال الكمية الجديدة",
        product.quantity,
        function (evt, value) {
          const newQuantity = parseInt(value);
          if (isNaN(newQuantity) || newQuantity < 1) {
            alertify.error("الرجاء إدخال قيمة صحيحة أكبر من 1");
            return;
          }

          if (!activeProduct) {
            alertify.error("حدث خطأ: المنتج غير موجود في السلة");
            return;
          }

          if (activeProduct.quantity === newQuantity) {
            alertify.error(
              "الكمية لم تتغير، القيمة المدخلة هي نفس الكمية الحالية",
            );
            return;
          }

          const updatedProductsInCart = productsInCart.map((item) =>
            item.id === activeProduct.id
              ? { ...item, quantity: newQuantity }
              : item,
          );

          setProductsInCart(updatedProductsInCart);
          console.log(updatedProductsInCart);
          alertify.success("تم تحديث الكمية إلى: " + newQuantity);
        },
        function () {
          alertify.error("تم إلغاء التعديل");
        },
      )
      .set({
        labels: {
          ok: "تأكيد",
          cancel: "إلغاء",
        },
      });
  };

  const handlequantity = (e, cartProduct) => {
    if (e.target.value === "+") {
      const newUpdatedProducts = productsInCart.map((product) => {
        return product.id === cartProduct.id
          ? { ...product, quantity: product.quantity + 1 }
          : product;
      });

      setProductsInCart(newUpdatedProducts);
    } else if (e.target.value === "-" && cartProduct.quantity > 1) {
      const newUpdatedProducts = productsInCart.map((product) => {
        return product.id === cartProduct.id
          ? { ...product, quantity: product.quantity - 1 }
          : product;
      });

      setProductsInCart(newUpdatedProducts);

      console.log(decs_Btn.current);
    }
  };

  useEffect(() => {
    if (decs_Btn.current) {
      decs_Btn.current.disabled = productsInCart.some(
        (product) => product.quantity <= 1,
      );
    }
  }, [productsInCart]);

  // !!! handle if no products in cart && alertify error show
  const handleNoProductInCart = () => {
    if (!productsInCart.length) {
      alertify.error("لا يوجد منتجات في السلة");
    } else {
      navigate("/checkout");
    }
  };

  // Cart Product Item Component
  const CartProductItem = ({ product, index }) => (
    <div className="main-cart-product-item" key={product.id}>
      <div className="main-cart-product-image">
        <img src={product.Image} alt={`${product.name}-${index}`} />
      </div>

      <div className="main-cart-product-details">
        <div className="main-cart-product-header">
          <h3 className="main-cart-product-title">{product.name}</h3>
          <div className="main-cart-product-actions">
            <button
              className="main-cart-action-btn edit"
              onClick={() => Alertify_Prompt_Quanity_edit(product)}
            >
              <FaEdit />
            </button>
            <button
              className="main-cart-action-btn delete"
              onClick={() => removeProductFromCart(product.id)}
            >
              <FaTrash />
            </button>
          </div>
        </div>

        <div className="main-cart-product-info">
          <div className="main-cart-price-info">
            <span className="main-cart-current-price">
              {parseInt(product.price)} ريال سعودي
            </span>
            {product.OldPrice && (
              <span className="main-cart-old-price">
                {product.OldPrice} ريال سعودي
              </span>
            )}
          </div>
          <div className="main-cart-quantity-controls">
            <span className="main-cart-quantity-label">الكمية:</span>
            <div className="main-cart-quantity-buttons">
              <button
                className="main-cart-quantity-btn"
                value="-"
                onClick={(e) => handlequantity(e, product)}
                disabled={product.quantity <= 1}
                ref={decs_Btn}
              >
                -
              </button>
              <span className="main-cart-quantity-value">
                {product.quantity}
              </span>
              <button
                className="main-cart-quantity-btn"
                value="+"
                onClick={(e) => handlequantity(e, product)}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Empty Cart Component
  const EmptyCart = () => (
    <div className="main-cart-empty">
      <FaShoppingCart className="main-cart-empty-icon" />
      <h2>سلة المشتريات فارغة</h2>
      <p>لم تقم بإضافة أي منتجات إلى سلة المشتريات بعد</p>
    </div>
  );

  return (
    <div className="main-cart-page">
      <div className="main-cart-container">
        {/* Cart Header */}
        <div className="main-cart-header">
          <h1 className="main-cart-title">
            <FaShoppingCart className="main-cart-header-icon" />
            سلة المشتريات
            <span className="main-cart-count">
              ({productsInCart.length}{" "}
              {productsInCart.length === 1 ? "منتج" : "منتجات"})
            </span>
          </h1>
        </div>

        <div className="main-cart-content">
          {/* Cart Products List */}
          <div className="main-cart-products-wrapper">
            {productsInCart.length ? (
              productsInCart.map((product, index) => (
                <CartProductItem product={product} index={index} key={index} />
              ))
            ) : (
              <EmptyCart />
            )}
          </div>

          {/* Cart Summary */}
          <div className="main-cart-summary">
            <div className="main-cart-summary-content">
              <h2 className="main-cart-summary-title">ملخص الطلب</h2>

              <div className="main-cart-summary-items">
                <div className="main-cart-summary-row">
                  <span>عدد المنتجات</span>
                  <span>
                    {productsInCart.length}{" "}
                    {productsInCart.length === 1 ? "منتج" : "منتجات"}
                  </span>
                </div>
                <div className="main-cart-summary-row">
                  <span>رسوم الشحن</span>
                  <span className="free-shipping">مجاناً</span>
                </div>
              </div>

              <div className="main-cart-summary-total">
                <span>الإجمالي النهائي</span>
                <span className="total-amount">
                  {productsInCart_TotalPrice} ريال سعودي
                </span>
              </div>

              <span
                onClick={handleNoProductInCart}
                className="main-cart-checkout-btn"
              >
                المتابعة لإتمام الطلب
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
