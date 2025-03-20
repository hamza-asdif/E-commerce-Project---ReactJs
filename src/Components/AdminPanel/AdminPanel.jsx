import React, { useEffect, useState } from "react";
import "./AdminPanel.css";
import Sidebar from "./SideBar/SideBar";
import { Outlet } from "react-router-dom";
import MobileNavBar from "./MobileSticky_NavBar/MobileNavBar";

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
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false)

  const handleWindowResize = () => {
    const getDeviceSize = window.outerWidth
    getDeviceSize < 770 ? setIsMobile(true) : setIsMobile(false);
  }

  useEffect(() => {
    const getDeviceSize = window.outerWidth;
    setIsMobile(getDeviceSize < 768);

    window.addEventListener("resize", handleWindowResize);

  }, []);

  const handleLoading = () => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }

  useEffect( () =>  {
    handleLoading()
  }, [] )



  return (
    <div className="admin-panel-main">
      {isMobile ? <MobileNavBar /> : <Sidebar />}
      <div className="admin-panel-container">
        <AdminHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
