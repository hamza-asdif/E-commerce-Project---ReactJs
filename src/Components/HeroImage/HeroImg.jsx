import React from "react";
import HeroImg from "../../../public/images/slide.png";
import "./Heroimg.css";

function HeroImage() {
  return (
    <div>
      <div className="hero-img-container">
        <div className="image-container">
          <img src="images/slide.png" alt="Slide" loading="lazy"/>
        </div>
      </div>
    </div>
  );
}

export default HeroImage;
