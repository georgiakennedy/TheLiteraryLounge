import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const profileId = id || (user && user.userId);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!profile) return <p>No profile found.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <img
          src={
            profile.profilePicture
              ? `http://localhost:5001/${profile.profilePicture}`
              : '/placeholderpfp.png'
          }
          alt={`${profile.username}'s profile`}
          style={{
            width: '150px',
            height: '150px',
            objectFit: 'cover',
            borderRadius: '50%',
            marginRight: '1rem'
          }}
        />
        <h1>{profile.username}'s Profile</h1>
      </div>
      <p><strong>Email:</strong> {profile.email}</p>
      {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}
      
      {user && profile && user.userId === profile._id.toString() && (
        <Link to="/edit-profile" style={{ textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}>
          Edit Profile
        </Link>
      )}
      
      <h2>Posts by {profile.username}</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
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
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <img
                  src={
                    profile.profilePicture
                      ? `http://localhost:5001/${profile.profilePicture}`
                      : '/placeholderpfp.png'
                  }
                  alt={`${profile.username}'s profile`}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '0.5rem'
                  }}
                />
                <span style={{ fontWeight: 'bold' }}>{profile.username}</span>
              </div>
              <h3>{post.title}</h3>
              <p>
                {post.content.length > 100
                  ? post.content.substring(0, 100) + '...'
                  : post.content}
              </p>
              <p>
                <strong>Date:</strong> {new Date(post.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Category:</strong> {post.category}
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default ProfilePage;
