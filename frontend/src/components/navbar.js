import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navStyle = {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    background: '#f0f0f0'
  };

  return (
    <nav style={navStyle}>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/create-post">Create Post</Link>
    </nav>
  );
};

export default Navbar;
