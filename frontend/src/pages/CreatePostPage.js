import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('tips & tricks');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    const postData = { title, content, category };

    try {
      const response = await api.post('/posts', postData);
      const createdPost = response.data.post;
      setMessage(response.data.message || 'Post created successfully!');

      setTitle('');
      setContent('');
      setCategory('tips & tricks');

      setTimeout(() => {
        navigate(`/post/${createdPost._id}`);
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating post');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Create Post</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Title:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            required 
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Content:</label>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="tips & tricks">tips & tricks</option>
            <option value="discussions">discussions</option>
            <option value="get inspired">get inspired</option>
            <option value="resources">resources</option>
            <option value="Self promo">Self promo</option>
          </select>
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePostPage;
