import React from 'react';
import './Footer.css'; // Make sure to create this CSS file

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h2 className="footer-logo">Food-Fusion</h2>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </p>
          <div className="footer-socials">
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-linkedin-in"></i>
            <i className="fab fa-youtube"></i>
          </div>
        </div>

        <div className="footer-section menu">
          <h3>Our Menus</h3>
          <ul>
            <li>Biryani's</li>
            <li>Ice Creams</li>
            <li>Fresh Vegetable</li>
            <li>Sea Foods</li>
            <li>Desserts</li>
            <li>Cold Drinks</li>
            <li>Discount</li>
          </ul>
        </div>

        <div className="footer-section links">
          <h3>Useful Links</h3>
          <ul>
            <li>About Us</li>
            <li>Restaurant</li>
            <li>Our Chefs</li>
            <li>Testimonials</li>
            <li>Blogs</li>
            <li>FAQs</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>📞 +44 (0) 9865 124 765</p>
          <p>📞 +44 (0) 0941 432 543</p>
          <p>🌐 www.foodfusion.com</p>
          <p>✉️ info@foodfusion.com</p>
          <p>📍 11 Brach Road,R.K Breach,</p>
        </div>

        <div className="footer-section download">
          <h3>Download App</h3>
          <p>Save $3 with app & new user only</p>
          <button className="google-play">Available on the Google Play</button>
          <button className="app-store">Download on the App Store</button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>©2023. All rights reserved by <strong>Food-Fusion</strong></p>
        <div className="payment-methods">
          <img src="/images/paypal.png" alt="PayPal" />
          <img src="/images/visa.png" alt="Visa" />
          <img src="/images/mastercard.png" alt="MasterCard" />
          <img src="/images/discover.png" alt="Discover" />
          <img src="/images/amex.png" alt="Amex" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
