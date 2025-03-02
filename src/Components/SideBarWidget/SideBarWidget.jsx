/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import "./SideBarWidget.css";
import { FaRegCircleXmark } from "react-icons/fa6";
import ProductInCart from "./ProductInCart/ProductInCart";
import { CartProductsProps } from "./ProductInCart/ProductInCart";
import axios from "axios";

import { useGlobalContext } from "../../Context/GlobalContext";

export default function SideBarWidget(props) {
  const [CartProducts, SetCartProducts] = useState([]);
  const [singleProduct, setSingleProduct] = useState({});
  const {
    setCartSideBarToggle,
    cartSideBarToggle,
    toggleCart
  } = useGlobalContext()

  const {
      productsInCart,
      productsInCart_TotalPrice,
    } = useGlobalContext();
  


  return (
    <div dir="rtl">
      <div className="cart-sidebar">
        <div className="cart-sidebar-header">
          <div className="sidebar-header-content">
            <h3 className="sidebar-header-title">سلة مشترياتي</h3>
            <span className="sidebar-header-span">
              {" "}
              {productsInCart.length} عناصر
            </span>
          </div>

          <FaRegCircleXmark
            id="close-sidebar"
            onClick={() => toggleCart(false)}
          />
        </div>

        <div className={productsInCart.length ? "cart-sidebar-products" : "cart-sidebar-products No-Product-Span"} >
          <ul className="ul-product-dom">
            {/* ------------------------------ */}
            {productsInCart.length
              ? productsInCart.map((CartP) => {
                  return (
                    <ProductInCart
                      Cart_Products={CartP}
                      setCart_Products={SetCartProducts}
                      key={CartP.id}
                    />
                  );
                })
              : (
                <span className="No-Product-Span">سلة مشترياتكم فارغة</span>
              )}
            {/* ------------------------------ */}
          </ul>
        </div>

        <div className="sidebar-call-to-action">
          <div className="sidebar-first-tab">
            <span className="first-tab-title">مجموع سلة التسوق</span>
            <span className="first-tab-span" id="cart-sum-span">
              {productsInCart_TotalPrice} ريال سعودي
            </span>
          </div>

          <div className="sidebar-middle-tab">
            <a href="cart.html" id="cart-buy-now">
              {" "}
              <button className="middle-tab-btn">شراء الآن</button>{" "}
            </a>
          </div>

          <div className="sidebar-last-tab">
            <button className="last-tab-btn">استمر في التسوق</button>
          </div>
        </div>
      </div>
    </div>
  );

}
