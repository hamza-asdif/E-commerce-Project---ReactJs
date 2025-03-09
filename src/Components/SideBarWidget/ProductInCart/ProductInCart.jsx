/* eslint-disable react/prop-types */
import React from "react";
import { FiEdit3 } from "react-icons/fi";
import { LuTrash } from "react-icons/lu";
import { useGlobalContext } from "../../../Context/GlobalContext";
import "./ProductInCart.css";

export default function ProductInCart({ Cart_Products }) {
  const { removeProductFromCart } = useGlobalContext();

  return (
    <li className="cart-product-item">
      <div className="cart-product-main">
        <div className="cart-product-box">
          <img
            src={`/shopping-cart-react/${Cart_Products.Image}`}
            alt={Cart_Products.name}
          />
        </div>

        <div className="cart-product-content">
          <span className="cart-product-title">{Cart_Products.name}</span>

          <div className="cart-product-details">
            <div className="cart-info-item">
              <span className="cart-product-price">
                {Cart_Products.price} ريال سعودي
              </span>
            </div>

            <div className="cart-info-quantity">
              <span className="quantity-label">الكمية:</span>
              <span className="quantity-value">{Cart_Products.quantity}</span>
            </div>
          </div>
        </div>

        <div className="cart-product-actions">
          <button
            type="button"
            className="action-button delete"
            onClick={() => removeProductFromCart(Cart_Products.id)}
          >
            <LuTrash />
          </button>
        </div>
      </div>
    </li>
  );
}
