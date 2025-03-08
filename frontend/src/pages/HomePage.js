import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../App.css';

const categories = ['All', 'tips & tricks', 'discussions', 'get inspired', 'resources', 'Self promo'];

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [authOverlayMessage, setAuthOverlayMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getBubbleColor = (cat) => {
    const category = cat.toLowerCase();
    switch (category) {
      case 'discussions':
        return '#ff4e9a';
      case 'tips & tricks':
        return '#ffc60b';
      case 'get inspired':
        return '#0b98ff';
      case 'resources':
        return '#ff8c1f';
      case 'self promo':
        return '#c51fff';
      default:
        return 'pink';
    }
  };

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

  const searchedPosts = filteredPosts.filter((post) => {
    const term = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term)
    );
  });

  const handleProfileClick = (e) => {
    e.preventDefault();
    setAuthOverlayMessage('Please login to view this profile');
    setTimeout(() => setAuthOverlayMessage(''), 3000);
  };

  return (
    <div className="pageWrapper">
      <div className="whiteContainer large">
        <div className="headerTitle">THE LITERARY LOUNGE FORUMS</div>

        <div className="searchBar">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="contentWrapper">
          <div className="categories">
            <h2>Categories</h2>
            <div className="categories-buttons">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="categories-dropdown">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="divider"></div>
          <div className="mainContent">
            <h2>Recent Posts</h2>
            {loading && <p>Loading posts...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && searchedPosts.length === 0 && <p>No posts available.</p>}
            <div>
              {searchedPosts.map((post) => (
                <Link
                  to={`/post/${post._id}`}
                  key={post._id}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="postCard">
                    <div className="postHeader">
                      {post.author && (
                        <>
                          <img
                            src={
                              post.author.profilePicture
                                ? `http://localhost:5001/${post.author.profilePicture}`
                                : '/placeholderpfp.png'
                            }
                            alt={`${post.author.username}'s profile`}
                          />
                          {localStorage.getItem('token') ? (
                            <Link
                              to={`/profile/${post.author._id}`}
                              style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}
                            >
                              {post.author.username}
                            </Link>
                          ) : (
                            <span
                              onClick={handleProfileClick}
                              style={{ color: '#333', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              {post.author.username}
                            </span>
                          )}
                        </>
                      )}
                      <span className="timestamp">
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <h2>{post.title}</h2>
                    <p>
                      {post.content.length > 100
                        ? post.content.substring(0, 100) + '...'
                        : post.content}
                    </p>
                    <div className="postStats">
                      <div className="bubble" style={{ background: getBubbleColor(post.category) }}>
                        {post.category}
                      </div>
                      <div className="statsIcons">
                        <span>
                          <img src="/heart.png" alt="Likes" />
                          {post.likes}
                        </span>
                        <span>
                          <img src="/speechbubble.png" alt="Comments" />
                          {post.comments ? post.comments.length : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {authOverlayMessage && (
          <div className="overlay">
            <div className="overlayContent">
              <h2>{authOverlayMessage}</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
