import { useState, useEffect, useRef, useCallback } from "react";
import { IoSearch } from "react-icons/io5";
import { FaCartPlus } from "react-icons/fa6";
import { FaBarsStaggered } from "react-icons/fa6";
import { NavLink, Link } from "react-router-dom";
import { useGlobalContext } from "../../../hooks/GlobalContextHooks";
import SideBarWidget from "../../shared/SideBarWidget/SideBarWidget";
import SearchBar from "../../searchBar/SearchBar";
import MobileMenu from "./MobileMenu";
import Topbar from "./TopBar/Topbar";
import "./Navbar.css";
import "./navBar-mobile.css";

const Navbar = () => {
  const { cartItems } = useGlobalContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <nav className="navbar">
      <Topbar />
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          Logo
        </Link>
        <div className="navbar-links">
          <NavLink to="/products" activeClassName="active">
            Products
          </NavLink>
          <NavLink to="/about" activeClassName="active">
            About
          </NavLink>
          <NavLink to="/contact" activeClassName="active">
            Contact
          </NavLink>
        </div>
        <div className="navbar-icons">
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
          <Link to="/cart" className="navbar-cart">
            <FaCartPlus />
            <span className="cart-count">{cartItems.length}</span>
          </Link>
          <button className="navbar-menu-button" onClick={toggleMobileMenu}>
            <FaBarsStaggered />
          </button>
        </div>
      </div>
      {isMobileMenuOpen && <MobileMenu />}
    </nav>
  );
};

export default Navbar;
