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
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: '0.5rem 1rem',
        fontFamily: 'Istok Web, sans-serif'
      }}
    >
      <div>
        <NavLink to="/">
          <img src={logo} alt="Logo" style={{ height: '40px' }} />
        </NavLink>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Home
        </NavLink>
        {user ? (
          <>
            <NavLink
              to={`/profile/${user.userId}`}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Profile
            </NavLink>
            <button onClick={handleLogout} className="nav-button">
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
