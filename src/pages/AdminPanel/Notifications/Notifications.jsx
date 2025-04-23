import React from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { BiPackage } from "react-icons/bi";
import { useAdminGlobalContext } from "../AdminGlobalContext";
import "./Notifications.css";

function Notifications() {
  const { showNotifications, setShowNotifications, orders } =
    useAdminGlobalContext();

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `منذ ${days} يوم`;
    if (hours > 0) return `منذ ${hours} ساعة`;
    if (minutes > 0) return `منذ ${minutes} دقيقة`;
    return "الآن";
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`notifications-backdrop ${showNotifications ? "show" : ""}`}
        onClick={() => setShowNotifications(false)}
        aria-hidden="true"
      />

      <aside
        className={`notifications-sidebar ${showNotifications ? "show" : ""}`}
        aria-label="الإشعارات"
      >
        <div className="notifications-container">
          <header className="notifications-header">
            <h2>
              <FaBell /> الإشعارات
              {orders?.length > 0 && (
                <span
                  className="notification-count"
                  aria-label={`${orders.length} إشعارات`}
                >
                  {orders.length}
                </span>
              )}
            </h2>
            <button
              className="close-notifications"
              onClick={() => setShowNotifications(false)}
              aria-label="إغلاق الإشعارات"
            >
              <FaTimes />
            </button>
          </header>

          <div className="notifications-list" role="list">
            {orders?.length > 0 ? (
              orders.map((order, index) => (
                <div
                  key={order.id || index}
                  className={`notification-item ${!order.read ? "new" : ""}`}
                  onClick={() => {
                    // Handle notification click
                    console.log("Notification clicked:", order);
                  }}
                  role="listitem"
                >
                  <div className="notification-icon" aria-hidden="true">
                    <BiPackage />
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      طلب جديد #
                      {order.orderNumber || `${index + 1}`.padStart(4, "0")}
                    </div>
                    <div className="notification-description">
                      {order.customerName} قام بطلب {order.items?.length || 0}{" "}
                      منتجات
                    </div>
                    <div
                      className="notification-time"
                      aria-label={`وقت الطلب: ${formatTime(order.date || new Date())}`}
                    >
                      {formatTime(order.date || new Date())}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state" role="status">
                <div className="notification-icon" aria-hidden="true">
                  <FaBell />
                </div>
                <div className="notification-title">لا توجد إشعارات</div>
                <div className="notification-description">
                  ستظهر الإشعارات الجديدة هنا
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Notifications;
