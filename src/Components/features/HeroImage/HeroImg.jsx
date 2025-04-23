import React, { useMemo } from "react";
import "./Heroimg.css";

function HeroImage() {
  return useMemo(() => {
    return (
      <div>
        <div className="hero-img-container">
          <div className="image-container">
            <img src="/images/slide.png" alt="Slide" loading="lazy" />
          </div>
        </div>
      </div>
    );
  }, []);
}

export default HeroImage;
