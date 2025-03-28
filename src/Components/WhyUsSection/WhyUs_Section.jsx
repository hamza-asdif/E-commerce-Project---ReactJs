import React from "react";
import "./whyUsSection.css";

import * as FaIcons from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";

import { FaCircleCheck } from "react-icons/fa6";
import { FaShippingFast } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa6";

function Why_Us_Section() {
  return (
    <div>
      <div className="last-product-section">
        <h2 className="last-product-h2">
          لماذا متجر مليون فكرة هو وجهتك الأولى لتسوق ؟
        </h2>
        <span className="last-product-span">-------⭐⭐⭐⭐⭐-------</span>
      </div>

      <div className="container">
        <div className="last-product-products-content">
          <div className="last-product-content-box">
            <div className="last-icon-box">
              <FaCircleCheck className="last-product-icon" id="circle-check" />
            </div>

            <div className="last-text-content">
              <span className="last-text-content-span">جودة مضمونة</span>
              <span className="last-text-content-sub-span">
                رضاكم هو أولويتنا
              </span>
            </div>
          </div>

          <div className="last-product-content-box">
            <div className="last-icon-box">
              <FaShippingFast className="last-product-icon" />
            </div>

            <div className="last-text-content">
              <span className="last-text-content-span">توصيل سريع</span>
              <span className="last-text-content-sub-span">
                لكل مكان في المملكة
              </span>
            </div>
          </div>

          <div className="last-product-content-box">
            <div className="last-icon-box">
              <FaCartArrowDown className="last-product-icon" />
            </div>

            <div className="last-text-content">
              <span className="last-text-content-span">دفع امن</span>
              <span className="last-text-content-sub-span">
                مدفوعاتك آمنة ١٠٠٪
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Why_Us_Section;
