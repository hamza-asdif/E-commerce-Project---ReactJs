import React from 'react'
import { FaHome, FaChevronLeft } from "react-icons/fa";
import './Breadcrumb.css'
import { useNavigate } from 'react-router-dom';

function Breadcrumb({pathNameInfo}) {
    const homeNavigate = useNavigate()
  return (
    <>
      <div className="single-product-breadcrumb">
        <div className="container">
          <div className="single-product-breadcrumb-content">
            <FaHome className="breadcrumb-home-icon" onClick={ () => homeNavigate("/") }/>
            <FaChevronLeft className="breadcrumb-chevron-icon" />
            <span> {pathNameInfo} 🔥</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Breadcrumb
