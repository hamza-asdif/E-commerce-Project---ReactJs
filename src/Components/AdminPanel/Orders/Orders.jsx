import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Orders.css";
import supabase from "../../../supabaseClient";
import Papa from "papaparse";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [currency] = useState("ر.س");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const tableRowRef = useRef(null);
  const [checkbox, setCheckbox] = useState(false);
  const [tableRowIndex, setTableRowIndex] = useState(null);
  const [tableRowSelected, setTableRowSelected] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [clickedOrder, setClickedOrder] = useState({});
  const [rowsSelectedCount, setRowsSelectedCount] = useState(0);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // *** state for the orders state in the page top *** //
  const [totalOrders, setTotalOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [processingOrders, setProcessingOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);

  // !!! Fetch orders from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: true });
        if (error) throw error;

        const ordersWithIds = data.map((item, index) => ({
          ...item,
          order_Id: `#${String(index + 1).padStart(3, "0")}`,
        }));

        setOrders(ordersWithIds);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // !!! orders states and calculations
  useEffect(() => {
    const calculateOrders = async () => {
      try {
        // Get all orders and their counts by status
        const { data: orderStats, error } = await supabase
          .from("orders")
          .select("status");

        if (error) {
          console.error("Error fetching order statistics:", error);
          return;
        }

        // Calculate totals for each status
        const stats = orderStats.reduce(
          (acc, order) => {
            switch (order.status) {
              case "delivered":
                acc.delivered++;
                break;
              case "processing":
                acc.processing++;
                break;
              case "cancelled":
                acc.cancelled++;
                break;
              default:
                break;
            }
            acc.total++;
            return acc;
          },
          {
            total: 0,
            delivered: 0,
            processing: 0,
            cancelled: 0,
          }
        );

        // Update state with calculated values
        setTotalOrders(stats.total);
        setDeliveredOrders(stats.delivered);
        setProcessingOrders(stats.processing);
        setCancelledOrders(stats.cancelled);
      } catch (error) {
        console.error("Error calculating order statistics:", error);
      }
    };

    calculateOrders();
  }, [orders]);

  // !!! Calculate currently displayed data
  const { paginatedOrders, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    return {
      paginatedOrders: orders.slice(startIndex, endIndex),
      totalPages,
    };
  }, [orders, currentPage, ordersPerPage]);

  // !!! Pagination buttons component
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
            onClick={() => {
              setCurrentPage(index + 1);
            }}
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

  // !!! Display order status
  const HandleOrderStatus = ({ orderStatus }) => {
    const statusMap = {
      delivered: { text: "تم التسليم", className: "delivered" },
      processing: { text: "قيد المعالجة", className: "processing" },
      cancelled: { text: "ملغي", className: "cancelled" },
      default: { text: "قيد الانتظار", className: "pending" },
    };

    const status = statusMap[orderStatus] || statusMap.default;

    return (
      <span className={`status-badge ${status.className}`}>{status.text}</span>
    );
  };

  // !!! Handle the checkbox click
  const handleCheckboxClick = (index, order) => {
    const currentPageSellection = selectedRows[currentPage] || [];

    setSelectedRows((prevItems) => ({
      ...prevItems,
      [currentPage]:
        currentPageSellection.includes(index) ?
          currentPageSellection.filter((rowIndex) => rowIndex !== index)
        : [...currentPageSellection, index],
    }));

    setSelectedOrders((prevItems) => [...prevItems, order]);

    console.log(selectedOrders);

    console.log(selectedRows);
  };

  // !!! Handle check all table rows in the table
  const checkAllTableRows = () => {
    setSelectedRows((prevSelectedRows) => {
      const currentPageSelection = paginatedOrders.map((_, i) => i);

      const isAllSelected =
        prevSelectedRows[currentPage]?.length === paginatedOrders.length;

      const allPaginatedOrders = [...paginatedOrders];

      setSelectedOrders((prevItems) => {
        if (prevItems.length >  0) {
          return [];
        }
        return [...allPaginatedOrders];
      });

      

      return {
        ...prevSelectedRows,
        [currentPage]: isAllSelected ? [] : currentPageSelection,
      };

    });

      console.log(selectedOrders);

  };

  // !!! handle EXPORT ORDERS logic
  const exportToCSV = async () => {
    try {
      // التأكد من أن selectedOrders تحتوي على معرفات الطلبات الصحيحة
      const selectedOrderIds = selectedOrders.map((order) => order.id);

      // جلب الطلبات المحددة من Supabase باستخدام الاسم الصحيح للعمود
      const { data: orders, error } = await supabase
        .from("orders")
        .select(
          `
        id,
        created_at,
        total_price,
        Customer_Infos
      `
        )
        .in("id", selectedOrderIds);

      if (error) {
        console.error("Error fetching selected orders:", error);
        return;
      }

      if (!orders || orders.length === 0) {
        console.error("No orders found to export");
        return;
      }

      // تجهيز البيانات للتصدير بتنسيق CSV
      const csvData = orders.map((order) => ({
        OrderID: order.id,
        Date: new Date(order.created_at).toLocaleDateString("en-SA"),
        Total: order.total_price,
        CustomerName: order.Customer_Infos?.fullName || "غير محدد",
        CustomerPhone: order.Customer_Infos?.tel || "غير متوفر",
        CustomerCity: order.Customer_Infos?.city || "غير محدد",
        CustomerAddress: order.Customer_Infos?.address || "غير محدد",
      }));

      // تحويل البيانات إلى تنسيق CSV
      const csv = Papa.unparse(csvData, {
        quotes: true,
        delimiter: ",",
      });

      // إنشاء Blob ورابط التنزيل
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "orders_export.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting orders to CSV:", error);
    }
  };

  return (
    <div className="orders-dashboard">
      <header className="orders-header">
        <h1 className="orders-title">إدارة الطلبات</h1>
        <div className="orders-stats">
          <div className="stat-card">
            <span className="stat-value">{totalOrders}</span>
            <span className="stat-label">إجمالي الطلبات</span>
          </div>

          <div className="stat-card">
            <span className="stat-value">{deliveredOrders}</span>
            <span className="stat-label">تم التسليم</span>
          </div>

          <div className="stat-card">
            <span className="stat-value">{processingOrders}</span>
            <span className="stat-label">قيد المعالجة</span>
          </div>

          <div className="stat-card">
            <span className="stat-value">{cancelledOrders}</span>
            <span className="stat-label">ملغي</span>
          </div>
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
          <button className="export-btn" onClick={exportToCSV}>
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
                <input
                  type="checkbox"
                  className="select-all-checkbox"
                  onChange={() => checkAllTableRows()}
                  checked={
                    selectedRows[currentPage]?.length ===
                      paginatedOrders.length && paginatedOrders.length > 0
                  }
                />
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
            {loading ?
              <tr>
                <td colSpan="7" className="loading-cell_2">
                  <div className="loading-spinner_2"></div>
                </td>
              </tr>
            : paginatedOrders.length > 0 ?
              paginatedOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className={
                    selectedRows[currentPage]?.includes(index) ? "selected" : ""
                  }
                >
                  <td className="checkbox-cell">
                    <input
                      type="checkbox"
                      className="order-checkbox"
                      onChange={() => handleCheckboxClick(index, order)}
                      checked={
                        selectedRows[currentPage]?.includes(index) || false
                      }
                    />
                  </td>
                  <td className="order-id">{order.order_Id}</td>
                  <td className="customer-info">
                    <div className="customer-name">
                      {order.Customer_Infos?.fullName || "غير محدد"}
                    </div>
                    <div className="customer-email">
                      {order.Customer_Infos?.email || "بريد غير متوفر"}
                    </div>
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
                    <HandleOrderStatus orderStatus={order.status} />
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
                <td colSpan="7">لا توجد طلبات متاحة</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      {!loading && (
        <div className="orders-pagination">
          <div className="pagination-info">
            عرض <span className="font-semibold">{paginatedOrders.length}</span>{" "}
            من <span className="font-semibold">{orders.length}</span> طلبية
          </div>
          <div className="pagination-controls">
            <PaginationButtons />
          </div>
          <div className="pagination-options">
            <span>عرض</span>
            <select
              className="per-page-select"
              value={ordersPerPage}
              onChange={(e) => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  setSelectedRows([]);
                }, 1000);

                setOrdersPerPage(Number(e.target.value));
                setCurrentPage(1); // العودة للصفحة الأولى عند تغيير عدد العناصر
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="30">30</option>
            </select>
            <span>لكل صفحة</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(Orders);
