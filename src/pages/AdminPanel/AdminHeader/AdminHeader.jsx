import { useEffect } from "react";
import supabase from "../../../lib/supabaseClient";
import alertify from "alertifyjs";
import { useAdminGlobalContext } from "../AdminGlobalContext";

const AdminHeader = () => {
  const { adminInfo, setAdminInfo } = useAdminGlobalContext();

  useEffect(() => {
    const fetchAdminInfos = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", "admin");

      if (error) {
        alertify.error("حدث خطأ في تحميل بيانات المسؤول");
      } else {
        setAdminInfo(data[0]);
      }
    };

    fetchAdminInfos();
  }, [setAdminInfo]);

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
