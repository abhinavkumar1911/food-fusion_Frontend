import React, { useState, lazy, Suspense } from 'react';
import './Home.css';
import Exploreitem from "../Menuitems/Exploreitem";
import ExploreitemLoader from "../Menuitems/ExploreitemLoader";
import Cart from '../Cart/Cart_test'; // ✅ import the Cart component

const LandingPage = lazy(() => import("../LandingPage/LandingPage"));
const Menuitems = lazy(() => import("../Menuitems/Menuitems"));

function Home() {
  const [exploreData, setExploreData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  

  const handleExploreLoaded = (data) => {
    setExploreData(data);
    setIsLoaded(true);
  };

  // ✅ Add to cart
  const handleAddToCart = (id, item) => {
    setCart(prev => ({
      ...prev,
      [id]: {
        ...item,
        quantity: (prev[id]?.quantity || 0) + 1,
      },
    }));
  };

  // ✅ Remove (decrease quantity)
  const handleRemoveFromCart = (id) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id]) {
        newCart[id].quantity -= 1;
        if (newCart[id].quantity <= 0) {
          delete newCart[id];
        }
      }
      return newCart;
    });
  };

  // ✅ DELETE completely from cart (used in Cart.js)
  const handleDeleteFromCart = (id) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[id];
      return newCart;
    });
  };

  // ✅ total cart item count
  const totalItemsInCart = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="home-wrapper">
      {/* 🛒 Cart Icon with Badge */}
      <div className="cart-icon" onClick={() => setShowCart(true)}>
        🛒 <span className="cart-badge">{totalItemsInCart}</span>
      </div>

      {/* Show spinner while loading */}
      {!isLoaded && (
        <div className="spinner-container">
          <div className="loader"></div>
        </div>
      )}

      {/* Main app */}
      <div style={{ display: isLoaded ? 'block' : 'none' }}>
        <Suspense fallback={<div className="spinner-container"><div className="loader"></div></div>}>
          {!exploreData ? (
            <ExploreitemLoader onLoaded={handleExploreLoaded} />
          ) : (
            <>
              <LandingPage />
              <Menuitems />
              <Exploreitem
                items={exploreData}
                onAdd={handleAddToCart}
                onRemove={handleRemoveFromCart}
              />
            </>
          )}
        </Suspense>
      </div>

      {/* ✅ Cart Modal with Delete Support */}
      {showCart && (
        <Cart
          cart={cart}
          onClose={() => setShowCart(false)}
          onDelete={handleDeleteFromCart} // 👈 this is the line that enables delete button to work
        />
      )}
    </div>
  );
}

export default Home;
