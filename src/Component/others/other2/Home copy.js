import React, { useState, lazy, Suspense } from 'react';
import './Home.css';
import ExploreitemLoader from "../../Menuitems/ExploreitemLoader";
import CustomerReview from '../../CustomerReview/CustomerReview';


const LandingPage = lazy(() => import("../../LandingPage/LandingPage"));
const Menuitems = lazy(() => import("../../Menuitems/Menuitems"));

function Home({ quantities, setQuantities,setExploreData  }) {
  const [exploreDataLocal, setExploreDataLocal] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
 
  

  
  const handleExploreLoaded = (data) => {
    setExploreDataLocal(data);   // ✅ local state for Home
    setExploreData(data);        // ✅ lift to App
    setIsLoaded(true);
  };


 
  return (
    <div className="home-wrapper">

      {/* Show spinner while loading */}
      {!isLoaded && (
        <div className="spinner-container">
          <div className="loader"></div>
        </div>
      )}

      {/* Main app */}
      <div style={{ display: isLoaded ? 'block' : 'none' }}>
        <Suspense fallback={<div className="spinner-container"><div className="loader"></div></div>}>
          {!exploreDataLocal ? (
            <ExploreitemLoader onLoaded={handleExploreLoaded} />
          ) : (
            <>
              
              <LandingPage />
              <Menuitems exploreData={exploreDataLocal} setExploreData={setExploreData} quantities={quantities} setQuantities={setQuantities} />
              <CustomerReview/>
              
            </>
          )}
        </Suspense>
      </div>
      
 
    </div>
  );
}

export default Home;
