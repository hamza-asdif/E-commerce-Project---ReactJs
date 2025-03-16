import React from "react";
import "./SideBar.css";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate()
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>لوحة التحكم</h2>
      </div>
      <ul className="sidebar-menu">
        <li className="active" onClick={() => navigate("")}>
          <span>🏠</span>
          <h6>الرئيسية</h6>
        </li>
        <li>
          <span>📦</span>
          <h6>الطلبات</h6>
        </li>
        <li onClick={() => navigate("products")}>
          <span>🛍️</span>
          <h6> المنتجات</h6>
        </li>
        <li>
          <span>📊</span>
          <h6>التحليلات</h6>
        </li>
        <li>
          <span>🔔</span>
          <h6>الإشعارات</h6>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
