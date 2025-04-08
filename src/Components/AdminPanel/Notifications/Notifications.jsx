import React from "react";
import "./Notifications.css";
import { useAdminGlobalContext } from "../AdminGlobalContext";
import { IoClose, IoPersonOutline } from "react-icons/io5";
import { BsBagCheck } from "react-icons/bs";

function Notifications() {
  const { showNotifications, setShowNotifications } = useAdminGlobalContext();

  return (
    <div className={`notifications-sidebar ${showNotifications ? "show" : ""}`}>
      <div className="notifications-container">
        <div className="notifications-header">
          <h2>الإشعارات</h2>
          <div className="notifications-actions">
            <span className="notification-count">3</span>
            <button
              className="close-notifications"
              onClick={() => setShowNotifications(false)}
            >
              <IoClose />
            </button>
          </div>
        </div>

        <div className="notifications-list">
          <div className="notification-item new">
            <div className="notification-icon">
              <BsBagCheck />
            </div>
            <div className="notification-content">
              <div className="notification-title">طلب جديد #12345</div>
              <div className="notification-description">
                تم استلام طلب جديد من محمد أحمد
              </div>
              <div className="notification-time">منذ دقيقتين</div>
            </div>
          </div>

          <div className="notification-item">
            <div className="notification-icon">
              <BsBagCheck />
            </div>
            <div className="notification-content">
              <div className="notification-title">تحديث المخزون</div>
              <div className="notification-description">
                المنتج "حذاء رياضي" وصل للحد الأدنى
              </div>
              <div className="notification-time">منذ ساعة</div>
            </div>
          </div>

          <div className="notification-item">
            <div className="notification-icon">
              <IoPersonOutline />
            </div>
            <div className="notification-content">
              <div className="notification-title">مستخدم جديد</div>
              <div className="notification-description">
                قام أحمد محمد بالتسجيل في المتجر
              </div>
              <div className="notification-time">منذ 3 ساعات</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
