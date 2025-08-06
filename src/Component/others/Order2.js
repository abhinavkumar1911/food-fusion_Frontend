import { db, auth } from "../../Firebase";
import {
  collection,
  query,
  where,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import "./Order.css";

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5); // for lazy load

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const q = query(collection(db, "Orders"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const orderList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

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
    const date = order.createdAt?.toDate().toLocaleString();
    const total = order.items.reduce((acc, item) => acc + item.quantity * item.Price, 0);

    const billText = `
====== FOOD ORDER BILL ======
Order ID: ${order.id}
Date: ${date}
Payment: ${order.paymentMethod}

--- Items ---
${order.items
      .map(
        (item) =>
          `${item.productName} - Qty: ${item.quantity} x ₹${item.Price} = ₹${
            item.quantity * item.Price
          }`
      )
      .join("\n")}

----------------------------
Total: ₹${total.toFixed(2)}
Status: ${order.status}

Thank you for ordering!
`;

    const blob = new Blob([billText], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Order_${order.id}_Bill.txt`;
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
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
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
                  <div
                    className={`step ${
                      ["confirmed", "preparing", "delivering", "delivered"].includes(
                        status
                      )
                        ? "active"
                        : ""
                    }`}
                  >
                    Order Confirmed
                  </div>
                  <div
                    className={`step ${
                      ["preparing", "delivering", "delivered"].includes(status)
                        ? "active"
                        : ""
                    }`}
                  >
                    Preparing
                  </div>
                  <div
                    className={`step ${
                      ["delivering", "delivered"].includes(status)
                        ? "active"
                        : ""
                    }`}
                  >
                    Out for Delivery
                  </div>
                  <div
                    className={`step ${
                      status === "delivered" ? "active" : ""
                    }`}
                  >
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
