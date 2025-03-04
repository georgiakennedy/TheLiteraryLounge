import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    
    flushSync(() => {
      logout();
    });
    navigate('/'); 
  };

  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to={`/profile/${user.userId}`} style={{ marginLeft: '1rem' }}>Profile</Link>
          <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginLeft: '1rem' }}>Login</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
