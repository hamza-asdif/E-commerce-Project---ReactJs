import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { FaCartPlus } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";
import SideBarWidget from "../SideBarWidget/SideBarWidget";
import { NavLink, Link } from "react-router-dom";

import Topbar from "./TopBar/Topbar";
import "./Navbar.css";
import "./navBar-mobile.css";

import { useGlobalContext } from "../../Context/GlobalContext";
import SearchBar from "../searchBar/SearchBar";
import { useRef } from "react";

export default function Navbar() {
  const HeaderLinks = [
    {
      name: "إنشاء حساب",
      link: "register",
    },
    {
      name: "تسجيل الدخول",
      link: "admin",
    },
  ];
  const {
    productsInCart,
    productsInCart_TotalPrice,
    toggleCart,
    cartSideBarToggle,
    setSearchState,
    resetAllStates,
    searchState,
    isMobile,
    setIsMobile,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useGlobalContext();
  const [scrollTop, setScrollTop] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const navBarRef = useRef(null);

  const toggleSearch = () => {
    setSearchState((val) => !val);
  };

  // التحقق من حجم الشاشة
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    checkScreenSize();

    // إضافة مستمع للتغيير في حجم النافذة
    window.addEventListener("resize", checkScreenSize);

    // تنظيف المستمع عند إزالة المكون
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // التحقق من حجم الشاشة
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    // تنفيذ الفحص عند تحميل المكون
    checkScreenSize();

    // إضافة مستمع للتغيير في حجم النافذة
    window.addEventListener("resize", checkScreenSize);

    // تنظيف المستمع عند إزالة المكون
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (window.location.pathname.endsWith("/")) {
      const handleScroll = () => {
        const scrollY = window.scrollY;

        if (scrollY > 200) {
          if (scrollY > lastScrollY) {
            setIsVisible(true);
            navBarRef.current.classList.add("scrolled");
          } else {
            setIsVisible(false);
          }
        } else {
          setIsVisible(true);
          navBarRef.current.classList.remove("scrolled");
        }

        setLastScrollY(scrollY);
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [lastScrollY]);



  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <div>
        <Topbar />
        <header
          className={`header ${isVisible ? "visible" : "hidden"}`}
          dir="ltr"
          ref={navBarRef}
        >
          <div className="header-container">
            {isMobile && (
              <div className="mobile-menu-box">
                <FaBarsStaggered id="mobile-menu" onClick={toggleMobileMenu} />
              </div>
            )}

            <div
              className={`header-links ${
                isMobile && mobileMenuOpen ? "mobile-menu-active" : ""
              }`}
            >
              <ul>
                {HeaderLinks.map((link, index) => (
                  <li className="header-li" key={index}>
                    <Link to={link.link} className="header-a">
                      {link.name}
                    </Link>
                  </li>
                ))}

                <li className="header-li shop-now">
                  <Link to="/shop" className="header-a shop-now">
                    تسوق الآن
                  </Link>
                </li>

                <li className="header-li" onClick={toggleSearch}>
                  <span to="" className="header-a">
                    <IoSearch
                      className="header-search-icon"
                      id="header-search-icon"
                    />
                  </span>
                </li>
              </ul>
            </div>

            <div className="header-logo">
              <NavLink to="" className="logo-box" onClick={resetAllStates}>
                <img src="/images/logo.png" alt="Logo" />
              </NavLink>
            </div>

            <div className="header-cart">
              <div className="cart-box">
                <div className="cart-box-div">
                  <div className="cart-content">
                    <span
                      className="cart-link"
                      id="id-cart-span"
                      onClick={() => toggleCart(true)}
                    >
                      <span className="cart-span" dir="rtl">
                        {productsInCart_TotalPrice} ريال سعودي
                      </span>
                      <div className="cart-icon-box">
                        <FaCartPlus id="cart-icon" />
                      </div>
                      <span className="cart-counter">
                        {productsInCart.length}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {searchState && <SearchBar />}
      {cartSideBarToggle && <SideBarWidget />}
    </>
  );
}
