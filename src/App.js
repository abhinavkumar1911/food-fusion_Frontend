import { Routes, Route, useNavigate } from "react-router-dom";
import { Suspense, lazy, useState, useEffect } from "react";
import NavBar from "./Component/Navbar/NavBar";
import Loader from "./Component/Loader";
import ErrorBoundary from "./Component/ErrorBoundary/ErrorBoundary";
import Cart from "./Component/Cart/Cart";
import Contact from "./Component/Contact/Contact";
import Payment from "./Component/Payment/Payment";
import Menu from "./Component/Menuitems/Menu";
import About from "./Component/About/About";
import Footer from "./Component/Footer/Footer";
import Login from "./Component/Login/Login";
import Order from "./Component/PlaceOrder/Order";
import {
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./Firebase";

const Home = lazy(() => import("./Component/HomePage/Home"));
const Addproduct = lazy(() => import("./Component/Meals/Addproduct/Addproduct"));
const ShowProduct = lazy(() => import("./Component/Meals/Showproduct/Showproduct"));
const EditProduct = lazy(() => import("./Component/Meals/EditProduct/EditProduct"));

function App() {
  const [quantities, setQuantities] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [exploreData, setExploreData] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [redirectAfterRestore, setRedirectAfterRestore] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const navigate = useNavigate();

  window.setQuantities = setQuantities;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("👤 Firebase auth state:", user);
      setCurrentUser(user);

      if (user) {
        setShowLoginModal(false);
        const backup = localStorage.getItem("cart");
        if (backup) {
          try {
            const cartArray = JSON.parse(backup);
            const rebuilt = {};
            cartArray.forEach((item) => {
              if (item.productId && item.quantity) {
                rebuilt[item.productId] = item.quantity;
              }
            });
            setQuantities(rebuilt);
            setRedirectAfterRestore(true);
          } catch (e) {
            console.error("Failed to rebuild cart:", e);
          }
        }
      } else {
        // ✅ Clear cart only when user is logged out (NOT on refresh)
        setQuantities({});
        localStorage.removeItem("cart");
      }

      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (redirectAfterRestore) {
      const target = localStorage.getItem("redirectAfterLogin");
      if (target) {
        localStorage.removeItem("redirectAfterLogin");
        setRedirectAfterRestore(false);
        navigate(target);
      }
    }
  }, [redirectAfterRestore]);

  const cart = Object.entries(quantities).reduce((acc, [id, qty]) => {
    if (qty > 0) {
      const item = exploreData.find((product) => product.id === id);
      if (item) {
        acc[id] = { ...item, quantity: qty };
      }
    }
    return acc;
  }, {});

  const handleUpdateQuantity = (id, newQty) => {
    setQuantities((prev) => {
      if (newQty <= 0) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      } else {
        return { ...prev, [id]: newQty };
      }
    });
  };

  const handleDelete = (id) => {
    setQuantities((prev) => {
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
          {isAuthReady ? (
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    quantities={quantities}
                    setQuantities={setQuantities}
                    setExploreData={setExploreData}
                  />
                }
              />
              <Route
                path="/home"
                element={
                  <Home
                    quantities={quantities}
                    setQuantities={setQuantities}
                    setExploreData={setExploreData}
                  />
                }
              />
              <Route
                path="/menu"
                element={
                  <Menu
                    items={exploreData}
                    selectedCategory={null}
                    quantities={quantities}
                    setQuantities={setQuantities}
                  />
                }
              />
              <Route
                path="/cart"
                element={
                  <Cart
                    cart={cart}
                    onDelete={handleDelete}
                    onUpdateQuantity={handleUpdateQuantity}
                    setShowLoginModal={setShowLoginModal}
                  />
                }
              />
              <Route path="/addproduct" element={<Addproduct />} />
              <Route path="/showproduct" element={<ShowProduct />} />
              <Route path="/edit/:id" element={<EditProduct />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/payment"
                element={
                  <Payment
                    onPaymentSelect={(method) => console.log("Selected:", method)}
                  />
                }
              />
              <Route path="/aboutus" element={<About />} />
              <Route path="/order" element={<Order />} />
            </Routes>
          ) : (
            <Loader />
          )}
        </Suspense>
      </ErrorBoundary>
      <Footer />
      <Login
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        setQuantities={setQuantities}
      />
    </div>
  );
}

export default App;
