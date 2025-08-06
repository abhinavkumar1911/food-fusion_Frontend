import React, { useState, useEffect } from "react";
import "./Payment.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../Firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const paymentOptions = [
  { id: "credit", name: "Credit Card", icon: "/Images/credit-card.png" },
  { id: "debit", name: "Debit Card", icon: "/Images/debit-card.png" },
  { id: "phonepe", name: "PhonePe", icon: "/Images/phonepe.png" },
  { id: "gpay", name: "Google Pay", icon: "/Images/gpay.png" },
  { id: "cod", name: "Cash on Delivery", icon: "/Images/cash.png" },
];

const Payment = ({ onPaymentSelect }) => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("");
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    nameOnCard: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && typeof window.setQuantities !== "function") {
        window.setQuantities = () => {};
      }
    });
  }, []);

  const handleSelect = (methodId) => {
    setSelectedMethod(methodId);
    if (onPaymentSelect) onPaymentSelect(methodId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceed = async () => {
    if (
      (selectedMethod === "credit" || selectedMethod === "debit") &&
      (!cardDetails.cardNumber ||
        !cardDetails.nameOnCard ||
        !cardDetails.expiry ||
        !cardDetails.cvv)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Info",
        text: "Please fill in all card details.",
      });
      return;
    }

    try {
      setProcessing(true);

      const user = auth.currentUser;
      if (!user) {
        setProcessing(false);
        Swal.fire({ icon: "error", title: "User not logged in" });
        return;
      }

      let rawCartData = localStorage.getItem("cart");

      if (!rawCartData || rawCartData === "[]") {
        const backup = sessionStorage.getItem("cartBackup");
        if (backup) {
          localStorage.setItem("cart", backup);
          rawCartData = backup;
        } else {
          Swal.fire({
            icon: "warning",
            title: "Cart Empty",
            text: "Your cart is empty or expired.",
          });
          setProcessing(false);
          return;
        }
      }

      const rawCart = JSON.parse(rawCartData || "[]");

      const cleanedCart = rawCart
        .map((item) => ({
          productId: item.productId || item.id || "",  // ✅ Make sure to get Firestore ID
          productName: item?.productName || "Unnamed",
          productType: item?.productType || "Veg",
          quantity: typeof item?.quantity === "number" ? item.quantity : 1,
          price: item?.Price || 0,
        }))
        .filter((item) => item.productName);

      if (cleanedCart.length === 0) {
        setProcessing(false);
        Swal.fire({
          icon: "warning",
          title: "Empty Cart",
          text: "Your cart is empty or invalid.",
        });
        return;
      }

      const orderDoc = {
        userId: user.uid,
        paymentMethod: selectedMethod,
        createdAt: Timestamp.now(),
        items: cleanedCart,
        totalAmount: cleanedCart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };

      await addDoc(collection(db, "Orders"), orderDoc);

      localStorage.removeItem("cart");
      sessionStorage.removeItem("cartBackup");

      Swal.fire({
        icon: "success",
        title: "Order Placed!",
        text: "Your order has been saved successfully.",
      }).then(() => {
        if (typeof window.setQuantities === "function") {
          window.setQuantities({});
        }
        navigate("/order");
      });
    } catch (err) {
      console.error("❌ Error while saving order:", err);
      Swal.fire({
        icon: "error",
        title: "Order Save Failed",
        text: err.message || "Unknown error",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getQRImage = () => {
    if (selectedMethod === "gpay") return "/Images/gpay-qr.png";
    if (selectedMethod === "phonepe") return "/Images/phonepe-qr.png";
    return null;
  };

  return (
    <div className="payment-gateway-container">
      <h2>Select a Payment Method</h2>
      <div className="payment-options">
        {paymentOptions.map((option) => (
          <div
            key={option.id}
            className={`payment-option ${
              selectedMethod === option.id ? "selected" : ""
            }`}
            onClick={() => handleSelect(option.id)}
          >
            <img src={option.icon} alt={option.name} className="payment-icon" />
            <span>{option.name}</span>
          </div>
        ))}
      </div>

      {(selectedMethod === "credit" || selectedMethod === "debit") && (
        <div className="card-details-form">
          <h3>Enter Card Details</h3>
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={cardDetails.cardNumber}
            onChange={handleChange}
            maxLength="16"
          />
          <input
            type="text"
            name="nameOnCard"
            placeholder="Name on Card"
            value={cardDetails.nameOnCard}
            onChange={handleChange}
          />
          <input
            type="text"
            name="expiry"
            placeholder="Expiry (MM/YY)"
            value={cardDetails.expiry}
            onChange={handleChange}
            maxLength="5"
          />
          <input
            type="password"
            name="cvv"
            placeholder="CVV"
            value={cardDetails.cvv}
            onChange={handleChange}
            maxLength="3"
          />
        </div>
      )}

      {(selectedMethod === "gpay" || selectedMethod === "phonepe") && (
        <div className="qr-code-section">
          <h3>Scan QR to Pay</h3>
          <img src={getQRImage()} alt="QR Code" className="qr-image" />
        </div>
      )}

      <button
        className="proceed-btn"
        disabled={!selectedMethod || processing}
        onClick={handleProceed}
      >
        {processing ? "Processing..." : "Proceed to Pay"}
      </button>
    </div>
  );
};

export default Payment;
