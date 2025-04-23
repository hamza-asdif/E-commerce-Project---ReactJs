import { Link } from "react-router-dom";
import { FaStore, FaHeart, FaPlus, FaShoppingCart } from "react-icons/fa";
import { useGlobalContext } from "../../hooks/GlobalContextHooks";
import { useEffect, useState, useRef } from "react";
import { MdApps, MdClose } from "react-icons/md";
import "./FloatingBtn.css";

const FloatingBtn = () => {
  const { isSidebarOpen, toggleSidebar } = useGlobalContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="floating-btn">
      <button className="menu-btn" onClick={toggleMenu}>
        {isMenuOpen ? <MdClose /> : <MdApps />}
      </button>
      {isMenuOpen && (
        <div className="menu" ref={menuRef}>
          <Link to="/store" className="menu-item">
            <FaStore />
            <span>Store</span>
          </Link>
          <Link to="/favorites" className="menu-item">
            <FaHeart />
            <span>Favorites</span>
          </Link>
          <Link to="/add" className="menu-item">
            <FaPlus />
            <span>Add</span>
          </Link>
          <Link to="/cart" className="menu-item">
            <FaShoppingCart />
            <span>Cart</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FloatingBtn;
