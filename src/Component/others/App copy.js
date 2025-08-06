import { Routes, Route } from "react-router-dom";
//import LandingPage from "./Component/LandingPage/LandingPage";
import NavBar from "../Navbar/NavBar";
import Home from "../HomePage/Home";
import Addproduct from '../Meals/Addproduct/Addproduct'
import ShowProduct from "../Meals/Showproduct/Showproduct";
import EditProduct from "../Meals/EditProduct/EditProduct";


function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/addproduct" element={<Addproduct />} />
        <Route path="/showproduct" element={<ShowProduct />} />
        <Route path="/edit/:id" element={<EditProduct />} />
       
      </Routes>
    </div>
  );
}

export default App;
