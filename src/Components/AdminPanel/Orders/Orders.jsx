import React, { useEffect, useMemo, useState } from "react";
import "./Orders.css";
import supabase from "../../../supabaseClient";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [currency, setCurrency] = useState("ر.س");
  const [orderStatus, setOrderStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(5);
  const [ordersData, setOrdersData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [paginatedOrders, setPaginatedOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1️⃣ جلب الطلبات الكاملة لحساب totalPages عند أول تحميل
  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*", { count: "exact" }) // جلب العدد الإجمالي
        .order("created_at", { ascending: false });

      if (error) {
        console.log("orders fetch error", error);
        return;
      }

      if (data?.length) {
        const newOrdersWithId = data.map((prevItems, index) => ({
          ...prevItems,
          order_Id: index + 1,
        }));

        setOrdersData(newOrdersWithId);
        console.log(newOrdersWithId);
        setTotalPages(Math.ceil(data.length / ordersPerPage));
      } else {
        console.log("No orders found or empty data array");
      }
    };

    fetchOrders();
  }, []);

  // 2️⃣ تحديث startIndex و endIndex عند تغيير الصفحة أو عدد الطلبات في الصفحة
  useEffect(() => {
    const start = (currentPage - 1) * ordersPerPage;
    const end = start + ordersPerPage - 1; // تعديل endIndex ليكون متوافقًا مع Supabase

    setStartIndex(start);
    setEndIndex(end);
  }, [currentPage, ordersPerPage]);

  // 3️⃣ جلب الطلبات حسب التصفح (Pagination)
  useEffect(() => {
    const filterOrders_Pagination = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .range(startIndex, endIndex); // استخدام startIndex و endIndex بعد تحديثهما

        if (error) {
          console.error("Error fetching paginated orders:", error.message);
          return;
        }

        if (Array.isArray(data) && data.length > 0) {
          const newOrders = data.map((prevItems, index) => ({
            ...prevItems,
            order_Id: index + 1,
          }));

          setPaginatedOrders(newOrders);
          console.log(newOrders);
        } else {
          console.log("No orders found in the specified range.");
          setPaginatedOrders([]);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (totalPages > 0) {
      filterOrders_Pagination();
    }
  }, [startIndex, endIndex]);

  // !!! handle the BUTTONS in paginations
  const PaginationButtons = () => {
    return (
      <div className="pagination-container">
        <button
          className="pagination-btn prev-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <i className="arrow-icon">◀</i>
          <span>السابق</span>
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`pagination-number ${
              currentPage === index + 1 ? "active" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="pagination-btn next-btn"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <span>التالي</span>
          <i className="arrow-icon">▶</i>
        </button>
      </div>
    );
  };

  return (
    <div className="orders-dashboard">
      <header className="orders-header">
        <h1 className="orders-title">إدارة الطلبات</h1>
        <div className="orders-stats">
          {["إجمالي الطلبات", "تم التسليم", "قيد الانتظار", "ملغي"].map(
            (label, index) => (
              <div className="stat-card" key={index}>
                <span className="stat-value">١٢٤</span>
                <span className="stat-label">{label}</span>
              </div>
            )
          )}
        </div>
      </header>

      <div className="orders-tools">
        <div className="search-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="البحث عن طلب..."
              className="search-input"
            />
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div className="filter-group">
            <select className="filter-select">
              <option value="">جميع الحالات</option>
              <option value="delivered">تم التسليم</option>
              <option value="pending">قيد الانتظار</option>
              <option value="processing">قيد المعالجة</option>
              <option value="cancelled">ملغي</option>
            </select>

            <div className="date-filter">
              <input type="date" className="date-input" />
              <span className="date-separator">-</span>
              <input type="date" className="date-input" />
            </div>

            <button className="filter-btn">تطبيق الفلتر</button>
            <button className="filter-reset">إعادة تعيين</button>
          </div>
        </div>

        <div className="bulk-actions">
          <select className="bulk-select">
            <option value="">إجراءات جماعية</option>
            <option value="mark-delivered">تحديد كمسلم</option>
            <option value="mark-processing">تحديد كقيد المعالجة</option>
            <option value="export">تصدير المحدد</option>
          </select>
          <button className="bulk-btn">تطبيق</button>
          <button className="export-btn">
            <i className="fas fa-file-export"></i>
            تصدير الكل
          </button>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table" aria-label="جدول الطلبات">
          <thead>
            <tr>
              <th className="checkbox-cell">
                <input type="checkbox" className="select-all-checkbox" />
              </th>
              <th className="sortable">رقم الطلب</th>
              <th>العميل</th>
              <th className="sortable"> تاريخ الطلب</th>
              <th> المبلغ </th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders?.length ?
              paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td className="checkbox-cell">
                    <input type="checkbox" className="order-checkbox" />
                  </td>
                  <td className="order-id">
                    {" "}
                    {order.order_Id.toString().length < 3 ?
                      order.order_Id.toString().length < 2 ?
                        (order.order_Id = `#00${order.order_Id}`)
                      : (order.order_Id = `#0${order.order_Id}`)
                    : ""}
                  </td>
                  <td className="customer-info">
                    <div className="customer-name">
                      {order.Customer_Infos.fullName}
                    </div>
                    <div className="customer-email">john@example.com</div>
                  </td>
                  <td className="order-date">
                    <div className="date-primary">
                      {new Date(order.created_at).toLocaleDateString("en-SA")}
                    </div>
                    <div className="date-secondary">
                      {new Date(order.created_at).toLocaleTimeString("en-SA", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </td>
                  <td className="order-amount">
                    {order.total_price}{" "}
                    <span className="currency-span"> {currency} </span>{" "}
                  </td>
                  <td className="order-status">
                    <HandleOrderStatus order_status={order.status} />
                    {/* <span className="status-badge delivered">
                    </span> */}
                  </td>
                  <td className="actions-cell_2">
                    <div className="action-buttons_2">
                      <button
                        className="action-btn view-btn"
                        title="عرض التفاصيل"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="action-btn print-btn"
                        title="طباعة الفاتورة"
                      >
                        <i className="fas fa-print"></i>
                      </button>
                      <button
                        className="action-btn more-btn"
                        title="المزيد من الخيارات"
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            : <tr>
                <td colSpan="7" className="loading-cell_2">
                  <div className="loading-spinner_2"></div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div className="orders-pagination">
        <div className="pagination-info">
          يوجد <span className="font-semibold">{orders.length}</span> طلبية في
          هذه الصفحة.
        </div>
        <div className="pagination-controls">
          <PaginationButtons
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
        <div className="pagination-options">
          <span>عرض</span>
          <select
            className="per-page-select"
            value={ordersPerPage}
            onChange={(e) => setOrdersPerPage(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="30">30</option>
          </select>
          <span>لكل صفحة</span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Orders);
