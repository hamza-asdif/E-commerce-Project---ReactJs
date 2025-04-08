import React, { useEffect, useState } from "react";
import "./AdminPanel.css";
import Sidebar from "./SideBar/SideBar";
import { Outlet } from "react-router-dom";
import MobileNavBar from "./MobileSticky_NavBar/MobileNavBar";
import AdminHeader from "./AdminHeader/AdminHeader";
import { useAdminGlobalContext } from "./AdminGlobalContext";
import AdminProvider from "./AdminGlobalContext";
import Notifications from "./Notifications/Notifications";

const AdminPanel = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleWindowResize = () => {
    const getDeviceSize = window.innerWidth;
    getDeviceSize < 770 ? setIsMobile(true) : setIsMobile(false);
  };

  useEffect(() => {
    const getDeviceSize = window.outerWidth;
    setIsMobile(getDeviceSize < 768);

    window.addEventListener("resize", handleWindowResize);

    const handleLoading = () => {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    handleLoading();
  }, []);

  return (
    <div className="admin-panel-main">
      {isMobile ? <MobileNavBar /> : <Sidebar />}
      <div className="admin-panel-container">
        <AdminHeader />
        <Outlet />
        <Notifications />
      </div>
    </div>
  );
};

export default AdminPanel;
