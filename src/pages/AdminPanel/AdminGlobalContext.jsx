import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import supabase from "../../lib/supabaseClient";
import alertify from "alertifyjs";

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
  const [filterOrders, setFilterOrders] = useState([]);
  const [ordersByTime, setOrdersByTime] = useState({});
  const [earningsByTime, setEarningsByTime] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);

  // Time filters for stats - Memoized to prevent recreation
  const statesTimes = useMemo(
    () => [
      "جميع الأوقات",
      "هذه السنة",
      "هذا الشهر",
      "هذا الأسبوع",
      "أمس",
      "اليوم",
    ],
    []
  );

  // Fetch admin info - Memoized callback
  const fetchAdminInfos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", "admin")
        .single();

      if (error) {
        alertify.error("حدث خطأ في تحميل بيانات المسؤول");
      } else if (data) {
        setAdminInfo(data);
      }
    } catch (error) {
      console.error("Error fetching admin info:", error);
    }
  }, []);

  // Fetch products - Memoized callback
  const handleProductsData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        alertify.error("حدث خطأ في تحميل المنتجات");
      } else if (data?.length) {
        setProductsData(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);

  // Fetch orders - Memoized callback
  const handletotalOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("orders").select("*");

      if (error) {
        alertify.error("حدث خطأ في تحميل الطلبات");
      } else if (data) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, []);

  // Fetch active users - Memoized callback
  const handleActiveUser = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");

      if (error) {
        alertify.error("حدث خطأ في تحميل بيانات المستخدمين");
      } else if (data) {
        setActiveUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  // Filter orders by date - Memoized calculation
  const getFilteredOrdersByDate = useCallback((orders, timeRange) => {
    if (!orders?.length) return [];

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
          const yesterday = new Date(now);
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
  }, []);

  // Memoized calculations for orders and earnings
  const { totalEarnings, orderStats, earningsStats } = useMemo(() => {
    if (!orders?.length) {
      return {
        totalEarnings: 0,
        orderStats: {},
        earningsStats: {},
      };
    }

    // Calculate total earnings once
    const totalEarnings = orders.reduce(
      (acc, order) => acc + (parseFloat(order.total_price) || 0),
      0
    );

    // Calculate stats for each time period
    const orderStats = {};
    const earningsStats = {};

    statesTimes.forEach((timeName) => {
      const filteredOrders = getFilteredOrdersByDate(orders, timeName);
      orderStats[timeName] = filteredOrders.length;
      earningsStats[timeName] = filteredOrders.reduce(
        (total, order) => total + (parseFloat(order.total_price) || 0),
        0
      );
    });

    return {
      totalEarnings,
      orderStats,
      earningsStats,
    };
  }, [orders, statesTimes, getFilteredOrdersByDate]);

  // Update derived state when calculations change
  useEffect(() => {
    setEarnings(totalEarnings);
    setOrdersByTime(orderStats);
    setEarningsByTime(earningsStats);
  }, [totalEarnings, orderStats, earningsStats]);

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchAdminInfos(),
          handleProductsData(),
          handletotalOrders(),
          handleActiveUser(),
        ]);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [
    fetchAdminInfos,
    handleProductsData,
    handletotalOrders,
    handleActiveUser,
  ]);

  // Context value - Memoized to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
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
      setFilterOrders,
      getFilteredOrdersByDate,
      statesTimes,
      ordersByTime,
      earningsByTime,
      showNotifications,
      setShowNotifications,
      refreshOrders: handletotalOrders,
      refreshProducts: handleProductsData,
      refreshUsers: handleActiveUser,
    }),
    [
      adminInfo,
      loading,
      isMobile,
      productsData,
      activeUsers,
      orders,
      earnings,
      currency,
      filterOrders,
      getFilteredOrdersByDate,
      statesTimes,
      ordersByTime,
      earningsByTime,
      showNotifications,
      handletotalOrders,
      handleProductsData,
      handleActiveUser,
    ]
  );

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;

// Custom hook to use admin context
export const useAdminGlobalContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error(
      "useAdminGlobalContext must be used within an AdminProvider"
    );
  }
  return context;
};
