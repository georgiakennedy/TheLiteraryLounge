import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const categories = ['tips & tricks', 'discussions', 'get inspired', 'resources', 'Self promo'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!title || !content || !category) {
      setError('Please fill in all required fields');
      return;
    }
    
    const postData = { title, content, category };

    try {
      const response = await api.post('/posts', postData);
      const createdPost = response.data.post;
      setMessage(response.data.message || 'Post created successfully!');
      setTitle('');
      setContent('');
      setCategory('');
      setTimeout(() => {
        navigate(`/post/${createdPost._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating post');
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setCategory('');
    navigate('/');
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.whiteContainer}>
        <div style={styles.header}>CREATE NEW POST</div>
        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.message}>{message}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Title</label>
          <input 
            type="text" 
            placeholder="Type title here..." 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required 
          />

          <label style={styles.label}>Category</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={styles.input}
            required
          >
            <option value="" disabled style={{ color: 'grey' }}>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label style={styles.label}>Content</label>
          <textarea 
            placeholder="Start typing your post..."
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
            rows={5}
            required
          />

          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.publishButton}>Publish</button>
            <button type="button" onClick={handleCancel} style={styles.cancelButton}>Cancel</button>
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
    width: '90%',
    maxWidth: '900px',
    textAlign: 'center',
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
    fontSize: '1.0rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '40px',
    border: 'none',
    backgroundColor: '#ccc',
    color: 'black',
    fontSize: '1.0rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
    fontFamily: 'Istok Web, sans-serif'
  },
  message: {
    color: 'green',
    marginBottom: '1rem',
    fontFamily: 'Istok Web, sans-serif'
  }
};

export default CreatePostPage;
