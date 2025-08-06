import React, { useEffect, useState } from 'react';
import './Exploreitem.css';

const Exploreitem = ({ onLoaded }) => {
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/FF_AddItem`);
        const data = await response.json();
        setItems(data);

        const initialQuantities = {};
        data.forEach(item => {
          initialQuantities[item.id] = 0;
        });
        setQuantities(initialQuantities);

        // ✅ Notify parent once data is loaded
        if (onLoaded) {
          onLoaded();
        }
      } catch (error) {
        console.error("❌ Error fetching items:", error);
      }
    };

    fetchItems();
  }, [onLoaded]);

  const handleIncrement = (id) => {
    setQuantities(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleDecrement = (id) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(prev[id] - 1, 0) }));
  };

  return (
    <div className="menu-container">
      <h2 className="menu-title">Top dishes near you</h2>
      <div className="menu-grid">
        {items.map((item) => (
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
                <button onClick={() => handleDecrement(item.id)}>-</button>
                <span>{quantities[item.id] || 0}</span>
                <button onClick={() => handleIncrement(item.id)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exploreitem;
