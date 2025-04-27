import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import './App.css';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem('driverToken', token);
      props.setIsValidToken(true);
      setSuccess('Login bem-sucedido! Redirecionando...');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-image-section">
        <div className="overlay">
          <h1>Entregas rápidas e seguras para os seus clientes</h1>
          <p>Faça entregas com eficiência e segurança</p>
        </div>
      </div>
      <div className="login-form-section">
        <div className="login-form-container">
          <h2>Entrar como Entregador</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <button type="submit">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('driverToken');
    setIsValidToken(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setIsValidToken={setIsValidToken} />} />
        <Route
          path="/dashboard"
          element={
            isValidToken ? (
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                  <Dashboard />
                </div>
              </div>
            ) : (
              <Login setIsValidToken={setIsValidToken} />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
