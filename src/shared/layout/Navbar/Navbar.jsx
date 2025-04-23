import { useState, useEffect, useRef, useCallback } from "react";
import { IoSearch } from "react-icons/io5";
import { FaCartPlus } from "react-icons/fa6";
import { FaBarsStaggered } from "react-icons/fa6";
import SideBarWidget from "../SideBarWidget/SideBarWidget";
import { NavLink, Link } from "react-router-dom";
import SearchBar from "../../ui/searchBar/SearchBar";
import MobileMenu from "./MobileMenu";
import Topbar from "./TopBar/Topbar";
import "./Navbar.css";
import "./navBar-mobile.css";
import { useGlobalContext } from "../../../hooks/GlobalContextHooks";

export default function Navbar() {
  const HeaderLinks = [
    { name: "إنشاء حساب", link: "register" },
    { name: "تسجيل الدخول", link: "admin" },
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

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navBarRef = useRef(null);

  const toggleSearch = () => {
    setSearchState((prev) => !prev);
    if (!searchState) {
      setMobileMenuOpen(false);
    }
  };

  const handleCloseMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, [setMobileMenuOpen]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [setIsMobile]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY > 200) {
        if (scrollY > lastScrollY) {
          setIsVisible(true);
          navBarRef.current?.classList.add("scrolled");
        } else {
          setIsVisible(false);
        }
      } else {
        setIsVisible(true);
        navBarRef.current?.classList.remove("scrolled");
      }

      setLastScrollY(scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        handleCloseMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen, handleCloseMobileMenu]);

  // Close mobile menu when viewport becomes desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      handleCloseMobileMenu();
    }
  }, [isMobile, mobileMenuOpen, handleCloseMobileMenu]);

  // Close mobile menu and cart/search when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        mobileMenuOpen &&
        !e.target.closest(".mobile-menu") &&
        !e.target.closest(".mobile-menu-box")
      ) {
        handleCloseMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [mobileMenuOpen, handleCloseMobileMenu]);

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
                <button
                  className="mobile-menu-button"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu"
                >
                  <FaBarsStaggered id="mobile-menu" />
                </button>
              </div>
            )}

            <div className="header-cart">
              <div className="cart-box">
                <div className="cart-box-div">
                  <div className="cart-content">
                    <button
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
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="header-logo">
              <NavLink to="" className="logo-box" onClick={resetAllStates}>
                <img src="/images/logo.png" alt="Logo" />
              </NavLink>
            </div>

            <div className="header-links">
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
                <li className="header-li">
                  <span className="header-a" onClick={toggleSearch}>
                    <IoSearch
                      className="header-search-icon"
                      id="header-search-icon"
                    />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </header>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={handleCloseMobileMenu}
        links={HeaderLinks}
        onSearchClick={toggleSearch}
        cartItemCount={productsInCart.length}
        totalPrice={productsInCart_TotalPrice}
      />

      {searchState && <SearchBar />}
      {cartSideBarToggle && <SideBarWidget />}
    </>
  );
}
