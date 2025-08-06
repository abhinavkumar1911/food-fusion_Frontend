// ✅ Cart.js (updated to support cart save before login)
import React, { useState } from "react";
import "./Cart.css";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { auth } from "../../../Firebase";

function Cart({ cart = {}, onDelete, onUpdateQuantity, setShowLoginModal }) {
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const cartItems = Object.entries(cart);
  const subtotal = cartItems.reduce(
    (total, [_, item]) => total + item.quantity * item.Price,
    0
  );
  const totalAmount = subtotal - discount;

  const applyCoupon = () => {
    const code = couponCode.trim().toLowerCase();
    if (code === "save10") {
      const discountAmount = subtotal * 0.1;
      setDiscount(discountAmount);
      Swal.fire({
        icon: "success",
        title: "Coupon Applied",
        text: "You've received 10% off!",
        confirmButtonColor: "#28a745",
      });
    } else {
      setDiscount(0);
      Swal.fire({
        icon: "error",
        title: "Invalid Coupon",
        text: "Please enter a valid code.",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const handleProceedToPayment = () => {
    Swal.fire({
      title: "Proceed to Payment",
      text: "You will be redirected to the payment gateway.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Continue",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545",
    }).then((result) => {
      if (result.isConfirmed) {
        const user = auth.currentUser;
        const cartArray = Object.entries(cart).map(([id, item]) => ({
          productId: id,
          productName: item.productName,
          image: item.image,
          Price: item.Price,
          quantity: item.quantity,
        }));

        localStorage.setItem("cart", JSON.stringify(cartArray));
        localStorage.setItem("totalAmount", totalAmount.toFixed(2));
        localStorage.setItem("discount", discount.toFixed(2));
        localStorage.setItem("couponCode", couponCode);
        localStorage.setItem("redirectAfterLogin", "/payment");

        if (user) {
          navigate("/payment");
        } else {
          setShowLoginModal(true);
        }
      }
    });
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Order Booking Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map(([id, item]) => (
              <div key={id} className="cart-item">
                <img src={item.image || "/Images/default.png"} alt={item.productName} />
                <div className="item-info">
                  <h5>{item.productName}</h5>
                  <p className="item-id">
                    {item.productDesc?.split(" ").slice(0, 5).join(" ")}...
                  </p>
                  <p className="menu-rating">⭐️⭐️⭐️⭐️☆</p>
                </div>
                <div className="quantity-control">
                  <button onClick={() => onUpdateQuantity(id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(id, item.quantity + 1)}>+</button>
                </div>
                <div className="price">₹ {item.Price.toFixed(2)}</div>
                <div className="remove" onClick={() => onDelete(id)}>×</div>
              </div>
            ))}
          </div>

          <div className="coupon-section">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
            />
            <button onClick={applyCoupon}>Apply</button>
          </div>
          <br />
          <span className="coupon">coupon code - save10</span>

          <div className="cart-footer">
            <div className="footer-details">
              <span>Subtotal:</span>
              <span>₹ {subtotal.toFixed(2)}</span>
            </div>
            <div className="footer-details">
              <span>Discount:</span>
              <span>- ₹ {discount.toFixed(2)}</span>
            </div>
            <div className="footer-details total-row">
              <span>Total:</span>
              <span className="total">₹ {totalAmount.toFixed(2)}</span>
            </div>

            <button className="proceed-btn" onClick={handleProceedToPayment}>
              Proceed for Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;