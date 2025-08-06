// src/Component/Menuitems/Menu.js

import React from 'react';
import Exploreitem from './Exploreitem';

const Menu = ({ items, selectedCategory = null, quantities = {}, setQuantities }) => {
  return (
    <div>
      <Exploreitem
        items={items}
        selectedCategory={selectedCategory}
        quantities={quantities}
        setQuantities={setQuantities}
      />
    </div>
  );
};

export default Menu;
