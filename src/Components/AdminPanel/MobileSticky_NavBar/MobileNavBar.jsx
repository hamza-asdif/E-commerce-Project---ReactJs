import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./MobileNavBar.css";
import { useAdminGlobalContext } from "../AdminGlobalContext";
import { IoHomeOutline, IoPersonOutline, IoNotificationsOutline } from "react-icons/io5";
import { BsBagCheck } from "react-icons/bs";

function MobileNavBar() {
  const location = useLocation();
  const { setShowNotifications, orders } = useAdminGlobalContext();

  // Calculate unread notifications
  const unreadNotifications = orders ? orders.filter(order => !order.read).length : 0;

  // Function to check active route
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-navbar">
      <ul className="mobile-navbar-menu">
        <li className={`nav-item ${isActive("/admin") ? "active" : ""}`}>
          <Link to="/admin">
            <div className="nav-icon">
              <IoHomeOutline />
            </div>
            <span className="nav-text">الرئيسية</span>
          </Link>
        </li>
        <li className={`nav-item ${isActive("/admin/orders") ? "active" : ""}`}>
          <Link to="/admin/orders">
            <div className="nav-icon">
              <BsBagCheck />
            </div>
            <span className="nav-text">الطلبات</span>
          </Link>
        </li>
        <li className={`nav-item ${isActive("/admin/products") ? "active" : ""}`}>
          <Link to="/admin/products">
            <div className="nav-icon">
              <IoPersonOutline />
            </div>
            <span className="nav-text">المنتجات</span>
          </Link>
        </li>
        <li
          className={`nav-item ${isActive("/admin/notifications") ? "active" : ""}`}
          onClick={() => setShowNotifications(true)}
        >
          <div className="nav-icon">
            <IoNotificationsOutline />
            {unreadNotifications > 0 && (
              <span className="notification-badge">{unreadNotifications}</span>
            )}
          </div>
          <span className="nav-text">الإشعارات</span>
        </li>
      </ul>
    </nav>
  );
}

export default MobileNavBar;
