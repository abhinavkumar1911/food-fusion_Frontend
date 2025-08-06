import { Routes, Route } from "react-router-dom";
import { Suspense, lazy, useState, useEffect } from "react";
import NavBar from "../../Navbar/NavBar";
import Loader from "../../Loader";
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary";
import Cart from "../../Cart/Cart";
import Contact from "../../Contact/Contact";
import Payment from "../../Payment/Payment";
import Menu from "../../Menuitems/Menu";
import About from "../../About/About";
import Footer from "../../Footer/Footer";
import Login from "../../Login/Login";
import Order from "./Component/PlaceOrder/Order2";

import { onAuthStateChanged, setPersistence, browserSessionPersistence, signOut } from "firebase/auth";
import { auth } from "../../../Firebase";

// Lazy-loaded components
const Home = lazy(() => import("../../HomePage/Home"));
const Addproduct = lazy(() => import("../../Meals/Addproduct/Addproduct"));
const ShowProduct = lazy(() => import("../../Meals/Showproduct/Showproduct"));
const EditProduct = lazy(() => import("../../Meals/EditProduct/EditProduct"));

function App() {
  const [quantities, setQuantities] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [exploreData, setExploreData] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setShowLoginModal(false);
      }
    });

    // Set session-only persistence
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        console.log("Auth persistence set to session.");
      })
      .catch((error) => {
        console.error("Failed to set persistence:", error);
      });

    // Sign out on browser/tab close
    const handleBeforeUnload = () => {
      signOut(auth).catch((error) => {
        console.error("Sign out failed:", error);
      });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Build cart object from quantities
  const cart = Object.entries(quantities).reduce((acc, [id, qty]) => {
    if (qty > 0) {
      const item = exploreData?.find(product => product.id === id);
      if (item) {
        acc[id] = {
          ...item,
          quantity: qty,
        };
      }
    }
    return acc;
  }, {});

  const handleUpdateQuantity = (id, newQty) => {
    setQuantities(prev => {
      if (newQty <= 0) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      } else {
        return {
          ...prev,
          [id]: newQty
        };
      }
    });
  };

  const handleDelete = (id) => {
    setQuantities(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  return (
    <div className="App">
      <NavBar quantities={quantities} onCartOpen={() => setShowCart(true)} />

      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home quantities={quantities} setQuantities={setQuantities} setExploreData={setExploreData} />} />
            <Route path="/home" element={<Home quantities={quantities} setQuantities={setQuantities} setExploreData={setExploreData} />} />
            <Route path="/menu" element={<Menu items={exploreData} selectedCategory={null} quantities={quantities} setQuantities={setQuantities} />} />
            <Route path="/cart" element={<Cart cart={cart} onDelete={handleDelete} onUpdateQuantity={handleUpdateQuantity} setShowLoginModal={setShowLoginModal} />} />
            <Route path="/addproduct" element={<Addproduct />} />
            <Route path="/showproduct" element={<ShowProduct />} />
            <Route path="/edit/:id" element={<EditProduct />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/payment" element={<Payment onPaymentSelect={(method) => console.log("Selected:", method)} setQuantities={setQuantities} />} />
            <Route path="/aboutus" element={<About />} />
            <Route path="/order" element={<Order />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      <Footer />
      <Login show={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}

export default App;
