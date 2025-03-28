import React from "react";
import "./Notifications.css";

function Notifications() {
  return (
    <>
      {/* Notifications */}
      <div className="notifications">
        <h2>الإشعارات</h2>
        <ul>
          <li>تم استلام طلب جديد (#١٢٣٤٥)</li>
          <li>المنتج "إكس واي زد" نفذ من المخزون</li>
          <li>المستخدم "جون دو" قام بالتسجيل</li>
        </ul>
      </div>
    </>
  );
}

export default Notifications;
