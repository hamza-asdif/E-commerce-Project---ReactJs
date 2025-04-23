import React from "react";
import "./whyUsSection.css";
import { FaCircleCheck } from "react-icons/fa6";
import { FaShippingFast } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa6";

const WhyUsSection = () => {
  return (
    <section className="why-us-section">
      <div className="why-us-item">
        <FaCircleCheck className="why-us-icon" />
        <h3>Quality Assurance</h3>
        <p>We ensure the highest quality in all our products.</p>
      </div>
      <div className="why-us-item">
        <FaShippingFast className="why-us-icon" />
        <h3>Fast Shipping</h3>
        <p>Quick and reliable delivery to your doorstep.</p>
      </div>
      <div className="why-us-item">
        <FaCartArrowDown className="why-us-icon" />
        <h3>Easy Shopping</h3>
        <p>Enjoy a seamless and hassle-free shopping experience.</p>
      </div>
    </section>
  );
};

export default WhyUsSection;
