import React from "react";
import "./AdminPanel.css";
import Sidebar from "./SideBar/SideBar";
import Home_States from "./Home_States/Home_States";
import { Outlet } from "react-router-dom";

const AdminHeader = () => {
  return (
    <div className="admin-panel-header">
      <h1>لوحة تحكم المسؤول</h1>
      <p>
        مرحباً بعودتك يا <strong> حمزة.</strong> هذه نظرة عامة على متجرك
      </p>
    </div>
  );
};

const AdminPanel = () => {
  return (
    <>
      <div className="admin-panel-main">
        {/* الشريط الجانبي */}
        <Sidebar />

        {/* المحتوى الرئيسي */}
        <div className="admin-panel-container">
        <AdminHeader />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
