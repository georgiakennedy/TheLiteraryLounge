import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import ViewPostPage from './pages/ViewPostPage'; 
import EditProfilePage from './pages/EditProfilePage';

import Navbar from './components/navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile/:id?" element={<ProfilePage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/post/:id" element={<ViewPostPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
