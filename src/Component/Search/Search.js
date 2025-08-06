// src/components/Search.js

import React, { useState } from 'react';
import './Search.css'; // Optional styling

function Search({ items = [] }) {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    const results = items.filter(item =>
      item.name.toLowerCase().includes(value)
    );
    setFilteredItems(results);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for a dish..."
        value={query}
        onChange={handleSearch}
        className="search-input"
      />

      {query && (
        <div className="search-results">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id} className="search-item">
                <img src={item.image} alt={item.name} className="item-image" />
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No matching dishes found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
