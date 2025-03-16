import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./AdminPanel/SideBar/SideBar";
import AdminPanel from "./AdminPanel/AdminPanel";

function AdminLayout() {
  return (
    <>
      <Sidebar />
      <AdminPanel />
      <Outlet />
    </>
  );
}

export default AdminLayout;
