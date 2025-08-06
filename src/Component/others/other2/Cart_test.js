import React from 'react';
import './Cart.css';

function Cart({ cart, onClose, onDelete }) {
  const totalAmount = Object.values(cart).reduce(
    (total, item) => total + item.quantity * item.Price,
    0
  );

  return (
    <div className="cart-overlay">
      <div className="cart">
        <button className="close-cart" onClick={onClose}>×</button>
        <h2>Your Cart</h2>

        {Object.keys(cart).length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul>
              {Object.values(cart).map((item) => (
                <li key={item.id} className="cart-item">
                  <img src={item.image || '/Images/default.jpg'} alt={item.productName} />
                  <div className="cart-details">
                    <h4>{item.productName}</h4>
                    <p>Qty: {item.quantity}</p>
                    <p>Price: ₹ {item.Price * item.quantity}</p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => onDelete(item.id)}
                    title="Remove from cart"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
            <hr />
            <h3>Total: ₹ {totalAmount}</h3>
            <button
              className="checkout-btn"
              onClick={() => alert('Checkout functionality coming soon!')}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
