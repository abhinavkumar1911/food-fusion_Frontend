import React, { useState,useEffect} from "react";
import { Container, Nav, Navbar, Modal, Button } from "react-bootstrap";
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleAuthProvider,signInWithPopup,RecaptchaVerifier,signInWithPhoneNumber,auth} from '../../Firebase';
import {onAuthStateChanged, signOut} from "firebase/auth";


function NavBar({ quantities }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const navigate = useNavigate()
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // toggle menu
    console.log("Navbar received quantities:", quantities);
  const totalQty = Object.values(quantities || {}).reduce((sum, q) => sum + q, 0);
  

  const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Login successful", result.user);
    setShowLoginModal(false);
    navigate("/home");
  } catch (error) {
    console.error("Google login failure", error);
  }
};

const handleSendOTP = async () => {
  try {
    console.log("Auth in handleSendOTP", auth);
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {}
      },
      auth
    );
    const confirmationResult = await signInWithPhoneNumber(auth, `+91${phone}`, window.recaptchaVerifier);
    setConfirmation(confirmationResult);
    toast.success("OTP Sent");
  } catch (error) {
    console.error("Error sending OTP", error);
    toast.error("Error sending OTP");
  }
};


  const handleVerifyOTP = async () => {
    try {
      const result = await confirmation.confirm(otp);
      toast.success("Phone Login Successful");
      console.log("Phone Login Successful:", result.user);
      setShowLoginModal(false);
       navigate("/home");
    } catch (error) {
      console.error("Error verifying OTP", error);
      toast.error("Error verifying OTP");
    }
  }
  const handleCloseModal = () => {
  setShowLoginModal(false);
  setPhone("");
  setOtp("");
  setConfirmation(null);
  // Optionally, clear reCAPTCHA
  window.recaptchaVerifier = null;
}
const handlecloseButton =()=>{
 setShowLoginModal(false);
  setPhone("");
  setOtp("");
  setConfirmation(null);
  // Optionally, clear reCAPTCHA
  window.recaptchaVerifier = null;
}

{/*Use useEffect to listen for auth state changes*/}
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return () => unsubscribe(); // Clean up listener
}, []);

{/*Add a handler function*/}

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
      <Navbar className="custom-navbar" expand="sm"  collapseOnSelect>
        <Container fluid>
          <Navbar.Brand
            href="/Home"
            className="d-flex align-items-center fw-bold me-4"
           // onClick={handleVideoOpen}
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

          {/* Toggle button for small screens */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Collapsible content */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto fw-bold">
              <Nav.Link as={Link} to="/home" className="nav-link" activeclassname="active">Home</Nav.Link>
              <Nav.Link as={Link}  to="/menu" className="nav-link" activeclassname="active">Menu</Nav.Link>
              <Nav.Link as={Link}  to="/order" className="nav-link" activeclassname="active">Order</Nav.Link>
              <Nav.Link as={Link}  to="/contact" className="nav-link" activeclassname="active">Contact</Nav.Link>
              <Nav.Link as={Link}  to="/aboutus" className="nav-link" activeclassname="active">About Us</Nav.Link>
            </Nav>

            {/* Search bar and login/profile */}
            <div className="d-flex align-items-center gap-3">
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
        className="text-decoration-none"
        style={{ cursor: "pointer" }}
        onClick={() => navigate('/cart')} // 🔄 navigate to Cart page
      >
        <img src="/Images/basket_icon.png" alt="Cart" height={30} width={30} />
        <span className="cart-badge">{totalQty}</span>
      </div>
    </div>

      {!user && (
  <Navbar.Text className="text-light fw-semibold mb-0">
    <span
      className="blue-text text-decoration-none"
      style={{ cursor: "pointer" }}
      onClick={() => setShowLoginModal(true)}
    >
      Login
    </span>
  </Navbar.Text>
)}

      {/* Login Modal implememnt in Nav bar using model  */}
      
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
        <Modal.Header closeButton onClick={handlecloseButton}>
          <Modal.Title>Login</Modal.Title>  
        </Modal.Header>
        <Modal.Body>
          <div className="d-grid gap-2">
          <Button variant="danger" onClick={handleGoogleLogin}>
            Login with Google
          </Button>

          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="form-control my-2"
          />
          <Button variant="primary" onClick={handleSendOTP}>Send OTP</Button>

          {confirmation && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-control my-2"
              />
              <Button variant="success" onClick={handleVerifyOTP}>Verify OTP</Button>
            </>
          )}
          <div id="recaptcha-container"></div>
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
   
  {/* Add user Image section */}
   {user ? (
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
) : (
  <img
    src="/Images/ProfileLogo.jpg"
    alt="Profile"
    height={40}
    width={40}
    className="rounded-circle border border-light"
    style={{ objectFit: 'cover' }}
  />
)}


             
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      
    </>
  );
}

export default NavBar;
