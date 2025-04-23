import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./MobileNavBar.css";
import { useAdminGlobalContext } from "../AdminGlobalContext";
import {
  IoHomeOutline,
  IoPersonOutline,
  IoNotificationsOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { BsBagCheck } from "react-icons/bs";
import supabase from "../../../lib/supabaseClient";
import alertify from "alertifyjs";

function MobileNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setShowNotifications, orders } = useAdminGlobalContext();

  // Calculate unread notifications
  const unreadNotifications = orders
    ? orders.filter((order) => !order.read).length
    : 0;

  // Function to check active route
  const isActive = (path) => location.pathname === path;

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

  return (
    <nav
      className="mobile-navbar"
      role="navigation"
      aria-label="القائمة الرئيسية"
    >
      <ul className="mobile-navbar-menu">
        <li>
          <Link
            to="/admin"
            className={`nav-item ${isActive("/admin") ? "active" : ""}`}
            aria-current={isActive("/admin") ? "page" : undefined}
          >
            <div className="nav-icon">
              <IoHomeOutline />
            </div>
            <span className="nav-text">الرئيسية</span>
          </Link>
        </li>
        <li>
          <Link
            to="/admin/orders"
            className={`nav-item ${isActive("/admin/orders") ? "active" : ""}`}
            aria-current={isActive("/admin/orders") ? "page" : undefined}
          >
            <div className="nav-icon">
              <BsBagCheck />
            </div>
            <span className="nav-text">الطلبات</span>
          </Link>
        </li>
        <li>
          <Link
            to="/admin/products"
            className={`nav-item ${isActive("/admin/products") ? "active" : ""}`}
            aria-current={isActive("/admin/products") ? "page" : undefined}
          >
            <div className="nav-icon">
              <IoPersonOutline />
            </div>
            <span className="nav-text">المنتجات</span>
          </Link>
        </li>
        <li>
          <button
            className={`nav-item ${isActive("/admin/notifications") ? "active" : ""}`}
            onClick={() => setShowNotifications(true)}
            aria-label={`الإشعارات ${unreadNotifications > 0 ? `(${unreadNotifications} غير مقروءة)` : ""}`}
          >
            <div className="nav-icon">
              <IoNotificationsOutline />
              {unreadNotifications > 0 && (
                <span className="notification-badge" aria-hidden="true">
                  {unreadNotifications}
                </span>
              )}
            </div>
            <span className="nav-text">الإشعارات</span>
          </button>
        </li>
        <li>
          <button
            className="nav-item logout"
            onClick={handleLogout}
            aria-label="تسجيل الخروج من لوحة التحكم"
          >
            <div className="nav-icon">
              <IoLogOutOutline />
            </div>
            <span className="nav-text">تسجيل الخروج</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default MobileNavBar;
