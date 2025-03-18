
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MobileNavBar.css';

function MobileNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check active route
  const isActive = (path) => location.pathname === path;

  return (
    <div className="mobile-navbar">
      <ul className="mobile-navbar-menu">
        <li
          className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
          onClick={() => navigate('')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">لوحة القيادة</span>
        </li>
        <li
          className={`nav-item ${isActive('/products') ? 'active' : ''}`}
          onClick={() => navigate('/products')}
        >
          <span className="nav-icon">📦</span>
          <span className="nav-text">المنتجات</span>
        </li>
        <li
          className={`nav-item ${isActive('/orders') ? 'active' : ''}`}
          onClick={() => navigate('/orders')}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-text">الطلبات</span>
          <span className="notification-badge">5</span> {/* Notifications */}
        </li>
        <li
          className={`nav-item ${isActive('/customers') ? 'active' : ''}`}
          onClick={() => navigate('/customers')}
        >
          <span className="nav-icon">👫</span>
          <span className="nav-text">العملاء</span>
        </li>
        <li
          className={`nav-item ${isActive('/settings') ? 'active' : ''}`}
          onClick={() => navigate('/settings')}
        >
          <span className="nav-icon">⚙️</span>
          <span className="nav-text">الإعدادات</span>
        </li>
      </ul>
    </div>
  );
}

export default MobileNavBar;
