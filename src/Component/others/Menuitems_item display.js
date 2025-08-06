import { useEffect, useState } from 'react';
import './Menuitems.css';

const categories = [
  { label: 'Breads', image: '/Images/rooti.png' },
  { label: 'Fried Rice', image: '/Images/friedriceveg.png' },
  { label: 'Noodles', image: '/Images/noodles.png' },
  { label: 'Combo', image: '/Images/veg_biryani.png' },
  { label: 'Soups', image: '/Images/vegsoup.png' },
  { label: 'Drinks', image: '/Images/water.png' },
  { label: 'Starters', image: '/Images/prawn_chilly.jpg' },
  { label: 'Salads', image: '/Images/salad.png' },
  { label: 'Curries', image: '/Images/kadiapaneer.png' },
  { label: 'Rice', image: '/Images/Curdrice.png' },
  { label: "Biryani's", image: '/Images/Biryani.png' },
];

export const Menuitems = () => {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ loading state added

 const handleCategoryClick = async (label) => {
  const cleanedLabel = label.trim();
  setActiveCategory(cleanedLabel);
  setLoading(true);
  setItems([]);

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/FF_AddItem?category=${encodeURIComponent(cleanedLabel)}`);
    const data = await response.json();

    const filtered = data.filter(item => item.productCategory === cleanedLabel);
    setItems(filtered); // ✅ only items with exact matching category
  } catch (error) {
    console.error("❌ Error fetching category items:", error);
  } finally {
    setLoading(false);
  }
};


// Add a separate effect to monitor updates:
useEffect(() => {
  console.log("✅ Current category:", activeCategory);
  console.log("✅ Items received:", items);
}, [activeCategory, items]);


  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore the menu</h1>
      <p className='explore-menu-text'>
        Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your craving and elevate your dining experience, one delicious meal at a time.
      </p>

      <div className="category-scroll-container">
        {categories.map((cat, index) => (
          <div
            key={index}
            className={`category-item ${activeCategory === cat.label ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat.label)}
            style={{ cursor: 'pointer' }}
          >
            <img src={cat.image} alt={cat.label} className="category-img" />
            <p className="category-label">{cat.label}</p>
          </div>
        ))}
      </div>

      <hr />

      {activeCategory && (
        <>
          <h2 style={{ marginTop: '1rem' }}>{activeCategory} Items</h2>
          <div className="category-results">
            {loading ? (
              <p>Loading...</p>
            ) : items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="menu-item-card">
                  <img
                    src={item.image || '/Images/default.jpg'}
                    alt={item.productName}
                    className="menu-item-image"
                  />
                  <div>
                    <h5>{item.productName}</h5>
                    <p>{item.productDesc}</p>
                    <p>₹ {item.Price}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No items found in this category.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
