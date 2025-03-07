import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
        const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and contain at least one special character');
      return;
    }

    try {
      await api.post('/users', { username, email, password, confirmPassword });
      const loginResponse = await api.post('/users/login', { credential: email, password });
      if (loginResponse.data.token) {
        login(loginResponse.data.user, loginResponse.data.token);
        navigate('/');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.whiteContainer}>
        <div style={styles.header}>SIGN UP</div>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        <p style={styles.switchText}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
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
    alignItems: 'center',
    backgroundColor: 'transparent'
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

export default RegisterPage;
