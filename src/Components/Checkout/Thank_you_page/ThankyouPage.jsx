import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaHome, FaShoppingCart } from "react-icons/fa";
import "./Thankyoupage.css";
import { useGlobalContext } from "../../../Context/GlobalContext";
import supabase from "../../../supabaseClient";

function ThankYouPage() {
  const { submittedOrder } = useGlobalContext();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const getOrderInfo = async () => {
    try {
      if (!submittedOrder?.user_id) return;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", submittedOrder.user_id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      if (data?.length > 0) {
        setOrderDetails(data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderInfo();
  }, [submittedOrder?.user_id]);

  // Format UUID to show first 8 characters only
  const formatOrderId = (uuid) => {
    if (!uuid) return "";
    return uuid.split("-")[0].toUpperCase(); // Shows first part of UUID
  };

  // Format date in Arabic with English numbers
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("ar-SA", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
  };

  return (
    <div className="thank-you-page" dir="rtl">
      <div className="thank-you-card">
        <FaCheckCircle className="success-icon" />
        <h1>شكراً لتسوقك معنا!</h1>
        <p className="confirmation-message">
          تم تأكيد طلبك بنجاح وسيتم تجهيزه في أقرب وقت ممكن
        </p>

        {loading ? (
          <p>جاري تحميل تفاصيل الطلب...</p>
        ) : orderDetails ? (
          <div className="order-summary">
            <h2>ملخص الطلب</h2>
            <div className="order-detail">
              <span>رقم الطلب:</span>
              <strong>#{formatOrderId(orderDetails.id)}</strong>
            </div>
            <div className="order-detail">
              <span>التاريخ:</span>
              <strong>{formatDate(orderDetails.created_at)}</strong>
            </div>
            <div className="order-detail">
              <span>المجموع:</span>
              <strong>{orderDetails.total_price} ر.س</strong>
            </div>
          </div>
        ) : (
          <p>لا يوجد بيانات للطلب</p>
        )}

        <div className="action-buttons">
          <Link to="/" className="home-btn">
            <FaHome /> الصفحة الرئيسية
          </Link>
          <Link to="/orders" className="orders-btn">
            <FaShoppingCart /> طلباتي
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ThankYouPage;
