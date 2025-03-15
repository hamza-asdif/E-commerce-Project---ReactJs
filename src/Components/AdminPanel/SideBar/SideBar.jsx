import React from "react";
import "./SideBar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <ul className="sidebar-menu">
        <li className="active">
          <span>🏠</span> Home
        </li>
        <li>
          <span>📦</span> Orders
        </li>
        <li>
          <span>🛍️</span> Products
        </li>
        <li>
          <span>📊</span> Analytics
        </li>
        <li>
          <span>🔔</span> Notifications
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;