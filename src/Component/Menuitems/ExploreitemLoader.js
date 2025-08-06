import { useEffect } from 'react';

const ExploreitemLoader = ({ onLoaded }) => {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/FF_AddItem`);
        const data = await res.json();
       // Send the data back to parent component
        if (onLoaded) onLoaded(data);
      } catch (error) {
        console.error("Error loading Exploreitem data:", error);
      }
    };

    fetchData();
  }, [onLoaded]);

  return null; // No UI
};



export default ExploreitemLoader;
