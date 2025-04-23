import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import alertify from "alertifyjs";
import supabase from "../../../../supabaseClient";
import { useAdminGlobalContext } from "../../AdminGlobalContext";
import "./OrderDetails.css";

const statusOptions = [
  { value: "pending", label: "قيد الانتظار", color: "#f59e0b" },
  { value: "processing", label: "قيد المعالجة", color: "#3b82f6" },
  { value: "delivered", label: "تم التسليم", color: "#10b981" },
  { value: "cancelled", label: "ملغي", color: "#6b7280" },
];

const OrderDetailsPopup = ({ isOpen, setIsOpen, order, mode = "view" }) => {
  const [currentStatus, setCurrentStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const { refreshOrders } = useAdminGlobalContext();
  const [selectedTab, setSelectedTab] = useState("details"); // ["details", "products", "notes"]

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status);
      setOrderNote(order.notes || "");
    }
  }, [order]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;

    try {
      setIsUpdating(true);

      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", order.id);

      if (error) throw error;

      setCurrentStatus(newStatus);
      if (order) order.status = newStatus;
      if (refreshOrders) refreshOrders();

      alertify.success("تم تحديث حالة الطلب بنجاح");
    } catch (error) {
      console.error("Error updating order status:", error);
      alertify.error("حدث خطأ أثناء تحديث حالة الطلب");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNoteUpdate = async () => {
    try {
      setIsUpdating(true);

      const { error } = await supabase
        .from("orders")
        .update({ notes: orderNote })
        .eq("id", order.id);

      if (error) throw error;

      alertify.success("تم حفظ الملاحظات بنجاح");
    } catch (error) {
      console.error("Error saving note:", error);
      alertify.error("حدث خطأ أثناء حفظ الملاحظات");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen || !order) return null;

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return statusOption ? statusOption.color : "#64748b";
  };

  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return statusOption ? statusOption.label : "غير معروف";
  };

  const renderTab = () => {
    switch (selectedTab) {
      case "products":
        return (
          <div className="products-tab">
            <div className="products-grid">
              {order.products?.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.Image} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <div className="product-details">
                      <span className="price">{product.price} ر.س</span>
                      <span className="quantity">
                        الكمية: {product.quantity}
                      </span>
                      <span className="total">
                        الإجمالي: {product.price * product.quantity} ر.س
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-summary">
              <div className="summary-row">
                <span>المجموع الفرعي:</span>
                <span>{order.total_price} ر.س</span>
              </div>
              <div className="summary-row">
                <span>رسوم الشحن:</span>
                <span>0 ر.س</span>
              </div>
              <div className="summary-row total">
                <span>الإجمالي:</span>
                <span>{order.total_price} ر.س</span>
              </div>
            </div>
          </div>
        );

      case "notes":
        return (
          <div className="notes-tab">
            <textarea
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="أضف ملاحظات حول هذا الطلب..."
              className="notes-textarea"
            />
            <button
              className="save-notes-btn"
              onClick={handleNoteUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? "جاري الحفظ..." : "حفظ الملاحظات"}
            </button>
          </div>
        );

      default: // details tab
        return (
          <div className="details-tab">
            <div className="info-grid">
              <div className="info-section">
                <h3>معلومات العميل</h3>
                <div className="info-card">
                  <div className="info-row">
                    <i className="fas fa-user"></i>
                    <div>
                      <label>الاسم</label>
                      <p>{order.Customer_Infos?.fullName || "غير محدد"}</p>
                    </div>
                  </div>
                  <div className="info-row">
                    <i className="fas fa-phone"></i>
                    <div>
                      <label>الهاتف</label>
                      <p dir="ltr">
                        {order.Customer_Infos?.tel || "غير متوفر"}
                      </p>
                    </div>
                  </div>
                  <div className="info-row">
                    <i className="fas fa-envelope"></i>
                    <div>
                      <label>البريد الإلكتروني</label>
                      <p>{order.Customer_Infos?.email || "غير متوفر"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>معلومات التوصيل</h3>
                <div className="info-card">
                  <div className="info-row">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                      <label>العنوان</label>
                      <p>{order.Customer_Infos?.address || "غير محدد"}</p>
                    </div>
                  </div>
                  <div className="info-row">
                    <i className="fas fa-city"></i>
                    <div>
                      <label>المدينة</label>
                      <p>{order.Customer_Infos?.city || "غير محدد"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>معلومات الطلب</h3>
                <div className="info-card">
                  <div className="info-row">
                    <i className="fas fa-shopping-cart"></i>
                    <div>
                      <label>رقم الطلب</label>
                      <p>{order.order_Id}</p>
                    </div>
                  </div>
                  <div className="info-row">
                    <i className="fas fa-calendar"></i>
                    <div>
                      <label>تاريخ الطلب</label>
                      <p>
                        {new Date(order.created_at).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                  </div>
                  <div className="info-row">
                    <i className="fas fa-money-bill-wave"></i>
                    <div>
                      <label>طريقة الدفع</label>
                      <p>الدفع عند الاستلام</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="order-modal-overlay" onClick={() => setIsOpen(false)}>
      <div className="order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <h2>تفاصيل الطلب {order.order_Id}</h2>
            <div
              className="order-status"
              style={{ backgroundColor: `${getStatusColor(currentStatus)}20` }}
            >
              <span
                className="status-dot"
                style={{ backgroundColor: getStatusColor(currentStatus) }}
              ></span>
              <span style={{ color: getStatusColor(currentStatus) }}>
                {getStatusLabel(currentStatus)}
              </span>
            </div>
          </div>
          <button className="close-button" onClick={() => setIsOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${selectedTab === "details" ? "active" : ""}`}
              onClick={() => setSelectedTab("details")}
            >
              <i className="fas fa-info-circle"></i>
              التفاصيل
            </button>
            <button
              className={`tab ${selectedTab === "products" ? "active" : ""}`}
              onClick={() => setSelectedTab("products")}
            >
              <i className="fas fa-box"></i>
              المنتجات
            </button>
            <button
              className={`tab ${selectedTab === "notes" ? "active" : ""}`}
              onClick={() => setSelectedTab("notes")}
            >
              <i className="fas fa-sticky-note"></i>
              الملاحظات
            </button>
          </div>
        </div>

        <div className="modal-content">{renderTab()}</div>

        <div className="modal-footer">
          {selectedTab === "details" && (
            <div className="status-buttons">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  className={`status-btn ${currentStatus === status.value ? "active" : ""}`}
                  onClick={() => handleStatusChange(status.value)}
                  disabled={isUpdating}
                  style={{
                    "--status-color": status.color,
                    "--status-bg": status.color + "20",
                  }}
                >
                  {status.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

OrderDetailsPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  order: PropTypes.object,
  mode: PropTypes.oneOf(["view", "print"]),
};

export default OrderDetailsPopup;
