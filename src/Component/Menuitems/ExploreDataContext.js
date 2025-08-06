import { createContext, useContext, useEffect, useState } from "react";

const ExploreDataContext = createContext();

export const ExploreDataProvider = ({ children }) => {
  const [exploreData, setExploreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExploreData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/FF_AddItem`);
        const data = await res.json();
        setExploreData(data);
      } catch (error) {
        console.error("Error fetching explore data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExploreData();
  }, []);

  return (
    <ExploreDataContext.Provider value={{ exploreData, setExploreData, loading }}>
      {children}
    </ExploreDataContext.Provider>
  );
};

export const useExploreData = () => useContext(ExploreDataContext);
