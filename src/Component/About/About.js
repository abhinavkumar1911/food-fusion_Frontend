import React from "react";
import "./About.css"; // optional: for styling
import Footer from "../Footer/Footer";

const About = () => {
  return (
    <div className="about-container p-4 md:p-10 text-gray-800 bg-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-red-600">About Us</h1>

      <p className="mb-6 text-lg">
        Welcome to <strong>YourAppName</strong> — your trusted food delivery partner! We bring
        delicious meals from top local restaurants straight to your doorstep, ensuring speed,
        hygiene, and flavor in every bite.
      </p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">🍽 Our Mission</h2>
        <p>
          To deliver fresh, hygienic, and flavorful meals from your favorite restaurants in the
          fastest and most convenient way possible.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">🚀 Why Choose Us?</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Wide range of cuisines – from local to global.</li>
          <li>Real-time order tracking.</li>
          <li>Fast and reliable delivery.</li>
          <li>Strict hygiene and safety practices.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">👨‍🍳 Our Team</h2>
        <p>
          We're a passionate group of food lovers, tech geeks, and logistics pros dedicated to
          making every meal moment perfect.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">📍 Serving Areas</h2>
        <p>
          Currently delivering in: <strong>Delhi, Mumbai, Bangalore</strong>. More cities coming
          soon!
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">🤝 Partner with Us</h2>
        <p>
          Are you a restaurant or chef looking to grow? Join our platform and reach thousands of
          hungry customers every day.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">📬 Contact Us</h2>
        <p>Email: <a href="mailto:support@foodfusion.com" className="text-red-500 hover:underline">support@yourappname.com</a></p>
        <p>Follow us on social media: Instagram | Facebook | Twitter</p>
      </section>
      
    </div>
    
    
  );
};

export default About;
