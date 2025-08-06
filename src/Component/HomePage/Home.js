import React, { useState, useEffect, lazy, Suspense } from 'react';
import './Home.css';
import ExploreitemLoader from "../Menuitems/ExploreitemLoader";
import CustomerReview from '../CustomerReview/CustomerReview';
import { getCachedExploreData, cacheExploreData } from '../Menuitems/storage';

const LandingPage = lazy(() => import("../LandingPage/LandingPage"));
const Menuitems = lazy(() => import("../Menuitems/Menuitems"));

function Home({ quantities, setQuantities, setExploreData }) {
  const [exploreDataLocal, setExploreDataLocal] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadCache() {
      const cached = await getCachedExploreData();
      if (cached) {
        setExploreDataLocal(cached);
        setExploreData(cached);
        setIsLoaded(true);
      }
    }
    loadCache();
  }, [setExploreData]);

  const handleExploreLoaded = async (data) => {
    setExploreDataLocal(data);
    setExploreData(data);
    await cacheExploreData(data);
    setIsLoaded(true);
  };

  return (
    <div className="home-wrapper">
      {!isLoaded && (
        <div className="spinner-container">
          <div className="loader"></div>
        </div>
      )}

      <div style={{ display: isLoaded ? 'block' : 'none' }}>
        <Suspense fallback={<div className="spinner-container"><div className="loader"></div></div>}>
          {!exploreDataLocal ? (
            <ExploreitemLoader onLoaded={handleExploreLoaded} />
          ) : (
            <>
              <LandingPage />
              <Menuitems
                exploreData={exploreDataLocal}
                setExploreData={setExploreData}
                quantities={quantities}
                setQuantities={setQuantities}
              />
              <CustomerReview />
            </>
          )}
        </Suspense>
      </div>
    </div>
  );
}

export default Home;
