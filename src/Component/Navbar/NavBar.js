import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../../Firebase';
import Login from "../Login/Login";

function NavBar({ quantities }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();
  const totalQty = Object.values(quantities || {}).reduce((sum, q) => sum + q, 0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out", error);
      toast.error("Sign out failed");
    }
  };

  return (
    <>
      <Navbar className="custom-navbar" expand="sm" collapseOnSelect>
        <Container fluid>
          <Navbar.Brand
            href="/Home"
            className="d-flex align-items-center fw-bold me-4"
            style={{ cursor: "pointer" }}
          >
            <img
              src="/Images/applogo.png"
              alt="Logo"
              height={60}
              width={80}
              className="me-2"
            />
            Food Fussion Delivery
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto fw-bold">
              <Nav.Link as={Link} to="/home">Home</Nav.Link>
              <Nav.Link as={Link} to="/menu">Menu</Nav.Link>
              <Nav.Link as={Link} to="/order">Order</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
              <Nav.Link as={Link} to="/aboutus">About Us</Nav.Link>
            </Nav>

            <div className="d-flex align-items-center gap-3">
              {/* Search */}
              <div className="nav-search me-2">
                <div className="search-wrapper">
                  <input
                    type="text"
                    className="search-box"
                    placeholder="Search Biryani, Cuisine..."
                  />
                </div>
              </div>

              {/* Cart Icon */}
              <div className="position-relative me-2">
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate('/cart')}
                >
                  <img src="/Images/basket_icon.png" alt="Cart" height={30} width={30} />
                  <span className="cart-badge">{totalQty}</span>
                </div>
              </div>

              {/* Login or Profile */}
              {!user ? (
                <Navbar.Text className="text-light fw-semibold mb-0">
                  <span
                    className="blue-text text-decoration-none"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowLoginModal(true)}
                  >
                    Login
                  </span>
                </Navbar.Text>
              ) : (
                <div className="profile-container position-relative">
                  <img
                    src="/Images/ProfileLogo.jpg"
                    alt="Profile"
                    height={40}
                    width={40}
                    className="rounded-circle border border-light"
                    style={{ objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  />
                  {showProfileMenu && (
                    <div className="profile-dropdown position-absolute end-0 mt-2 p-2 bg-white border rounded shadow">
                      <strong>{user.displayName || "User"}</strong><br />
                      <small>{user.email || user.phoneNumber}</small>
                      <hr className="my-2" />
                      <button
                        className="btn btn-sm btn-danger w-100"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Login Modal */}
      <Login show={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}

export default NavBar;
