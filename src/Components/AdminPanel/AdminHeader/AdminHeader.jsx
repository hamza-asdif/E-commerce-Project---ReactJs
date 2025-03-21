import React, { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import { useAdminGlobalContext } from "../AdminGlobalContext";

const AdminHeader = () => {
  const { adminInfo, setAdminInfo } = useAdminGlobalContext();
  const [request, setRequest] = useState(false);

  useEffect(() => {
    const fetchAdminInfos = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", "admin");

      if (error) {
        console.log("ADMIN DATA FETCH ERRRRRRROOOOOOR", error);
      } else {
        setAdminInfo(data[0]);
      }
    };

    fetchAdminInfos();
  }, []);

  return (
    <div className="admin-panel-header">
      <h1>لوحة تحكم المسؤول</h1>
      <p>
        مرحباً بعودتك يا{" "}
        <strong>
          {Object.keys(adminInfo).length
            ? `${adminInfo.FirstName} ${adminInfo.LastName}`
            : "جاري تحميل البيانات..."}
        </strong>{" "}
        هذه نظرة عامة على متجرك
      </p>
    </div>
  );
};

export default AdminHeader;
