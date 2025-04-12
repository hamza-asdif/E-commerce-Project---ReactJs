import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingFallback = ({ count = 5, className = "" }) => (
  <div className={`loading-container ${className}`}>
    <Skeleton count={count} />
  </div>
);

LoadingFallback.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string,
};

LoadingFallback.defaultProps = {
  count: 5,
  className: "",
};

export default LoadingFallback;
