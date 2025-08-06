import React, { useEffect, useState } from 'react';
import './Menuitems.css';

export const Menuitems = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      console.log("🔍 React is fetching from:", `${process.env.REACT_APP_API}/FF_AddItem`);
      try {
        const response = await fetch(`${process.env.REACT_APP_API}/FF_AddItem`);
        if (!response.ok) throw new Error('Failed to fetch menu items');

        const data = await response.json();
        console.log("📦 Response data:", data);
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  // Group by category and pick first image
  const categoryImages = {};
  menuItems.forEach(item => {
    const category = item.productCategory?.trim() || 'Uncategorized';
    if (!categoryImages[category]) {
      categoryImages[category] = {
        image: item.image,
        name: item.productName || 'Sample Dish',
      };
    }
  });

  const categories = Object.keys(categoryImages);

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Menu Categories</h1>
      <p className='explore-menu-text'>
        Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your craving and elevate your dining experience, one delicious meal at a time.
      </p>

      {categories.length === 0 ? (
        <p style={{ color: 'red' }}>⚠️ No categories found</p>
      ) : (
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "20px",
            marginTop: "24px",
            paddingBottom: "10px",
          }}
        >
          {categories.map((category, index) => (
            <div
              key={index}
              style={{
                minWidth: "120px",
                flex: "0 0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              <img
                src={categoryImages[category].image}
                alt={categoryImages[category].name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  marginBottom: "10px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}
              />
              <span>{category}</span>
            </div>
          ))}
        </div>
      )}
      <hr/>
    </div>
  );
};
