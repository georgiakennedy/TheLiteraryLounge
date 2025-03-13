import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const profileId = id || (user && user.userId);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
        setError('No profile ID provided');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get(`/users/profile/${profileId}`);
        setProfile(response.data.user);
        const sortedPosts = response.data.posts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError('Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  if (loading) return <p style={styles.loading}>Loading profile...</p>;
  if (error) return <p style={styles.error}>{error}</p>;
  if (!profile) return <p style={styles.error}>No profile found.</p>;

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.whiteContainer}>
        <div style={styles.gradientBorder}></div>
        
        <div style={styles.userInfo}>
          <img
            src={
              profile.profilePicture
                ? `https://theliterarylounge.onrender.com/uploads/${profile.profilePicture}`
                : '/placeholderpfp.png'
            }
            alt={profile.username}
            style={styles.profilePicture}
          />
          <div style={styles.userDetails}>
            <h1 style={styles.username}>{profile.username}</h1>
            {profile.bio && <p style={styles.bio}>{profile.bio}</p>}
            {user && profile && user.userId === profile._id.toString() && (
              <button onClick={() => navigate('/edit-profile')} style={styles.editProfileButton}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
        
        <div style={styles.profileContent}>
          <h2 style={styles.sectionHeader}>Posts by {profile.username}</h2>
          {posts.length === 0 ? (
            <p style={styles.noPosts}>No posts available.</p>
          ) : (
            posts.map((post) => (
              <Link
                to={`/post/${post._id}`}
                key={post._id}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={styles.postCard}>
                  <div style={styles.postCardTop}>
                    <img
                      src={
                        profile.profilePicture
                          ? `https://theliterarylounge.onrender.com/uploads/${profile.profilePicture}`
                          : '/placeholderpfp.png'
                      }
                      alt={profile.username}
                      style={styles.postCardProfilePicture}
                    />
                    <span style={styles.postCardUsername}>{profile.username}</span>
                    <span style={styles.postCardTimestamp}>
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 style={styles.postCardTitle}>{post.title}</h3>
                  <p style={styles.postCardContent}>
                    {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
                  </p>
                  <div style={styles.postCardBottom}>
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    padding: '1rem',
    backgroundColor: 'transparent',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center'
  },
  whiteContainer: {
    backgroundColor: '#fff',
    borderRadius: '0px',
    width: '90%',
    maxWidth: '900px',
    overflow: 'hidden'
  },
  gradientBorder: {
    height: '10px',
    background: 'linear-gradient(90deg, rgba(255,235,128,1) 0%, rgba(255,198,11,1) 25%, rgba(255,123,180,1) 65%, rgba(255,87,159,1) 92%)'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem'
  },
  userDetails: {
    textAlign: 'left'
  },
  profilePicture: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '1rem'
  },
  username: {
    fontFamily: 'Istok Web, sans-serif',
    fontWeight: 'bold',
    fontSize: '2rem',
    color: '#333',
    margin: 0
  },
  bio: {
    fontFamily: 'Istok Web, sans-serif',
    fontSize: '1rem',
    color: '#555',
    marginTop: '0.5rem'
  },
  editProfileButton: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: 'rgb(255,102,196)',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  profileContent: {
    borderTop: '1px solid #ccc',
    padding: '1rem',
    fontFamily: 'Istok Web, sans-serif'
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '1rem'
  },
  noPosts: {
    fontSize: '1rem',
    color: '#555'
  },
  postCard: {
    backgroundColor: '#f4f4f4',
    padding: '0.8rem',
    marginBottom: '0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    position: 'relative'
  },
  postCardTop: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
    position: 'relative'
  },
  postCardProfilePicture: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '0.5rem'
  },
  postCardUsername: {
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Istok Web, sans-serif'
  },
  postCardTimestamp: {
    position: 'absolute',
    right: '1rem',
    top: '0.5rem',
    fontSize: '0.8rem',
    color: 'darkgrey',
    fontFamily: 'Istok Web, sans-serif'
  },
  postCardTitle: {
    fontWeight: '900',
    color: 'black',
    fontSize: '1.3rem',
    marginBottom: '0.2rem',
    fontFamily: 'Istok Web, sans-serif'
  },
  postCardContent: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '1rem',
    fontFamily: 'Istok Web, sans-serif'
  },
  postCardBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  categoryBubble: {
    backgroundColor: 'pink',
    borderRadius: '20px',
    padding: '0.2rem 0.5rem',
    fontWeight: 'bold',
    color: 'black',
    fontSize: '0.8rem',
    fontFamily: 'Istok Web, sans-serif'
  },
  postCardStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '0.9rem',
    color: '#555',
    fontFamily: 'Istok Web, sans-serif'
  },
  statsItem: {
    fontFamily: 'Istok Web, sans-serif'
  }
};

export default ProfilePage;
