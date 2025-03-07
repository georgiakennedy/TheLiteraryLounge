import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', { credential, password });
      if (response.data.token) {
        login(response.data.user, response.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.whiteContainer}>
        <div style={styles.header}>LOGIN</div>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Enter username or email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <p style={styles.switchText}>
          Don't have an account? <Link to="/register" style={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  whiteContainer: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '0px',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center'
  },
  header: {
    background: 'linear-gradient(90deg, rgba(255,235,128,1) 0%, rgba(255,198,11,1) 25%, rgba(255,123,180,1) 65%, rgba(255,87,159,1) 92%)',
    padding: '0.7rem',
    borderRadius: '0px',
    color: 'white',
    fontFamily: 'Istok Web, sans-serif',
    fontWeight: 'bold',
    fontSize: '2rem',
    marginBottom: '1.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    fontFamily: 'Istok Web, sans-serif',
    color: '#333'
  },
  button: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'rgb(255,102,196)',
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
    fontFamily: 'Istok Web, sans-serif'
  },
  switchText: {
    marginTop: '1rem',
    fontFamily: 'Istok Web, sans-serif'
  },
  link: {
    color: 'rgb(255,102,196)',
    fontWeight: 'bold',
    textDecoration: 'none'
  }
};

export default LoginPage;
