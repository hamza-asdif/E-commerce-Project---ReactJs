import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaHome, FaShoppingCart } from "react-icons/fa";
import "./Thankyoupage.css";
import { useGlobalContext } from "../../../hooks/GlobalContextHooks";
import supabase from "../../../lib/supabaseClient";

function ThankYouPage() {
  const { submittedOrder } = useGlobalContext();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const getOrderInfo = async () => {
    try {
      // Try to get the order ID from context first, then from localStorage
      const orderId =
        submittedOrder?.user_id || localStorage.getItem("lastOrderId");

      if (!orderId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", orderId)
        .single();

      if (error) throw error;

      if (data) {
        setOrderDetails(data);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
      // Clear the localStorage after fetching
      localStorage.removeItem("lastOrderId");
    }
  };

  useEffect(() => {
    getOrderInfo();
  }, [submittedOrder]);

  const formatOrderId = (uuid) => {
    return uuid ? uuid.substring(0, 8).toUpperCase() : "N/A";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="thank-you-page">
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
              <strong>#{formatOrderId(orderDetails.user_id)}</strong>
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
          <p>لا يمكن عرض تفاصيل الطلب حالياً</p>
        )}

        <div className="action-buttons">
          <Link to="/" className="home-btn">
            <FaHome /> الصفحة الرئيسية
          </Link>
          <Link to="/shop" className="orders-btn">
            <FaShoppingCart /> متابعة التسوق
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ThankYouPage;
