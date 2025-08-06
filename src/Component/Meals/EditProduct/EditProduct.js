import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Button, Form, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./EditProduct.css"; // or Editproduct.css if separated
import Swal from 'sweetalert2';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null); // file
  const [preview, setPreview] = useState(null); // URL or base64
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productType, setProductType] = useState("");
  const [price, setPrice] = useState("");

  const productOptions = ["Curries", "Noodles", "Breads", "Fried Rice", "Biryani's", "Starters", "Rice", "Soups", "Drinks", "Salads", "Combo"];
  const categoryOptions = ["Veg", "NonVeg"];

  // ✅ Fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/FF_AddItem/${id}`);
        const data = await res.json();

        setProductName(data.productName || "");
        setProductDesc(data.productDesc || "");
        setProductCategory(data.productCategory || "");
        setProductType(data.productType || "");
        setPrice(data.Price || "");
        setPreview(data.image || null); // existing image
      } catch (err) {
        toast.error("❌ Failed to load product");
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Image Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("❌ Only image files allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("❌ Image size must be under 10MB");
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

    // ✅ cancel button
  const handlecancel = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "Changes will not be saved!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, cancel"
  }).then((result) => {
    if (result.isConfirmed) {
      navigate("/showproduct");
    }
  });
};


  // ✅ Update Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to update this product?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, update it!",
  });

  if (!result.isConfirmed) {
    toast.info("ℹ️ Update cancelled");
    return;
  }


    if (!productName || !productCategory || !productType || !price) {
      toast.error("❌ Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productDesc", productDesc);
    formData.append("productCategory", productCategory);
    formData.append("productType", productType);
    formData.append("Price", price);

    if (image) {
      formData.append("image", image); // only if new image selected
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/FF_AddItem/${id}`, {
        method: "PUT",
        body: formData,
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        toast.error("❌ Unexpected server response");
        return;
      }

      if (res.ok) {
        toast.success("✅ Product updated successfully");
        setTimeout(() => navigate("/showproduct"), 1500); // go back after success
      } else {
        toast.error("❌ " + (data.message || "Update failed"));
      }
    } catch (err) {
      toast.error("❌ Update failed");
      console.error("Update error:", err);
    }
  };

  return (
    <Container className="p-4 product-table-container">
      <h2>Edit Product</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
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
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                min="0.00"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="success">Update Product</Button>
            <Button variant="secondary" onClick={handlecancel}>Cancel</Button>
          </Col>

          <Col md={6} className="d-flex justify-content-center align-items-start">
            <div>
              <Form.Label>Product Image</Form.Label>
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
                  src={preview }
                  alt="Preview"
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

export default EditProduct;
