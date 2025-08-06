import React, { useState,useEffect } from "react";
import { Container, Row, Button, Form, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./Addproduct.css"; // Make sure this includes your custom CSS
//import { db } from "../../../../Backend/Firebasetest";
//import { collection, addDoc, Timestamp } from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';


function AddProduct() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productType, setProductType] = useState("");
  const [price,setprice] = useState("");

  const productOptions = ["Curries", "Noodles", "Breads", "Fried Rice", "Biryani's","Starters","Rice","Soups","Drinks","Salads","Combo"];
  const categoryOptions = ["Veg", "NonVeg"];

  //DB Connect status

  useEffect(()=>{
    const checkDBConnection=async() =>{
      try{
        const res = await fetch("/api/FF_AddItem")
        const data = await res.json();
        const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("❌ Response is not JSON");
        return;
      }

      if (res.ok) {
        console.log("✅ Database connected:", data.message || "Success")
      }else {
        console.error("❌ Database connection error:", data.message || "Unknown error")
      }
    } catch (error) {
      console.error("❌ Error connecting to database:", error.message)
    }
    }
  
  checkDBConnection()
}, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!productName || !productCategory || !productType || !preview){
        toast.error("❌ Please Fill All Fields and Upload Image")
        return
    }

    {/*try{
        const docRef=await addDoc(collection(db,"products"),{
            productName,
        productDesc,
        productCategory,
        productType,
        image: preview, // storing base64 image
        createdAt: Timestamp.now()
        })
        toast.success("✅Product Added Successfully")
        console.log("Product Added with Id",docRef.id)
        // Clear form
      setProductName("");
      setProductDesc("");
      setProductCategory("");
      setProductType("");
      setImage(null);
      setPreview(null);
    }
    catch(err){
        toast.error( "❌Failed to add product");
      console.error("Firebase Error: ", err);
    }
    }*/}

    const formData = new FormData();
    formData.append("image", image);
    formData.append("productName", productName);
    formData.append("productDesc", productDesc);
    formData.append("productCategory", productCategory);
    formData.append("productType", productType);
    formData.append("Price", price);
    try{
        const req = await fetch("/api/FF_AddItem", {
      method: "POST",
      body: formData,
    })
    
    const data=await req.json()
    if(req.ok){
        toast.success("✅Product Added Successfully")
        console.log("Product Added with Id")
        // Clear form
      setProductName("");
      setProductDesc("");
      setProductCategory("");
      setProductType("");
      setprice("");
      setImage(null);
      setPreview(null);

    }
      else {
      toast.error("❌ " + data.message);
    }
  } catch (err) {
    toast.error("❌ Upload failed!");
    console.error(err);
  }
}



 return (
  <Container className="p-4">
    <h2>Add Product</h2>
    <Form onSubmit={handleSubmit}>
      <Row>
        {/* Left side: Text inputs */}
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Product Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Product Category</Form.Label>
            <Form.Select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {productOptions.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Veg / NonVeg</Form.Label>
            <Form.Select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            >
              <option value="">Select Type</option>
              {categoryOptions.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Product Price</Form.Label>
            <Form.Control
              type="Number"  min="0.00" max="10000.00" step="0.01"
              placeholder="Price in INR"
              value={price}
              onChange={(e) => setprice(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Upload Product
          </Button>
        </Col>

        {/* Right side: Image preview and upload */}
        <Col md={6} className="d-flex justify-content-center align-items-start">
          <div>
            <Form.Label>Upload Image</Form.Label>
            <label
              htmlFor="file-upload"
              style={{
                display: "block",
                width: "200px",
                height: "200px",
                border: "2px dashed #ccc",
                borderRadius: "10px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "#f8f9fa",
                overflow: "hidden",
              }}
            >
              <img
                src={preview || "https://via.placeholder.com/200x200?text=No+Image"}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
        </Col>
      </Row>
    </Form>

    <ToastContainer position="top-right" autoClose={3000} />
  </Container>
);
}

export default AddProduct;
