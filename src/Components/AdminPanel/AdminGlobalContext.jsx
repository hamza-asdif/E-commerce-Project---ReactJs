import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import supabase from "../../supabaseClient";

// Create the context
const AdminContext = createContext();

// Provider component
const AdminProvider = ({ children }) => {
  // State variables
  const [adminInfo, setAdminInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [currency] = useState("ر.س");
  const [filterOrders, setFiltredOrders] = useState([]);
  const [ordersByTime, setOrdersByTime] = useState({});
  const [earningsByTime, setEarningsByTime] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);

  // Time filters for stats
  const statesTimes = [
    "جميع الأوقات",
    "هذه السنة",
    "هذا الشهر",
    "هذا الأسبوع",
    "أمس",
    "اليوم",
  ];

  // Fetch admin info
  const fetchAdminInfos = useCallback(async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "admin");

    if (error) {
      console.error("ADMIN DATA FETCH ERROR", error);
    } else {
      setAdminInfo(data[0]);
    }
    setLoading(false);
  }, []);

  // Fetch products
  const handleProductsData = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) console.error(error);
    if (data?.length) {
      setProductsData(data);
    }
  }, []);

  // Fetch all orders
  const handletotalOrders = useCallback(async () => {
    const { data, error } = await supabase.from("orders").select("*");

    if (error) console.error(error);
    else {
      setOrders(data);
    }
  }, []);

  // Fetch all users (for active users)
  const handleActiveUser = useCallback(async () => {
    const { data, error } = await supabase.from("users").select("*");

    if (error) console.error("active user", error);
    else {
      setActiveUsers(data);
    }
  }, []);

  // Filter orders by date range
  const filterOrdersByDate = useCallback(
    (timeRange) => {
      const now = new Date();

      return orders.filter((order) => {
        const orderDate = new Date(order.created_at);

        switch (timeRange) {
          case "اليوم":
            return (
              orderDate.getDate() === now.getDate() &&
              orderDate.getMonth() === now.getMonth() &&
              orderDate.getFullYear() === now.getFullYear()
            );
          case "أمس":
            const yesterday = new Date();
            yesterday.setDate(now.getDate() - 1);
            return (
              orderDate.getDate() === yesterday.getDate() &&
              orderDate.getMonth() === yesterday.getMonth() &&
              orderDate.getFullYear() === yesterday.getFullYear()
            );
          case "هذا الأسبوع":
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            weekStart.setHours(0, 0, 0, 0);
            return orderDate >= weekStart;
          case "هذا الشهر":
            return (
              orderDate.getMonth() === now.getMonth() &&
              orderDate.getFullYear() === now.getFullYear()
            );
          case "هذه السنة":
            return orderDate.getFullYear() === now.getFullYear();
          case "جميع الأوقات":
          default:
            return true;
        }
      });
    },
    [orders]
  );

  // Calculate earnings and stats when orders change
  // Fixed: Combined the calculations to avoid infinite loop
  useEffect(() => {
    // Calculate total earnings
    if (orders.length) {
      const allEarnings = orders.reduce((acc, order) => {
        return acc + parseFloat(order.total_price || 0);
      }, 0);
      setEarnings(allEarnings);
    } else {
      setEarnings(0);
    }

    // Calculate stats for orders and earnings by time
    const ordersResult = {};
    const earningsResult = {};

    statesTimes.forEach((timeName) => {
      const filteredOrders = filterOrdersByDate(timeName);
      ordersResult[timeName] = filteredOrders.length;
      earningsResult[timeName] = filteredOrders.reduce(
        (total, order) => total + parseFloat(order.total_price || 0),
        0
      );
    });

    setOrdersByTime(ordersResult);
    setEarningsByTime(earningsResult);
    // eslint-disable-next-line
  }, [orders]);

  // Initial data fetch (run only once on mount)
  useEffect(() => {
    fetchAdminInfos();
    handleProductsData();
    handletotalOrders();
    handleActiveUser();
    // eslint-disable-next-line
  }, []);

  // Context value
  const contextValue = {
    adminInfo,
    loading,
    isMobile,
    setIsMobile,
    setAdminInfo,
    handleProductsData,
    productsData,
    setProductsData,
    activeUsers,
    orders,
    setOrders,
    earnings,
    currency,
    filterOrders,
    setFiltredOrders,
    filterOrdersByDate,
    statesTimes,
    ordersByTime,
    earningsByTime,
    showNotifications,
    setShowNotifications,
    refreshOrders: handletotalOrders,
    refreshProducts: handleProductsData,
    refreshUsers: handleActiveUser,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;

// Custom hook for using the context
export const useAdminGlobalContext = () => {
  return useContext(AdminContext);
};