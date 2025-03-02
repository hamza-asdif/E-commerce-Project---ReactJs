/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import './SectionTitle.css'

function SectionTitle({SectionTitle = "⭐مجموعة مميزة⭐", SectionSpan = " منتجات حصريا في المملكة العربية السعودية"}) {
  return (
    <div>
      <div className="section-title-container">
        <section className="section-text-content">
          <h2 className="section-content-title"> {SectionTitle} </h2>
          <span className="section-content-span">
           {SectionSpan}
          </span>
        </section>
      </div>
    </div>
  );
}

export default SectionTitle;
