import React, { useEffect, useLayoutEffect, useState } from "react";
import "./Home_States.css";
import { BsBoxSeam } from "react-icons/bs";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaDollarSign } from "react-icons/fa6";
import { useAdminGlobalContext } from "../AdminGlobalContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Home_States() {
  const {
    productsData,
    orders,
    earnings,
    currency,
    activeUsers,
    filterOrders,
    filterOrdersByDate,
    statesTimes,
    ordersByTime,
    earningsByTime,
  } = useAdminGlobalContext();
  const [loadingText, setLoadingText] = useState("تحميل البيانات...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productsData?.length && orders?.length && activeUsers?.length) {
      const timer = setTimeout(() => {
        setLoading(false);
        setLoadingText("");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [productsData, orders, activeUsers]);

  const manageDataLoading = (data) => {
    if (loading) {
      return <div className="loader"></div>;
    }
    return <p>{data}</p>;
  };

  return (
    <>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{loadingText}</p>
        </div>
      ) : (
        <div className="quick-state-container">
          <div className="quick-stats">
            <div className="stat-card">
              <h3>إجمالي الإيرادات</h3>
              {manageDataLoading(`${earnings} ${currency}`)}
            </div>
            <div className="stat-card">
              <h3>إجمالي الطلبات</h3>
              {manageDataLoading(orders.length)}
            </div>
            <div className="stat-card">
              <h3>المستخدمون النشطون</h3>
              {manageDataLoading(activeUsers.length)}
            </div>
            <div className="stat-card">
              <h3>المنتجات</h3>
              {manageDataLoading(productsData.length)}
            </div>
          </div>
          <div className="home-state-container">
            <div className="home-state-wrapper">
              <div className="home-state-header">
                <h4>نظرة عامة على لوحة التحكم</h4>
              </div>
              <div className="home-state-body">
                <div className="home-state-orders">
                  <div className="home-state-box">
                    <div className="home-state-box-header">
                      <BsBoxSeamFill className="home-state-box-icons" />
                      <span>الطلبيات</span>
                    </div>

                    <div className="home-state-box-body">
                      {statesTimes.map((timeName, index) => {
                        return (
                          <div className="home-state-box-data" key={index}>
                            <h5> {timeName} </h5>
                            <span>{ordersByTime?.[timeName] ?? 0}</span>

                            {/* استخدام nullish coalescing operator لمنع الأخطاء */}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="home-state-earnings">
                  <div className="home-state-box">
                    <div className="home-state-box-header">
                      <FaDollarSign className="home-state-box-icons" />
                      <span>الأرباح</span>
                    </div>

                    <div className="home-state-box-body">
                      {statesTimes.map((timeName, index) => {
                        return (
                          <div className="home-state-box-data" key={index}>
                            <h5> {timeName} </h5>
                            <span>
                              {`${earningsByTime?.[timeName] ?? 0} ${currency}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home_States;
