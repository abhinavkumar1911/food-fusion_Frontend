import { db, auth } from "../../Firebase";
import {
  collection,
  query,
  where,
  updateDoc,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import "./Order.css";

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const q = query(collection(db, "Orders"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const orderList = [];

        for (const docSnap of querySnapshot.docs) {
          const orderData = docSnap.data();
          const itemsWithImages = await Promise.all(
            orderData.items.map(async (item) => {
              let image = "/Images/default.png";
              if (item.productId) {
                try {
                  const productRef = doc(db, "FF_AddItem", item.productId);
                  const productSnap = await getDoc(productRef);
                  if (productSnap.exists()) {
                    const productData = productSnap.data();
                    image = productData.image || image;
                  }
                } catch (e) {
                  console.warn("Image fetch error for item:", item.productId);
                }
              }
              return { ...item, image };
            })
          );

          orderList.push({
            id: docSnap.id,
            ...orderData,
            items: itemsWithImages,
          });
        }

        orderList.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        setOrders(orderList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "Orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const generateBill = (order) => {
    const dateObj = order.createdAt?.toDate();
    const date = dateObj?.toLocaleDateString() || "";
    const time = dateObj?.toLocaleTimeString() || "";
    const total = order.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const cgst = total * 0.05;
    const sgst = total * 0.05;
    const netTotal = total + cgst + sgst;

    const header = `
          FOOD FUSION
        Original Receipt

Address: 123 Fusion Street
Phone: +91 98765 43210  GSTIN: 27AAFFF1234G1Z9
Date: ${date}     Time: ${time}
Table: ${order.tableNo || "N/A"}   Receipt No.: ${Math.floor(Math.random() * 9000) + 1000}
Waiter: ${order.waiterName || "N/A"}

Description          Qty   Price   Subtotal
-------------------------------------------
`;

    const itemLines = order.items.map(item => {
      const name = item.productName.padEnd(20).slice(0, 20);
      const qty = String(item.quantity).padStart(3);
      const price = `₹${item.price}`.padStart(6);
      const subtotal = `₹${(item.quantity * item.price).toFixed(2)}`.padStart(9);
      return `${name}${qty}  ${price}  ${subtotal}`;
    }).join("\n");

    const summary = `
-------------------------------------------
Sub Total:                  ₹${total.toFixed(2)}
CGST:     5%                ₹${cgst.toFixed(2)}
SGST:     5%                ₹${sgst.toFixed(2)}
-------------------------------------------
Total:                     ₹${netTotal.toFixed(2)}

MODE: ${order.paymentMethod || "N/A"}

        SAVE PAPER SAVE NATURE !!
     THANK YOU FOR A DELICIOUS MEAL.

     [🔵 PAID - Food Fusion Stamp]
`;

    const fullBill = header + itemLines + summary;

    const blob = new Blob([fullBill], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Receipt_${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p style={{ padding: "1rem" }}>Loading your orders...</p>;

  const visibleOrders = orders.slice(0, visibleCount);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          {visibleOrders.map((order, index) => {
            const status = order.status || "confirmed";

            return (
              <div
                key={order.id}
                className="order-card"
                style={{
                  marginBottom: "1.5rem",
                  border: "1px solid #ddd",
                  padding: "1rem",
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h4>Order #{index + 1}</h4>
                  <span className="order-id">Order ID: {order.id}</span>
                </div>

                <h5>Items:</h5>
                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                  {order.items?.map((item, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <img
                        loading="lazy"
                        src={item.image || "/Images/default.png"}
                        alt={item.productName}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginRight: "1rem",
                        }}
                      />
                      <div>
                        <strong>{item.productName}</strong>
                        <p style={{ margin: 0 }}>Qty: {item.quantity}</p>
                        <p style={{ margin: 0 }}>Price: ₹{item.price}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <p>
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {order.createdAt?.toDate().toLocaleString()}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1rem",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label htmlFor={`status-${order.id}`}>
                      <strong>Update Order Status:</strong>
                    </label>
                    <select
                      id={`status-${order.id}`}
                      value={status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={status === "delivered"}
                      style={{
                        marginLeft: "1rem",
                        padding: "0.4rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        backgroundColor:
                          status === "delivered" ? "#f0f0f0" : "#fff",
                        cursor:
                          status === "delivered" ? "not-allowed" : "pointer",
                      }}
                    >
                      <option value="confirmed">Order Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="delivering">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>

                  <button
                    onClick={() => generateBill(order)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Generate Bill
                  </button>
                </div>

                <div className="order-status-tracker">
                  <div className={`step ${["confirmed", "preparing", "delivering", "delivered"].includes(status) ? "active" : ""}`}>
                    Order Confirmed
                  </div>
                  <div className={`step ${["preparing", "delivering", "delivered"].includes(status) ? "active" : ""}`}>
                    Preparing
                  </div>
                  <div className={`step ${["delivering", "delivered"].includes(status) ? "active" : ""}`}>
                    Out for Delivery
                  </div>
                  <div className={`step ${status === "delivered" ? "active" : ""}`}>
                    Delivered
                  </div>
                </div>
              </div>
            );
          })}

          {visibleCount < orders.length && (
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                onClick={() => setVisibleCount((prev) => prev + 5)}
                style={{
                  padding: "0.6rem 1.2rem",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Order;
