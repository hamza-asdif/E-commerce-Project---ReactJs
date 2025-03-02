/* eslint-disable react/prop-types */
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { LuTrash } from "react-icons/lu";

import "./ProductInCart.css";

export const CartProductsProps = createContext();

export default function ProductInCart({ Cart_Products, setCart_Products }) {
  useEffect(() => {
    let Url = "http://localhost:3000/CartProducts";
    axios
      .get(Url)
      .then((res) => setCart_Products(res.data))
      .catch((err) => console.error(err));
  }, [Cart_Products]);

  return (
    <div>
      <div key={Cart_Products.id}>
        <li id="product-${n.id}">
          <div className="cart-product-box">
            <img src={`../../../public/${Cart_Products.Image}`} alt="" />
          </div>

          <a href="#">
            <span className="cart-product-title"> {Cart_Products.name} </span>
          </a>

          <div className="cart-product-icons">
            <button type="button">
              <FiEdit3 id="edit-product-icon" />
            </button>

            <button type="button">
              <LuTrash id="trash-product" />
            </button>
          </div>
        </li>
        <div className="cart-product-infos" id="product-div-${n.id}">
          <span className="cart-product-infos-title">الكمية</span>
          <span className="cart-product-quantite" id="quantity-${n.id}">
            {" "}
            {Cart_Products.quantity}
          </span>
          <span className="cart-product-price">
            {" "}
            {Cart_Products.price} ريال سعودي
          </span>
        </div>
      </div>
    </div>
  );
}
