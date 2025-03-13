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
  
  const authPaths = ['/login', '/register', '/edit-profile'];
  const isAuthPage = authPaths.includes(location.pathname);

  return (
    <div className="background-container">
      <Navbar />
      {isAuthPage ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
        </Routes>
      ) : (
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
