import React, { useState, useEffect } from 'react';
import api from './api';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/api/orders');
        console.log('Orders fetched:', response.data); // Log para depuração
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      }
    };
    fetchOrders();
  }, []);

  const acceptOrder = async (orderId) => {
    if (!orderId) {
      setError('Invalid order ID');
      return;
    }
    try {
      await api.patch(`/api/orders/${orderId}`, { status: 'accepted' });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'accepted' } : order
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept order');
    }
  };

  const completeOrder = async (orderId) => {
    if (!orderId) {
      setError('Invalid order ID');
      return;
    }
    try {
      await api.patch(`/api/orders/${orderId}`, { status: 'delivered' });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'delivered' } : order
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete order');
    }
  };

  const availableOrders = orders.filter(order => order.status === 'pending');
  const myOrders = orders.filter(order => order.status === 'accepted');

  return (
    <div>
      <h2>Driver Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Available Orders</h3>
      {availableOrders.length === 0 ? (
        <p>No available orders.</p>
      ) : (
        <ul>
          {availableOrders.map(order => (
            <li key={order._id || Math.random()}>
              {order.client} - {order.description} - ${order.value}
              <button onClick={() => acceptOrder(order._id)}>Accept</button>
            </li>
          ))}
        </ul>
      )}
      <h3>My Orders</h3>
      {myOrders.length === 0 ? (
        <p>No orders accepted.</p>
      ) : (
        <ul>
          {myOrders.map(order => (
            <li key={order._id || Math.random()}>
              {order.client} - {order.description} - ${order.value}
              <button onClick={() => completeOrder(order._id)}>Complete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
