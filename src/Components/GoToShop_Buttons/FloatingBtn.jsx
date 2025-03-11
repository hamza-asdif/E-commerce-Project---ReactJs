import React from "react";
import "./FloatingBtn.css";
import { Link } from "react-router-dom";
import { FaStore } from "react-icons/fa";

function FloatingBtn() {
  return (
    <>
      <Link to="/shop" className="floating-shop-btn">
        <FaStore />
        <span>تسوق الآن</span>
      </Link>
    </>
  );
}

export default FloatingBtn;
