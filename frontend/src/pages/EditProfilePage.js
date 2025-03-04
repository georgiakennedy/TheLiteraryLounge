import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const EditProfilePage = () => {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('bio', bio);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
    try {
      const response = await api.put(`/users/profile/${user.userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      login(response.data.user, localStorage.getItem('token'));
      navigate(`/profile/${user.userId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Edit Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Bio:</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div>
          <label>Profile Picture:</label>
          <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} accept="image/*" />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfilePage;
