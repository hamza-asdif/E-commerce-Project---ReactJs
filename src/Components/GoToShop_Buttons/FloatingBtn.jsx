import { Link } from "react-router-dom";
import { FaStore, FaHeart, FaPlus, FaShoppingCart } from "react-icons/fa";
import { useGlobalContext } from "../../Context/GlobalContext";
import { useEffect, useState, useRef } from "react";
import { MdApps, MdClose } from "react-icons/md"; // Import new icons
import "./FloatingBtn.css";

function FloatingBtn() {
  const { favoriteProducts, toggleCart } = useGlobalContext();
  const [favCount, setFavCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(favoriteProducts)) {
      setFavCount(favoriteProducts.length);
    }
  }, [favoriteProducts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isExpanded]);

  const handleMainButtonClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    toggleCart(true);
    setIsExpanded(false);
  };

  return (
    <div className="floating-buttons-container" ref={containerRef}>
      <div
        className={`floating-buttons-wrapper ${isExpanded ? "expanded" : ""}`}
      >
        <Link
          to="/favorites"
          className="floating-btn floating-child-btn"
          onClick={() => setIsExpanded(false)}
        >
          <FaHeart />
          <span className="btn-tooltip">المفضلة</span>
          {favCount > 0 && (
            <span className="favorites-count-badge">{favCount}</span>
          )}
        </Link>

        <Link
          to="/shop"
          className="floating-btn floating-child-btn"
          onClick={() => setIsExpanded(false)}
        >
          <FaStore />
          <span className="btn-tooltip">تسوق الآن</span>
        </Link>

        <a
          href="#"
          className="floating-btn floating-child-btn"
          onClick={handleCartClick}
        >
          <FaShoppingCart />
          <span className="btn-tooltip">السلة</span>
        </a>
      </div>

      <button
        className={`floating-btn main-floating-btn ${isExpanded ? "active" : ""}`}
        onClick={handleMainButtonClick}
        aria-label="القائمة"
      >
       {isExpanded ? <MdClose /> : <MdApps />}
      </button>
    </div>
  );
}

export default FloatingBtn;
