import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logov1.png';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className="navbar"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: '0.5rem 1rem',
        fontFamily: 'Istok Web, sans-serif'
      }}
    >
      <div className="navbar-logo">
        <NavLink to="/">
          <img src={logo} alt="Logo" style={{ height: '40px' }} />
        </NavLink>
      </div>
      <div className="navbar-links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
        {user ? (
          <>
            <NavLink to={`/profile/${user.userId}`} className="nav-link">
              Profile
            </NavLink>
            <NavLink to="/create-post" className="nav-link">
              Create Post
            </NavLink>
            <button onClick={handleLogout} className="nav-button">
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
