import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

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
    <div style={{ padding: '1rem', fontFamily: 'Istok Web, sans-serif' }}>
      <div
        style={{
          background: 'linear-gradient(90deg, rgba(255,235,128,1) 0%, rgba(255,198,11,1) 25%, rgba(255,123,180,1) 65%, rgba(255,87,159,1) 92%)',
          padding: '0.7rem',
          textAlign: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '2.5rem',
          borderRadius: '0px',
          marginBottom: '1rem'
        }}
      >
        THE LITERARY LOUNGE FORUMS
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        padding: '0.5rem'
      }}>
        <span style={{ marginRight: '0.5rem', fontSize: '1.2rem', color: '#666' }}>🔍</span>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            width: '100%',
            fontSize: '1rem',
            color: '#333'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flexBasis: '15%', paddingRight: '1rem' }}>
          <h2 style={{ 
            color: 'black',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>
            Categories
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  backgroundColor: '#e0e0e0',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '0.5rem 1rem',
                  color: '#555',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: '1px', backgroundColor: '#ccc' }}></div>

        <div style={{ flexBasis: '85%', paddingLeft: '1rem' }}>
          <h2 style={{ 
            color: 'black', 
            fontWeight: '2000', 
            marginBottom: '1rem',
            fontSize: '1.8rem'
          }}>
            Recent Posts
          </h2>
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
              <div
                style={{
                  backgroundColor: '#f4f4f4',
                  padding: '0.8rem',
                  marginBottom: '0.8rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', position: 'relative' }}>
                  {post.author && (
                    <>
                      <img
                        src={
                          post.author.profilePicture
                            ? `http://localhost:5001/${post.author.profilePicture}`
                            : '/placeholderpfp.png'
                        }
                        alt={`${post.author.username}'s profile`}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginRight: '0.5rem'
                        }}
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
                  <span style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '0.5rem',
                    color: 'darkgrey',
                    fontSize: '0.8rem'
                  }}>
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
            
                <h2 style={{ fontWeight: '900', color: 'black', fontSize: '1.3rem', marginBottom: '0.2rem' }}>
                  {post.title}
                </h2>
            
                <p style={{ fontSize: '1rem', color: '#555', marginBottom: '1rem' }}>
                  {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
                </p>
            
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    backgroundColor: getBubbleColor(post.category),
                    borderRadius: '20px',
                    padding: '0.2rem 0.5rem',
                    fontWeight: 'bold',
                    color: 'black',
                    fontSize: '0.8rem',
                    fontFamily: 'Istok Web, sans-serif'
                  }}>
                    {post.category}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontSize: '0.9rem',
                    color: '#555',
                    fontFamily: 'Istok Web, sans-serif'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src="/heart.png"
                        alt="Likes"
                        style={{ width: '16px', marginRight: '0.3rem' }}
                      />
                      {post.likes}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src="/speechbubble.png"
                        alt="Comments"
                        style={{ width: '16px', marginRight: '0.3rem' }}
                      />
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
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h2>{authOverlayMessage}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
