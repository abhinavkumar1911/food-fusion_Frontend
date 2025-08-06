import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you can integrate backend API or Firebase
    alert("Thank you for contacting us!");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <div className="contact-wrapper">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" required value={formData.name} onChange={handleChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" required value={formData.email} onChange={handleChange} />
          </label>
          <label>
            Message:
            <textarea name="message" required value={formData.message} onChange={handleChange}></textarea>
          </label>
          <button type="submit">Send Message</button>
        </form>

        <div className="contact-info">
          <h3>Our Contact Info</h3>
          <p><strong>Phone:</strong> +91 9876543210</p>
          <p><strong>Email:</strong> support@foodfusion.com</p>
          <p><strong>Address:</strong> 11 Brach Road,R.K Breach, India</p>

          <iframe
            title="Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.4471070490623!2d77.59456231529877!3d12.97159888085871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjciTiA3N8KwMzUnNDMuNSJF!5e0!3m2!1sen!2sin!4v1618126789392!5m2!1sen!2sin"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact;
