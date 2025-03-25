import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import supabase from "../../supabaseClient";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [currency, setCurrency] = useState("ر.س");
  const [filterOrders, setFiltredOrders] = useState([]);
  const [ordersByTime, setOrdersByTime] = useState({});
  const [earningsByTime, setEarningsByTime] = useState({});
  const statesTimes = [
    "جميع الأوقات",
    "هذه السنة",
    "هذا الشهر",
    "هذا الأسبوع",
    "أمس",
    "اليوم",
  ];

  const fetchAdminInfos = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "admin");

    if (error) {
      console.log("ADMIN DATA FETCH ERROR", error);
    } else {
      setAdminInfo(data[0]);
    }
    setLoading(false);
  };

  const handleProductsData = async () => {
    const { data, error } = await supabase.from("products").select("*");

    if (error) console.error(error);
    else {
      console.log("DATA ----------------------", data);
      setProductsData(data);
    }
  };

  const handletotalOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*");

    if (error) console.log(error);
    else {
      setOrders(data);
    }
  };

  const handleActiveUser = async () => {
    const { data, error } = await supabase.from("users").select("*");

    if (error) console.error("active user", error);
    else {
      setActiveUsers(data);
    }
  };

  const filterOrdersByDate = (timeRange) => {
    const now = new Date();

    return orders.filter((order) => {
      const orderDate = new Date(order.created_at); // تأكد أن `createdAt` موجود في بيانات الطلبات

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
          const weekStart = new Date();
          weekStart.setDate(now.getDate() - now.getDay()); // بداية الأسبوع (الأحد)
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
  };

  const calculateStats = () => {
    const ordersResult = {};
    const earningsResult = {};

    statesTimes.forEach((timeName) => {
      const filteredOrders = filterOrdersByDate(timeName);
      ordersResult[timeName] = filteredOrders.length;
      earningsResult[timeName] = filteredOrders.reduce(
        (total, order) => total + parseFloat(order.total_price),
        0
      );
    });

    setOrdersByTime(ordersResult);
    setEarningsByTime(earningsResult);
  };



  useEffect(() => {
    const totalEraning = () => {
      if (orders.length) {
        const allEarnings = orders.reduce((acc, order) => {
          return acc + parseInt(order.total_price);
        }, 0);

        setEarnings(allEarnings);
        console.log(allEarnings);
      }
    };

    totalEraning();
    calculateStats();
  }, [orders]);

  useEffect(() => {
    fetchAdminInfos();
    handleProductsData();
    handletotalOrders();
    handleActiveUser();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        adminInfo,
        loading,
        isMobile,
        setAdminInfo,
        handleProductsData,
        productsData,
        activeUsers,
        orders,
        earnings,
        currency,
        filterOrders,
        setFiltredOrders,
        filterOrdersByDate,
        statesTimes,
        // أضف هذين المتغيرين:
        ordersByTime,
        earningsByTime,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;

export const useAdminGlobalContext = () => {
  return useContext(AdminContext);
};
