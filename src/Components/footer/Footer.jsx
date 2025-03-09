import React from 'react'
import './footer.css'

function Footer() {
  return (
    <div>
      <footer className="footer">
        <div className="footer-logo-container">
            <div className="footer-logo-box">
                <a href="index.html" className="footer-logo-link">
                    <img src="/shopping-cart-react/images/logo.png" alt="" />
                </a>
            </div>

        </div>
        <hr />

        <div className="footer-text-content">
            <div className="footer-link-box">
                <ul className="footer-ul">
                    <li className="footer-li"><a href="#" className="footer-a">عن المتجر</a></li>
                    <li className="footer-li"><a href="#" className="footer-a">عن المتجر</a></li>
                    <li className="footer-li"><a href="#" className="footer-a">طرق الدفع</a></li>
                    <li className="footer-li"><a href="#" className="footer-a">الشحن والتسليم</a></li>
                </ul>
            </div>


            <div className="footer-link-box">
                <ul className="footer-ul">
                    <li className="footer-li"><a href="#" className="footer-a">اتصل بنا</a></li>
                    <li className="footer-li"><a href="#" className="footer-a">اتصل بنا</a></li>
                    <li className="footer-li"><a href="#" className="footer-a">الأسئلة المتكررة</a></li>
                    <li className="footer-li"><a href="#" className="footer-a"></a></li>
                </ul>
            </div>

            



            <div className="footer-link-box">
                <ul className="footer-ul">
                    <li className="footer-li"><a href="#" className="footer-a">الشروط والسياسات</a></li>
                    <li className="footer-li"><a href="#" className="footer-a">شروط الاستخدام</a></li>
                    <li className="footer-li"><a href="#" className="footer-a">سياسة الاستبدال والاسترجاع</a></li>
                    <li className="footer-li"><a href="#" className="footer-a">سياسة الخصوصية</a></li>
                </ul>
            </div>
        </div>
     </footer>
    </div>
  )
}

export default Footer