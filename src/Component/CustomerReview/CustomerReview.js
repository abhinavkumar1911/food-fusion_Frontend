import React, { useState } from "react";
import "./CustomerReview.css";

const initialReviews = [
  {
    id: 1,
    name: "Amit Sharma",
    image: "/Images/user1.png",
    rating: 4.5,
    review: "Great taste and timely delivery. Loved the biryani!",
    suggestion: "Please add more spicy options to the menu."
  },
  {
    id: 2,
    name: "Priya Singh",
    image: "/Images/user3.png",
    rating: 5,
    review: "Amazing service and quality food!",
    suggestion: "Would be great if you offered Jain food options."
  },
  {
    id: 3,
    name: "Rahul Verma",
    image: "/Images/user2.png",
    rating: 4,
    review: "Good experience, neatly packed and delivered hot.",
    suggestion: "Add beverages like cold coffee or shakes."
  }
];

const CustomerReview = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [formData, setFormData] = useState({
    name: "",
    rating: "",
    review: "",
    suggestion: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      id: Date.now(),
      name: formData.name,
      image: "/Images/default-user.png", // placeholder image
      rating: formData.rating,
      review: formData.review,
      suggestion: formData.suggestion
    };
    setReviews(prev => [newReview, ...prev]);
    setFormData({ name: "", rating: "", review: "", suggestion: "" });
  };

  return (
    <div className="review-section container">
      <h2 className="section-title">Customer Reviews & Suggestions</h2>

      <form className="review-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating (1 to 5)"
          value={formData.rating}
          onChange={handleChange}
          step="0.1"
          min="1"
          max="5"
          required
        />
        <textarea
          name="review"
          placeholder="Your review"
          value={formData.review}
          onChange={handleChange}
          required
        />
        <textarea
          name="suggestion"
          placeholder="Any suggestion?"
          value={formData.suggestion}
          onChange={handleChange}
        />
        <button type="submit">Submit Review</button>
      </form>

      <div className="review-column">
        {reviews.map(({ id, name, image, rating, review, suggestion }) => (
          <div key={id} className="review-card">
            <img src={image} alt={name} className="customer-img" />
            <div className="review-content">
              <h4 className="customer-name">{name}</h4>
              <p className="rating">⭐ {rating}/5</p>
              <p className="review-text">"{review}"</p>
              <p className="suggestion">💡 {suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReview;
