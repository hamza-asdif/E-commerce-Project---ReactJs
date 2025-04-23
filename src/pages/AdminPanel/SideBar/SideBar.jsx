import React from "react";
import "./SideBar.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MobileNavBar from "../MobileSticky_NavBar/MobileNavBar";
import { useAdminGlobalContext } from "../AdminGlobalContext";
import supabase from "../../../lib/supabaseClient";
import alertify from "alertifyjs";

const Sidebar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { setShowNotifications, orders } = useAdminGlobalContext();

  const handleActivePath = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("adminSession");
      alertify.success("تم تسجيل الخروج بنجاح");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alertify.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  // Calculate unread notifications (for this example, using new orders)
  const unreadNotifications = orders
    ? orders.filter((order) => !order.read).length
    : 0;

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>لوحة التحكم</h2>
        </div>
        <ul className="sidebar-menu">
          <li
            className={`sidebar-item ${
              handleActivePath("/admin") ? "active" : ""
            }`}
            onClick={() => navigate("")}
          >
            <span>🏠</span>
            <h6>الرئيسية</h6>
          </li>
          <li
            className={`sidebar-item ${
              handleActivePath("/admin/orders") ? "active" : ""
            }`}
            onClick={() => {
              navigate("orders");
            }}
          >
            <span>📦</span>
            <h6>الطلبات</h6>
          </li>
          <li
            className={`sidebar-item ${
              handleActivePath("/admin/products") ||
              handleActivePath(`/admin/edit-product/${id}`) ||
              handleActivePath("/admin/add-product")
                ? "active"
                : ""
            }`}
            onClick={() => {
              navigate("products");
            }}
          >
            <span>🛍️</span>
            <h6> المنتجات</h6>
          </li>
          <li
            className={`sidebar-item ${
              handleActivePath("/admin/notifications") ? "active" : ""
            }`}
            onClick={() => setShowNotifications(true)}
            id="notification-li"
          >
            <span>🔔</span>
            <h6>الإشعارات</h6>
            {unreadNotifications > 0 && <strong>{unreadNotifications}</strong>}
          </li>
          <li className="sidebar-item logout" onClick={handleLogout}>
            <span>🚪</span>
            <h6>تسجيل الخروج</h6>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
