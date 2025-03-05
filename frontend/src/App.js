import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import ViewPostPage from './pages/ViewPostPage';
import EditProfilePage from './pages/EditProfilePage';

import Navbar from './components/navbar';
import './App.css';

function AppContent() {
  const location = useLocation();

  return (
    <div className="background-container">
      {location.pathname === '/' && (
        <div className="couch-container">
          <img
            src={`${process.env.PUBLIC_URL}/couch.png`}
            alt="Couch"
            style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto' }}
          />
        </div>
      )}
      <div className="content-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile/:id?" element={<ProfilePage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<ViewPostPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
