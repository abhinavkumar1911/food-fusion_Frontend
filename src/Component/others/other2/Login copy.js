import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  auth,
} from "../../../Firebase";
import { useNavigate } from "react-router-dom";

function Login({ show, onClose }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Login successful", result.user);
      toast.success("Google Login Successful");
      handleClose();
      onClose()
      const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath);
    } else {
      navigate("/home");
    }
  } catch (error) {
    toast.error("Google login failed");
  }
  };

  const handleSendOTP = async () => {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible", callback: () => {} },
        auth
      );
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        window.recaptchaVerifier
      );
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
      toast.success("Phone Login Successful",result.user);
      handleClose();
      onClose()
      const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath);
    } else {
      navigate("/home");
    }
  } catch (error) {
    toast.error("Invalid OTP");
  }}

  const handleClose = () => {
    onClose();
    setPhone("");
    setOtp("");
    setConfirmation(null);
    window.recaptchaVerifier = null;
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
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
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Login;
