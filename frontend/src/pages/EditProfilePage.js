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

  const handleCancel = () => {
    navigate(`/profile/${user.userId}`);
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.whiteContainer}>
        <div style={styles.header}>EDIT PROFILE</div>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={styles.textarea}
            rows={4}
          />

          <label style={styles.label}>Profile Picture</label>
          <input
            type="file"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            accept="image/*"
            style={styles.input}
          />

          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.publishButton}>
              Update Profile
            </button>
            <button type="button" onClick={handleCancel} style={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  whiteContainer: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '0px',
    width: '75%',
    maxWidth: '700px',
    textAlign: 'center'
  },
  header: {
    background: 'linear-gradient(90deg, rgba(255,235,128,1) 0%, rgba(255,198,11,1) 25%, rgba(255,123,180,1) 65%, rgba(255,87,159,1) 92%)',
    padding: '1rem',
    borderRadius: '0px',
    color: 'white',
    fontFamily: 'Istok Web, sans-serif',
    fontWeight: 'bold',
    fontSize: '2rem',
    marginBottom: '1.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  label: {
    textAlign: 'left',
    fontFamily: 'Istok Web, sans-serif',
    fontWeight: 'bold',
    fontSize: '1rem',
    marginBottom: '0.25rem',
    color: '#333'
  },
  input: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    fontFamily: 'Istok Web, sans-serif',
    color: '#333'
  },
  textarea: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    fontFamily: 'Istok Web, sans-serif',
    color: '#333',
    resize: 'vertical'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '1rem'
  },
  publishButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '40px',
    border: 'none',
    backgroundColor: 'rgb(255,102,196)',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '40px',
    border: 'none',
    backgroundColor: '#ccc',
    color: 'black',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
    fontFamily: 'Istok Web, sans-serif'
  }
};

export default EditProfilePage;
