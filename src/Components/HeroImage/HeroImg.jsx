import React from 'react'
import HeroImg from '../../../public/images/slide.png'
import './Heroimg.css'

function HeroImage() {
  return (
    <div>
      <div className="hero-img-container">
        <div className="image-container">
            <img src={HeroImg} alt="Slide" />
        </div>
      </div>
    </div>
  )
}


export default HeroImage