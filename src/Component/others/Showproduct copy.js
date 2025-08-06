import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Button, Image } from 'react-bootstrap';
import './Showproduct.css'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ShowProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/FF_AddItem`)
      .then(res => res.json())
      .then(data => {
        console.log("✅ Fetched products:", data);
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  //delete product
  
  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This product will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  if (!result.isConfirmed) {
    Swal.fire({
      icon: 'info',
      title: 'Cancelled',
      text: 'Product deletion was cancelled.',
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }

  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/FF_AddItem/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: '🗑️ Product has been deleted successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      const errorText = await res.text();
      console.error("❌ Failed to delete:", errorText);
      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: '❌ Could not delete the product.',
      });
    }
  } catch (err) {
    console.error("❌ Error:", err);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Something went wrong while deleting.',
    });
  }
};

//edit product
  const handleEdit = async(product) => {
    const result = await Swal.fire({
    title: "Are you sure?",
    text: "Changes to the current view will not be saved!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, continue",
    cancelButtonText: "No, stay here",
  });

  if (result.isConfirmed) {
    navigate(`/edit/${product.id}`);
  } else {
    toast.info("ℹ️ Edit cancelled");
  }
};

    {/*alert(`📝 Edit Product:\n${JSON.stringify(product, null, 2)}`);*/}
 



  const navigate = useNavigate();

  return (
  <Container className="product-table-container">
      <h2 className="mb-4">All Products list</h2>

      {loading ? (
        <div className="text-center my-5 table-scroll-container">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {products.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead className="table-primary sticky-header">
                <tr>
                  <th>id</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Price (₹)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>
                      <Image
                        src={product.image}
                        alt={product.productName}
                        rounded
                        loading="lazy"
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                      />
                    </td>
                    <td>{product.productName}</td>
                    <td>{product.productDesc}</td>
                    <td>{product.productCategory}</td>
                    <td>{product.productType}</td>
                    <td>{product.Price}</td>
                    <td className="text-center">
                      <Button
                        variant="light"
                        onClick={() => handleEdit(product)}
                        className="me-2"
                      >
                        <img src="/Images/Edit.png" alt="Edit" width={25} height={25} />
                      </Button>
                      <Button
                        variant="light"
                        onClick={() => handleDelete(product.id)}
                      >
                        <img src="/Images/Delete.png" alt="Delete" width={25} height={25} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted">No products found.</p>
          )}
        </>
      )}
    </Container>
  );
}

export default ShowProduct;
