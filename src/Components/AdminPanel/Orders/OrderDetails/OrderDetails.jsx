/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import "./OrderDetails.css";
import supabase from "../../../../supabaseClient";
import alertify from "alertifyjs";

const OrderDetailsPopup = ({ isOpen, setIsOpen, order }) => {
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status);
    }
  }, [order]);

  const statusOptions = [
    { value: "pending", label: "قيد الانتظار", color: "#f59e0b" },
    { value: "processing", label: "قيد المعالجة", color: "#3b82f6" },
    { value: "delivered", label: "تم التسليم", color: "#10b981" },
    { value: "cancelled", label: "ملغي", color: "#6b7280" },
  ];

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) {
      setShowStatusPopup(false);
      return;
    }

    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", order.id)
        .single();

      if (error) throw error;

      setCurrentStatus(newStatus);
      alertify.success("تم تحديث حالة الطلب بنجاح");

      // Update the order in the parent component
      order.status = newStatus;
    } catch (error) {
      console.error("Error updating order status:", error);
      alertify.error("حدث خطأ أثناء تحديث حالة الطلب");
    } finally {
      setIsUpdating(false);
      setShowStatusPopup(false);
    }
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return statusOption ? statusOption.color : "#64748b";
  };

  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return statusOption ? statusOption.label : "غير معروف";
  };

  if (!isOpen || !order) return null;

  return (
    <div className="order-modal-overlay-unique" onClick={() => setIsOpen(false)}>
      <div className="order-modal-unique" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header-unique">
          <h2>تفاصيل الطلب {order.order_Id} </h2>
          <button
            className="close-button-unique"
            aria-label="إغلاق"
            onClick={() => setIsOpen(false)}
          >
            <span>&times;</span>
          </button>
        </header>

        <div className="modal-content-unique">
          <section className="customer-info-unique">
            <h3>معلومات العميل</h3>
            <div className="info-container-unique">
              <div className="info-item-unique">
                <i className="fas fa-user"></i>
                <div>
                  <label>الاسم</label>
                  <p>{order.Customer_Infos.fullName}</p>
                </div>
              </div>
              <div className="info-item-unique">
                <i className="fas fa-envelope"></i>
                <div>
                  <label>البريد الإلكتروني</label>
                  <p>
                    {order.Customer_Infos.email || "hamzaasdif@gmail.com"}
                  </p>
                </div>
              </div>
              <div className="info-item-unique">
                <i className="fas fa-phone"></i>
                <div>
                  <label>الهاتف</label>
                  <p dir="ltr">{order.Customer_Infos.tel}</p>
                </div>
              </div>
              <div className="info-item-unique">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <label>العنوان</label>
                  <p>{order.Customer_Infos.address}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="order-summary-unique">
            <h3>ملخص الطلب</h3>
            <div className="summary-container-unique">
              <div className="summary-item-unique">
                <span
                  className={`status-badge-unique ${currentStatus}`}
                  style={{
                    backgroundColor: getStatusColor(currentStatus) + "20",
                    color: getStatusColor(currentStatus),
                  }}
                >
                  {getStatusLabel(currentStatus)}
                </span>
              </div>
              <div className="summary-item-unique">
                <label>تاريخ الطلب</label>
                <p>{new Date(order.created_at).toLocaleDateString("ar-SA")}</p>
              </div>
              <div className="summary-item-unique">
                <label>طريقة الدفع</label>
                <p>الدفع عند الاستلام</p>
              </div>
              <div className="summary-item-unique">
                <label>المبلغ الإجمالي</label>
                <p className="total-amount-unique">{order.total_price} ر.س</p>
              </div>
            </div>
          </section>

          <section className="order-items-unique">
            <h3>العناصر المطلوبة</h3>
            <div className="items-table-wrapper-unique">
              <table className="items-table-unique">
                <thead>
                  <tr>
                    <th>المنتج</th>
                    <th>التفاصيل</th>
                    <th>السعر</th>
                    <th>الكمية</th>
                    <th>الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-image-unique">
                          <img src={product.Image} alt={product.name} />
                        </div>
                      </td>
                      <td>
                        <div className="product-details-unique">
                          <h4>{product.name}</h4>
                          <span className="product-id-unique">
                            #{product.id}
                          </span>
                        </div>
                      </td>
                      <td>{product.price} ر.س</td>
                      <td>{product.quantity}</td>
                      <td>{product.price * product.quantity} ر.س</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <footer className="modal-footer-unique">
          <button className="btn-secondary-unique">
            <i className="fas fa-print"></i> طباعة الفاتورة
          </button>
          <button
            className="btn-primary-unique"
            onClick={() => setShowStatusPopup(true)}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> جاري التحديث...
              </>
            ) : (
              <>
                <i className="fas fa-sync"></i> تغيير الحالة
              </>
            )}
          </button>
        </footer>

        {showStatusPopup && (
          <div
            className="status-popup-overlay-unique"
            onClick={() => !isUpdating && setShowStatusPopup(false)}
          >
            <div className="status-popup-unique" onClick={(e) => e.stopPropagation()}>
              <h4>تغيير حالة الطلب</h4>
              <div className="status-options-unique">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    className={`status-option-unique ${
                      currentStatus === status.value ? "active" : ""
                    }`}
                    onClick={() => handleStatusChange(status.value)}
                    disabled={isUpdating}
                    style={{
                      "--status-color": status.color,
                      "--status-bg": status.color + "20",
                    }}
                  >
                    <span className="status-dot-unique"></span>
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPopup;