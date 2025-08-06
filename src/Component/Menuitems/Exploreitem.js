import React from 'react';
import './Exploreitem.css';

const Exploreitem = ({ items, selectedCategory, quantities={}, setQuantities }) => {
  const handleIncrement = (id, e) => {
    e?.stopPropagation();
    setQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id, e) => {
    e?.stopPropagation();
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const filteredItems = selectedCategory
    ? items.filter(
        item =>
          item.productCategory &&
          item.productCategory.toLowerCase().trim() ===
            selectedCategory.toLowerCase().trim()
      )
    : items;

  if (!items || items.length === 0) {
    return <p style={{ textAlign: 'center' }}>Loading dishes...</p>;
  }

  return (
    <div className="menu-container">
      <h2 className="menu-title">Top dishes near you</h2>
      <div className="menu-grid">
        {filteredItems.map(item => (
          <div className="menu-card" key={item.id}>
            <img
              src={item.image || '/Images/default.jpg'}
              alt={item.productName}
              className="menu-image"
            />
            <div className="menu-info">
              <h4>{item.productName}</h4>
              <div className="menu-rating">⭐️⭐️⭐️⭐️☆</div>
              <p className="menu-desc">{item.productDesc}</p>
              <p className="menu-price">₹ {item.Price}</p>
              <div className="menu-qty">
                <button onClick={(e) => handleDecrement(item.id, e)}>-</button>
                <span>{quantities[item.id] || 0}</span>
                <button onClick={(e) => handleIncrement(item.id, e)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredItems.length === 0 && (
        <p style={{ textAlign: 'center', color: 'gray' }}>
          No items found for "{selectedCategory}"
        </p>
      )}
    </div>
  );
};

export default Exploreitem;
