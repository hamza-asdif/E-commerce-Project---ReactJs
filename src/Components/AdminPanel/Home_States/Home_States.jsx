import React, { useEffect, useLayoutEffect, useState } from "react";
import "./Home_States.css";
import { BsBoxSeam } from "react-icons/bs";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaDollarSign } from "react-icons/fa6";

function Home_States() {
  const statesTimes = [
    "جميع الأوقات",
    "هذه السنة",
    "هذا الشهر",
    "هذا الأسبوع",
    "أمس",
    "اليوم",
  ];
  const [loadingText, setLoadingText] = useState("جاري تحميل المنتجات...");
  const [loading, setLoading] = useState(true);

  useLayoutEffect( () => {
    handleLoading()
  }, [] )

  const handleLoading  = () => {

    setTimeout(() => {
      setLoading(false)
    }, 1500);
  }

  return (
    <>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{loadingText}</p>
        </div>
      ) : (
        <>
          <div className="quick-stats">
            <div className="stat-card">
              <h3>إجمالي الإيرادات</h3>
              <p>٦٩,٧٣٨.٠٠ ريال</p>
            </div>
            <div className="stat-card">
              <h3>إجمالي الطلبات</h3>
              <p>٣٨٠</p>
            </div>
            <div className="stat-card">
              <h3>المستخدمون النشطون</h3>
              <p>١,٢٣٤</p>
            </div>
            <div className="stat-card">
              <h3>المنتجات</h3>
              <p>٥٦</p>
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
                            <span>0</span>
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
                            <span>0</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Home_States;
