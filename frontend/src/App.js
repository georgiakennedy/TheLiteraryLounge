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
  
  // Define paths that are for auth pages
  const authPaths = ['/login', '/register', '/edit-profile'];
  const isAuthPage = authPaths.includes(location.pathname);

  return (
    <div className="background-container">
      <Navbar />
      {isAuthPage ? (
        // For auth pages, no white container wrapper is used (or use a different style)
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
        </Routes>
      ) : (
        // For non-auth pages, wrap content in a white container
        <div className="content-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:id?" element={<ProfilePage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/post/:id" element={<ViewPostPage />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
