import React, { useState } from 'react';
import './Menuitems.css';
import ExploreitemLoader from './ExploreitemLoader';
import Exploreitem from './Exploreitem';

function Menuitems({exploreData, quantities, setQuantities,setExploreData}) {
  const [items, setItems] = useState(exploreData ||[]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

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

  return (
    <>
      <div className='explore-menu' id='explore-menu'>
        <h1>Explore the menu</h1>
        <p className='explore-menu-text'>
          Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your craving and elevate your dining experience, one delicious meal at a time.
        </p>

        <div className="category-scroll-container">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className={`category-item ${selectedCategory === cat.label ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.label)}
            >
              <img src={cat.image} alt={cat.label} className="category-img" />
              <p className="category-label">{cat.label}</p>
            </div>
          ))}
        </div>
        <hr />
      </div>

       {/* Loader fetches data from backend once */}
      {/*<ExploreitemLoader onLoaded={setItems} />*/}
      {items.length === 0 ? (
  <ExploreitemLoader
    onLoaded={(data) => {
      setItems(data);
      setExploreData(data);
    }}
  />
) : (
  <Exploreitem
    items={items}
    selectedCategory={selectedCategory}
    quantities={quantities}
    setQuantities={setQuantities}
  />
)}
</>
  );
}

export default Menuitems;
