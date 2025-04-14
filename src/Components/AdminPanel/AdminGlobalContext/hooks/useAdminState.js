import { useState, useCallback, useEffect, useMemo } from 'react';
import supabase from '../../../../supabaseClient';

const useAdminState = () => {
  // State declarations
  const [adminInfo, setAdminInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobile] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [currency] = useState("ر.س");
  const [filterOrders, setFiltredOrders] = useState([]);
  const [ordersByTime, setOrdersByTime] = useState({});
  const [earningsByTime, setEarningsByTime] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderError, setOrderError] = useState(null);

  const statesTimes = useMemo(() => [
    "جميع الأوقات",
    "هذه السنة",
    "هذا الشهر",
    "هذا الأسبوع",
    "أمس",
    "اليوم",
  ], []);

  const filterOrdersByDate = useCallback((timeRange) => {
    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order.created_at);

      switch (timeRange) {
        case "اليوم": {
          return orderDate.toDateString() === now.toDateString();
        }
        case "أمس": {
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          return orderDate.toDateString() === yesterday.toDateString();
        }
        case "هذا الأسبوع": {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          return orderDate >= weekStart;
        }
        case "هذا الشهر": {
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        }
        case "هذه السنة": {
          return orderDate.getFullYear() === now.getFullYear();
        }
        case "جميع الأوقات":
        default: {
          return true;
        }
      }
    });
  }, [orders]);

  const calculateStats = useCallback(() => {
    if (!orders.length) return;

    try {
      const ordersResult = {};
      const earningsResult = {};

      statesTimes.forEach((timeName) => {
        const filteredOrders = filterOrdersByDate(timeName);
        ordersResult[timeName] = filteredOrders?.length || 0;
        earningsResult[timeName] =
          filteredOrders?.reduce(
            (total, order) => total + (parseFloat(order.total_price) || 0),
            0
          ) || 0;
      });

      setOrdersByTime(ordersResult);
      setEarningsByTime(earningsResult);

      const allEarnings = orders.reduce(
        (acc, order) => acc + (parseFloat(order.total_price) || 0),
        0
      );
      setEarnings(allEarnings);
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  }, [orders, filterOrdersByDate, statesTimes]);

  const handleProductsData = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      if (data?.length) {
        setProductsData(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchAdminInfos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", "admin");

      if (error) throw error;
      if (data?.length) {
        setAdminInfo(data[0]);
      }
    } catch (error) {
      console.error("Error fetching admin info:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrderError(null);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const ordersWithIds = data.map((order, index) => ({
          ...order,
          order_Id: `#${String(index + 1).padStart(3, "0")}`,
          status: order.status || "pending",
          read: order.read || false,
          total_price: parseFloat(order.total_price || 0),
          Customer_Infos: order.Customer_Infos || {},
          products: Array.isArray(order.products) ? order.products : []
        }));

        setOrders(ordersWithIds);
        calculateStats();
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrderError(error.message);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [calculateStats]);

  const fetchActiveUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      setActiveUsers(data || []);
    } catch (error) {
      console.error("Error fetching active users:", error);
    }
  };

  // Setup real-time subscriptions
  useEffect(() => {
    const channel = supabase.channel('order-changes');
    
    const subscription = channel
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders' 
        }, 
        (payload) => {
          try {
            switch (payload.eventType) {
              case "INSERT":
                setOrders(currentOrders => [payload.new, ...currentOrders]);
                break;
              case "UPDATE":
                setOrders(currentOrders =>
                  currentOrders.map(order =>
                    order.id === payload.new.id ? payload.new : order
                  )
                );
                break;
              case "DELETE":
                setOrders(currentOrders =>
                  currentOrders.filter(order => order.id !== payload.old.id)
                );
                break;
            }
          } catch (error) {
            console.error("Error handling real-time order update:", error);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchAdminInfos();
    handleProductsData();
    fetchOrders();
    fetchActiveUsers();
  }, [fetchAdminInfos, fetchOrders]);

  // Recalculate stats when orders change
  useEffect(() => {
    if (orders.length) {
      calculateStats();
    }
  }, [orders, calculateStats]);

  return {
    adminInfo,
    loading,
    isMobile,
    setAdminInfo,
    handleProductsData,
    productsData,
    setProductsData,
    activeUsers,
    orders,
    setOrders,
    ordersLoading,
    orderError,
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
  };
};

export default useAdminState;