/* eslint-disable react/prop-types */
import React, { useMemo } from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useGlobalContext } from "../../../Context/GlobalContext";
import "./ProductInCart.css";

function ProductInCart({ Cart_Products }) {
  const { updateProductQuantity, removeProductFromCart } = useGlobalContext();

  return useMemo(() => {
    return (
      <li className="cart-item">
        <div className="cart-item-image">
          <img src={Cart_Products.Image} alt={Cart_Products.name} />
        </div>

        <div className="cart-item-content">
          <h4 className="cart-item-title">{Cart_Products.name}</h4>

          <div className="cart-item-price">
            <span>{Cart_Products.price} ريال</span>
          </div>

          <div className="cart-item-actions">
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() =>
                  updateProductQuantity(
                    Cart_Products.id,
                    Cart_Products.quantity - 1
                  )
                }
                disabled={Cart_Products.quantity <= 1}
              >
                <FaMinus />
              </button>

              <span className="quantity-display">{Cart_Products.quantity}</span>

              <button
                className="quantity-btn"
                onClick={() =>
                  updateProductQuantity(
                    Cart_Products.id,
                    Cart_Products.quantity + 1
                  )
                }
              >
                <FaPlus />
              </button>
            </div>

            <button
              className="remove-btn"
              onClick={async () => {
                await removeProductFromCart(Cart_Products.id);
              }}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </li>
    );
  }, [Cart_Products, updateProductQuantity, removeProductFromCart]);
}

export default ProductInCart;
