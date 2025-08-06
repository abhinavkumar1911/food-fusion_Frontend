import React from 'react';
import './Loader.css'; // optional styling

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Loading, please wait...</p>
    </div>
  );
};

export default Loader;
