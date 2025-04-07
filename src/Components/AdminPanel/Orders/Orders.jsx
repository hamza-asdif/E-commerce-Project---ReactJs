import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Orders.css";
import supabase from "../../../supabaseClient";
import Papa from "papaparse";
import alertify from "alertifyjs";
import OrderDetailsPopup from "./OrderDetails/OrderDetails";


function Orders() {
  const [orders, setOrders] = useState([]);
  const [currency] = useState("ر.س");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const tableRowRef = useRef(null);
  const [checkbox, setCheckbox] = useState(false);
  const [tableRowIndex, setTableRowIndex] = useState(null);
  const [tableRowSelected, setTableRowSelected] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [clickedOrder, setClickedOrder] = useState({});
  const [rowsSelectedCount, setRowsSelectedCount] = useState(0);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // State for orders stats
  const [totalOrders, setTotalOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [processingOrders, setProcessingOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);
  const [isOrderDetails, setisOrderDeatils] = useState(false)

  // Fetch orders from Supabase
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

  // Calculate order statistics
  useEffect(() => {
    const calculateOrders = async () => {
      try {
        const { data: orderStats, error } = await supabase
          .from("orders")
          .select("status");

        if (error) {
          console.error("Error fetching order statistics:", error);
          return;
        }

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

  // Filter orders based on search term
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;

    const searchValue = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const {
        fullName = "",
        tel = "",
        address = "",
        city = "",
      } = order.Customer_Infos || {};
      return (
        fullName.toLowerCase().includes(searchValue) ||
        tel.toLowerCase().includes(searchValue) ||
        address.toLowerCase().includes(searchValue) ||
        city.toLowerCase().includes(searchValue) ||
        order.order_Id.toLowerCase().includes(searchValue)
      );
    });
  }, [orders, searchTerm]);

  // Pagination logic
  const { paginatedOrders, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const ordersToPaginate = isSearchActive ? filteredOrders : orders;
    const totalPages = Math.ceil(ordersToPaginate.length / ordersPerPage);

    return {
      paginatedOrders: ordersToPaginate.slice(startIndex, endIndex),
      totalPages,
    };
  }, [orders, filteredOrders, currentPage, ordersPerPage, isSearchActive]);

  // Search function
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearchActive(true);
      setCurrentPage(1);
    } else {
      setIsSearchActive(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setIsSearchActive(false);
    setCurrentPage(1);
  };

  // PaginationButtons component
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

  // HandleOrderStatus component
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

  // Handle checkbox click
  const handleCheckboxClick = (index, order) => {
    const currentPageSelection = selectedRows[currentPage] || [];
    const isSelected = currentPageSelection.includes(index);

    setSelectedRows((prevItems) => ({
      ...prevItems,
      [currentPage]: isSelected
        ? currentPageSelection.filter((rowIndex) => rowIndex !== index)
        : [...currentPageSelection, index],
    }));

    setSelectedOrders((prevOrders) => {
      if (isSelected) {
        return prevOrders.filter(
          (selectedOrder) => selectedOrder.id !== order.id
        );
      } else {
        const orderExists = prevOrders.some(
          (selectedOrder) => selectedOrder.id === order.id
        );
        return orderExists ? prevOrders : [...prevOrders, order];
      }
    });
  };

  // Check all table rows
  const checkAllTableRows = () => {
    const currentPageSelection = selectedRows[currentPage] || [];
    const isAllSelected =
      currentPageSelection.length === paginatedOrders.length &&
      paginatedOrders.length > 0;

    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [currentPage]: isAllSelected ? [] : paginatedOrders.map((_, i) => i),
    }));

    setSelectedOrders((prevOrders) => {
      if (isAllSelected) {
        const currentPageOrderIds = paginatedOrders.map((order) => order.id);
        return prevOrders.filter(
          (order) => !currentPageOrderIds.includes(order.id)
        );
      } else {
        const newOrders = [...prevOrders];
        paginatedOrders.forEach((order) => {
          if (
            !newOrders.some((selectedOrder) => selectedOrder.id === order.id)
          ) {
            newOrders.push(order);
          }
        });
        return newOrders;
      }
    });
  };

  // Export to CSV
  const exportToCSV = async () => {
    try {
      if (selectedOrders.length === 0) {
        alertify.error("الرجاء تحديد طلب واحد على الأقل للتصدير");
        return;
      }

      const notification = alertify.notify(
        `جاري تصدير ${selectedOrders.length} طلب...`,
        "custom",
        0
      );

      setLoading(true);

      const selectedOrderIds = selectedOrders.map((order) => order.id);
      const { data: orders, error } = await supabase
        .from("orders")
        .select(`id, created_at, total_price, Customer_Infos, status`)
        .in("id", selectedOrderIds);

      if (error) {
        console.error("Error fetching selected orders:", error);
        notification.dismiss();
        alertify.error("حدث خطأ أثناء جلب بيانات الطلبات");
        return;
      }

      if (!orders || orders.length === 0) {
        console.error("No orders found to export");
        notification.dismiss();
        alertify.error("لم يتم العثور على طلبات للتصدير");
        return;
      }

      notification.setContent(`جاري معالجة ${orders.length} طلب...`);

      const csvData = orders.map((order) => ({
        OrderID: order.id,
        Date: new Date(order.created_at).toLocaleDateString("en-SA"),
        Total: order.total_price,
        Status: order.status,
        CustomerName: order.Customer_Infos?.fullName || "غير محدد",
        CustomerPhone: order.Customer_Infos?.tel || "غير متوفر",
        CustomerEmail: order.Customer_Infos?.email || "غير متوفر",
        CustomerCity: order.Customer_Infos?.city || "غير محدد",
        CustomerAddress: order.Customer_Infos?.address || "غير محدد",
      }));

      notification.setContent(`جاري إنشاء ملف التصدير...`);

      const csv = Papa.unparse(csvData, {
        quotes: true,
        delimiter: ",",
        header: true,
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders_export_${new Date().toISOString().slice(0, 10)}.csv`;

      notification.setContent(`جاري تنزيل الملف...`);

      setTimeout(() => {
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        notification.dismiss();
        alertify.success(`تم تصدير ${orders.length} طلب بنجاح`);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error exporting orders to CSV:", error);
      alertify.error("حدث خطأ أثناء تصدير الطلبات");
      setLoading(false);
    }
  };

  // Export all to CSV
  const exportAllToCSV = async () => {
    try {
      alertify
        .confirm(
          "تصدير جميع الطلبات",
          "هل أنت متأكد من رغبتك في تصدير جميع الطلبات؟ قد تستغرق هذه العملية بعض الوقت.",
          async function () {
            try {
              const notification = alertify.notify(
                "جاري تحضير البيانات للتصدير...",
                "custom",
                0
              );

              setLoading(true);
              notification.setContent("جاري جلب بيانات الطلبات...");
              const { data: allOrders, error } = await supabase
                .from("orders")
                .select(`id, created_at, total_price, Customer_Infos, status`);

              if (error) {
                console.error("Error fetching all orders:", error);
                notification.dismiss();
                alertify.error("حدث خطأ أثناء جلب بيانات الطلبات");
                setLoading(false);
                return;
              }

              if (!allOrders || allOrders.length === 0) {
                notification.dismiss();
                alertify.error("لا توجد طلبات للتصدير");
                setLoading(false);
                return;
              }

              notification.setContent(`جاري معالجة ${allOrders.length} طلب...`);

              const batchSize = 100;
              const totalBatches = Math.ceil(allOrders.length / batchSize);
              let csvData = [];

              for (let i = 0; i < totalBatches; i++) {
                const start = i * batchSize;
                const end = Math.min(start + batchSize, allOrders.length);
                const batch = allOrders.slice(start, end);

                notification.setContent(
                  `جاري معالجة الدفعة ${i + 1} من ${totalBatches}...`
                );

                const batchData = batch.map((order) => ({
                  OrderID: order.id,
                  Date: new Date(order.created_at).toLocaleDateString("en-SA"),
                  Total: order.total_price,
                  Status: order.status,
                  CustomerName: order.Customer_Infos?.fullName || "غير محدد",
                  CustomerPhone: order.Customer_Infos?.tel || "غير متوفر",
                  CustomerEmail: order.Customer_Infos?.email || "غير متوفر",
                  CustomerCity: order.Customer_Infos?.city || "غير محدد",
                  CustomerAddress: order.Customer_Infos?.address || "غير محدد",
                }));

                csvData = [...csvData, ...batchData];
                await new Promise((resolve) => setTimeout(resolve, 0));
              }

              notification.setContent(`جاري إنشاء ملف التصدير...`);

              const csv = Papa.unparse(csvData, {
                quotes: true,
                delimiter: ",",
                header: true,
              });

              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `all_orders_export_${new Date().toISOString().slice(0, 10)}.csv`;

              notification.setContent(`جاري تنزيل الملف...`);

              setTimeout(() => {
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                notification.dismiss();
                alertify.success(`تم تصدير ${allOrders.length} طلب بنجاح`);
                setLoading(false);
              }, 1000);
            } catch (error) {
              console.error("Error exporting all orders to CSV:", error);
              alertify.error("حدث خطأ أثناء تصدير الطلبات");
              setLoading(false);
            }
          },
          function () {
            alertify.message("تم إلغاء عملية التصدير");
          }
        )
        .set("labels", { ok: "تصدير", cancel: "إلغاء" });
    } catch (error) {
      console.error("Error in export dialog:", error);
      alertify.error("حدث خطأ غير متوقع");
    }
  };

  // Apply bulk action
  const applyBulkAction = async (action) => {
    if (selectedOrders.length === 0) {
      alertify.error("الرجاء تحديد طلب واحد على الأقل");
      return;
    }

    const selectedOrderIds = selectedOrders.map((order) => order.id);

    try {
      setLoading(true);

      let newStatus;
      switch (action) {
        case "mark-delivered":
          newStatus = "delivered";
          break;
        case "mark-processing":
          newStatus = "processing";
          break;
        default:
          return;
      }

      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .in("id", selectedOrderIds);

      if (error) {
        console.error("Error updating orders:", error);
        alertify.error("حدث خطأ أثناء تحديث حالة الطلبات");
        return;
      }

      const { data: updatedOrders, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: true });

      if (fetchError) {
        console.error("Error fetching updated orders:", fetchError);
        return;
      }

      const ordersWithIds = updatedOrders.map((item, index) => ({
        ...item,
        order_Id: `#${String(index + 1).padStart(3, "0")}`,
      }));

      setOrders(ordersWithIds);
      setSelectedOrders([]);
      setSelectedRows({});

      alertify.success(`تم تحديث حالة ${selectedOrderIds.length} طلب بنجاح`);
    } catch (error) {
      console.error("Error applying bulk action:", error);
      alert("حدث خطأ أثناء تطبيق الإجراء");
    } finally {
      setLoading(false);
    }
  };

  return (
    

    <>
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
          <div className="search-box_orders">
            <input
              type="text"
              placeholder="ابحث برقم الطلب، الاسم، الهاتف..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {isSearchActive ? (
              <button className="search-btn" onClick={clearSearch}>
                <i className="fas fa-times"></i>
              </button>
            ) : (
              <button className="search-btn" onClick={handleSearch}>
                <i className="fas fa-search"></i>
              </button>
            )}
          </div>
        </div>

        <div className="bulk-actions">
          <select
            className="bulk-select"
            onChange={(e) => {
              if (e.target.value) {
                if (e.target.value === "export") {
                  exportToCSV();
                } else {
                  applyBulkAction(e.target.value);
                }
                e.target.value = "";
              }
            }}
          >
            <option value="">إجراءات جماعية</option>
            <option value="mark-delivered">تحديد كمسلم</option>
            <option value="mark-processing">تحديد كقيد المعالجة</option>
            <option value="export">تصدير المحدد</option>
          </select>
          <button
            className="export-btn"
            onClick={exportAllToCSV}
            disabled={loading}
          >
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
                  onChange={checkAllTableRows}
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
            {loading ? (
              <tr>
                <td colSpan="7" className="loading-cell_2">
                  <div className="loading-spinner_2"></div>
                </td>
              </tr>
            ) : paginatedOrders.length > 0 ? (
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
                        onClick={() => {
                          setisOrderDeatils(true)
                          setClickedOrder(order)
                        }}
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
            ) : (
              <tr>
                <td colSpan="7">
                  {isSearchActive
                    ? "لا توجد نتائج مطابقة للبحث"
                    : "لا توجد طلبات متاحة"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && (
        <div className="orders-pagination">
          <div className="pagination-info">
            عرض <span className="font-semibold">{paginatedOrders.length}</span>{" "}
            من{" "}
            <span className="font-semibold">
              {isSearchActive ? filteredOrders.length : orders.length}
            </span>{" "}
            طلبية
            {isSearchActive && " (نتائج البحث)"}
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
                setCurrentPage(1);
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
    <OrderDetailsPopup isOpen={isOrderDetails}  setIsOpen={setisOrderDeatils} order={clickedOrder} />


    
    </>
  );
}

export default React.memo(Orders);
