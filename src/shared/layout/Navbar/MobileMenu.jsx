import { IoClose } from "react-icons/io5";
import {
  FaUserPlus,
  FaSignInAlt,
  FaShoppingBag,
  FaSearch,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./MobileMenu.css";
import { useGlobalContext } from "../../../hooks/GlobalContextHooks";

function MobileMenu({
  isOpen,
  onClose,
  links,
  onSearchClick,
  cartItemCount,
  totalPrice,
}) {
  const menuRef = useRef();
  const navigate = useNavigate();
  const { toggleCart } = useGlobalContext();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("mobile-menu-open");
      menuRef.current?.focus();
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isOpen]);

  const handleCartClick = () => {
    onClose();
    navigate("/cart"); // Navigate to cart page instead of opening sidebar
  };

  // Map icons to link names
  const getIcon = (name) => {
    switch (name) {
      case "إنشاء حساب":
        return <FaUserPlus />;
      case "تسجيل الدخول":
        return <FaSignInAlt />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`mobile-menu ${isOpen ? "mobile-menu-active" : ""}`}
      ref={menuRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="القائمة الرئيسية"
    >
      <div className="mobile-menu-header">
        <button
          className="close-menu"
          onClick={onClose}
          aria-label="إغلاق القائمة"
        >
          <IoClose />
        </button>
      </div>

      <div className="mobile-menu-content">
        <div className="mobile-menu-cart" onClick={handleCartClick}>
          <span>عربة التسوق</span>
          <div className="mobile-cart-info">
            <span className="mobile-cart-count">{cartItemCount} منتجات</span>
            <span className="mobile-cart-price">{totalPrice} ريال سعودي</span>
          </div>
        </div>

        <nav className="mobile-menu-nav">
          <ul>
            {links.map((link, index) => (
              <li key={index} style={{ "--item-index": index }}>
                <Link
                  to={link.link}
                  className="mobile-menu-link"
                  onClick={onClose}
                >
                  {getIcon(link.name)}
                  <span>{link.name}</span>
                </Link>
              </li>
            ))}
            <li style={{ "--item-index": links.length }}>
              <Link
                to="/shop"
                className="mobile-menu-link shop-now"
                onClick={onClose}
              >
                <FaShoppingBag />
                <span>تسوق الآن</span>
              </Link>
            </li>
            <li style={{ "--item-index": links.length + 1 }}>
              <button
                className="mobile-menu-link"
                onClick={() => {
                  onSearchClick();
                  onClose();
                }}
              >
                <FaSearch />
                <span>البحث عن منتج</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSearchClick: PropTypes.func.isRequired,
  cartItemCount: PropTypes.number.isRequired,
  totalPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

export default MobileMenu;
