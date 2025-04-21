import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import './App.css';

    function App() {
      const [orders, setOrders] = useState([]);
      const [error, setError] = useState('');

      // Fetch pending orders on mount
      useEffect(() => {
        fetchOrders();
      }, []);

      const fetchOrders = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/orders/status/pending');
          setOrders(response.data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };

      const markAsCompleted = async (orderId) => {
        try {
          await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, {
            status: 'completed'
          });
          fetchOrders(); // Refresh the list
        } catch (error) {
          setError(error.response?.data?.error || 'Error updating order status');
        }
      };

      return (
        <div className="App">
          <h1>NaHora Driver</h1>

          <h2>Pending Orders</h2>
          {orders.length === 0 ? (
            <p>No pending orders found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Description</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.client}</td>
                    <td>{order.description}</td>
                    <td>{order.value}</td>
                    <td>{order.status}</td>
                    <td>
                      <button onClick={() => markAsCompleted(order._id)}>
                        Mark as Completed
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      );
    }

    export default App;