import React, { useContext } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logov1.png';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const authLinkLabel = location.pathname === '/register' ? 'Sign Up' : 'Login';
  const authLinkTo = location.pathname === '/register' ? '/register' : '/login';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">
          <img src={logo} alt="Logo" />
        </NavLink>
      </div>
      <div className="navbar-links">
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
          <NavLink to={authLinkTo} className="nav-link">
            {authLinkLabel}
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
