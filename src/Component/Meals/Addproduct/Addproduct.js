import React, { useState, useEffect } from "react";
import { Container, Row, Button, Form, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Addproduct.css";
import { useNavigate } from 'react-router-dom';



function AddProduct() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productType, setProductType] = useState("");
  const [price, setPrice] = useState("");

  const productOptions = ["Curries", "Noodles", "Breads", "Fried Rice", "Biryani's", "Starters", "Rice", "Soups", "Drinks", "Salads", "Combo"];
  const categoryOptions = ["Veg", "NonVeg"];
  const navigate = useNavigate();


  useEffect(() => {
    const checkDBConnection = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/status`);
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          console.log("✅ Database connected:", data.message);
        } catch {
          console.warn("❌ Non-JSON response from /status:", text);
        }
      } catch (error) {
        console.error("❌ Error connecting to database:", error.message);
      }
    };
    checkDBConnection();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return
     // ✅ Check file type
  if (!file.type.startsWith("image/")) {
    toast.error("❌ Only image files allowed");
    return;
  }

  // ✅ Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    toast.error("❌ Image size must be under 10MB");
    return;
  }
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !productCategory || !productType || !image || !price) {
      toast.error("❌ Please fill all fields and upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("productName", productName);
    formData.append("productDesc", productDesc);
    formData.append("productCategory", productCategory);
    formData.append("productType", productType);
    formData.append("Price", price);

    try {
      const req = await fetch(`${process.env.REACT_APP_API_URL}/FF_AddItem`, {
        method: "POST",
        body: formData,
      });

      const text = await req.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("❌ Server returned non-JSON:", text);
        toast.error("❌ Unexpected server response");
        return;
      }

      if (req.ok) {
        toast.success("✅ Product added successfully");
        setProductName("");
        setProductDesc("");
        setProductCategory("");
        setProductType("");
        setPrice("");
        setImage(null);
        setPreview(null);
      } else {
        toast.error("❌ " + (data.message || "Upload failed"));
      }
    } catch (err) {
      toast.error("❌ Upload failed!");
      console.error("❌ Upload error:", err);
    }
  };
   useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <Container className="p-4 product-table-container">
      <h2>Add Product</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                type="text"
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
                placeholder="Enter description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Category</Form.Label>
              <Form.Select value={productCategory} onChange={(e) => setProductCategory(e.target.value)}>
                <option value="">Select Category</option>
                {productOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Veg / NonVeg</Form.Label>
              <Form.Select value={productType} onChange={(e) => setProductType(e.target.value)}>
                <option value="">Select Type</option>
                {categoryOptions.map((type, idx) => (
                  <option key={idx} value={type}>{type}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Price</Form.Label>
              <Form.Control
                type="number"
                min="0.00"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price in INR"
              />
            </Form.Group>

            <Button type="submit" variant="primary">Upload Product</Button>
             <Button type="button" variant="secondary" onClick={() => navigate("/ShowProduct")}>
    Show Product
  </Button>
          </Col>

          <Col md={6} className="d-flex justify-content-center align-items-start">
            <div>
              <Form.Label>Upload Image</Form.Label>
              <label htmlFor="file-upload" style={{
                display: "block",
                width: "200px",
                height: "200px",
                border: "2px dashed #ccc",
                borderRadius: "10px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "#f8f9fa",
                overflow: "hidden"
              }}>
                <img
                loading="lazy"
                  src={preview || "/Images/no-image.png"}
                  alt={preview ? "Product Preview" : "No Image Available"}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
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
