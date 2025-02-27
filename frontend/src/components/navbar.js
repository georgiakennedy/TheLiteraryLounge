import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navStyle = {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    background: '#f0f0f0'
  };

  return (
    <nav style={navStyle}>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to={`/profile/${user.userId}`}>Profile</Link>
          <Link to="/create-post">Create Post</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          {location.pathname === '/register' ? (
            <Link to="/register">Register</Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </>
      )}
    </nav>
  );
};

export default Navbar;
