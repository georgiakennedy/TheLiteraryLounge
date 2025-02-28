import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts');
      const sortedPosts = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts =
    selectedCategory === 'All'
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>The Literary Lounge</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="categorySelect" style={{ marginRight: '0.5rem' }}>
          Filter by Category:
        </label>
        <select
          id="categorySelect"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="tips & tricks">tips & tricks</option>
          <option value="discussions">discussions</option>
          <option value="get inspired">get inspired</option>
          <option value="resources">resources</option>
          <option value="Self promo">Self promo</option>
        </select>
      </div>

      <button onClick={fetchPosts} style={{ marginBottom: '1rem' }}>
        Refresh Posts
      </button>

      {loading && <p>Loading posts...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && filteredPosts.length === 0 && <p>No posts available.</p>}

      <div>
        {filteredPosts.map((post) => (
          <Link
            to={`/post/${post._id}`}
            key={post._id}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <h2>{post.title}</h2>
              <p>
                <strong>By:</strong> {post.author?.username || 'Unknown'}
              </p>
              <p>
                <strong>Date:</strong> {new Date(post.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Category:</strong> {post.category}
              </p>
              <p>
                <strong>Likes:</strong> {post.likes}
              </p>
              <p>
                <strong>Comments:</strong> {post.comments ? post.comments.length : 0}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
