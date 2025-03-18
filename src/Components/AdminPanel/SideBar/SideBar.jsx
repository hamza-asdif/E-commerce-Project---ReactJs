import React from "react";
import "./SideBar.css";
import { useNavigate } from "react-router-dom";
import MobileNavBar from "../MobileSticky_NavBar/MobileNavBar";

const Sidebar = () => {
  const navigate = useNavigate()
  const handleActivePath = (path) =>  location.pathname === path
  return (
    <>
      <div className="sidebar">
      <div className="sidebar-header">
        <h2>لوحة التحكم</h2>
      </div>
      <ul className="sidebar-menu">
        <li className={`sidebar-item ${ handleActivePath("/admin") ? "active" : ""}`} onClick={() => navigate("")}>
          <span>🏠</span>
          <h6>الرئيسية</h6>
        </li>
        <li className={`sidebar-item ${ handleActivePath("/admin/orders") ? "active" : ""}`} >
          <span>📦</span>
          <h6>الطلبات</h6>
        </li>
        <li className={`sidebar-item ${ handleActivePath("/admin/products") ? "active" : ""}`} onClick={() => {navigate("products"), console.log(location.pathname)}}>
          <span>🛍️</span>
          <h6> المنتجات</h6>
        </li>
        <li className={`sidebar-item ${ handleActivePath("/admin/analytics") ? "active" : ""}`}>
          <span>📊</span>
          <h6>التحليلات</h6>
        </li>
        <li className={`sidebar-item ${ handleActivePath("/admin/notifications") ? "active" : ""}`}>
          <span>🔔</span>
          <h6>الإشعارات</h6>
        </li>
      </ul>
    </div>
    </>
  );
};

export default Sidebar;
